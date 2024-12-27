import '../../../styles/components/Molecules/editor/menubar.scss';

import { Editor } from '@tiptap/react';
import React from 'react';

import Icon from '../../Atoms/custom/Icon';

interface IProps {
  editor: Editor | null;
}

export default function MenuBar({ editor }: IProps) {
  if (!editor) {
    return null;
  }

  return (
    <div id="editor-menubar" className="mt-2 mb-3  border-b border-solid">
      <button
        aria-label="bold"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}>
        <Icon size={18} name="bold" />
      </button>
      <button
        aria-label="text-italic"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}>
        <Icon size={18} name="text-italic" />
      </button>
      <button
        type="button"
        aria-label="text-strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}>
        <Icon size={18} name="text-strikethrough" />
      </button>
      {/* <button type='button' onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
        </button>
        <button type='button' onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button> */}
      {/* <button type='button'
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}>
        <Icon name="paragraph" />
      </button> */}
      <button
        type="button"
        aria-label="heading-one"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
        <Icon size={18} name="heading-h1" />
      </button>
      {/* <button type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
        h2
        </button> */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
        <Icon size={18} name="heading-h2" />
      </button>
      {/* <button type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}>
        h4
        </button> */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}>
        <Icon size={18} name="heading-h3" />
      </button>
      {/* <button type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}>
        h6
      </button> */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}>
        <Icon size={18} name="list-ul" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}>
        <Icon size={18} name="list-ol" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}>
        <Icon size={18} name="code" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}>
        <Icon size={18} name="blockquote-left" />
      </button>
      {/* <button type='button' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
        <Icon name="blockquote-left" />
      </button> */}
      {/* <button type='button' onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button> */}

      <button type="button" onClick={() => editor.chain().focus().undo().run()}>
        <Icon size={18} name="undo" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()}>
        <Icon size={18} name="redo" />
      </button>
    </div>
  );
}
