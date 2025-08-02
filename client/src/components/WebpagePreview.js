import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, Share2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function WebpagePreview() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (!state.cvData) {
      navigate('/');
      return;
    }

    if (!state.webpageId) {
      navigate('/edit');
      return;
    }
  }, [state.cvData, state.webpageId, navigate]);

  const handleDownload = async () => {
    if (!state.webpageId) {
      toast.error('No webpage to download');
      return;
    }

    setIsDownloading(true);
    try {
      await api.downloadWebpage(state.webpageId);
      toast.success('Webpage downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error(error.message || 'Failed to download webpage');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!state.cvData) {
      toast.error('No CV data available');
      return;
    }

    setIsRegenerating(true);
    try {
      const response = await api.generateWebpage(
        state.cvData,
        state.selectedTemplate,
        state.customizations
      );

      if (response.success) {
        actions.setWebpageId(response.webpageId);
        setIframeKey(prev => prev + 1); // Force iframe reload
        toast.success('Webpage regenerated successfully!');
      } else {
        throw new Error(response.error || 'Failed to regenerate webpage');
      }
    } catch (error) {
      console.error('Regenerate error:', error);
      toast.error(error.message || 'Failed to regenerate webpage');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleShare = () => {
    const previewUrl = api.getPreviewUrl(state.webpageId);
    navigator.clipboard.writeText(previewUrl).then(() => {
      toast.success('Preview URL copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy URL');
    });
  };

  const openInNewTab = () => {
    const previewUrl = api.getPreviewUrl(state.webpageId);
    window.open(previewUrl, '_blank');
  };

  if (!state.cvData || !state.webpageId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading preview...</p>
      </div>
    );
  }

  const previewUrl = api.getPreviewUrl(state.webpageId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Webpage Preview</h2>
            <p className="text-gray-600 mt-1">
              Your professional webpage is ready! Preview it below and download when satisfied.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/edit')}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </button>
            
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
            >
              {isRegenerating ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Copy Link
            </button>

            <button
              onClick={openInNewTab}
              className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in Tab
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
            >
              {isDownloading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Live
            </div>
            <div className="hidden md:block">
              Responsive Design
            </div>
          </div>
        </div>

        {/* Device Toggle */}
        <div className="mb-4 flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <DeviceToggle />
        </div>

        {/* Iframe Container */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 font-mono">
              {previewUrl}
            </div>
          </div>
          
          <div className="bg-white">
            <iframe
              key={iframeKey}
              src={previewUrl}
              className="w-full h-[600px] border-0"
              title="Webpage Preview"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Next Steps</h3>
        <div className="space-y-2 text-blue-800">
          <p className="flex items-start">
            <span className="text-blue-600 mr-2">1.</span>
            Review your webpage in the preview above
          </p>
          <p className="flex items-start">
            <span className="text-blue-600 mr-2">2.</span>
            If you need changes, go back to edit your information or template
          </p>
          <p className="flex items-start">
            <span className="text-blue-600 mr-2">3.</span>
            Download the ZIP file containing your complete webpage
          </p>
          <p className="flex items-start">
            <span className="text-blue-600 mr-2">4.</span>
            Extract the files and upload to your preferred hosting service
          </p>
        </div>
      </div>

      {/* Hosting Options */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosting Options</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <HostingOption
            name="GitHub Pages"
            description="Free hosting for public repositories"
            url="https://pages.github.com/"
          />
          <HostingOption
            name="Netlify"
            description="Free hosting with drag-and-drop deployment"
            url="https://netlify.com/"
          />
          <HostingOption
            name="Vercel"
            description="Free hosting with automatic deployments"
            url="https://vercel.com/"
          />
        </div>
      </div>
    </div>
  );
}

function DeviceToggle() {
  const [selectedDevice, setSelectedDevice] = useState('desktop');

  const devices = [
    { id: 'desktop', name: 'Desktop', icon: '💻' },
    { id: 'tablet', name: 'Tablet', icon: '📱' },
    { id: 'mobile', name: 'Mobile', icon: '📱' },
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {devices.map((device) => (
        <button
          key={device.id}
          onClick={() => setSelectedDevice(device.id)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            selectedDevice === device.id
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="mr-1">{device.icon}</span>
          {device.name}
        </button>
      ))}
    </div>
  );
}

function HostingOption({ name, description, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
    >
      <h4 className="font-medium text-gray-900 mb-1">{name}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex items-center text-blue-600 text-sm">
        Learn more
        <ExternalLink className="w-3 h-3 ml-1" />
      </div>
    </a>
  );
}

export default WebpagePreview;