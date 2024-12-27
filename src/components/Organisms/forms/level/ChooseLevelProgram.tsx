import React from 'react';
import { useTranslation } from 'react-i18next';

import { ValueType } from '../../../../types';
import Button from '../../../Atoms/custom/Button';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';

function ChooseLevelProgram() {
  function handleChange(_e: ValueType) {}
  const { t } = useTranslation();
  return (
    <form>
      <DropdownMolecule
        placeholder={'Select ' + t('Program')}
        name={t('Program')}
        handleChange={handleChange}
        options={[
          { value: 'cadetteprogram', label: 'Cadette Program' },
          { value: 'program', label: 'Program' },
          { value: 'cadette', label: 'Cadette' },
          { value: 'progra', label: 'Progra' },
        ]}>
        Choose {t('Program')}
      </DropdownMolecule>
      <div className="py-6 ">
        <Button type="button">Save</Button>
      </div>
    </form>
  );
}

export default ChooseLevelProgram;
