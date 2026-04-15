import { ResumeData, TemplateId } from '../types';
import { Phone, MapPin, Mail, Linkedin, Globe } from 'lucide-react';

const ClassicTemplate = ({ data }: { data: ResumeData }) => (
  <div className="bg-white w-full h-full min-h-[297mm] p-8">
    <div className="border border-gray-400 p-8 h-full min-h-[277mm] flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-wide uppercase">
          {data.personal.name || 'Your Name'}
        </h1>
        {data.personal.title && (
          <h2 className="text-lg md:text-xl text-slate-600 tracking-[0.2em] uppercase">
            {data.personal.title}
          </h2>
        )}
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-y border-gray-800 py-3 mt-6 text-sm text-gray-800">
          {data.personal.phone && (
            <div className="flex items-start gap-1.5">
              <span className="pt-[10px] flex shrink-0"><Phone size={14} className="text-slate-800" /></span>
              <span className="leading-relaxed">{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div className="flex items-start gap-1.5">
              <span className="pt-[10px] flex shrink-0"><MapPin size={14} className="text-slate-800" /></span>
              <span className="leading-relaxed">{data.personal.location}</span>
            </div>
          )}
          {data.personal.email && (
            <div className="flex items-start gap-1.5">
              <span className="pt-[10px] flex shrink-0"><Mail size={14} className="text-slate-800" /></span>
              <span className="leading-relaxed">{data.personal.email}</span>
            </div>
          )}
          {data.personal.linkedin && (
            <div className="flex items-start gap-1.5">
              <span className="pt-[10px] flex shrink-0"><Linkedin size={14} className="text-slate-800" /></span>
              <span className="leading-relaxed">{data.personal.linkedin}</span>
            </div>
          )}
          {data.personal.website && (
            <div className="flex items-start gap-1.5">
              <span className="pt-[10px] flex shrink-0"><Globe size={14} className="text-slate-800" /></span>
              <span className="leading-relaxed">{data.personal.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* About Me */}
      {data.aboutMe && (
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">About Me</h3>
          <div className="w-full h-[1px] bg-gray-400 mb-3"></div>
          <p className="text-gray-700 leading-relaxed text-sm text-justify whitespace-pre-wrap">
            {data.aboutMe}
          </p>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">Education</h3>
          <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id} className="grid grid-cols-[1fr_2.5fr] gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{edu.year}</div>
                  <div className="text-sm text-gray-600 pr-4">{edu.school}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base">{edu.degree}</div>
                  {edu.percentage && <div className="text-sm text-gray-600 mt-1">Percentage : {edu.percentage}</div>}
                  {edu.university && <div className="text-sm text-gray-600">University : {edu.university}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">WORK SUMMARY</h3>
          <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
          <div className="w-full">
            <ul className="text-gray-700 text-sm space-y-1.5">
              {data.summary.split('\n').map((line, i) => {
                if (!line.trim()) return <li key={i} className="list-none h-2"></li>;
                const formattedLine = line.replace(/^[-*]\s*/, '');
                return (
                  <li key={i} className="flex items-start break-inside-avoid">
                    <span className="mr-2 text-gray-700">&bull;</span>
                    <span className="text-justify">{formattedLine}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6 html2pdf__page-break break-before-page">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">Experience</h3>
          <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
          
          <div className="grid grid-cols-[1fr_2.5fr] gap-4 mb-3">
            <div className="font-bold text-slate-900 text-base">Projects</div>
            <div className="font-bold text-slate-900 text-base">Work Project and Platform</div>
          </div>

          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id} className="grid grid-cols-[1fr_2.5fr] gap-4">
                <div>
                  <div className="text-sm text-gray-800">{exp.company}</div>
                  {exp.role && <div className="text-xs text-gray-600 mt-1">{exp.role}</div>}
                  {exp.startDate && <div className="text-xs text-gray-500 mt-1">{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</div>}
                </div>
                <div>
                  <ul className="text-gray-700 text-sm space-y-1.5">
                    {exp.description.split('\n').map((line, i) => {
                      if (!line.trim()) return <li key={i} className="list-none h-3"></li>;
                      const formattedLine = line.replace(/^[-*]\s*/, '');
                      const parts = formattedLine.split(/\*\*(.*?)\*\*/g);
                      return (
                        <li key={i} className="flex items-start break-inside-avoid">
                          <span className="mr-2 text-gray-700">&bull;</span>
                          <span className="text-justify">
                            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-bold text-slate-900">{part}</strong> : part)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide mb-2">SKILLS</h3>
          <div className="w-full h-[1px] bg-gray-400 mb-4"></div>
          <div className="space-y-4">
            {data.skills.map((skillGroup, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-bold text-slate-900 mb-3">{skillGroup.category}</h4>
                <ul className="grid grid-cols-4 gap-y-3 gap-x-4 text-sm text-gray-700">
                  {skillGroup.items.map((item, i) => (
                    <li key={i} className="flex items-start break-inside-avoid">
                      <span className="mr-2 text-gray-700">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declaration */}
      {data.declaration && (
        <div className="pt-4 pb-4 break-inside-avoid mt-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Declaration</h3>
          <p className="text-sm text-gray-700 mb-12">
            {data.declaration}
          </p>
          <div className="flex justify-end text-sm text-gray-800">
            <div className="flex flex-col items-center">
              <div className="mb-8">Thanking you,</div>
              <div className="font-medium">{data.signature !== undefined ? data.signature : data.personal.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const ModernTemplate = ({ data }: { data: ResumeData }) => (
  <div className="bg-white w-full h-full min-h-[297mm] flex">
    {/* Sidebar */}
    <div className="w-1/3 bg-slate-800 text-slate-100 p-8">
      <h1 className="text-3xl font-bold text-white mb-2 leading-tight">{data.personal.name || 'Your Name'}</h1>
      <div className="text-slate-400 text-sm mb-8 space-y-2 mt-4">
        {data.personal.email && <div className="flex items-start gap-2"><span className="pt-[5px] flex shrink-0"><Mail size={14} /></span><span className="leading-relaxed">{data.personal.email}</span></div>}
        {data.personal.phone && <div className="flex items-start gap-2"><span className="pt-[5px] flex shrink-0"><Phone size={14} /></span><span className="leading-relaxed">{data.personal.phone}</span></div>}
        {data.personal.location && <div className="flex items-start gap-2"><span className="pt-[5px] flex shrink-0"><MapPin size={14} /></span><span className="leading-relaxed">{data.personal.location}</span></div>}
        {data.personal.linkedin && <div className="flex items-start gap-2"><span className="pt-[5px] flex shrink-0"><Linkedin size={14} /></span><span className="leading-relaxed">{data.personal.linkedin}</span></div>}
        {data.personal.website && <div className="flex items-start gap-2"><span className="pt-[5px] flex shrink-0"><Globe size={14} /></span><span className="leading-relaxed">{data.personal.website}</span></div>}
      </div>
      {data.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-slate-600 pb-2 text-slate-300">Skills</h2>
          <div className="space-y-4">
            {data.skills.map((skillGroup, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, i) => (
                    <span key={i} className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    {/* Main Content */}
    <div className="w-2/3 p-8 bg-white">
      {data.aboutMe && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">About Me</h2>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{data.aboutMe}</p>
        </div>
      )}
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">Work Summary</h2>
          <ul className="text-slate-600 text-sm space-y-1.5">
            {data.summary.split('\n').filter(line => line.trim()).map((line, i) => (
              <li key={i} className="flex items-start break-inside-avoid">
                <span className="mr-2 text-slate-600">&bull;</span>
                <span className="text-justify">{line.replace(/^[-*]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">Experience</h2>
          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <h3 className="text-base font-bold text-slate-800">{exp.role}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-600">{exp.company}</span>
                  <span className="text-xs text-slate-500 font-medium">{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</span>
                </div>
                <ul className="text-slate-600 text-sm space-y-1.5">
                  {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                    <li key={i} className="flex items-start break-inside-avoid">
                      <span className="mr-2 text-slate-600">&bull;</span>
                      <span>{line.replace(/^[-*]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.education.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">Education</h2>
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id}>
                <h3 className="text-base font-bold text-slate-800">{edu.degree}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{edu.school}</span>
                  <span className="text-xs text-slate-500 font-medium">{edu.year}</span>
                </div>
                {(edu.percentage || edu.university) && (
                  <div className="text-xs text-slate-500 mt-1">
                    {edu.percentage && <span>Percentage: {edu.percentage}</span>}
                    {edu.percentage && edu.university && <span className="mx-2">|</span>}
                    {edu.university && <span>University: {edu.university}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const ExecutiveTemplate = ({ data }: { data: ResumeData }) => (
  <div className="bg-white w-full h-full min-h-[297mm] p-10 font-serif">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-3 uppercase tracking-wider">{data.personal.name || 'Your Name'}</h1>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-700 mt-2">
        {data.personal.phone && <span className="flex items-start gap-1.5"><span className="pt-[5px] flex shrink-0"><Phone size={14} /></span> <span className="leading-relaxed">{data.personal.phone}</span></span>}
        {data.personal.location && <span className="flex items-start gap-1.5"><span className="pt-[5px] flex shrink-0"><MapPin size={14} /></span> <span className="leading-relaxed">{data.personal.location}</span></span>}
        {data.personal.email && <span className="flex items-start gap-1.5"><span className="pt-[5px] flex shrink-0"><Mail size={14} /></span> <span className="leading-relaxed">{data.personal.email}</span></span>}
        {data.personal.linkedin && <span className="flex items-start gap-1.5"><span className="pt-[5px] flex shrink-0"><Linkedin size={14} /></span> <span className="leading-relaxed">{data.personal.linkedin}</span></span>}
        {data.personal.website && <span className="flex items-start gap-1.5"><span className="pt-[5px] flex shrink-0"><Globe size={14} /></span> <span className="leading-relaxed">{data.personal.website}</span></span>}
      </div>
    </div>

    {data.aboutMe && (
      <div className="mb-6 break-inside-avoid">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 border-b-2 border-gray-900 pb-1 text-center">About Me</h2>
        <p className="text-gray-800 text-sm leading-relaxed text-center whitespace-pre-wrap">{data.aboutMe}</p>
      </div>
    )}

    {data.summary && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 border-b-2 border-gray-900 pb-1 text-center">Work Summary</h2>
        <ul className="text-gray-700 text-sm space-y-1.5">
          {data.summary.split('\n').filter(line => line.trim()).map((line, i) => (
            <li key={i} className="flex items-start break-inside-avoid">
              <span className="mr-2 text-gray-700">&bull;</span>
              <span className="text-justify">{line.replace(/^[-*]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {data.experience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 border-b-2 border-gray-900 pb-1 text-center">Professional Experience</h2>
        <div className="space-y-6">
          {data.experience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-gray-900">{exp.company}</h3>
                <span className="text-sm text-gray-700 font-medium italic">{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</span>
              </div>
              <div className="text-sm text-gray-800 italic mb-2">{exp.role}</div>
              <ul className="text-gray-700 text-sm space-y-1.5">
                {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                  <li key={i} className="flex items-start break-inside-avoid">
                    <span className="mr-2 text-gray-700">&bull;</span>
                    <span>{line.replace(/^[-*]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )}

    {data.education.length > 0 && (
      <div className="mb-6 break-inside-avoid">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 border-b-2 border-gray-900 pb-1 text-center">Education</h2>
        <div className="space-y-4">
          {data.education.map(edu => (
            <div key={edu.id} className="flex justify-between items-baseline">
              <div>
                <h3 className="text-base font-bold text-gray-900">{edu.school}</h3>
                <div className="text-sm text-gray-800 italic">{edu.degree}</div>
                {(edu.percentage || edu.university) && (
                  <div className="text-xs text-gray-600 mt-1">
                    {edu.percentage && <span>Percentage: {edu.percentage}</span>}
                    {edu.percentage && edu.university && <span className="mx-2">|</span>}
                    {edu.university && <span>University: {edu.university}</span>}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700">{edu.year}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {data.skills.length > 0 && (
      <div>
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4 border-b-2 border-gray-900 pb-1 text-center">Core Competencies</h2>
        <div className="space-y-4">
          {data.skills.map((skillGroup, idx) => (
            <div key={idx} className="text-center">
              <h3 className="text-sm font-bold text-gray-800 mb-1">{skillGroup.category}</h3>
              <div className="text-sm text-gray-700 leading-relaxed">
                {skillGroup.items.join(' • ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export function ResumePreview({ data, template }: { data: ResumeData, template: TemplateId }) {
  switch (template) {
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'executive':
      return <ExecutiveTemplate data={data} />;
    case 'classic':
    default:
      return <ClassicTemplate data={data} />;
  }
}
