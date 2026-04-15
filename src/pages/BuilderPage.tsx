import { useState, useEffect, useRef } from 'react';
import { ResumeData, TemplateId } from '../types';
import { ResumeEditor } from '../components/ResumeEditor';
import { ResumePreview } from '../components/ResumePreview';
import { Sparkles, Download, LayoutTemplate, Loader2, LogOut } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';

const initialData: ResumeData = {
  personal: { name: 'Balasubramanian', title: 'Full Stack Developer', email: 'balasubramanian0819@gmail.com', phone: '+91 8012448219', location: '55 Kallar street, Keeranur, Pudukkottai 622502', linkedin: '', website: '' },
  aboutMe: 'I am a Versatile IT professional with a strong command of both front-end and back-end technologies. Experienced in developing scalable, efficient web applications using modern frameworks, cloud platforms, and relational databases. Committed to continuous learning and driven by a passion for clean, maintainable code and innovative problem-solving.',
  summary: '- Worked with databases such as MySQL, PostgreSQL, and MongoDB to manage and optimize application data flows.\n- Refactored and maintained existing codebases, addressing bugs and improving functionality while adhering to best software development practices.\n- Utilized Docker for containerization and implemented CI/CD pipelines to streamline deployment processes.\n- Stayed updated on emerging trends and best practices in frontend and backend development to ensure the delivery of cutting-edge solutions.\n- Integrated Artificial Intelligence (AI) and Machine Learning (ML) models into web applications to enhance user experience and automate complex tasks.\n- Leveraged Generative AI APIs and prompt engineering techniques to develop intelligent features such as automated content generation and predictive analytics.',
  experience: [
    {
      id: '1',
      company: 'Cloud & Beyond',
      role: '',
      startDate: '',
      endDate: '',
      description: '- **Rezingo** is a health-focused application that offers wellness-based programs.\n- I\'m developing the front end using React.js and Tailwind CSS, while the backend is powered by Node.js and Express, with PostgreSQL as the database.\n- The platform is deployed on Google Cloud Platform (GCP).\n\n- **Election Campaign :** The project is about Election Results Prediction and Analytics tool\n- I am work on this platform Front end React JS , JavaScript\n- Backend for this project Python and Node JS\n- Data Analytics using Data wrapper and Python\n- Azure Server and Database MongoDB\n\n- **Rental Application :** The project is about US Based House rental application\n- I am work on this platform Front end React JS , Next JS\n- Backend for this project Node JS and Spring boot frame work\n- Vercel Server and Database MongoDB\n\n- **Samskritasurabhi:** Developed an interactive web platform to facilitate Sanskrit learning through structured lessons, quizzes, and multimedia content.\n- Implemented responsive UI using React.js and styled components for a seamless learning experience across devices.\n- Integrated backend APIs using Node.js and Express to manage user progress, content delivery, and assessments.'
    }
  ],
  education: [
    {
      id: '1',
      school: 'MIET Arts And Science College - Trichy',
      degree: 'Bachelor of Computer Applications (BCA)',
      year: '2018 - 2021',
      percentage: '83%',
      university: 'Bharathidasan University'
    },
    {
      id: '2',
      school: 'Alagappa University - Karaikudi',
      degree: 'Master of Computer Applications (MCA)',
      year: '2023 - 2025',
      percentage: '83%',
      university: 'Alagappa University'
    }
  ],
  skills: [
    { category: 'Frontend Program', items: ['React JS', 'Next JS', 'Javascript', 'HTML', 'CSS', 'Material Design', 'Bootstrap', 'Tailwind CSS'] },
    { category: 'Backend Program', items: ['Node JS', 'Python', 'Typescript', 'PHP'] },
    { category: 'Server Handling', items: ['Mongo DB', 'Gitlab'] }
  ],
  declaration: 'I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.'
};

export function BuilderPage() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState<TemplateId>('classic');
  const [isDownloading, setIsDownloading] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [previewHeight, setPreviewHeight] = useState(1123);
  const navigate = useNavigate();

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        const padding = window.innerWidth >= 1024 ? 64 : 32;
        const availableWidth = containerWidth - padding;
        const targetWidth = 794; // A4 width in pixels (96dpi)
        
        if (availableWidth < targetWidth) {
          setScale(availableWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }

    window.addEventListener('resize', updateScale);
    updateScale();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  useEffect(() => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPreviewHeight(entry.contentRect.height);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [template, data]);

  const handleDownload = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    setIsDownloading(true);
    
    // Wait for state update to remove shadow before generating PDF
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const opt = {
      margin:       0,
      filename:     `${data.personal.name.replace(/\\s+/g, '_')}_Resume.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 794, scrollY: 0 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    try {
      if (template === 'classic') {
        const innerDiv = element.querySelector('.border-gray-400') as HTMLElement;
        if (innerDiv) {
          // Temporarily adjust classes for perfect PDF margins
          innerDiv.classList.remove('border-gray-400', 'p-8', 'min-h-[277mm]');
          innerDiv.classList.add('border-transparent', 'border-0', 'px-8', 'py-0');
          
          // Wait for DOM to update
          await new Promise(resolve => setTimeout(resolve, 50));
          
          const pageContentHeight = 994.52; // 297mm - 2 * 16.933mm in pixels
          const currentHeight = innerDiv.scrollHeight;
          
          let pages = Math.max(2, Math.ceil(currentHeight / pageContentHeight));
          const targetHeight = pages * pageContentHeight;
          
          innerDiv.style.height = `${targetHeight}px`;
          
          // Wait for flex-grow to push declaration down
          await new Promise(resolve => setTimeout(resolve, 100));

          const classicOpt = {
            ...opt,
            margin: [16.933, 8.467, 16.933, 8.467] as [number, number, number, number], // top, right, bottom, left in mm
            pagebreak: { mode: ['css', 'legacy'] },
            html2canvas: { ...opt.html2canvas, windowWidth: 730 }
          };

          const pdf = await html2pdf().set(classicOpt).from(innerDiv).toPdf().get('pdf');
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setDrawColor(156, 163, 175); // Tailwind gray-400 (#9ca3af)
            pdf.setLineWidth(0.5); // ~1px border
            pdf.rect(8.467, 8.467, 210 - 2 * 8.467, 297 - 2 * 8.467);
          }
          pdf.save(opt.filename);
          
          // Restore HTML
          innerDiv.style.height = '';
          innerDiv.classList.remove('border-transparent', 'border-0', 'px-8', 'py-0');
          innerDiv.classList.add('border-gray-400', 'p-8', 'min-h-[277mm]');
        }
      } else {
        // For other templates, calculate required pages based on content height
        const currentHeight = element.scrollHeight;
        const a4Height = 1123;
        const pages = Math.max(2, Math.ceil(currentHeight / a4Height));
        const targetHeight = pages * a4Height;
        
        element.style.height = `${targetHeight}px`;
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const otherOpt = {
          ...opt,
          pagebreak: { mode: ['css', 'legacy'] }
        };
        await html2pdf().set(otherOpt).from(element).save();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      element.style.height = ''; // Reset height
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden">
        <div className="flex items-center gap-2 text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>
          <Sparkles className="w-6 h-6 flex-shrink-0" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">AI Resume Builder</h1>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center">
          <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 px-2 sm:px-3 py-1.5 rounded-md border border-gray-200">
            <LayoutTemplate className="w-4 h-4 text-gray-500 hidden sm:block" />
            <select 
              value={template} 
              onChange={(e) => setTemplate(e.target.value as TemplateId)}
              className="bg-transparent text-xs sm:text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="flex items-center gap-1 sm:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {isDownloading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <Download className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download'}</span>
            <span className="sm:hidden">{isDownloading ? 'Wait...' : 'PDF'}</span>
          </button>
          <button 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md font-medium transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      <main className={`flex-1 flex flex-col lg:flex-row ${isDownloading ? 'overflow-visible' : 'overflow-hidden'}`}>
        <section className="w-full lg:w-1/2 xl:w-2/5 bg-white border-r border-gray-200 overflow-y-auto print:hidden">
          <ResumeEditor data={data} onChange={setData} />
        </section>
        
        <section 
          ref={previewContainerRef}
          className={`w-full lg:w-1/2 xl:w-3/5 bg-gray-200 p-4 lg:p-8 flex justify-center items-start print:p-0 print:m-0 print:w-full print:bg-white print:overflow-visible ${isDownloading ? 'overflow-visible' : 'overflow-y-auto'}`}
        >
          <div 
            style={{ 
              width: isDownloading ? '794px' : `${794 * scale}px`,
              height: isDownloading ? 'auto' : `${previewHeight * scale}px`,
            }}
          >
            <div 
              style={{ 
                transform: isDownloading ? 'none' : `scale(${scale})`, 
                transformOrigin: 'top left',
                width: '794px',
              }}
            >
              <div id="resume-preview" className={`bg-white w-[794px] min-h-[1123px] ${isDownloading ? 'overflow-hidden' : 'shadow-xl'}`}>
                <ResumePreview data={data} template={template} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
