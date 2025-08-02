import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const { state, actions } = useApp();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Please upload a valid PDF, Word document, or text file');
      return;
    }

    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file first');
      return;
    }

    actions.setLoading(true);
    actions.setError(null);

    try {
      const response = await api.uploadCV(uploadedFile);
      
      if (response.success) {
        actions.setCVData(response.data);
        toast.success('CV uploaded and parsed successfully!');
        navigate('/edit');
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      actions.setError(error.message);
      toast.error(error.message || 'Failed to upload CV');
    } finally {
      actions.setLoading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Processing your CV...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your CV file here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports PDF, Word documents (.doc, .docx), and text files (.txt)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Maximum file size: 10MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Process CV
            </button>
          </div>
        </div>
      )}

      {state.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 font-medium">Upload Error</h4>
            <p className="text-red-700 text-sm mt-1">{state.error}</p>
          </div>
        </div>
      )}

      {/* Sample files for demo */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Try with sample files:</h4>
        <p className="text-sm text-blue-700">
          Don't have a CV ready? You can test the app with our sample CV files or create a simple text file 
          with your professional information.
        </p>
      </div>
    </div>
  );
}

export default FileUpload;