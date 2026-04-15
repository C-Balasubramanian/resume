import React, { useState, useRef } from 'react';
import { ResumeData, Experience, Education } from '../types';
import { enhanceText, generateResumeFromNotes } from '../services/ai';
import { Sparkles, Plus, Trash2, Loader2, Wand2, User, FileText, Briefcase, GraduationCap, Wrench, AlignLeft, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { extractTextFromPdf } from '../utils/pdfExtractor';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const EnhanceButton = ({ text, context, onEnhance }: { text: string, context: string, onEnhance: (t: string) => void }) => {
  const [loading, setLoading] = useState(false);
  
  const handleEnhance = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const enhanced = await enhanceText(text, context);
      onEnhance(enhanced);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEnhance} 
      disabled={loading || !text.trim()} 
      className="absolute right-2 bottom-2 p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1 text-xs font-medium"
      title="Enhance with AI"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
      {loading ? 'Enhancing...' : 'AI Enhance'}
    </button>
  );
};

export function ResumeEditor({ data, onChange }: Props) {
  const [notes, setNotes] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPdf(file);
      } else {
        text = await file.text();
      }
      
      // Automatically generate resume from the uploaded file text
      const generated = await generateResumeFromNotes(text);
      onChange(generated);
      setNotes(text); // Show the extracted text in the input box
    } catch (error) {
      alert('Failed to read or process file. Please try pasting the text instead.');
    } finally {
      setIsImporting(false);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!notes.trim()) return;
    setIsImporting(true);
    try {
      const generated = await generateResumeFromNotes(notes);
      onChange(generated);
      setNotes('');
    } catch (e) {
      alert("Failed to import. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    onChange({ ...data, personal: { ...data.personal, [field]: value } });
  };

  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '' };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), school: '', degree: '', year: '' };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const addSkillCategory = () => {
    onChange({ ...data, skills: [...data.skills, { category: '', items: [] }] });
  };

  const updateSkillCategory = (index: number, field: 'category' | 'items', value: string) => {
    const newSkills = [...data.skills];
    if (field === 'category') {
      newSkills[index].category = value;
    } else {
      newSkills[index].items = value.split(',').map(s => s.trim()).filter(Boolean);
    }
    onChange({ ...data, skills: newSkills });
  };

  const removeSkillCategory = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-gray-200 bg-indigo-50/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Magic Import
          </h2>
          <div>
            <input 
              type="file" 
              accept=".txt,.pdf,.md,.json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-white px-2 py-1 rounded border border-indigo-200 hover:border-indigo-300 transition-colors"
              title="Upload old resume (PDF/TXT)"
            >
              <Upload className="w-3 h-3" />
              Upload Resume
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-3">Paste your LinkedIn profile, old resume, or raw notes here. AI will structure it for you.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your experience and details here..."
          className="w-full h-24 p-3 border border-indigo-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-3"
        />
        <button
          onClick={handleImport}
          disabled={isImporting || !notes.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          {isImporting ? 'Generating Resume...' : 'Generate Resume'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {/* Personal Info */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setActiveTab(activeTab === 'personal' ? '' : 'personal')}
            className={`w-full flex items-center justify-between p-4 transition-colors ${activeTab === 'personal' ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className={`flex items-center gap-2 font-medium ${activeTab === 'personal' ? 'text-indigo-700' : 'text-gray-800'}`}>
              <User className={`w-5 h-5 ${activeTab === 'personal' ? 'text-indigo-600' : 'text-gray-500'}`} />
              Personal Info
            </div>
            {activeTab === 'personal' ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {activeTab === 'personal' && (
            <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={data.personal.name} onChange={e => updatePersonal('name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Professional Title</label>
                  <input type="text" value={data.personal.title || ''} onChange={e => updatePersonal('title', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="e.g. Full Stack Developer" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input type="text" value={data.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                  <input type="text" value={data.personal.website} onChange={e => updatePersonal('website', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                </div>
            </div>
            </div>
          )}
        </div>

        {/* About Me */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setActiveTab(activeTab === 'aboutMe' ? '' : 'aboutMe')}
            className={`w-full flex items-center justify-between p-4 transition-colors ${activeTab === 'aboutMe' ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className={`flex items-center gap-2 font-medium ${activeTab === 'aboutMe' ? 'text-indigo-700' : 'text-gray-800'}`}>
              <AlignLeft className={`w-5 h-5 ${activeTab === 'aboutMe' ? 'text-indigo-600' : 'text-gray-500'}`} />
              About Me
            </div>
            {activeTab === 'aboutMe' ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {activeTab === 'aboutMe' && (
            <div className="p-4 border-t border-gray-200">
            <div className="relative">
                <textarea
                  value={data.aboutMe || ''}
                  onChange={e => onChange({ ...data, aboutMe: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 pb-10"
                  placeholder="A brief paragraph about yourself..."
                />
                <EnhanceButton 
                  text={data.aboutMe || ''} 
                  context="About me section for a resume" 
                  onEnhance={(text) => onChange({ ...data, aboutMe: text })} 
                />
            </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setActiveTab(activeTab === 'summary' ? '' : 'summary')}
            className={`w-full flex items-center justify-between p-4 transition-colors ${activeTab === 'summary' ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className={`flex items-center gap-2 font-medium ${activeTab === 'summary' ? 'text-indigo-700' : 'text-gray-800'}`}>
              <FileText className={`w-5 h-5 ${activeTab === 'summary' ? 'text-indigo-600' : 'text-gray-500'}`} />
              Summary
            </div>
            {activeTab === 'summary' ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {activeTab === 'summary' && (
            <div className="p-4 border-t border-gray-200">
            <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">Description (Bullet points)</label>
                <textarea
                  value={data.summary}
                  onChange={e => onChange({ ...data, summary: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 pb-10"
                  placeholder="- Developed new features...&#10;- Led a team of..."
                />
                <EnhanceButton 
                  text={data.summary} 
                  context="Professional summary for a resume" 
                  onEnhance={(text) => onChange({ ...data, summary: text })} 
                />
            </div>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setActiveTab(activeTab === 'experience' ? '' : 'experience')}
            className={`w-full flex items-center justify-between p-4 transition-colors ${activeTab === 'experience' ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className={`flex items-center gap-2 font-medium ${activeTab === 'experience' ? 'text-indigo-700' : 'text-gray-800'}`}>
              <Briefcase className={`w-5 h-5 ${activeTab === 'experience' ? 'text-indigo-600' : 'text-gray-500'}`} />
              Experience
            </div>
            {activeTab === 'experience' ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {activeTab === 'experience' && (
            <div className="p-4 border-t border-gray-200 space-y-6">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                      <input type="text" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                      <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                      <input type="text" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="e.g. Jan 2020" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                      <input type="text" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="e.g. Present" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description (Use **text** for bold)</label>
                    <textarea
                      value={exp.description}
                      onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                      className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 pb-10"
                      placeholder="- **Project Name:** Developed new features...&#10;- Led a team of..."
                    />
                    <EnhanceButton 
                      text={exp.description} 
                      context={`Job description for a ${exp.role} at ${exp.company}`} 
                      onEnhance={(text) => updateExperience(exp.id, 'description', text)} 
                    />
                  </div>
                </div>
              ))}
            <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
          )}
        </div>

        {/* Education */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setActiveTab(activeTab === 'education' ? '' : 'education')}
            className={`w-full flex items-center justify-between p-4 transition-colors ${activeTab === 'education' ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className={`flex items-center gap-2 font-medium ${activeTab === 'education' ? 'text-indigo-700' : 'text-gray-800'}`}>
              <GraduationCap className={`w-5 h-5 ${activeTab === 'education' ? 'text-indigo-600' : 'text-gray-500'}`} />
              Education
            </div>
            {activeTab === 'education' ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {activeTab === 'education' && (
            <div className="p-4 border-t border-gray-200 space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Degree / Certificate</label>
                      <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">School / College</label>
                      <input type="text" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                      <input type="text" value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Percentage / CGPA</label>
                      <input type="text" value={edu.percentage || ''} onChange={e => updateEducation(edu.id, 'percentage', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">University</label>
                      <input type="text" value={edu.university || ''} onChange={e => updateEducation(edu.id, 'university', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
          )}
        </div>

        {/* Skills */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setActiveTab(activeTab === 'skills' ? '' : 'skills')}
            className={`w-full flex items-center justify-between p-4 transition-colors ${activeTab === 'skills' ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className={`flex items-center gap-2 font-medium ${activeTab === 'skills' ? 'text-indigo-700' : 'text-gray-800'}`}>
              <Wrench className={`w-5 h-5 ${activeTab === 'skills' ? 'text-indigo-600' : 'text-gray-500'}`} />
              Skills
            </div>
            {activeTab === 'skills' ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {activeTab === 'skills' && (
            <div className="p-4 border-t border-gray-200 space-y-4">
              {data.skills.map((skillGroup, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                  <button onClick={() => removeSkillCategory(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="mb-3 pr-8">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Name</label>
                    <input type="text" value={skillGroup.category} onChange={e => updateSkillCategory(index, 'category', e.target.value)} placeholder="e.g. Frontend Program" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Comma-separated skills</label>
                    <textarea
                      value={skillGroup.items.join(', ')}
                      onChange={e => updateSkillCategory(index, 'items', e.target.value)}
                      className="w-full h-20 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="React JS, Next JS, HTML, CSS..."
                    />
                  </div>
                </div>
              ))}
            <button onClick={addSkillCategory} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Skill Category
            </button>
          </div>
          )}
        </div>
        {/* Declaration */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <button 
            onClick={() => setActiveTab(activeTab === 'declaration' ? '' : 'declaration')}
            className={`w-full flex items-center justify-between p-4 transition-colors ${activeTab === 'declaration' ? 'bg-indigo-50/50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className={`flex items-center gap-2 font-medium ${activeTab === 'declaration' ? 'text-indigo-700' : 'text-gray-800'}`}>
              <FileText className={`w-5 h-5 ${activeTab === 'declaration' ? 'text-indigo-600' : 'text-gray-500'}`} />
              Declaration
            </div>
            {activeTab === 'declaration' ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {activeTab === 'declaration' && (
            <div className="p-4 border-t border-gray-200 space-y-4">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">Declaration Text</label>
                <textarea
                  value={data.declaration || ''}
                  onChange={e => onChange({ ...data, declaration: e.target.value })}
                  className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 pb-10"
                  placeholder="I hereby declare that the information provided above is true and correct to the best of my knowledge and belief."
                />
                <EnhanceButton 
                  text={data.declaration || ''} 
                  context="A formal declaration statement at the end of a resume" 
                  onEnhance={(text) => onChange({ ...data, declaration: text })} 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Signature Name</label>
                <input 
                  type="text" 
                  value={data.signature !== undefined ? data.signature : data.personal.name} 
                  onChange={e => onChange({ ...data, signature: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm" 
                  placeholder="e.g. John Doe" 
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
