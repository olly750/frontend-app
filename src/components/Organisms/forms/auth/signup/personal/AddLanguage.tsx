import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import { queryClient } from '../../../../../../plugins/react-query';
import SelectMolecule from '../../../../../Molecules/input/SelectMolecule';
import { ValueType } from '../../../../../../types';
import Button from '../../../../../Atoms/custom/Button';
import languagesStore from '../../../../../../store/administration/languages.store';
import { LanguageTypes } from '../../../../../../types/services/language.types';
import languages from '../../../../../../data/languages.json';

interface ParamType {
  personId: string;
}

export default function AddLanguage() {
  const { personId } = useParams<ParamType>();
  const [details, setDetails] = useState<LanguageTypes>({
    description: '',
    name: '',
    person_id: personId,
    code: '',
    origin: '',
  });

  const { mutate } = languagesStore.addLanguage();
  const history = useHistory();

  useEffect(() => {
    setDetails({ ...details, person_id: personId });
  }, [personId]);

  useEffect(() => {
    setDetails({
      ...details,
      code: languages.find((lang) => lang.int === details.name)?.code || '',
      origin: languages.find((lang) => lang.int === details.name)?.native || '',
    });
  }, [details.name]);

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

  const languageToSelect = useMemo(
    () =>
      languages.map((int) => {
        return {
          value: int.int,
          label: int.int,
        };
      }),
    [],
  );

  const handleChange = (e: ValueType) => {
    setDetails({ ...details, [e.name]: e.value });
  };

  return (
    <form onSubmit={saveLanguage}>
      <SelectMolecule
        options={languageToSelect}
        name="name"
        placeholder="select language"
        value={details.name}
        handleChange={handleChange}>
        Language
      </SelectMolecule>
      <div className="pt-3">
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
}
