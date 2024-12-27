import '../../../styles/components/Molecules/editor/tiptap.scss';

import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';

import MenuBar from './Menubar';

interface IProps {
  handleChange: (_editor: Editor) => void;
  content: string;
  editable?: boolean;
  viewMenu?: boolean;
  showBorder?: boolean;
  backgroundColor?: string;
  handleBlur?: (_editor?: Editor) => void;
}

export default function Tiptap({
  handleChange,
  handleBlur = () => { },
  content,
  editable = true,
  viewMenu = true,
  backgroundColor = 'bg-main',
  showBorder = true,
}: IProps) {
  const editor = useEditor({
    onUpdate({ editor }) {
      handleChange(editor as Editor);
    },
    onBlur({ editor }) {
      handleBlur(editor as Editor);
    },
    extensions: [StarterKit],
    content,
    editable,
  });

  return (
    <section
      id="tiptap-editor"
      className={`${showBorder ? 'show-border' : ''} ${backgroundColor}`}>
      {viewMenu && (
        <article>
          <MenuBar editor={editor} />
        </article>
      )}
      <article className="text-sm">
        <EditorContent editor={editor} />
      </article>
    </section>
  );
}
