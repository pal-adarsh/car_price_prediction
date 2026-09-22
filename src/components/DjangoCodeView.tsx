import React, { useState } from 'react';
import { DJANGO_FILES, DjangoFileSnippet } from '../data/modelsData';
import { SpecDivider } from './SpecDivider';
import { Code2, Copy, Check, FileCode, Terminal, Folder } from 'lucide-react';

interface DjangoCodeViewProps {
  onToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const DjangoCodeView: React.FC<DjangoCodeViewProps> = ({ onToast }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('views_py');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'code' | 'quickstart'>('code');

  const currentFile: DjangoFileSnippet =
    DJANGO_FILES.find((f: DjangoFileSnippet) => f.id === selectedFileId) || DJANGO_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    if (onToast) {
      onToast(`Copied ${currentFile.filename}`, `Source code copied to your clipboard.`, 'success');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full space-y-8" id="django-code-view">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
            ACADEMIC ARTIFACT &amp; BACKEND CODEBASE
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#B8924A]/15 text-[#B8924A] font-mono-tabular font-bold border border-[#B8924A]/30">
            Django 4.2 + scikit-learn
          </span>
        </div>
        <h2 className="font-serif-heading text-2xl sm:text-4xl font-semibold text-[#F4F3F0] mt-1">
          Django Backend Architecture &amp; Repository
        </h2>
        <p className="text-sm text-[#8C8F94] font-sans-body mt-2 max-w-3xl leading-relaxed">
          Production-grade Django project files implementing Model-Template-View (MTV) architecture, forms validation, and joblib model unpickling for academic project submissions and viva defense.
        </p>
      </div>

      <SpecDivider />

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-[rgba(244,243,240,0.1)] pb-3">
        <button
          onClick={() => setActiveMode('code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'code'
              ? 'bg-[#B8924A] text-[#17181C]'
              : 'bg-[#1F2126] text-[#8C8F94] hover:text-[#F4F3F0]'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Interactive Source Explorer</span>
        </button>

        <button
          onClick={() => setActiveMode('quickstart')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMode === 'quickstart'
              ? 'bg-[#B8924A] text-[#17181C]'
              : 'bg-[#1F2126] text-[#8C8F94] hover:text-[#F4F3F0]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Local Setup &amp; Commands Guide</span>
        </button>
      </div>

      {activeMode === 'code' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* File Explorer Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-3 rounded-lg bg-[#1F2126] border border-[rgba(244,243,240,0.08)] flex items-center justify-between">
              <span className="text-xs font-mono-tabular uppercase tracking-wider text-[#8C8F94] font-semibold flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#B8924A]" />
                Repository Tree
              </span>
              <span className="text-[10px] text-[#8C8F94] font-mono-tabular">
                {DJANGO_FILES.length} Files
              </span>
            </div>

            <div className="space-y-1.5">
              {DJANGO_FILES.map((file: DjangoFileSnippet) => {
                const isSelected = file.id === selectedFileId;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'border-[#B8924A] bg-[#B8924A]/15 text-[#F4F3F0] font-semibold ring-1 ring-[#B8924A]/30'
                        : 'border-[rgba(244,243,240,0.06)] bg-[#17181C] text-[#8C8F94] hover:text-[#F4F3F0] hover:bg-[#1F2126]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#B8924A]' : 'text-[#8C8F94]'}`} />
                      <div className="truncate">
                        <div className="text-xs font-mono-tabular truncate">{file.filename}</div>
                        <div className="text-[10px] text-[#8C8F94] line-clamp-1">{file.path}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer (8 cols) */}
          <div className="lg:col-span-8 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#121316] overflow-hidden shadow-2xl flex flex-col">
            
            {/* Code Header bar */}
            <div className="p-4 bg-[#17181C] border-b border-[rgba(244,243,240,0.1)] flex items-center justify-between">
              <div>
                <div className="text-xs font-mono-tabular font-bold text-[#F4F3F0] flex items-center gap-2">
                  <span>{currentFile.filename}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F2126] text-[#8C8F94]">
                    {currentFile.language}
                  </span>
                </div>
                <div className="text-[11px] text-[#8C8F94] mt-0.5">{currentFile.description}</div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(244,243,240,0.16)] bg-[#1F2126] text-xs text-[#E8E6E1] hover:text-[#F4F3F0] hover:border-[#B8924A] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#1E6E4F]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content with Line Numbers */}
            <div className="p-4 overflow-x-auto max-h-[580px] bg-[#121316] text-[#E8E6E1] font-mono-tabular text-xs leading-relaxed">
              <pre className="select-text whitespace-pre">
                {currentFile.content.split('\n').map((line: string, idx: number) => (
                  <div key={idx} className="table-row hover:bg-[#1F2126]/40">
                    <span className="table-cell pr-4 select-none text-[#8C8F94]/50 text-right w-10 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="table-cell whitespace-pre">{line}</span>
                  </div>
                ))}
              </pre>
            </div>

          </div>

        </div>
      ) : (
        /* QUICKSTART & SETUP GUIDE */
        <div className="p-6 sm:p-8 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] space-y-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif-heading text-xl font-semibold text-[#F4F3F0]">
              How to Run the Django Backend Locally
            </h3>
          </div>

          <SpecDivider className="my-1" />

          <div className="space-y-4">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-2">
              <div className="text-xs font-bold text-[#B8924A] uppercase tracking-wider">
                Step 1: Clone Repository &amp; Create Virtualenv
              </div>
              <div className="p-3 rounded bg-[#121316] font-mono-tabular text-xs text-[#E8E6E1]">
                git clone &lt;your-repo-url&gt;<br />
                cd car_price_predictor<br />
                python -m venv venv<br />
                source venv/bin/activate  # On Windows: venv\Scripts\activate
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-2">
              <div className="text-xs font-bold text-[#B8924A] uppercase tracking-wider">
                Step 2: Install Python Dependencies
              </div>
              <div className="p-3 rounded bg-[#121316] font-mono-tabular text-xs text-[#E8E6E1]">
                pip install -r requirements.txt
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-2">
              <div className="text-xs font-bold text-[#B8924A] uppercase tracking-wider">
                Step 3: Run Migrations &amp; Start Development Server
              </div>
              <div className="p-3 rounded bg-[#121316] font-mono-tabular text-xs text-[#E8E6E1]">
                python manage.py migrate<br />
                python manage.py runserver
              </div>
              <p className="text-xs text-[#8C8F94]">
                App will start at <code className="text-[#B8924A]">http://127.0.0.1:8000/</code> with complete form validation and inference views.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
