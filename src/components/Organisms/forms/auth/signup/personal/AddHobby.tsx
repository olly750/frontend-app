import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import { queryClient } from '../../../../../../plugins/react-query';
import hobbiesStore from '../../../../../../store/administration/hobbies.store';
import { HobbiesTypes } from '../../../../../../types/services/hobbies.types';
import SelectMolecule from '../../../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../../../Molecules/input/TextAreaMolecule';
import interests from '../../../../../../../src/data/interests.json';
import { ValueType } from '../../../../../../types';
import Button from '../../../../../Atoms/custom/Button';

interface ParamType {
  personId: string;
}

export default function AddHobby() {
  const [details, setDetails] = useState<HobbiesTypes>({
    description: '',
    name: '',
    person_id: '',
  });

  const { mutate } = hobbiesStore.addHobby();
  const { personId } = useParams<ParamType>();
  const history = useHistory();

  useEffect(() => {
    setDetails({ ...details, person_id: personId });
  }, [personId]);

  const saveHobby = (e: FormEvent) => {
    e.preventDefault();

    mutate(details, {
      onSuccess(data) {
        toast.success(data.data.message);
        queryClient.invalidateQueries(['person/hobby/id', personId]);
        history.go(-1);
      },
      onError(error: any) {
        toast.error(error.response.data.message);
      },
    });
  };

  const hobbies = useMemo(
    () =>
      interests.map((int) => {
        return {
          value: int.interest,
          label: int.interest,
        };
      }),
    [],
  );

  const handleChange = (e: ValueType) => {
    setDetails({ ...details, [e.name]: e.value });
  };

  return (
    <form onSubmit={saveHobby}>
      <SelectMolecule
        options={hobbies}
        name="name"
        placeholder="select hobby"
        value={details.name}
        handleChange={handleChange}>
        Hobby
      </SelectMolecule>
      <TextAreaMolecule
        name="description"
        value={details.description}
        handleChange={handleChange}
        placeholder="You can provide more description (optional)">
        Description
      </TextAreaMolecule>
      <div className="pt-3">
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
}
