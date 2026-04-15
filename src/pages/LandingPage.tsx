import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Wand2, Download, CheckCircle2 } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold text-gray-900">AI Resume Builder</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="text-gray-600 hover:text-gray-900 font-medium text-sm hidden sm:block"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-colors shadow-sm shadow-indigo-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
            Build a professional resume <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              with the power of AI
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10">
            Create, edit, and download your perfect resume in minutes. Paste your LinkedIn profile or notes, and let our AI structure and enhance it for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Build My Resume Now
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Magic Import</h3>
              <p className="text-gray-600">
                Paste your raw notes or old resume. Our AI automatically structures and formats it into professional sections.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Enhancement</h3>
              <p className="text-gray-600">
                Stuck on what to write? Use our AI enhance feature to rewrite your bullet points and summaries professionally.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Export to PDF</h3>
              <p className="text-gray-600">
                Choose from multiple ATS-friendly templates and download your polished resume as a high-quality PDF.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof / Checkmarks */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 bg-gray-50 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Everything you need to land the job</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
            {[
              'ATS-friendly templates',
              'AI-powered text enhancement',
              'Real-time preview',
              'Unlimited PDF downloads',
              'No watermarks',
              '100% free to use'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
