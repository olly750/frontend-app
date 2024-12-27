import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { ValueType } from '../../../types';
import { IEvaluationSectionBased } from '../../../types/services/evaluation.types';
import { UserInfo } from '../../../types/services/user.types';
import { getDropDownOptions } from '../../../utils/getOption';
import Button from '../../Atoms/custom/Button';
import SelectMolecule from '../../Molecules/input/SelectMolecule';
export function EvaluationChangeMarker({
  module,
  markers,
}: {
  module: IEvaluationSectionBased;
  markers: UserInfo[];
}) {

  const [marker, setMarker] = useState(module.marker?.adminId);

  function handleChange({ value }: ValueType) {
    setMarker(value as string);
  }

  const { mutate, isLoading } = evaluationStore.updateMarkersOnModule();

  const updateMarker = () => {
    mutate(
      {
        markerId: marker + '',
        id: module.id + '',
      },
      {
        onSuccess: () => {
          toast.success(
            `Marker updated successfully for ${module.module_subject?.title} module`,
          );
        },
        onError: () => {
          toast.error(`Error updating marker for ${module.module_subject?.title} module`);
        },
      },
    );
  };

  return (
    <div className="py-5">
      <p className="w-full">{module.module_subject?.title}</p>
      <SelectMolecule
        width='w-48'
        handleChange={handleChange}
        name={'module'}
        value={marker}
        options={getDropDownOptions({
          inputs: markers,
          labelName: ['first_name', 'last_name'],
          //@ts-ignore
          getOptionLabel: (mark: UserInfo) =>
            `${mark.person?.current_rank?.abbreviation || ''} ${mark.first_name + ' ' + mark.last_name
            }`,
        })}
        placeholder="marker"
      />

      <Button
        className="my-5"
        disabled={isLoading}
        isLoading={isLoading}
        onClick={updateMarker}>
        Save
      </Button>
    </div>
  );
}
