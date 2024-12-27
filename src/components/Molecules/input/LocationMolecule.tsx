import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import locationStore from '../../../store/administration/location.store';
import { DropdownProps, ValueType } from '../../../types';
import { LocationInfo } from '../../../types/services/location.types';
import { getDropDownOptions } from '../../../utils/getOption';
import SelectMolecule from './SelectMolecule';

interface Props extends Omit<DropdownProps, 'options'> {
  children?: ReactNode | string;
  error?: string;
  isRequired?: boolean;
  requiredMessage?: string;
  villageId?: string;
}
export default function LocationMolecule({
  name,
  handleChange = (_e: ValueType) => {},
  children,
  placeholder = '',
  isRequired = false,
  requiredMessage,
  villageId = '',
  ...attrs
}: Props) {
  const [locationLevel, setLocationLevel] = useState(1);
  const [locations, setLocations] = useState<LocationInfo[]>();
  const [choseLocations, setChoseLocations] = useState('');
  const levels = ['country', 'province', 'district', 'sector', 'cell', 'village'];

  const [locationId, setLocationId] = useState(villageId);

  const { data: country, isFetching: isFetchingCountry } =
    locationStore.getLocationsByLevel('1');
  const { data: dbLocations, isFetching: isFetchingLocations } =
    locationStore.findByParent(locationId ? locationId.toString() : '');

  const { data: villageAncestor } = locationStore.getLocationsById(villageId);

  const handleLocationChange = (e: ValueType) => {
    handleChange(e);
    setLocationId(e.value.toString());
    setChoseLocations((old) =>
      e.label ? `${old} ${old.length > 0 ? '-> ' : ''} ${e.label}` : '',
    );

    setLocationLevel((old) => old + 1);
  };

  function resetResidenceLocation() {
    setLocationLevel(1);
    setLocationId('');
    country?.data.data && setLocations(country?.data.data);
    setChoseLocations('');
  }

  const recursiveGetAncestor = useCallback(
    (result: string, location?: LocationInfo): string => {
      if (location) {
        result += location.name;
        if (location.parent) {
          result += '->';
          return recursiveGetAncestor(result, location.parent);
        }
        return result;
      }
      return result;
    },
    [],
  );

  useEffect(() => {
    if (villageId) {
      setChoseLocations(
        recursiveGetAncestor('', villageAncestor?.data.data)
          .split('->')
          .reverse()
          .join('->'),
      );
    }
  }, [recursiveGetAncestor, villageAncestor?.data.data, villageId]);

  useEffect(() => {
    country?.data.data && setLocations(country?.data.data);
  }, [country?.data]);

  useEffect(() => {
    dbLocations?.data.data && setLocations(dbLocations?.data.data.content);
  }, [dbLocations?.data]);

  return (
    <div>
      <SelectMolecule
        {...attrs}
        hasError={locationLevel > 1 && locationLevel < 7 && !locationId}
        placeholder={placeholder}
        name={name}
        value={locationId}
        handleChange={handleLocationChange}
        loading={isFetchingCountry || isFetchingLocations}
        options={getDropDownOptions({ inputs: locations! })}>
        {children}
        {isRequired && <span className="text-error-500">{requiredMessage}</span>}
        {locationLevel > 1 && locationLevel < 7 && !locationId && (
          <span className="text-error-500">( select {levels[locationLevel - 2]} )</span>
        )}
      </SelectMolecule>
      <div className="flex items-center mb-4">
        <p className="text-sm text-primary-500 ">{choseLocations}</p>
        {choseLocations.length > 0 ? (
          <button className="ml-4 hover:bg-lightblue" onClick={resetResidenceLocation}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="15"
              height="15">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
