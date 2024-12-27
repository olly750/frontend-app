import { Editor } from '@tiptap/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import ILabel from '../../components/Atoms/Text/ILabel';
import Tiptap from '../../components/Molecules/editor/Tiptap';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import { queryClient } from '../../plugins/react-query';
import { moduleMaterialStore } from '../../store/administration/module-material.store';
import { ParamType, ValueType } from '../../types';
import { MaterialType, ModuleMaterial } from '../../types/services/module-material.types';
import { getDropDownStatusOptions } from '../../utils/getOption';

function NewModuleMaterial() {
  const history = useHistory();
  const { id } = useParams<ParamType>();

  const [material, setMaterial] = useState<ModuleMaterial>({
    content: '',
    module_id: '',
    title: '',
    type: MaterialType.NOTES,
  });

  const { mutateAsync, isLoading } = moduleMaterialStore.addModuleMaterial();
  const { t } = useTranslation();

  function handleChange(e: ValueType) {
    setMaterial({ ...material, [e.name]: e.value });
  }

  function handleEditorChange(editor: Editor) {
    setMaterial((material) => ({ ...material, content: editor.getHTML() }));
  }

  const handleSubmit = async () => {
    await mutateAsync(
      { ...material, module_id: id },
      {
        async onSuccess(data) {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['material/moduleid']);
          history.goBack();
        },
        onError(error: any) {
          toast.error(error.response.data.message || 'error occurred please try again');
        },
      },
    );
  };

  return (
    <>
      <form
        className="bg-main w-3/5 px-6 py-4 mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
        <Heading fontWeight="semibold" fontSize="xl" className="py-4">
          New learning material
        </Heading>
        <InputMolecule value={material.title} handleChange={handleChange} name={'title'}>
          Material Title
        </InputMolecule>
        <DropdownMolecule
          name="type"
          handleChange={handleChange}
          defaultValue={getDropDownStatusOptions(MaterialType).find(
            (cl) => cl.value === material.type,
          )}
          options={getDropDownStatusOptions(MaterialType)}
          placeholder={'Choose ' + t('Class') + ' type'}>
          Material Type
        </DropdownMolecule>
        <div className="flex flex-col gap-2 py-2">
          <ILabel size="sm" textTransform="normal-case">
            Content
          </ILabel>
          <Tiptap content={material.content} handleChange={handleEditorChange} />
        </div>
        <div className="mt-5">
          <Button type="submit" isLoading={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </>
  );
}

export default NewModuleMaterial;
