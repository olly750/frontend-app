import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { getRolesByAcademy, getUsersByRole } from '../../../../store/administration';
import academyStore from '../../../../store/administration/academy.store';
import { ParamType, SelectData, ValueType } from '../../../../types';
import { AcademyCreateInfo } from '../../../../types/services/academy.types';
import { getDropDownOptions } from '../../../../utils/getOption';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

function AssignAdminToAcademy() {
  const history = useHistory();
  const { id } = useParams<ParamType>();
  const { data } = academyStore.getAcademyById(id);
  const [selectedRole, setSelectedRole] = useState('');

  const { mutateAsync, isLoading } = academyStore.modifyAcademy();

  const roles = getRolesByAcademy(id);
  const users = getUsersByRole(selectedRole, !!selectedRole);

  const [details, setDetails] = useState<AcademyCreateInfo>({
    current_admin_id: '',
    email: '',
    fax_number: '',
    full_address: '',
    head_office_location_id: 0,
    institution_id: '',
    mission: '',
    moto: '',
    name: '',
    phone_number: '',
    postal_code: '',
    short_name: '',
    website_link: '',
    translation_preset: 'default',
  });

  useEffect(() => {
    data?.data.data &&
      setDetails({
        ...data?.data.data,
        institution_id: data?.data.data.institution.id.toString(),
        head_office_location_id: data.data.data.village.id,
      });
  }, [data]);

  function handleChange(e: ValueType) {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  function saveAdmin<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (details.current_admin_id === '') {
      toast.error('Please select an academy admin');
    } else {
      mutateAsync(details, {
        onSuccess(data) {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['academies/instutionId']);
          history.goBack();
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      });
    }
  }

  return (
    <form onSubmit={saveAdmin} className="pt-4">
      <InputMolecule
        disabled
        readOnly
        value={data?.data.data.name || 'Loading...'}
        name={'academy'}>
        Academy
      </InputMolecule>
      <div className="-mt-4 mb-5">
        <SelectMolecule
          handleChange={(e) => setSelectedRole(e.value.toString())}
          name={'selectedRole'}
          options={getDropDownOptions({ inputs: roles.data?.data.data || [] })}
          loading={roles.isLoading}
          placeholder={roles.isLoading ? 'Loading roles....' : 'select role'}>
          Role
        </SelectMolecule>
        {selectedRole && (
          <SelectMolecule
            placeholder={users.isLoading ? 'Loading users' : 'select academy admin'}
            value={details.current_admin_id}
            options={
              (users.data?.data.data.map((usr) => ({
                value: usr.user.id,
                label: `${usr.user.person?.current_rank?.abbreviation || ''} ${
                  usr.user.first_name
                } ${usr.user.last_name}`,
              })) as SelectData[]) || []
            }
            name="current_admin_id"
            handleChange={handleChange}>
            Academy Admin
          </SelectMolecule>
        )}
      </div>
      <Button type="submit" isLoading={isLoading}>
        Save
      </Button>
    </form>
  );
}

export default AssignAdminToAcademy;
