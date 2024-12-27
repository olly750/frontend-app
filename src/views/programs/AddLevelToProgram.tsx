import _ from 'lodash';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import SwitchMolecule from '../../components/Molecules/input/SwitchMolecule';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import { levelStore } from '../../store/administration/level.store';
import programStore from '../../store/administration/program.store';
import { ParamType, ValueType } from '../../types';
import { ILevel } from '../../types/services/levels.types';
import { CreateAcademicProgramLevel } from '../../types/services/program.types';
import { getDropDownOptions } from '../../utils/getOption';

interface FilteredLevels
  extends Pick<ILevel, 'id' | 'name' | 'description' | 'generic_status' | 'flow'> {}

export default function AddLevelToProgram() {
  const { id: progId } = useParams<ParamType>();
  const { t } = useTranslation();
  const history = useHistory();
  const [levels, setLevels] = useState<FilteredLevels[]>();
  const picked_role = usePickedRole();
  const { data: levelsInfo } = levelStore.getLevelsByAcademy(
    picked_role?.academy_id + '',
  ); // fetch levels

  const { mutateAsync, isLoading } = programStore.addProgramToLevel();
  // const [filteredLevelFlows, setFilteredLevelFlows] = useState<FilteredLevels[]>([]);

  useEffect(() => {
    setLevelFlows((flows) => ({ ...flows, program_id: progId }));
  }, [progId]);

  const [levelFlows, setLevelFlows] = useState<CreateAcademicProgramLevel>({
    endg_flow: 0,
    useSingleLevel: false,
    program_id: progId,
    starting_flow: 0,
  });

  useEffect(() => {
    // filter data to display
    const filterdData = levelsInfo?.data.data.map((level) =>
      _.pick(level, ['id', 'name', 'description', 'generic_status', 'flow']),
    );

    levelsInfo?.data.data && setLevels(filterdData);
  }, [levelsInfo?.data.data]);

  function handleChange(e: ValueType) {
    setLevelFlows((flows) => ({
      ...flows,
      [e.name]: e.value,
    }));
  }

  useEffect(() => {
    if (levelFlows.useSingleLevel) {
      setLevelFlows((flows) => ({
        ...flows,
        ['endg_flow']: levelFlows.starting_flow,
      }));
    }
  }, [levelFlows.useSingleLevel, levelFlows.starting_flow]);

  function addLevelToProg<T>(e: FormEvent<T>) {
    e.preventDefault();

    mutateAsync(levelFlows, {
      onSuccess() {
        toast.success('Level added to program');
        queryClient.invalidateQueries(['levels/program_id']);
        history.push(`/dashboard/programs/${progId}`);
      },
      onError(error: any) {
        if (
          error.response.data.message.includes('Failed to associate level to program')
        ) {
          toast.error(`Level already assigned on ${t('Program')}`);
        } else {
          toast.error(error.response.data.message);
        }
      },
    });
  }

  return (
    <form onSubmit={addLevelToProg}>
      <>
        <DropdownMolecule
          options={getDropDownOptions({ inputs: levels || [], value: 'flow' })}
          name="starting_flow"
          placeholder="Starting flow"
          handleChange={handleChange}>
          Start level
        </DropdownMolecule>

        <div className="pb-4">
          <SwitchMolecule
            loading={false}
            name="useSingleLevel"
            value={levelFlows.useSingleLevel}
            handleChange={handleChange}>
            Use a single level
          </SwitchMolecule>
        </div>

        {!levelFlows.useSingleLevel && (
          <DropdownMolecule
            placeholder="Ending flow"
            options={getDropDownOptions({
              inputs: levels || [],
              value: 'flow',
            })}
            defaultValue={getDropDownOptions({
              inputs: levels || [],
              value: 'flow',
            }).find((level) => level.value == levelFlows.endg_flow + '')}
            name="endg_flow"
            handleChange={handleChange}>
            End level
          </DropdownMolecule>
        )}
      </>
      <div className="mt-5">
        <Button type="submit" isLoading={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
}
