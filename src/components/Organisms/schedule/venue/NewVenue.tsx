import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import usePickedRole from '../../../../hooks/usePickedRole';
import { queryClient } from '../../../../plugins/react-query';
import { venueStore } from '../../../../store/timetable/venue.store';
import { GenericStatus, ValueType } from '../../../../types';
import { CreateVenue, venueType } from '../../../../types/services/event.types';
import { getDropDownStatusOptions } from '../../../../utils/getOption';
import { venueSchema } from '../../../../validations/calendar.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

interface VenueErrors extends Pick<CreateVenue, 'name' | 'code'> {
  venueType: string;
}

export default function NewVenue() {
  const history = useHistory();

  const picked_role = usePickedRole();

  const [values, setvalues] = useState<CreateVenue>({
    venueType: venueType.CLASS,
    name: '',
    code: '',
    status: GenericStatus.ACTIVE,
    academyId: picked_role?.academy_id + '',
  });

  useEffect(() => {
    setvalues((prev) => ({ ...prev, academyId: picked_role?.academy_id + '' }));
  }, [picked_role?.academy_id]);

  function handleChange(e: ValueType) {
    setvalues((val) => ({ ...val, [e.name]: e.value }));
  }

  const initialErrorState: VenueErrors = {
    name: '',
    venueType: '',
    code: '',
  };
  const [errors, setErrors] = useState<VenueErrors>(initialErrorState);

  const { mutateAsync, isLoading } = venueStore.createVenue();

  function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = venueSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(values, {
          async onSuccess(_data) {
            toast.success('Venue was created successfully');
            queryClient.invalidateQueries(['venues']);
            history.goBack();
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        });
      })
      .catch((err) => {
        const validatedErr: VenueErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof VenueErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputMolecule
          error={errors.name}
          name="name"
          placeholder="Venue name"
          value={values.name}
          handleChange={handleChange}>
          Venue name
        </InputMolecule>
        <InputMolecule
          error={errors.code}
          name="code"
          placeholder="Venue abbreviation"
          value={values.name}
          handleChange={handleChange}>
          Venue code/abbr
        </InputMolecule>
        <SelectMolecule
          error={errors.venueType}
          name="venueType"
          value={values.venueType}
          handleChange={handleChange}
          options={getDropDownStatusOptions(venueType)}
          placeholder="Select venue category">
          Venue type
        </SelectMolecule>
        <div className="pt-4">
          <Button disabled={isLoading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
