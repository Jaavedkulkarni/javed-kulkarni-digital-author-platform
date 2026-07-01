import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from './AdminLayout';
import { supabase } from '../../lib/supabase';
import { uploadMediaFile } from '../../lib/mediaService';
import {
  Save,
  User,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Globe,
  BookOpen,
  Upload,
  Check,
  AlertCircle,
  Camera,
  ImageIcon,
  AtSign,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteSettings {
  author_name: string;
  author_bio: string;
  author_photo_url: string;
  social_instagram: string;
  social_facebook: string;
  social_linkedin: string;
  social_x: string;
  social_amazon: string;
  site_logo_url: string;
  site_favicon_url: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function empty(): SiteSettings {
  return {
    author_name: '',
    author_bio: '',
    author_photo_url: '',
    social_instagram: '',
    social_facebook: '',
    social_linkedin: '',
    social_x: '',
    social_amazon: '',
    site_logo_url: '',
    site_favicon_url: '',
  };
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

// ─── Main Component ───────────────────────────────────────────────────────────

export function SettingsPage() {
  const [form, setForm] = useState<SiteSettings>(empty());
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');
  const [uploading, setUploading] = useState<Partial<Record<keyof SiteSettings, boolean>>>({});

  // ── Load ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('blog_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (data) {
        setForm({
          author_name: data.author_name ?? '',
          author_bio: data.author_bio ?? '',
          author_photo_url: data.author_photo_url ?? '',
          social_instagram: data.social_instagram ?? '',
          social_facebook: data.social_facebook ?? '',
          social_linkedin: data.social_linkedin ?? '',
          social_x: data.social_x ?? '',
          social_amazon: data.social_amazon ?? '',
          site_logo_url: data.site_logo_url ?? '',
          site_favicon_url: data.site_favicon_url ?? '',
        });
      }
      setLoading(false);
    })();
  }, []);

  // ── Field helpers ───────────────────────────────────────────────────────────

  const set = (key: keyof SiteSettings, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // ── Image upload ────────────────────────────────────────────────────────────

  const uploadImage = async (file: File, field: keyof SiteSettings) => {
    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const asset = await uploadMediaFile(file);
      set(field, asset.publicUrl);
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaveState('saving');
    setSaveError('');
    const { error } = await supabase
      .from('blog_settings')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', 1);
    if (error) {
      setSaveState('error');
      setSaveError(error.message);
    } else {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-navy-800 border border-navy-700 rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-navy-700 rounded w-32" />
              <div className="h-10 bg-navy-700 rounded" />
              <div className="h-10 bg-navy-700 rounded" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-500 text-sm mt-0.5">Blog आणि Author माहिती</p>
          </div>
          <SaveButton state={saveState} onClick={handleSave} />
        </div>

        {saveState === 'error' && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {saveError || 'Settings save करण्यात त्रुटी आली.'}
          </div>
        )}

        {/* ── Section: Author Profile ──────────────────────────────────────── */}
        <Section icon={<User className="w-4 h-4 text-gold-400" />} title="Author Profile">
          {/* Author Photo */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Author Photo</label>
            <ImageField
              value={form.author_photo_url}
              onChange={(v) => set('author_photo_url', v)}
              onUpload={(f) => uploadImage(f, 'author_photo_url')}
              uploading={!!uploading.author_photo_url}
              placeholder="https://..."
              accept="image/*"
              preview="round"
            />
          </div>

          <Field label="Author Name">
            <input
              type="text"
              value={form.author_name}
              onChange={(e) => set('author_name', e.target.value)}
              className={inputCls}
              placeholder="जावेद कुलकर्णी"
            />
          </Field>

          <Field label="Author Bio">
            <textarea
              value={form.author_bio}
              onChange={(e) => set('author_bio', e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="लेखकाबद्दल थोडक्यात माहिती..."
            />
          </Field>
        </Section>

        {/* ── Section: Social Links ─────────────────────────────────────────── */}
        <Section icon={<AtSign className="w-4 h-4 text-gold-400" />} title="Social Links">
          <SocialField
            icon={<Instagram className="w-4 h-4 text-pink-400" />}
            label="Instagram"
            value={form.social_instagram}
            onChange={(v) => set('social_instagram', v)}
            placeholder="https://instagram.com/username"
          />
          <SocialField
            icon={<Facebook className="w-4 h-4 text-blue-400" />}
            label="Facebook"
            value={form.social_facebook}
            onChange={(v) => set('social_facebook', v)}
            placeholder="https://facebook.com/username"
          />
          <SocialField
            icon={<Linkedin className="w-4 h-4 text-sky-400" />}
            label="LinkedIn"
            value={form.social_linkedin}
            onChange={(v) => set('social_linkedin', v)}
            placeholder="https://linkedin.com/in/username"
          />
          <SocialField
            icon={<Twitter className="w-4 h-4 text-gray-300" />}
            label="X (Twitter)"
            value={form.social_x}
            onChange={(v) => set('social_x', v)}
            placeholder="https://x.com/username"
          />
          <SocialField
            icon={<BookOpen className="w-4 h-4 text-amber-400" />}
            label="Amazon Author Page"
            value={form.social_amazon}
            onChange={(v) => set('social_amazon', v)}
            placeholder="https://amazon.com/author/..."
          />
        </Section>

        {/* ── Section: Branding ─────────────────────────────────────────────── */}
        <Section icon={<ImageIcon className="w-4 h-4 text-gold-400" />} title="Site Branding">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Website Logo</label>
            <ImageField
              value={form.site_logo_url}
              onChange={(v) => set('site_logo_url', v)}
              onUpload={(f) => uploadImage(f, 'site_logo_url')}
              uploading={!!uploading.site_logo_url}
              placeholder="https://..."
              accept="image/*"
              preview="rect"
            />
            <p className="text-xs text-gray-600 mt-1.5">SVG, PNG किंवा WebP. 200×60px शिफारस.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Favicon</label>
            <ImageField
              value={form.site_favicon_url}
              onChange={(v) => set('site_favicon_url', v)}
              onUpload={(f) => uploadImage(f, 'site_favicon_url')}
              uploading={!!uploading.site_favicon_url}
              placeholder="https://..."
              accept="image/png,image/x-icon,image/svg+xml,image/webp"
              preview="round"
            />
            <p className="text-xs text-gray-600 mt-1.5">PNG, ICO किंवा SVG. 32×32px शिफारस.</p>
          </div>
        </Section>

        {/* Bottom save */}
        <div className="flex justify-end pb-4">
          <SaveButton state={saveState} onClick={handleSave} />
        </div>
      </div>
    </AdminLayout>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-navy-700 bg-navy-900/40">
        {icon}
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SocialField({
  icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-navy-700 border border-navy-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} flex-1`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function ImageField({
  value,
  onChange,
  onUpload,
  uploading,
  placeholder,
  accept,
  preview,
}: {
  value: string;
  onChange: (v: string) => void;
  onUpload: (f: File) => void;
  uploading: boolean;
  placeholder: string;
  accept: string;
  preview: 'round' | 'rect';
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-3">
      {/* Preview */}
      <div
        className={`flex-shrink-0 bg-navy-700 border border-navy-600 flex items-center justify-center overflow-hidden ${
          preview === 'round'
            ? 'w-14 h-14 rounded-full'
            : 'w-20 h-14 rounded-lg'
        }`}
      >
        {value ? (
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <Camera className="w-5 h-5 text-navy-500" />
        )}
      </div>

      {/* URL input + upload button */}
      <div className="flex-1 min-w-0 space-y-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-xs font-medium hover:text-white hover:border-navy-500 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="w-3 h-3 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            if (e.target.files?.[0]) onUpload(e.target.files[0]);
            e.target.value = '';
          }}
          className="hidden"
        />
      </div>
    </div>
  );
}

function SaveButton({ state, onClick }: { state: SaveState; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={state === 'saving'}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-70 ${
        state === 'saved'
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
          : 'bg-gold-500 hover:bg-gold-400 text-navy-900 shadow-lg shadow-gold-500/20'
      }`}
    >
      {state === 'saving' ? (
        <>
          <div className="w-4 h-4 rounded-full border-2 border-navy-900 border-t-transparent animate-spin" />
          Saving...
        </>
      ) : state === 'saved' ? (
        <>
          <Check className="w-4 h-4" />
          Saved!
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          Save Settings
        </>
      )}
    </button>
  );
}

export default SettingsPage;
