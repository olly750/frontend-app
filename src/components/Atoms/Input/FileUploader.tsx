/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';

import Error from '../../Atoms/Text/Error';

interface IProps {
  maxNumberOfFiles?: number;
  maxFileSizeInBytes?: number;
  allowPreview?: boolean;
  accept: string;
  multiple?: boolean;
  handleUpload: (_files: FileList | null) => any;
  children: ReactNode;
  clearFile?: boolean;
  error?: string;
  handleBlur?: () => void;
  disableUpload?: boolean;
}

export default function FileUploader({
  accept,
  multiple,
  handleUpload,
  children,
  clearFile,
  error,
  handleBlur,
  disableUpload = false,
}: IProps) {
  const fileInputField = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileList | null>();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    handleUpload(e.target.files);
  };

  useEffect(() => {
    if (clearFile) setFiles(null);
  }, [clearFile]);

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputField}
        onChange={changeHandler}
        onBlur={handleBlur}
        accept={accept}
        multiple={multiple}
      />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disableUpload && fileInputField.current?.click()}
        className="inline-block">
        {children}
      </div>
      {files && files[0] && (
        <div className="py-2 text-sm font-semibold">{files[0].name}</div>
      )}
      <Error>{error && error}</Error>
    </>
  );
}
