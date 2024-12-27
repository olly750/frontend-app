import React, { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { CommonFormProps, SigninPropTypes, ValueType } from '../../../../types';
import Button from '../../../Atoms/custom/Button';
import Heading from '../../../Atoms/Text/Heading';
import CardHeadMolecule from '../../../Molecules/CardHeadMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
interface PropType<K> extends CommonFormProps<K> {
  academy?: SigninPropTypes;
}

function ProgramList<E>({ academy, onSubmit }: PropType<E>) {
  function handleChange(_e: ValueType) {}
  const { t } = useTranslation();

  function submitForm(e: FormEvent) {
    e.preventDefault(); // prevent page to reload:
    if (onSubmit) onSubmit(e);
  }
  return academy != undefined ? (
    <form onSubmit={submitForm}>
      <CardHeadMolecule
        title={academy.title}
        code={academy.code}
        status={academy.status}
        description={academy.description}
      />
      <RadioMolecule
        value="cadetteprogram"
        type="block"
        options={academy.programs}
        handleChange={handleChange}
        name={t('Program')}
      />
      <div className="mt-5">
        <Button type="submit">Register</Button>
      </div>
    </form>
  ) : (
    <Heading fontWeight="semibold"> No programs provided</Heading>
  );
}

export default ProgramList;
