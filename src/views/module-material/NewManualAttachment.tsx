import { values } from 'lodash';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import Badge from '../../components/Atoms/custom/Badge';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import FileUploader from '../../components/Atoms/Input/FileUploader';
import Heading from '../../components/Atoms/Text/Heading';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import { queryClient } from '../../plugins/react-query';
import { moduleMaterialStore } from '../../store/administration/module-material.store';
import { SelectData, ValueType } from '../../types';
import {
  IntakeModuleMaterialAttachment,
  ModuleMaterialAttachmentInfo,
} from '../../types/services/module-material.types';
import { getDropDownStatusOptions } from '../../utils/getOption';
import { advancedTypeChecker } from '../../utils/getOption';

interface ParamType {
  id: string;
  materialId: string;
}

function NewManualAttachment() {
  const { materialId, id } = useParams<ParamType>();
  const history = useHistory();

  const { data: moduleMaterial } = moduleMaterialStore.getModuleMaterialByModule(id);
  const moduleMaterials = moduleMaterial?.data.data || [];

  const [selectedMaterial, setSelectedMaterial] = useState('');

  const matAttachments =
    moduleMaterialStore.getModuleMaterialAttachments(selectedMaterial);
  const attachments = matAttachments.data?.data.data;

  function handleChanges(e: ValueType) {
    setSelectedMaterial(e.value + '');
  }

  const goBack = () => {
    history.goBack();
  };


  const displaySavedManuals = moduleMaterials.map((material: any) => {
    return {
      value: material.id,
      label: material.title,
    };
  }) as SelectData[];

  const { data: materials, isLoading } =
    moduleMaterialStore.getIntakeModuleMaterial(materialId);

  const material = materials?.data.data;

  const [attach] = useState<IntakeModuleMaterialAttachment>({
    attachment_id: '',
    intake_academic_program_level_module_materials_id: 0,
  });

  return (
    <>
   
          <div className="flex items-center justify-between mb-4">
            <Heading fontSize="base" className="py-4">
              {material?.title} attachment
            </Heading>
          </div>
          <button className="outline-none" onClick={goBack}>
            <Icon name={'back-arrow'} bgColor="gray" />
          </button>
          <div className="flex items-center">
            <SelectMolecule
              className="px-6"
              width="5/5"
              handleChange={handleChanges}
              name={'materialId'}
              placeholder="Search file"
              value={selectedMaterial}
              options={displaySavedManuals}
            />{' '}
          </div>
          <div className="mt-5">
            {attachments?.map((attach) => (
              <ShowAttachment attach={attach} key={attach.id} />
            ))}
          </div>
 
    </>
  );
}
function ShowAttachment({ attach }: { attach: ModuleMaterialAttachmentInfo }) {
  const attachment = moduleMaterialStore.getFileById(attach.attachment_id).data?.data
    .data;
  let filename = attachment?.path_to_file.replace(/^.*[\\/]/, '').slice(36) || '';
  const history = useHistory();
  const { materialId, id } = useParams<ParamType>();
  const { search } = useLocation();

  const intkmod = new URLSearchParams(search).get('intkmod') || '';
  const showMenu = new URLSearchParams(search).get('showMenus');
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';
  const mod = new URLSearchParams(search).get('Mod') || '';
  const goBack = () => {
    history.goBack();
  };

  const { mutateAsync } = moduleMaterialStore.addIntakeModuleMaterialAttachment();

  function activateAttachment(intake_module_material_attachment_id: any) {
    const status: string = 'DESACTIVATED';

    mutateAsync(
      { 
        attachment_id: intake_module_material_attachment_id + '',
        intake_academic_program_level_module_materials_id: parseInt(intkmod + ''),
      }, 
      {
        // async onSuccess(data) {
          onSuccess: () => {
            toast.success('manual added successfuly', { duration: 3000 });
            // toast.success(data.data.message);
                // queryClient.invalidateQueries(['IntakeModuleMaterials']);
                //  history.goBack();
                history.push(
                  `/dashboard/modules/${id}/intakematerials?showMenus=${showMenu}&Mod=${mod}&intkPrg=${intakeProg}`,
                );
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      },
    );
  }

  return (
    <div className="flex items-center justify-between w-4/5">
      <div className="flex items-center max-w-full">
        <Icon name="pdf" />
        <p className="truncate">{filename}</p>
      </div>
      <Button
        className="mt-2 mb-4 mx-20"
        styleType="outline"
        onClick={() => activateAttachment(attachment?.id)}>
        Share
      </Button>
    </div>
  );
}

export default NewManualAttachment;
