import React, { useState } from 'react';

import { DateRange } from '../../../../types/services/schedule.types';
import { formatDateToYyMmDd } from '../../../../utils/date-helper';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';

interface Iprops {
  defaultRange: DateRange;
  handleApply: (_r: DateRange) => void;
}

export default function DateRangePicker({ defaultRange, handleApply }: Iprops) {
  const [dateRange, setdateRange] = useState(defaultRange);

  return (
    <div>
      <InputMolecule
        type="date"
        value={dateRange.start_date}
        handleChange={(e) =>
          setdateRange({
            ...dateRange,
            start_date: formatDateToYyMmDd(e.value.toString()),
          })
        }
        name={'expected_start_date'}>
        From:
      </InputMolecule>
      <InputMolecule
        type="date"
        name={'expected_end_date'}
        value={dateRange.end_date}
        handleChange={(e) =>
          setdateRange({
            ...dateRange,
            end_date: formatDateToYyMmDd(e.value.toString()),
          })
        }>
        To:
      </InputMolecule>
      <Button onClick={() => handleApply(dateRange)}>Apply</Button>
    </div>
  );
}
