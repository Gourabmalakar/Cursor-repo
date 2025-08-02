import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import CVEditor from './components/CVEditor';
import TemplateSelector from './components/TemplateSelector';
import WebpagePreview from './components/WebpagePreview';
import LoadingSpinner from './components/LoadingSpinner';

// Context
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/edit" element={<EditPage />} />
              <Route path="/preview" element={<PreviewPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

// Home Page Component
function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Transform Your CV into a Beautiful Webpage
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your CV in PDF, Word, or text format and instantly create a stunning personal webpage 
            that showcases your professional brand.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard 
            icon="📄"
            title="Easy Upload"
            description="Support for PDF, Word documents, and text files"
          />
          <FeatureCard 
            icon="🎨"
            title="Beautiful Templates"
            description="Choose from professionally designed templates"
          />
          <FeatureCard 
            icon="📱"
            title="Mobile Responsive"
            description="Perfect display on all devices and screen sizes"
          />
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 fade-in">
          <FileUpload />
        </div>
      </div>
    </div>
  );
}

// Edit Page Component
function EditPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Edit Your Information</h2>
            <CVEditor />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose Template & Customize</h2>
            <TemplateSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Page Component
function PreviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <WebpagePreview />
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default App;