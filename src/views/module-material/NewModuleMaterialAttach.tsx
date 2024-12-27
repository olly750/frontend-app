import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import Badge from '../../components/Atoms/custom/Badge';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import FileUploader from '../../components/Atoms/Input/FileUploader';
import Heading from '../../components/Atoms/Text/Heading';
import { queryClient } from '../../plugins/react-query';
import { moduleMaterialStore } from '../../store/administration/module-material.store';
import { ModuleMaterialAttachment } from '../../types/services/module-material.types';
import { advancedTypeChecker } from '../../utils/getOption';

interface ParamType {
  id: string;
  materialId: string;
}

function NewModuleMaterialAttach() {
  const { materialId, id } = useParams<ParamType>();
  const history = useHistory();

  const { data: materials, isLoading } =
    moduleMaterialStore.getModuleMaterial(materialId);

  const material = materials?.data.data;

  const [attach] = useState<ModuleMaterialAttachment>({
    attachment_id: '',
    learning_material_id: 0,
  });

  const [file, setFile] = useState<File | null>(null);

  const { mutate, isLoading: isAddingFile } = moduleMaterialStore.addFile();
  const { mutateAsync, isLoading: isAddingMaterial } =
    moduleMaterialStore.addModuleMaterialAttachment();

  const { search } = useLocation();
  const showMenu = new URLSearchParams(search).get('showMenus');
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';

  const handleUpload = (files: FileList | null) => {
    setFile(files ? files[0] : null);
  };
    
  async function submitForm(e: FormEvent) {
    e.preventDefault(); // prevent page to reload:
    if (file) {
      let formData = new FormData();
      formData.append('file', file);

      mutate(formData, {
        onSuccess(data) {
          toast.success(data.data.message);
          mutateAsync(
            {
              ...attach,
              attachment_id: data.data.data.id + '',
              learning_material_id: parseInt(material?.id + ''),
            },
            {
              async onSuccess(data) {
                toast.success(data.data.message);
                queryClient.invalidateQueries(['material/attachment']);
                history.push(
                  `/dashboard/modules/${id}/materials?showMenus=${showMenu}&intkPrg=${intakeProg}`,
                );
              },
              onError(error: any) {
                toast.error(error.response.data.message);
              },
            },
          );
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      });
    } else {
      toast.error('Please add file');
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <form className="bg-main w-7/12 px-6 py-4 mt-4" onSubmit={submitForm}>
          <div className="flex items-center justify-between mb-4">
            <Heading fontSize="base" className="py-4">
              {material?.title} attachment
            </Heading>
            {material?.type && (
              <Badge className="h-4/5" badgecolor={advancedTypeChecker(material.type)}>
                {material.type}
              </Badge>
            )}
          </div>
          <div className="flex items-center">
            <FileUploader allowPreview={false} handleUpload={handleUpload} accept={'*'}>
              <Button type="button" styleType="outline" icon={true}>
                <span className="flex items-center">
                  <Icon name={'attach'} fill="primary" />
                  <span className="pr-3">Attach supporting file</span>
                </span>
              </Button>
            </FileUploader>
          </div>
          <div className="mt-5">
            <Button type="submit" isLoading={isAddingFile || isAddingMaterial}>
              Save
            </Button>
          </div>
        </form>
      )}
    </>
  );
}

export default NewModuleMaterialAttach;
