import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import usePickedRole from '../../../../hooks/usePickedRole';
import { queryClient } from '../../../../plugins/react-query';
import { moduleStore } from '../../../../store/administration/modules.store';
import { GenericStatus, ValueType } from '../../../../types';
import { CreatePrerequisites } from '../../../../types/services/modules.types';
import { getDropDownOptions } from '../../../../utils/getOption';
import Button from '../../../Atoms/custom/Button';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface ParamType {
  moduleId: string;
}

export default function AddPrerequesitesForm() {
  const { moduleId } = useParams<ParamType>();
  const { mutateAsync, isLoading } = moduleStore.addPrerequisites();
  const history = useHistory();
  const { search } = useLocation();
  const showMenu = new URLSearchParams(search).get('showMenus');
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';

  const [values, setValues] = useState({
    module_id: moduleId,
    prerequistis: [],
    description: '',
    status: 'ACTIVE',
  });

  function handleChange(e: ValueType) {
    setValues({ ...values, [e.name]: e.value });
  }

  const picked_role = usePickedRole();

  const moduleSt = moduleStore.getModulesByAcademy(picked_role?.academy_id + '');
  const modulePrereqs = moduleStore.getModulePrereqsByModule(moduleId);
  const modulePrereqIds = modulePrereqs.data?.data.data.map(
    (preq) => preq.prerequisite.id,
  );

  const academyModules =
    moduleSt.data?.data.data.filter((module) => module.id != moduleId) || [];

  const modules = academyModules.filter((mod) => !modulePrereqIds?.includes(mod.id + ''));

  const handleSubmit = async () => {
    if (values.prerequistis.length === 0) {
      toast.error('You must select module prerequisites');
    } else {
      let data: CreatePrerequisites = {
        modele_id: values.module_id,
        prerequistis: [],
      };

      for (let i = 0; i < values.prerequistis.length; i++) {
        data.prerequistis.push({
          description: values.description,
          module_id: values.module_id,
          prerequisite_id: values.prerequistis[i],
          status: GenericStatus.ACTIVE,
        });
      }

      await mutateAsync(data, {
        async onSuccess(res) {
          toast.success(res.data.message);
          queryClient.invalidateQueries(['prereqs/moduleid']);
          showMenu && intakeProg
            ? history.push(
                `/dashboard/modules/${moduleId}/prereqs?showMenus=${showMenu}&intkPrg=${intakeProg}`,
              )
            : history.push(`/dashboard/modules/${moduleId}/prereqs`);
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      });
    }
  };

  return (
    <form>
      <DropdownMolecule
        options={getDropDownOptions({ inputs: modules || [] })}
        name="prerequistis"
        isMulti
        placeholder={moduleSt.isLoading ? 'Loading prerequisites...' : 'Prerequisites'}
        handleChange={handleChange}>
        Select Prerequisites
      </DropdownMolecule>
      <TextAreaMolecule
        value={values.description}
        handleChange={handleChange}
        name={'description'}>
        Comments
      </TextAreaMolecule>
      <RadioMolecule
        className="mt-4"
        value={values.status}
        name="status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
        ]}
        handleChange={handleChange}>
        Status
      </RadioMolecule>
      <div className="mt-5">
        <Button type="button" disabled={isLoading} onClick={() => handleSubmit()} full>
          {isLoading ? '....' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
