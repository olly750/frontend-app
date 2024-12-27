import { AxiosResponse } from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UseMutateAsyncFunction } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

import useAuthenticator from '../../../../../../hooks/useAuthenticator';
import { queryClient } from '../../../../../../plugins/react-query';
import { experienceStore } from '../../../../../../store/administration/experience.store';
import { moduleMaterialStore } from '../../../../../../store/administration/module-material.store';
import { Response, ValueType } from '../../../../../../types';
import {
  ExperienceInfo,
  ExperienceType,
} from '../../../../../../types/services/experience.types';
import { experienceFormSchema } from '../../../../../../validations/complete-profile/experience-form.validtation';
import Button from '../../../../../Atoms/custom/Button';
import Icon from '../../../../../Atoms/custom/Icon';
import FileUploader from '../../../../../Atoms/Input/FileUploader';
import NoDataAvailable from '../../../../../Molecules/cards/NoDataAvailable';
import DateMolecule from '../../../../../Molecules/input/DateMolecule';
import InputMolecule from '../../../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../../../Molecules/input/TextAreaMolecule';

interface ParamType {
  id: string;
  expId: string;
}

interface ExperienceInfoErrors
  extends Pick<
    ExperienceInfo,
    | 'end_date'
    | 'level'
    | 'location'
    | 'occupation'
    | 'proof'
    | 'start_date'
    | 'description'
  > {}

export default function UpdateExperience() {
  const { user } = useAuthenticator();

  const history = useHistory();
  const { id, expId } = useParams<ParamType>();
  const { data } = experienceStore.getExperienceById(expId);
  const experienceData = data?.data.data;
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (files: FileList | null) => {
    if (files) {
      setFile(files[0]);
    }
  };

  const { mutate } = moduleMaterialStore.addFile();
  const { mutateAsync } = experienceStore.update();

  const [experience, setExperience] = useState<ExperienceInfo>({
    attachment_id: '',
    description: '',
    end_date: '',
    level: '',
    location: '',
    occupation: '',
    person_id: user?.person?.id + '',
    proof: '',
    start_date: '',
    type: experienceData?.type || ExperienceType.EMPLOYMENT,
  });

  const initialErrorState: ExperienceInfoErrors = {
    level: '',
    start_date: '',
    end_date: '',
    location: '',
    occupation: '',
    description: '',
    proof: '',
  };

  const [errors, setErrors] = useState<ExperienceInfoErrors>(initialErrorState);

  useEffect(() => {
    if (experienceData) {
      setExperience(experienceData);
    }
  }, [experienceData]);

  const finishStep = () => {
    const validatedForm = experienceFormSchema.validate(experience, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        if (saveData) {
          saveData(mutateAsync);
        }
      })
      .catch((err) => {
        const validatedErr: ExperienceInfoErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ExperienceInfoErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  function saveData(
    mutateAsync: UseMutateAsyncFunction<
      AxiosResponse<Response<ExperienceInfo>>,
      unknown,
      ExperienceInfo,
      unknown
    >,
  ) {
    if (file) {
      let formData = new FormData();
      formData.append('file', file);

      mutate(formData, {
        onSuccess(data) {
          toast.success(data.data.message);
          mutateAsync(
            {
              ...experience,
              attachment_id: data.data.data.id + '',
            },
            {
              onSuccess(data) {
                toast.success(data.data.message);
                queryClient.invalidateQueries(['user/id', id]);
                history.push(`/dashboard/user/${id}/profile?me=true`);
              },
              onError(error: any) {
                toast.error(error.response.data.message);
              },
            },
          );
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      });
    } else {
      mutateAsync(experience, {
        onSuccess(data) {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['user/id', id]);
          history.push(`/dashboard/user/${id}/profile?me=true`);
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      });
    }
  }

  const handleChange = (e: ValueType) => {
    setExperience({ ...experience, [e.name]: e.value });
  };

  return (
    <>
      {experience ? (
        <form className="p-10">
          <div>
            <div className="flex flex-col gap-4">
              <InputMolecule
                required={false}
                error={errors.level}
                name="level"
                placeholder=""
                value={experience.level}
                handleChange={handleChange}>
                {experience.type.replaceAll('_', ' ')}
              </InputMolecule>
            </div>
            <div className="flex flex-col gap-4">
              <InputMolecule
                required={false}
                error={errors.occupation}
                placeholder={`Enter your faculty / option / position`}
                name="occupation"
                value={experience.occupation}
                handleChange={handleChange}>
                Course / Option / Position / Achievement
              </InputMolecule>
              <InputMolecule
                required={false}
                error={errors.location}
                placeholder={`Enter the location`}
                name="location"
                value={experience.location}
                handleChange={handleChange}>
                Location
              </InputMolecule>
              <TextAreaMolecule
                error={errors.description}
                name="description"
                value={experience.description}
                handleChange={handleChange}>
                Description
              </TextAreaMolecule>
            </div>
          </div>
          {/* second column */}
          <div>
            <div className="flex flex-col gap-4">
              <DateMolecule
                error={errors.start_date}
                handleChange={handleChange}
                defaultValue={experienceData?.start_date}
                name="start_date"
                // startYear={new Date().getFullYear() - 25}
                width="60 md:w-80">
                Start Date
              </DateMolecule>
              <DateMolecule
                error={errors.end_date}
                handleChange={handleChange}
                name="end_date"
                startYear={moment(experience.start_date).year()}
                endYear={moment(experience.start_date).year() + 25}
                defaultValue={experienceData?.end_date}
                width="60 md:w-80">
                End Date
              </DateMolecule>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <InputMolecule
                  required={false}
                  error={errors.proof}
                  placeholder={`Enter document title (eg: proof, certificate)`}
                  name="proof"
                  value={experience.proof}
                  handleChange={handleChange}>
                  Document title
                </InputMolecule>
              </div>
            </div>
            <div className="py-2">
              <FileUploader
                allowPreview={false}
                handleUpload={handleUpload}
                accept={'application/pdf'}>
                <Button type="button" styleType="outline" icon={true}>
                  <span className="flex items-center">
                    <Icon name={'attach'} fill="primary" />
                    <span className="pr-3">Attach file</span>
                  </span>
                </Button>
              </FileUploader>
            </div>
          </div>
          <div className="py-3">
            <Button type="button" onClick={() => finishStep()}>
              Save
            </Button>
          </div>
        </form>
      ) : (
        <NoDataAvailable
          icon="reg-control"
          showButton={false}
          buttonLabel="Add new experience"
          title={'This experience is currently unavailable'}
          handleClick={() => {}}
          description=""
        />
      )}
    </>
  );
}
