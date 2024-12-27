import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import usersStore from '../../../../store/administration/users.store';
import { ValueType } from '../../../../types';
import { DocErrors, INewPersonalDoc } from '../../../../types/services/user.types';
import { userDocSchema } from '../../../../validations/user.validation';
import Button from '../../../Atoms/custom/Button';
import FileUploader from '../../../Atoms/Input/FileUploader';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface DocParams {
  personId: string;
}

export default function NewPersonalDocument({ personId }: DocParams) {
  const initialErrorState: DocErrors = { purpose: '', file: '' };
  const [errors, setErrors] = useState<DocErrors>(initialErrorState);

  const [attachment, setAttachment] = useState<INewPersonalDoc>({
    description: '',
    purpose: '',
    personId: personId,
  });

  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (files: FileList | null) => {
    setFile(files ? files[0] : null);
  };

  const history = useHistory();
  const { mutateAsync, isLoading } = usersStore.addPersonalDoc();

  function handleChange(e: ValueType) {
    setAttachment({ ...attachment, [e.name]: e.value });
  }

  async function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = userDocSchema.validate(
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
          data.append('personId', `${personId}`);

          mutateAsync(
            { id: personId, docInfo: data },
            {
              onSuccess() {
                toast.success('Document uploaded successfully');
                queryClient.invalidateQueries(['user/personal_docs', personId]);
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
          required={false}
          error={errors.purpose}
          value={attachment.purpose}
          handleChange={handleChange}
          placeholder="Enter attachment purpose"
          name="purpose">
          Personal Doc Purpose
        </InputMolecule>

        <TextAreaMolecule
          required={false}
          value={attachment.description}
          name="description"
          handleChange={handleChange}>
          Doc Descripiton
        </TextAreaMolecule>

        <FileUploader
          allowPreview={false}
          handleUpload={handleUpload}
          accept={'*'}
          error={errors.file}>
          <Button styleType="outline" type="button">
            upload doc
          </Button>
        </FileUploader>
      </div>

      <Button disabled={isLoading} type="submit">
        Save
      </Button>
    </form>
  );
}
