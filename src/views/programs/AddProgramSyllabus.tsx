import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import FileUploader from '../../components/Atoms/Input/FileUploader';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import TextAreaMolecule from '../../components/Molecules/input/TextAreaMolecule';
import { queryClient } from '../../plugins/react-query';
import programStore from '../../store/administration/program.store';
import { ValueType } from '../../types';
import { ProgramSyllabus } from '../../types/services/program.types';
import { DocErrors } from '../../types/services/user.types';
import { programSyllabusSchema } from '../../validations/program.validation';

interface DocParams {
  programId: string;
}

export default function AddProgramSyllabus({ programId }: DocParams) {
  const initialErrorState: DocErrors = { purpose: '', file: '' };
  const [errors, setErrors] = useState<DocErrors>(initialErrorState);

  const [attachment, setAttachment] = useState<ProgramSyllabus>({
    description: '',
    purpose: '',
    programId: programId,
  });

  const [file, setFile] = useState<File | null>(null);
  const { t } = useTranslation();

  const handleUpload = (files: FileList | null) => {
    setFile(files ? files[0] : null);
  };

  const history = useHistory();
  const { mutateAsync, isLoading } = programStore.addProgramSyllabus();

  function handleChange(e: ValueType) {
    setAttachment({ ...attachment, [e.name]: e.value });
  }

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    const validatedForm = programSyllabusSchema.validate(
      { purpose: attachment.purpose, file: file },
      {
        abortEarly: false,
      },
    );

    validatedForm
      .then(() => {
        if (file) {
          let data = new FormData();

          data.append('description', `${attachment.description}`);
          data.append('purpose', `${attachment.purpose}`);
          data.append('attachmentFile', file);
          data.append('programId', `${programId}`);

          mutateAsync(
            { id: programId, docInfo: data },
            {
              onSuccess() {
                toast.success('Document uploaded successfully');
                queryClient.invalidateQueries(['intake-program/id', programId]);
                history.goBack();
              },
              onError(error: any) {
                toast.error(error.response.data.message);
              },
            },
          );
        }
      })
      .catch((err) => {
        const validatedErr: DocErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof DocErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      <div className="mb-6">
        <InputMolecule
          value={attachment.purpose}
          error={errors.purpose}
          handleChange={handleChange}
          placeholder="Enter attachment purpose"
          name="purpose">
          {t('Program')} Syllabus Title
        </InputMolecule>

        <TextAreaMolecule
          value={attachment.description}
          name="description"
          handleChange={handleChange}>
          Syllabus Descripiton
        </TextAreaMolecule>

        <FileUploader allowPreview={false} handleUpload={handleUpload} accept={'*'}>
          <Button styleType="outline" type="button">
            upload doc
          </Button>
        </FileUploader>
      </div>

      <Button isLoading={isLoading} type="submit">
        Save
      </Button>
    </form>
  );
}
