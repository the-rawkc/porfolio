'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/components/PortfolioContext';
import { ProjectItem, SkillCategory, ExperienceItem, hexToRgba } from '@/lib/portfolio-data';
import {
  Palette,
  LayoutTemplate,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Mail,
  FileText,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Upload,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Cyber Lime', hex: '#C6FF4D' },
  { name: 'Electric Cyan', hex: '#00F0FF' },
  { name: 'Neon Purple', hex: '#A855F7' },
  { name: 'Sunset Orange', hex: '#FF6B4A' },
  { name: 'Ruby Rose', hex: '#F43F5E' },
  { name: 'Matrix Emerald', hex: '#10B981' },
  { name: 'Solar Gold', hex: '#FACC15' },
  { name: 'Sky Blue', hex: '#38BDF8' },
];

export default function EditPage() {
  const { data, setData, saveData, resetToDefault } = usePortfolio();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active editor tab
  const [activeTab, setActiveTab] = useState<
    'theme' | 'hero' | 'about' | 'projects' | 'skills' | 'experience' | 'contact' | 'resume'
  >('theme');

  // Saving state
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Resume upload state
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadMsg, setResumeUploadMsg] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('rawkc_studio_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passkey is "rawkc" or "rawkc2026"
    const validKeys = ['rawkc', 'rawkc2026', 'admin', 'portfolio'];
    if (validKeys.includes(passwordInput.trim().toLowerCase())) {
      setIsAuthenticated(true);
      sessionStorage.setItem('rawkc_studio_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await saveData(data);
      setSaveStatus(res.message || 'Saved successfully!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch {
      setSaveStatus('Error saving data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all changes back to the original default portfolio?')) {
      resetToDefault();
      setSaveStatus('Reset to original default content.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'rawkc_portfolio_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        if (json && json.hero && json.about) {
          setData(json);
          setSaveStatus('Backup loaded successfully! Click Save to apply.');
        } else {
          alert('Invalid portfolio backup file format.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeUploadMsg(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setData(prev => ({
          ...prev,
          contact: {
            ...prev.contact,
            resumeUrl: result.resumeUrl,
            resumeFileName: result.fileName,
          },
        }));
        setResumeUploadMsg(`Uploaded "${result.fileName}" successfully!`);
      } else {
        setResumeUploadMsg('Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setResumeUploadMsg('Upload failed: ' + String(err));
    } finally {
      setUploadingResume(false);
    }
  };

  // Lock screen if not authenticated
  if (!isAuthenticated) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#F5F5F5',
        fontFamily: 'var(--font-body)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: '#0D0D11',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '36px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'rgba(198,255,77,0.1)',
            border: '1px solid rgba(198,255,77,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#C6FF4D',
          }}>
            <Lock size={24} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            RAWKC Secret Studio
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px', lineHeight: 1.5 }}>
            Enter your secret studio passkey to unlock live editing capabilities.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="password"
              placeholder="Enter passkey (e.g. rawkc)"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#16161D',
                border: authError ? '1px solid #F43F5E' : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />

            {authError && (
              <p style={{ fontSize: '12px', color: '#F43F5E', textAlign: 'left', margin: 0 }}>
                Incorrect passkey. Please try again.
              </p>
            )}

            <button
              type="submit"
              style={{
                padding: '12px 18px',
                background: '#C6FF4D',
                color: '#050505',
                fontWeight: '600',
                fontSize: '14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'opacity 0.2s',
              }}
            >
              Unlock Editor <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Authenticated Editor
  return (
    <div style={{
      minHeight: '100vh',
      background: '#070709',
      color: '#EDEDED',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Header & Save Toolbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 13, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '18px',
            color: data.theme.accentColor,
            letterSpacing: '0.04em',
          }}>
            RAWKC<sup style={{ fontSize: '10px' }}>®</sup> Studio
          </div>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.06)',
            color: '#888',
          }}>
            CMS
          </span>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {saveStatus && (
            <span style={{
              fontSize: '12px',
              color: '#C6FF4D',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <CheckCircle2 size={15} /> {saveStatus}
            </span>
          )}

          <Link
            href="/"
            target="_blank"
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '500',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: '#ddd',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            Live Site <ExternalLink size={14} />
          </Link>

          <button
            onClick={handleExportJson}
            title="Download JSON backup"
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: '#aaa',
              cursor: 'pointer',
            }}
          >
            Export JSON
          </button>

          <button
            onClick={handleReset}
            title="Reset to defaults"
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '6px',
              border: 'none',
              background: data.theme.accentColor,
              color: '#050505',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 0 16px ${hexToRgba(data.theme.accentColor, 0.4)}`,
            }}
          >
            <Save size={15} /> {isSaving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)' }}>
        {/* Left Navigation Sidebar */}
        <aside style={{
          width: '240px',
          background: '#0B0B0E',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {[
            { id: 'theme', label: 'Theme & Accent', icon: Palette },
            { id: 'hero', label: 'Hero Header', icon: LayoutTemplate },
            { id: 'about', label: 'About & Stats', icon: User },
            { id: 'projects', label: 'Projects Matrix', icon: FolderGit2 },
            { id: 'skills', label: 'Skills & Craft', icon: Cpu },
            { id: 'experience', label: 'Experience & Edu', icon: GraduationCap },
            { id: 'contact', label: 'Contact & Links', icon: Mail },
            { id: 'resume', label: 'Resume PDF', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: active ? '600' : '500',
                  color: active ? data.theme.accentColor : '#999',
                  background: active ? hexToRgba(data.theme.accentColor, 0.1) : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Center Editing Canvas */}
        <main style={{ flex: 1, padding: '32px 40px', maxWidth: '1000px', margin: '0 auto' }}>
          {/* TAB 1: THEME & COLOR PICKER */}
          {activeTab === 'theme' && (
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Theme &amp; Accent Color</h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
                Select or customize the primary signature color for the entire portfolio. This dynamically updates
                all highlight fonts, button fills, card glows, border highlights, stat counters, and particle physics.
              </p>

              {/* Preset Chips */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#aaa', display: 'block', marginBottom: '10px' }}>
                  PRESET PALETTES
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                  {PRESET_COLORS.map(p => {
                    const isSelected = data.theme.accentColor.toLowerCase() === p.hex.toLowerCase();
                    return (
                      <button
                        key={p.hex}
                        onClick={() => {
                          setData(prev => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              accentColor: p.hex,
                              accentDim: hexToRgba(p.hex, 0.12),
                              accentDim2: hexToRgba(p.hex, 0.06),
                            },
                          }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(255,255,255,0.12)' : '#111116',
                          border: isSelected ? `2px solid ${p.hex}` : '1px solid rgba(255,255,255,0.08)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: p.hex,
                          boxShadow: isSelected ? `0 0 10px ${p.hex}` : 'none',
                        }} />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Input */}
              <div style={{
                background: '#111116',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '28px',
              }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#aaa', display: 'block', marginBottom: '12px' }}>
                  CUSTOM HEX COLOR
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <input
                    type="color"
                    value={data.theme.accentColor}
                    onChange={e => {
                      const hex = e.target.value;
                      setData(prev => ({
                        ...prev,
                        theme: {
                          ...prev.theme,
                          accentColor: hex,
                          accentDim: hexToRgba(hex, 0.12),
                          accentDim2: hexToRgba(hex, 0.06),
                        },
                      }));
                    }}
                    style={{
                      width: '48px',
                      height: '42px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  />
                  <input
                    type="text"
                    value={data.theme.accentColor}
                    onChange={e => {
                      const hex = e.target.value;
                      setData(prev => ({
                        ...prev,
                        theme: {
                          ...prev.theme,
                          accentColor: hex,
                          accentDim: hexToRgba(hex, 0.12),
                          accentDim2: hexToRgba(hex, 0.06),
                        },
                      }));
                    }}
                    placeholder="#C6FF4D"
                    style={{
                      padding: '10px 14px',
                      background: '#1A1A22',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      width: '140px',
                    }}
                  />
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: data.theme.accentColor,
                    color: '#050505',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}>
                    Sample Button
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: HERO SECTION */}
          {activeTab === 'hero' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>Hero Section</h2>
                <p style={{ fontSize: '13px', color: '#888' }}>
                  Customize the bold introductory typography and CTA buttons.
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Top Label</label>
                <input
                  type="text"
                  value={data.hero.label}
                  onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, label: e.target.value } }))}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Headline Line 1</label>
                  <input
                    type="text"
                    value={data.hero.headlineLine1}
                    onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, headlineLine1: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Headline Line 2</label>
                  <input
                    type="text"
                    value={data.hero.headlineLine2}
                    onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, headlineLine2: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>
                    Headline Accent Word (Glowing Color)
                  </label>
                  <input
                    type="text"
                    value={data.hero.headlineAccent}
                    onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, headlineAccent: e.target.value } }))}
                    style={{ ...inputStyle, color: data.theme.accentColor }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Headline Line 4</label>
                  <input
                    type="text"
                    value={data.hero.headlineLine4}
                    onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, headlineLine4: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Bio / Description</label>
                <textarea
                  rows={3}
                  value={data.hero.description}
                  onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
                  style={textareaStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Primary CTA Button</label>
                  <input
                    type="text"
                    value={data.hero.ctaPrimaryText}
                    onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, ctaPrimaryText: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Secondary CTA Button</label>
                  <input
                    type="text"
                    value={data.hero.ctaSecondaryText}
                    onChange={e => setData(prev => ({ ...prev, hero: { ...prev.hero, ctaSecondaryText: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: ABOUT & STATS */}
          {activeTab === 'about' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>About Section &amp; Counters</h2>
                <p style={{ fontSize: '13px', color: '#888' }}>
                  Edit bio paragraphs, metadata details, and the animated numeric stat counters.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Headline Line 1</label>
                  <input
                    type="text"
                    value={data.about.headlineLine1}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, headlineLine1: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Headline Line 2</label>
                  <input
                    type="text"
                    value={data.about.headlineLine2}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, headlineLine2: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Headline Accent</label>
                  <input
                    type="text"
                    value={data.about.headlineAccent}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, headlineAccent: e.target.value } }))}
                    style={{ ...inputStyle, color: data.theme.accentColor }}
                  />
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#ddd' }}>Bio Paragraphs</label>
                  <button
                    onClick={() => {
                      setData(prev => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          bioParagraphs: [...prev.about.bioParagraphs, 'New bio paragraph...'],
                        },
                      }));
                    }}
                    style={smallAddBtn}
                  >
                    <Plus size={14} /> Add Paragraph
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.about.bioParagraphs.map((para, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px' }}>
                      <textarea
                        rows={2}
                        value={para}
                        onChange={e => {
                          const updated = [...data.about.bioParagraphs];
                          updated[i] = e.target.value;
                          setData(prev => ({ ...prev, about: { ...prev.about, bioParagraphs: updated } }));
                        }}
                        style={textareaStyle}
                      />
                      <button
                        onClick={() => {
                          const updated = data.about.bioParagraphs.filter((_, idx) => idx !== i);
                          setData(prev => ({ ...prev, about: { ...prev.about, bioParagraphs: updated } }));
                        }}
                        style={iconBtnStyle}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Numeric Stat Counters */}
              <div style={{
                background: '#111116',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px',
              }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#ddd', display: 'block', marginBottom: '14px' }}>
                  Animated Stat Counters (Intersection Triggered)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Projects Built</span>
                    <input
                      type="number"
                      value={data.about.stats.projectsCount}
                      onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, stats: { ...prev.about.stats, projectsCount: Number(e.target.value) } } }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Years Coding</span>
                    <input
                      type="number"
                      value={data.about.stats.yearsCoding}
                      onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, stats: { ...prev.about.stats, yearsCoding: Number(e.target.value) } } }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Deployments Live</span>
                    <input
                      type="number"
                      value={data.about.stats.deploymentsLive}
                      onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, stats: { ...prev.about.stats, deploymentsLive: Number(e.target.value) } } }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Technologies Used</span>
                    <input
                      type="number"
                      value={data.about.stats.technologiesCount}
                      onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, stats: { ...prev.about.stats, technologiesCount: Number(e.target.value) } } }))}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Details Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', display: 'block' }}>Location</label>
                  <input
                    type="text"
                    value={data.about.details.location}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, details: { ...prev.about.details, location: e.target.value } } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', display: 'block' }}>Focus</label>
                  <input
                    type="text"
                    value={data.about.details.focus}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, details: { ...prev.about.details, focus: e.target.value } } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', display: 'block' }}>Education</label>
                  <input
                    type="text"
                    value={data.about.details.education}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, details: { ...prev.about.details, education: e.target.value } } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', display: 'block' }}>Status</label>
                  <input
                    type="text"
                    value={data.about.details.status}
                    onChange={e => setData(prev => ({ ...prev, about: { ...prev.about, details: { ...prev.about.details, status: e.target.value } } }))}
                    style={inputStyle}
                  />
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Projects Showcase</h2>
                  <p style={{ fontSize: '13px', color: '#888' }}>
                    Add, edit, reorder, or remove projects shown on your portfolio.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newProj: ProjectItem = {
                      id: `proj-${Date.now()}`,
                      title: 'New Project',
                      category: 'Web Application',
                      shortDesc: 'A concise summary of what this application does.',
                      description: 'Comprehensive overview of features, engineering challenges, and technical stack.',
                      contributions: ['Designed core database schema', 'Built full REST API'],
                      stack: ['React', 'Node.js', 'TypeScript'],
                      features: ['User authentication', 'Real-time telemetry'],
                      status: 'development',
                      accentColor: data.theme.accentColor,
                    };
                    setData(prev => ({ ...prev, projects: [newProj, ...prev.projects] }));
                  }}
                  style={{ ...smallAddBtn, background: data.theme.accentColor, color: '#050505', border: 'none' }}
                >
                  <Plus size={15} /> Add New Project
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {data.projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    style={{
                      background: '#111116',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {/* Project Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: '#888',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}>
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={e => {
                            const updated = [...data.projects];
                            updated[idx].title = e.target.value;
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={{
                            ...inputStyle,
                            fontWeight: '700',
                            fontSize: '16px',
                            width: '240px',
                          }}
                        />
                      </div>

                      {/* Action buttons (Move Up, Move Down, Delete) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            const updated = [...data.projects];
                            const temp = updated[idx - 1];
                            updated[idx - 1] = updated[idx];
                            updated[idx] = temp;
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={iconBtnStyle}
                          title="Move Up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          disabled={idx === data.projects.length - 1}
                          onClick={() => {
                            const updated = [...data.projects];
                            const temp = updated[idx + 1];
                            updated[idx + 1] = updated[idx];
                            updated[idx] = temp;
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={iconBtnStyle}
                          title="Move Down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete project "${proj.title}"?`)) {
                              const updated = data.projects.filter((_, i) => i !== idx);
                              setData(prev => ({ ...prev, projects: updated }));
                            }
                          }}
                          style={{ ...iconBtnStyle, color: '#F43F5E' }}
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Category</label>
                        <input
                          type="text"
                          value={proj.category}
                          onChange={e => {
                            const updated = [...data.projects];
                            updated[idx].category = e.target.value;
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Status</label>
                        <select
                          value={proj.status}
                          onChange={e => {
                            const updated = [...data.projects];
                            updated[idx].status = e.target.value as 'live' | 'development' | 'completed';
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={inputStyle}
                        >
                          <option value="live">Live</option>
                          <option value="completed">Completed</option>
                          <option value="development">In Development</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Accent Color</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={proj.accentColor || '#C6FF4D'}
                            onChange={e => {
                              const updated = [...data.projects];
                              updated[idx].accentColor = e.target.value;
                              setData(prev => ({ ...prev, projects: updated }));
                            }}
                            style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          />
                          <input
                            type="text"
                            value={proj.accentColor || ''}
                            onChange={e => {
                              const updated = [...data.projects];
                              updated[idx].accentColor = e.target.value;
                              setData(prev => ({ ...prev, projects: updated }));
                            }}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div>
                      <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Short Description</label>
                      <input
                        type="text"
                        value={proj.shortDesc}
                        onChange={e => {
                          const updated = [...data.projects];
                          updated[idx].shortDesc = e.target.value;
                          setData(prev => ({ ...prev, projects: updated }));
                        }}
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Full Description</label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={e => {
                          const updated = [...data.projects];
                          updated[idx].description = e.target.value;
                          setData(prev => ({ ...prev, projects: updated }));
                        }}
                        style={textareaStyle}
                      />
                    </div>

                    {/* Tags & Links */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                          Tech Stack (Comma Separated)
                        </label>
                        <input
                          type="text"
                          value={proj.stack.join(', ')}
                          onChange={e => {
                            const updated = [...data.projects];
                            updated[idx].stack = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                          Features (Comma Separated)
                        </label>
                        <input
                          type="text"
                          value={proj.features.join(', ')}
                          onChange={e => {
                            const updated = [...data.projects];
                            updated[idx].features = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>GitHub URL</label>
                        <input
                          type="text"
                          value={proj.github || ''}
                          placeholder="https://github.com/..."
                          onChange={e => {
                            const updated = [...data.projects];
                            updated[idx].github = e.target.value;
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>Live Demo URL</label>
                        <input
                          type="text"
                          value={proj.demo || ''}
                          placeholder="https://..."
                          onChange={e => {
                            const updated = [...data.projects];
                            updated[idx].demo = e.target.value;
                            setData(prev => ({ ...prev, projects: updated }));
                          }}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 5: SKILLS MATRIX */}
          {activeTab === 'skills' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Skills &amp; Technologies</h2>
                  <p style={{ fontSize: '13px', color: '#888' }}>
                    Manage technology groups and badges displayed in the Craft section.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newCat: SkillCategory = {
                      label: 'New Category',
                      skills: ['Skill 1', 'Skill 2'],
                    };
                    setData(prev => ({ ...prev, skills: [...prev.skills, newCat] }));
                  }}
                  style={smallAddBtn}
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.skills.map((group, gi) => (
                  <div
                    key={gi}
                    style={{
                      background: '#111116',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={group.label}
                        onChange={e => {
                          const updated = [...data.skills];
                          updated[gi].label = e.target.value;
                          setData(prev => ({ ...prev, skills: updated }));
                        }}
                        style={{ ...inputStyle, fontWeight: '600', width: '220px' }}
                      />
                      <button
                        onClick={() => {
                          const updated = data.skills.filter((_, idx) => idx !== gi);
                          setData(prev => ({ ...prev, skills: updated }));
                        }}
                        style={{ ...iconBtnStyle, color: '#F43F5E' }}
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: '#888', display: 'block', marginBottom: '4px' }}>
                        Skills (Comma Separated)
                      </label>
                      <input
                        type="text"
                        value={group.skills.join(', ')}
                        onChange={e => {
                          const updated = [...data.skills];
                          updated[gi].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setData(prev => ({ ...prev, skills: updated }));
                        }}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 6: EXPERIENCE & EDUCATION */}
          {activeTab === 'experience' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Education &amp; Experience</h2>
                  <p style={{ fontSize: '13px', color: '#888' }}>
                    Manage timeline milestones displayed in the Background section.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newExp: ExperienceItem = {
                      id: `exp-${Date.now()}`,
                      type: 'Experience',
                      role: 'Software Engineer',
                      org: 'Company / Institution',
                      period: '2025 – Present',
                      desc: 'Describe responsibilities, systems designed, and technical achievements.',
                    };
                    setData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }));
                  }}
                  style={smallAddBtn}
                >
                  <Plus size={14} /> Add Timeline Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.experiences.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      background: '#111116',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Role / Degree"
                          value={item.role}
                          onChange={e => {
                            const updated = [...data.experiences];
                            updated[idx].role = e.target.value;
                            setData(prev => ({ ...prev, experiences: updated }));
                          }}
                          style={{ ...inputStyle, fontWeight: '600', width: '260px' }}
                        />
                        <input
                          type="text"
                          placeholder="Type (e.g. Education / Work)"
                          value={item.type}
                          onChange={e => {
                            const updated = [...data.experiences];
                            updated[idx].type = e.target.value;
                            setData(prev => ({ ...prev, experiences: updated }));
                          }}
                          style={{ ...inputStyle, width: '130px' }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          const updated = data.experiences.filter((_, i) => i !== idx);
                          setData(prev => ({ ...prev, experiences: updated }));
                        }}
                        style={{ ...iconBtnStyle, color: '#F43F5E' }}
                        title="Delete Milestone"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Organization / University"
                        value={item.org}
                        onChange={e => {
                          const updated = [...data.experiences];
                          updated[idx].org = e.target.value;
                          setData(prev => ({ ...prev, experiences: updated }));
                        }}
                        style={inputStyle}
                      />
                      <input
                        type="text"
                        placeholder="Period (e.g. 2021 – 2025)"
                        value={item.period}
                        onChange={e => {
                          const updated = [...data.experiences];
                          updated[idx].period = e.target.value;
                          setData(prev => ({ ...prev, experiences: updated }));
                        }}
                        style={inputStyle}
                      />
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Description of activities and contributions"
                      value={item.desc}
                      onChange={e => {
                        const updated = [...data.experiences];
                        updated[idx].desc = e.target.value;
                        setData(prev => ({ ...prev, experiences: updated }));
                      }}
                      style={textareaStyle}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 7: CONTACT & PROFILE URLS */}
          {activeTab === 'contact' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Contact &amp; Profile URLs</h2>
                <p style={{ fontSize: '13px', color: '#888' }}>
                  Update your direct communication links and social profile handles.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Email Address</label>
                  <input
                    type="email"
                    value={data.contact.email}
                    onChange={e => setData(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>Section Subtitle</label>
                  <input
                    type="text"
                    value={data.contact.subtitle}
                    onChange={e => setData(prev => ({ ...prev, contact: { ...prev.contact, subtitle: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>GitHub Profile URL</label>
                  <input
                    type="text"
                    value={data.contact.github}
                    onChange={e => setData(prev => ({ ...prev, contact: { ...prev.contact, github: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px', display: 'block' }}>LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={data.contact.linkedin}
                    onChange={e => setData(prev => ({ ...prev, contact: { ...prev.contact, linkedin: e.target.value } }))}
                    style={inputStyle}
                  />
                </div>
              </div>
            </section>
          )}

          {/* TAB 8: RESUME PDF UPLOADER */}
          {activeTab === 'resume' && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Resume PDF Manager</h2>
                <p style={{ fontSize: '13px', color: '#888' }}>
                  Upload a new resume PDF directly from your device. It immediately updates all &ldquo;Resume&rdquo; download
                  links on your portfolio (Navbar &amp; Contact section).
                </p>
              </div>

              {/* Upload Box */}
              <div style={{
                background: '#111116',
                border: '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '36px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: hexToRgba(data.theme.accentColor, 0.12),
                  color: data.theme.accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Upload size={24} />
                </div>

                <div>
                  <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                    Upload New Resume PDF
                  </p>
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    Select a PDF from your computer to update the live downloadable file.
                  </p>
                </div>

                <label style={{
                  padding: '10px 20px',
                  background: data.theme.accentColor,
                  color: '#050505',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: uploadingResume ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <FileText size={16} />
                  {uploadingResume ? 'Uploading...' : 'Choose PDF File'}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    style={{ display: 'none' }}
                  />
                </label>

                {resumeUploadMsg && (
                  <p style={{ fontSize: '13px', color: '#C6FF4D', marginTop: '6px' }}>
                    {resumeUploadMsg}
                  </p>
                )}
              </div>

              {/* Current Status */}
              <div style={{
                background: '#111116',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '18px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Active Live Resume
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>
                    {data.contact.resumeFileName || 'Ravi_Mohan_Rohela_Resume.pdf'}
                  </p>
                </div>

                <a
                  href={data.contact.resumeUrl || '/resume.pdf'}
                  download={data.contact.resumeFileName || 'Ravi_Mohan_Rohela_Resume.pdf'}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '13px',
                    color: '#ddd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Download size={14} /> Test Download
                </a>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

// Common styles
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: '#16161D',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '6px',
  color: '#EDEDED',
  fontSize: '13px',
  outline: 'none',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: '#16161D',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '6px',
  color: '#EDEDED',
  fontSize: '13px',
  lineHeight: 1.5,
  outline: 'none',
  resize: 'vertical',
};

const smallAddBtn: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: '#EDEDED',
  fontSize: '12px',
  fontWeight: '500',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
};

const iconBtnStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#aaa',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
