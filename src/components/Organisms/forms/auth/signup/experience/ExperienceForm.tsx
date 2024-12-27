/* eslint-disable jsx-a11y/label-has-associated-control */
import { AxiosResponse } from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UseMutateAsyncFunction } from 'react-query';

import useAuthenticator from '../../../../../../hooks/useAuthenticator';
import { queryClient } from '../../../../../../plugins/react-query';
import { experienceStore } from '../../../../../../store/administration/experience.store';
import {
  CommonFormProps,
  CommonStepProps,
  Response,
  ValueType,
} from '../../../../../../types';
import {
  ExperienceInfo,
  ExperienceType,
} from '../../../../../../types/services/experience.types';
import { downloadAttachment } from '../../../../../../utils/file-util';
import { experienceFormSchema } from '../../../../../../validations/complete-profile/experience-form.validtation';
import Button from '../../../../../Atoms/custom/Button';
import Icon from '../../../../../Atoms/custom/Icon';
import Panel from '../../../../../Atoms/custom/Panel';
import FileUploader from '../../../../../Atoms/Input/FileUploader';
import Heading from '../../../../../Atoms/Text/Heading';
import Accordion from '../../../../../Molecules/Accordion';
import DateMolecule from '../../../../../Molecules/input/DateMolecule';
import InputMolecule from '../../../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../../../Molecules/input/TextAreaMolecule';

interface IExperienceForm<E> extends CommonStepProps, CommonFormProps<E> {
  skip?: () => void;
  type: ExperienceType;
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

function ExperienceForm<E>({
  isVertical,
  nextStep,
  prevStep,
  skip,
  display_label,
  type,
}: IExperienceForm<E>) {
  const { user } = useAuthenticator();

  const initialErrorState: ExperienceInfoErrors = {
    level: '',
    start_date: '',
    end_date: '',
    location: '',
    occupation: '',
    proof: '',
    description: '',
  };

  const initialExpState: ExperienceInfo = {
    attachment_id: '',
    description: '',
    end_date: '',
    level: '',
    location: '',
    occupation: '',
    person_id: user?.person?.id + '',
    proof: '',
    start_date: '',
    type: type,
  };

  const [errors, setErrors] = useState<ExperienceInfoErrors>(initialErrorState);

  const [experience, setExperience] = useState<ExperienceInfo>(initialExpState);

  const [url, setUrl] = useState('');

  useEffect(() => {
    async function getIt() {
      setUrl(
        await downloadAttachment(
          experience.attachment?.original_file_name.toString() || '',
        ),
      );
    }
    getIt();
  }, [experience.attachment?.original_file_name]);

  const [file, setFile] = useState<File | null>(null);

  const { mutate } = experienceStore.addFile();
  useEffect(() => {
    setExperience((exp) => {
      return { ...exp, person_id: user?.person?.id + '' };
    });
  }, [user?.person?.id]);

  useEffect(() => {
    setExperience((exp) => {
      return { ...exp, type: type };
    });
  }, [type]);

  const { mutateAsync } = experienceStore.create();
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
                setErrors(initialErrorState);
                setExperience({
                  attachment_id: '',
                  description: '',
                  end_date: '',
                  level: '',
                  location: '',
                  occupation: '',
                  person_id: user?.person?.id + '',
                  proof: '',
                  start_date: '',
                  type: experience.type,
                });
                setTotalExperience([]);
                queryClient.invalidateQueries(['experience/id', user?.person?.id]);
                setExperience(initialExpState);
                setErrors(initialErrorState);
                window.scrollTo(0, 0);
                nextStep(true);
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
          setErrors(initialErrorState);
          queryClient.invalidateQueries(['experience/id', user?.person?.id]);
          setExperience({
            attachment_id: '',
            description: '',
            end_date: '',
            level: '',
            location: '',
            occupation: '',
            person_id: user?.person?.id + '',
            proof: '',
            start_date: '',
            type: experience.type,
          });
          // setFile()
          setTotalExperience([]);
          nextStep(true);
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

  const handleUpload = (files: FileList | null) => {
    if (files) {
      setFile(files[0]);
    }
  };

  const [totalExperience, setTotalExperience] = useState<ExperienceInfo[]>([]);

  const moveForward = () => {
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

  async function handleMore() {
    const validatedForm = experienceFormSchema.validate(experience, {
      abortEarly: false,
    });
    console.log(experience);
    validatedForm
      .then(() => {
        if (experience) {
          mutateAsync(experience, {
            onSuccess() {
              toast.success(
                `${experience.type.replaceAll(
                  '_',
                  ' ',
                )} experience information successfully added`,
                {
                  duration: 1200,
                },
              );
            },
            onError(error: any) {
              toast.error(error.response.data.message);
            },
          });
        }
        setTotalExperience([...totalExperience, experience]);

        setExperience({
          attachment_id: '',
          description: '',
          end_date: '',
          level: '',
          location: '',
          occupation: '',
          person_id: user?.person?.id + '',
          proof: '',
          start_date: '',
          type: experience.type,
        });
      })
      .catch((err) => {
        const validatedErr: ExperienceInfoErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ExperienceInfoErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  const moveBack = () => {
    if (prevStep) {
      setExperience(initialExpState);
      setErrors(initialErrorState);
      window.scrollTo(0, 0);
      prevStep();
    }
  };

  const jump = () => {
    if (skip) {
      setExperience(initialExpState);
      setErrors(initialErrorState);
      window.scrollTo(0, 0);
      skip();
    }
  };

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full mx-auto">
      <div className="">
        {!isVertical && (
          <Heading fontSize="2xl" fontWeight="semibold" className="pt-4 pb-8">
            {display_label.replaceAll('_', ' ')}
          </Heading>
        )}
        <form action="">
          <div>
            <div className="flex flex-col gap-4">
              <InputMolecule
                required={false}
                error={errors.level}
                name="level"
                placeholder="Enter Institution Name"
                value={experience.level}
                handleChange={handleChange}>
                {display_label.replaceAll('_', ' ')}
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
                defaultValue={experience.start_date}
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
                endYear={moment(experience.start_date).year() + 50}
                defaultValue={experience.end_date}
                width="60 md:w-80">
                End Date
              </DateMolecule>
            </div>
            <div>
              <label>Attach a file (ex: Proof, Certificate) </label>
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
            <div className="flex flex-col gap-4 pt-2">
              <div>
                <InputMolecule
                  required={false}
                  error={errors.proof}
                  placeholder={`Enter name of the document you attached(eg: proof, certificate)`}
                  name="proof"
                  value={experience.proof}
                  handleChange={handleChange}>
                  Document title
                </InputMolecule>
              </div>
            </div>
          </div>
          <div className="py-3">
            <Button styleType="outline" type="button" onClick={() => handleMore()}>
              Add more
            </Button>
          </div>
        </form>
        <div className="py-5 flex justify-between w-80">
          <div className="flex justify-evenly">
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
          </div>
          <Button onClick={() => moveForward()}>Save & Continue</Button>
        </div>
      </div>

      <div className="md:pl-20 px-5">
        {totalExperience.length > 0 && <p className="py-3">Experiences</p>}
        <Accordion>
          {totalExperience.map((exp) => {
            return (
              <Panel
                bgColor="tertiary"
                key={exp.type}
                title={exp.type.replaceAll('_', ' ')}
                subtitle={exp.description}>
                <div className="p-2">Institution Name: {exp.occupation}</div>
                <div className="p-2">Name: {exp.level}</div>
                <div className="p-2">Location: {exp.location}</div>
                <div className="p-2">Description: {exp.description}</div>
                <div className="p-2">Start Date: {exp.start_date}</div>
                <div className="p-2">End Date: {exp.end_date}</div>
                {exp.proof !== '' ? (
                  <div className="flex items-center">
                    <Icon name="attach" fill="primary" />
                    <span className="border-txt-primary border-b font-small">
                      {exp.proof}
                    </span>
                    <a href={url} download={true}>
                      <Icon name="download" fill="primary" />
                    </a>
                  </div>
                ) : (
                  <div></div>
                )}
              </Panel>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

export default ExperienceForm;
