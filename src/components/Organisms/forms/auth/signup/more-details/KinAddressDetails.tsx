import React, { FormEvent, useState } from 'react';

import { CommonFormProps, CommonStepProps, ValueType } from '../../../../../../types';
import Button from '../../../../../Atoms/custom/Button';
import Heading from '../../../../../Atoms/Text/Heading';
import InputMolecule from '../../../../../Molecules/input/InputMolecule';
import LocationMolecule from '../../../../../Molecules/input/LocationMolecule';

interface KinAddress<E> extends CommonStepProps, CommonFormProps<E> {
  skip?: () => void;
}

function KinAddressDetails<E>({
  display_label,
  isVertical,
  skip,
  prevStep,
  nextStep,
  onSubmit,
}: KinAddress<E>) {
  const [details, setDetails] = useState({
    country: '',
    location: '',
    other_location: '',
  });
  const jump = () => {
    skip && skip();
  };
  const moveBack = () => {
    prevStep && prevStep();
  };
  const moveForward = (e: FormEvent) => {
    e.preventDefault();
    nextStep(true);
    if (onSubmit) onSubmit(e, details);
  };

  const handleChange = (e: ValueType) => {
    setDetails({ ...details, [e.name]: e.value });
  };

  return (
    <div className="flex flex-col gap-4">
      {!isVertical && (
        <Heading fontSize="base" fontWeight="semibold">
          {display_label}
        </Heading>
      )}
      <form onSubmit={moveForward}>
        <div className="flex flex-col gap-4">
          <LocationMolecule width="72 md:w-80" name="country" handleChange={handleChange}>
            Country
          </LocationMolecule>
          <LocationMolecule
            width="72 md:w-80"
            name="location"
            handleChange={handleChange}>
            Location
          </LocationMolecule>
        </div>
        <div className="flex flex-col gap-4">
          <InputMolecule
            name="other_location"
            value={details.other_location}
            handleChange={handleChange}>
            Other Location
            <span className="text-txt-secondary"> (State / Region)</span>
          </InputMolecule>
        </div>
        <div className="flex justify-between w-80">
          {prevStep && (
            <Button
              styleType="text"
              hoverStyle="no-underline"
              color="txt-secondary"
              onClick={() => moveBack()}>
              Back
            </Button>
          )}
          {skip && (
            <Button
              styleType="text"
              hoverStyle="no-underline"
              color="txt-secondary"
              onClick={() => jump()}>
              Skip
            </Button>
          )}
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}

export default KinAddressDetails;
