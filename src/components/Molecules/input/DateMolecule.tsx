import moment from 'moment';
import React, { ReactNode, useEffect, useState } from 'react';

import { IDateState, ValueType } from '../../../types';
import { formatPickerDate } from '../../../utils/date-helper';
import DaySelect from '../../Atoms/Input/date/DaySelect';
import HourSelect from '../../Atoms/Input/date/HourSelect';
import MinuteSelect from '../../Atoms/Input/date/MinuteSelect';
import MonthSelect from '../../Atoms/Input/date/MonthSelect';
import YearSelect from '../../Atoms/Input/date/YearSelect';
import Error from '../../Atoms/Text/Error';
import ILabel from '../../Atoms/Text/ILabel';

type IProp = {
  showDate?: boolean;
  showTime?: boolean;
  width?: string;
  handleChange: (_value: ValueType) => void;
  name: string;
  children: ReactNode;
  startYear?: number;
  endYear?: number;
  yearClassName?: string;
  yearDisabled?: boolean;
  monthNumeric?: boolean;
  monthShort?: boolean;
  monthCapital?: boolean;
  monthDisabled?: boolean;
  monthClassName?: string;
  dayDisabled?: boolean;
  dayClassName?: string;
  yearWidth?: string;
  monthWidth?: string;
  dayWidth?: string;
  hourWidth?: string;
  minuteWidth?: string;
  hourDisabled?: boolean;
  minuteDisabled?: boolean;
  defaultValue?: string;
  reverse?: boolean;
  date_time_type?: boolean;
  breakToNextLine?: boolean;
  error?: string;
};

function DateMolecule({
  reverse = true,
  showDate = true,
  showTime = false,
  width = '60 md:w-80',
  children,
  handleChange,
  name,
  startYear,
  endYear,
  yearClassName,
  yearDisabled = false,
  monthNumeric = false,
  monthShort = true,
  monthCapital = false,
  monthDisabled = false,
  monthClassName,
  dayDisabled = false,
  dayClassName,
  yearWidth = '28',
  monthWidth = '28',
  dayWidth = '28',
  hourWidth = '28',
  minuteWidth = '28',
  hourDisabled = false,
  minuteDisabled = false,
  defaultValue,
  date_time_type = true,
  breakToNextLine = false,
  error = '',
}: IProp) {
  const [dateState, setDateState] = useState<IDateState>({
    Year: moment().year(),
    Month: moment().month() + 1,
    Day: `${moment().date()}`,
    Hours: `${moment().hours()}`,
    Minutes: `${moment().minutes()}`,
  });

  useEffect(() => {
    if (defaultValue) {
      const dV = moment(defaultValue);
      setDateState({
        Year: dV.year(),
        Month: dV.month() + 1,
        Day: dV.date() < 10 ? `0${dV.date()}` : `${dV.date()}`,
        Hours: dV.hours() < 10 ? `0${dV.hours()}` : `${dV.hours()}`,
        Minutes: dV.minutes() < 10 ? `0${dV.minutes()}` : `${dV.minutes()}`,
      });
    }
  }, [defaultValue]);

  const handleSelect = (e: ValueType) => {
    let updated = { ...dateState, [e.name]: e.value };

    setDateState(updated);
    handleChange({ name: name, value: formatPickerDate(updated, date_time_type) });
  };

  return (
    <div className={`flex flex-col gap-2 pb-3 w-${width || 'full md:w-80'}`}>
      <ILabel size="sm" weight="medium">
        {children}
      </ILabel>
      <div className={`flex ${breakToNextLine && 'flex-col gap-4'} gap-2`}>
        {showDate && (
          <div className="flex gap-2">
            <YearSelect
              reverse={reverse}
              value={dateState.Year}
              onChange={handleSelect}
              name="Year"
              width={yearWidth}
              start={startYear}
              end={endYear}
              className={yearClassName}
              disabled={yearDisabled}
              placeholder={'Year'}
            />
            <MonthSelect
              year={dateState.Year}
              value={dateState.Month}
              onChange={handleSelect}
              short={monthShort}
              caps={monthCapital}
              name="Month"
              width={monthWidth}
              numeric={monthNumeric}
              className={monthClassName}
              disabled={monthDisabled}
              placeholder={'Month'}
            />
            <DaySelect
              year={dateState.Year}
              month={dateState.Month}
              value={dateState.Day}
              onChange={handleSelect}
              name="Day"
              className={dayClassName}
              width={dayWidth}
              disabled={dayDisabled}
              placeholder={'Day'}
            />
          </div>
        )}
        {showTime && (
          <div className="flex gap-1">
            <HourSelect
              value={dateState.Hours}
              onChange={handleSelect}
              name="Hours"
              width={hourWidth}
              disabled={hourDisabled}
              placeholder={'hrs'}
            />
            <MinuteSelect
              value={dateState.Minutes}
              onChange={handleSelect}
              name="Minutes"
              width={minuteWidth}
              disabled={minuteDisabled}
              placeholder="mins"
            />
          </div>
        )}
      </div>
      <Error>{error && error}</Error>
    </div>
  );
}

export default DateMolecule;
