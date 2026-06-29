import React, { useState } from 'react';
import { useEditor, EditorContent, Node, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ImageIcon,
  Code,
  Highlighter,
  Undo,
  Redo,
  Table as TableIcon,
  Youtube as YoutubeIcon,
  Minus,
  Columns,
  RowsIcon,
  Trash2,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

function getYoutubeEmbedUrl(input: string): string | null {
  try {
    const url = new URL(input);
    let videoId: string | null = null;
    if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    } else if (url.hostname.includes('youtube.com')) {
      videoId = url.searchParams.get('v');
    }
    if (!videoId) videoId = input.trim();
    if (!videoId) return null;
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return `https://www.youtube-nocookie.com/embed/${input.trim()}`;
  }
}

const YoutubeEmbed = Node.create({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null } };
  },
  parseHTML() {
    return [{ tag: 'div[data-youtube-embed]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-youtube-embed': '' }), ['iframe', {
      src: HTMLAttributes.src,
      frameborder: '0',
      allowfullscreen: 'true',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      style: 'width:100%;aspect-ratio:16/9;border-radius:8px;',
    }]];
  },
  addCommands() {
    return {
      setYoutubeVideo: (options: { src: string }) => ({ commands }: any) => {
        const embedUrl = getYoutubeEmbedUrl(options.src);
        if (!embedUrl) return false;
        return commands.insertContent({ type: this.name, attrs: { src: embedUrl } });
      },
    } as any;
  },
});

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-gold-500 hover:text-gold-600 underline' },
      }),
      ImageExt.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      YoutubeEmbed,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const applyLink = () => {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    }
    setLinkDialogOpen(false);
    setLinkUrl('');
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setLinkDialogOpen(false);
    setLinkUrl('');
  };

  const applyImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    }
    setImageDialogOpen(false);
    setImageUrl('');
  };

  const applyYoutube = () => {
    if (youtubeUrl.trim()) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl.trim() }).run();
    }
    setYoutubeDialogOpen(false);
    setYoutubeUrl('');
  };

  const openLinkDialog = () => {
    const existing = editor.getAttributes('link').href ?? '';
    setLinkUrl(existing);
    setLinkDialogOpen(true);
  };

  return (
    <div className="rich-text-editor relative">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-navy-700 border border-navy-600 rounded-t-lg p-2 flex flex-wrap gap-0.5 border-b-0">
        {/* Text format */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight"><Highlighter className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code"><Code className="w-4 h-4" /></Btn>

        <Sep />

        {/* Headings */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1"><Heading1 className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2"><Heading2 className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3"><Heading3 className="w-4 h-4" /></Btn>

        <Sep />

        {/* Alignment */}
        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight className="w-4 h-4" /></Btn>

        <Sep />

        {/* Lists & blocks */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule"><Minus className="w-4 h-4" /></Btn>

        <Sep />

        {/* Table */}
        <Btn
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          active={editor.isActive('table')}
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </Btn>
        {editor.isActive('table') && (
          <>
            <Btn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column"><Columns className="w-4 h-4" /></Btn>
            <Btn onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row"><RowsIcon className="w-4 h-4" /></Btn>
            <Btn onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table"><Trash2 className="w-4 h-4" /></Btn>
          </>
        )}

        <Sep />

        {/* Media */}
        <Btn onClick={openLinkDialog} active={editor.isActive('link')} title="Add Link"><LinkIcon className="w-4 h-4" /></Btn>
        <Btn onClick={() => { setImageUrl(''); setImageDialogOpen(true); }} title="Insert Image"><ImageIcon className="w-4 h-4" /></Btn>
        <Btn onClick={() => { setYoutubeUrl(''); setYoutubeDialogOpen(true); }} title="Embed YouTube"><YoutubeIcon className="w-4 h-4" /></Btn>

        <Sep />

        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo className="w-4 h-4" /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo className="w-4 h-4" /></Btn>
      </div>

      {/* Editor content */}
      <div className="border border-navy-600 rounded-b-lg bg-navy-800 text-white p-4 min-h-[500px] prose prose-invert max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>

      {/* Link dialog */}
      {linkDialogOpen && (
        <Dialog title="Insert Link" onClose={() => setLinkDialogOpen(false)}>
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyLink()}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={applyLink} className="flex-1 py-2 rounded-lg bg-gold-500 text-navy-900 text-sm font-semibold hover:bg-gold-400 transition-colors">Apply</button>
            {editor.isActive('link') && (
              <button onClick={removeLink} className="px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition-colors">Remove</button>
            )}
            <button onClick={() => setLinkDialogOpen(false)} className="px-3 py-2 rounded-lg bg-navy-700 text-gray-300 text-sm hover:bg-navy-600 transition-colors">Cancel</button>
          </div>
        </Dialog>
      )}

      {/* Image dialog */}
      {imageDialogOpen && (
        <Dialog title="Insert Image" onClose={() => setImageDialogOpen(false)}>
          <input
            autoFocus
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyImage()}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
          />
          {imageUrl && (
            <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-navy-700">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <button onClick={applyImage} className="flex-1 py-2 rounded-lg bg-gold-500 text-navy-900 text-sm font-semibold hover:bg-gold-400 transition-colors">Insert</button>
            <button onClick={() => setImageDialogOpen(false)} className="px-3 py-2 rounded-lg bg-navy-700 text-gray-300 text-sm hover:bg-navy-600 transition-colors">Cancel</button>
          </div>
        </Dialog>
      )}

      {/* YouTube dialog */}
      {youtubeDialogOpen && (
        <Dialog title="Embed YouTube Video" onClose={() => setYoutubeDialogOpen(false)}>
          <p className="text-xs text-gray-400 mb-2">Paste a YouTube URL or video ID</p>
          <input
            autoFocus
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyYoutube()}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={applyYoutube} className="flex-1 py-2 rounded-lg bg-gold-500 text-navy-900 text-sm font-semibold hover:bg-gold-400 transition-colors">Embed</button>
            <button onClick={() => setYoutubeDialogOpen(false)} className="px-3 py-2 rounded-lg bg-navy-700 text-gray-300 text-sm hover:bg-navy-600 transition-colors">Cancel</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function Btn({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-gold-500 text-navy-900' : 'text-gray-300 hover:bg-navy-600 hover:text-white'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-6 bg-navy-600 mx-0.5 self-center" />;
}

function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-navy-800 border border-navy-600 rounded-xl p-5 shadow-2xl">
        <p className="text-sm font-semibold text-white mb-3">{title}</p>
        {children}
      </div>
    </div>
  );
}
