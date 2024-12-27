import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import { queryClient } from '../../../../../../plugins/react-query';
import { SelectData, ValueType } from '../../../../../../types';
import Button from '../../../../../Atoms/custom/Button';
import MultiselectMolecule from '../../../../../Molecules/input/MultiselectMolecule';
import diseasesStore from '../../../../../../store/administration/diseases.store';
import { PersonDiseaseTypes } from '../../../../../../types/services/chronicdiseases.types';

interface ParamType {
  personId: string;
}

export default function AddChronicDisease() {
  const { personId } = useParams<ParamType>();
  const [details, setDetails] = useState<PersonDiseaseTypes>({
    diseases: [],
    person_id: personId,
  });

  const [selectedDiseases, setSelectedDisease] = useState<string[]>([]);

  const { mutate } = diseasesStore.addChronicalDiseasesToPerson();
  const history = useHistory();

  const saveLanguage = (e: FormEvent) => {
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

  const diseases = diseasesStore
    .getDiseases()
    .data?.data.data.map((hb) => ({ label: hb.name, value: hb.id })) as SelectData[];

  useEffect(() => {
    setDetails({ ...details, person_id: personId });
  }, [personId]);

  useEffect(() => {
    setDetails({
      ...details,
      diseases: selectedDiseases.map((dis) => {
        return {
          name: diseases.find((id) => id.value === dis)?.label || '',
          id: dis,
          description: '',
        };
      }),
    });
  }, [selectedDiseases]);

  return (
    <form onSubmit={saveLanguage}>
      <MultiselectMolecule
        placeholder="Select chronic diseases u have"
        name="chronic_disease"
        value={selectedDiseases}
        handleChange={(e: ValueType) => setSelectedDisease(e.value as string[])}
        options={diseases}>
        Chronic diseases
      </MultiselectMolecule>
      <div className="pt-3">
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
}
