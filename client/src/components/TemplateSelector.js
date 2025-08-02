import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Eye, Download, Wand2 } from 'lucide-react';
import { CirclePicker } from 'react-color';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function TemplateSelector() {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load available templates
    const loadTemplates = async () => {
      try {
        const response = await api.getTemplates();
        actions.setTemplates(response.templates);
      } catch (error) {
        console.error('Failed to load templates:', error);
        toast.error('Failed to load templates');
      }
    };

    if (state.templates.length === 0) {
      loadTemplates();
    }
  }, [state.templates.length, actions]);

  const handleTemplateSelect = (templateId) => {
    actions.setSelectedTemplate(templateId);
    toast.success('Template selected');
  };

  const handleCustomizationChange = (field, value) => {
    actions.setCustomizations({ [field]: value });
  };

  const handleGenerateWebpage = async () => {
    if (!state.cvData) {
      toast.error('Please upload a CV first');
      return;
    }

    setIsGenerating(true);
    actions.setLoading(true);

    try {
      const response = await api.generateWebpage(
        state.cvData,
        state.selectedTemplate,
        state.customizations
      );

      if (response.success) {
        actions.setWebpageId(response.webpageId);
        toast.success('Webpage generated successfully!');
        navigate('/preview');
      } else {
        throw new Error(response.error || 'Failed to generate webpage');
      }
    } catch (error) {
      console.error('Generate webpage error:', error);
      toast.error(error.message || 'Failed to generate webpage');
    } finally {
      setIsGenerating(false);
      actions.setLoading(false);
    }
  };

  if (!state.cvData) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">Please upload and edit your CV first to choose a template.</p>
      </div>
    );
  }

  const colorOptions = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
  ];

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Wand2 className="w-5 h-5 mr-2" />
          Choose Template
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {state.templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`
                border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                ${state.selectedTemplate === template.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Preview</span>
              </div>
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              {state.selectedTemplate === template.id && (
                <div className="mt-2 text-sm text-blue-600 font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {state.templates.length === 0 && (
          <div className="text-center py-8">
            <LoadingSpinner />
            <p className="mt-2 text-gray-500">Loading templates...</p>
          </div>
        )}
      </div>

      {/* Customization Options */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Customize Colors
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <CirclePicker
              color={state.customizations.primaryColor}
              colors={colorOptions}
              onChange={(color) => handleCustomizationChange('primaryColor', color.hex)}
              circleSize={28}
              circleSpacing={14}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <CirclePicker
              color={state.customizations.accentColor}
              colors={colorOptions}
              onChange={(color) => handleCustomizationChange('accentColor', color.hex)}
              circleSize={28}
              circleSpacing={14}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              value={state.customizations.fontFamily || 'Inter'}
              onChange={(e) => handleCustomizationChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Inter">Inter (Modern)</option>
              <option value="Georgia">Georgia (Serif)</option>
              <option value="Arial">Arial (Classic)</option>
              <option value="Helvetica">Helvetica (Clean)</option>
              <option value="Times New Roman">Times New Roman (Traditional)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGenerateWebpage}
            disabled={isGenerating || !state.cvData}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Generate & Preview
              </>
            )}
          </button>

          {state.webpageId && (
            <button
              onClick={() => navigate('/preview')}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Preview
            </button>
          )}
        </div>

        {state.webpageId && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <span className="text-green-600 mr-2">✓</span>
              Webpage generated successfully! You can now preview and download it.
            </div>
          </div>
        )}
      </div>

      {/* Template Preview */}
      {state.selectedTemplate && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Live Preview
          </h3>
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div 
              className="w-full h-64 bg-white rounded border"
              style={{
                background: `linear-gradient(135deg, ${state.customizations.primaryColor}15, ${state.customizations.accentColor}15)`,
                fontFamily: state.customizations.fontFamily
              }}
            >
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: state.customizations.primaryColor }}
                  >
                    {state.cvData.name ? state.cvData.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="ml-3">
                    <h4 
                      className="font-bold"
                      style={{ color: state.customizations.primaryColor }}
                    >
                      {state.cvData.name || 'Your Name'}
                    </h4>
                    <p className="text-sm text-gray-600">{state.cvData.email || 'email@example.com'}</p>
                  </div>
                </div>
                <div className="flex-1 text-xs text-gray-500">
                  <p>This is a preview of how your webpage will look with the selected template and colors.</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {state.cvData.skills?.slice(0, 4).map((skill, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 rounded text-white text-xs"
                        style={{ backgroundColor: state.customizations.primaryColor }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateSelector;