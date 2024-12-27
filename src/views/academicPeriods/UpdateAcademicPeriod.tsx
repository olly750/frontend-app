import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import { queryClient } from '../../plugins/react-query';
import academicperiodStore from '../../store/administration/academicperiod.store';
import { ParamType, ValueType } from '../../types';
import { ICreateAcademicPeriod } from '../../types/services/academicperiod.types';
import { PeriodType } from '../../types/services/intake.types';
import { getDropDownStatusOptions } from '../../utils/getOption';

function UpdateAcademicPeriod() {
  const { id: yearId } = useParams<ParamType>();
  const history = useHistory();
  const [period, setPeriod] = useState<ICreateAcademicPeriod>({
    start_on: '',
    end_on: '',
    id: '',
    name: '',
    academic_year_id: '',
    period_type: PeriodType.COMPLETE,
  });

  useEffect(() => {
    setPeriod((period) => ({ ...period, academic_year_id: yearId }));
  }, [yearId]);

  useEffect(() => {
    let period_no =
      period.period_type === PeriodType.TRIMESTER
        ? 3
        : period.period_type === PeriodType.SEMESTER
        ? 2
        : period.period_type === PeriodType.COMPLETE
        ? 1
        : 0;

    let period_name = '';

    if (period_no === 1) {
      period_name = 'Whole Year';
    } else {
      for (let pn = 1; pn <= period_no; pn++) {
        let name = `Term ${pn}`;
        if (pn > 1) {
          period_name += ',';
        }
        period_name += name;
      }
    }

    setPeriod((period) => ({ ...period, name: period_name }));
  }, [period.period_type]);

  function handleChange(e: ValueType) {
    setPeriod((period) => ({
      ...period,
      [e.name]: e.value,
    }));
  }

  const { mutateAsync } = academicperiodStore.modifyAcademicPeriod();

  function createPeriod<T>(e: FormEvent<T>) {
    e.preventDefault();
    mutateAsync(period, {
      onSuccess() {
        toast.success('academic period successfully added');
        queryClient.invalidateQueries(['academicyears']);
        history.push(`/dashboard/academic-years`);
      },
      onError(error: any) {
        toast.error(error.response.data.message);
      },
    });
  }
  return (
    <form onSubmit={createPeriod}>
      <p className="text-txt-secondary pt-2 pb-6">
        Each academic year should have period that make up <br />
        whole academic year, make sure to select the right type.
      </p>
      <DropdownMolecule
        width="full"
        placeholder="select period type"
        defaultValue={getDropDownStatusOptions(PeriodType).find(
          (pd) => pd.value === period.period_type,
        )}
        options={getDropDownStatusOptions(PeriodType)}
        name="period_type"
        handleChange={handleChange}>
        Period Type
      </DropdownMolecule>
      <div className="mt-5">
        <Button type="submit">Change</Button>
      </div>
    </form>
  );
}

export default UpdateAcademicPeriod;
