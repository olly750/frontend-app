import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../hooks/useAuthenticator';
import usePickedRole from '../../../hooks/usePickedRole';
import { queryClient } from '../../../plugins/react-query';
import { getRolesByAcademy, getRolesByInstitution } from '../../../store/administration';
import academyStore from '../../../store/administration/academy.store';
import { intakeStore } from '../../../store/administration/intake.store';
import programStore from '../../../store/administration/program.store';
import usersStore from '../../../store/administration/users.store';
import { RoleType, SelectData, ValueType } from '../../../types';
import { AcademyInfo } from '../../../types/services/academy.types';
// import { IntakeProgramInfo } from '../../../types/services/intake-program.types';
// import { ProgramInfo } from '../../../types/services/program.types';
import {
  AssignUserRole,
  IImportUser,
  IImportUserRes,
  UserType,
} from '../../../types/services/user.types';
import { getDropDownOptions } from '../../../utils/getOption';
import { importUserSchema } from '../../../validations/user.validation';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';
import FileUploader from '../../Atoms/Input/FileUploader';
import Heading from '../../Atoms/Text/Heading';
import InputMolecule from '../../Molecules/input/InputMolecule';
import SelectMolecule from '../../Molecules/input/SelectMolecule';
import PopupMolecule from '../../Molecules/Popup';

interface IProps {
  userType: UserType;
}

interface ImportErrors
  extends Pick<IImportUser, 'academyId' | 'roleId' | 'program' | 'intakeProgramId'> {}

export default function ImportUsers({ userType }: IProps) {
  const history = useHistory();
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();
  const { t } = useTranslation();

  const { mutate } = usersStore.assignRoles();

  const [roleInfo, setRoleInfo] = useState({
    name: '',
    description: '',
    academyId: '',
    institution_id: '',
    type: RoleType.ACADEMY,
  });

  useEffect(() => {
    setRoleInfo((role) => ({ ...role, institution_id: user?.institution.id + '' }));
  }, [user?.institution.id]);

  const [values, setValues] = useState<IImportUser>({
    academicYearId: '',
    academyId: '',
    userType,
    intakeProgramId: '',
    program: '',
    roleId: '',
    file: null,
  });

  const initialErrorState: ImportErrors = {
    academyId: '',
    roleId: '',
    program: '',
    intakeProgramId: '',
  };

  const [errors, setErrors] = useState<ImportErrors>(initialErrorState);

  const [importReport, setimportReport] = useState<IImportUserRes | undefined>(undefined);

  const academies: AcademyInfo[] | undefined =
    academyStore.fetchAcademies().data?.data.data || [];
  // const intakes =
  //   getIntakesByAcademy(values.academyId, false, !!values.academyId).data?.data.data ||
  //   [];

  // const programs =
  //   getProgramsByIntake(values.intake, !!values.intake).data?.data.data || [];

  // const allprograms = programStore.fetchPrograms().data?.data.data || [];
  // const programs = allprograms.filter(
  //   (prog) => prog.department.academy.id === values.academyId,
  // );

  const { data } =
    roleInfo.type === RoleType.ACADEMY
      ? getRolesByAcademy(values.academyId)
      : getRolesByInstitution(roleInfo.institution_id);

  // const { data: userRoles } = usersStore.getUserRoles(user?.id + '');

  // const userRolesId = userRoles?.data.data.map((role) => role.role.id) || [];

  const roleOptions = data?.data.data || [];

  const academic_programs =
    programStore.getProgramsByAcademy(values.academyId).data?.data.data || [];

  const intakes = intakeStore.getIntakesByProgram(values.program).data?.data.data || [];

  const {
    data: academy,
    isLoading: academyLoading,
    refetch: refetchAcademy,
  } = academyStore.getAcademyById(picked_role?.academy_id + '', true);

  if (picked_role?.academyId && picked_role?.type === RoleType.ACADEMY) refetchAcademy();

  useEffect(() => {
    if (picked_role?.academy_id && picked_role?.type === RoleType.ACADEMY)
      setValues((prev) => ({ ...prev, academyId: picked_role?.academy_id + '' }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked_role]);

  const { mutateAsync, isLoading } = usersStore.importUsers();

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = importUserSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(async () => {
        if (values.file) {
          // let academicYearId =
          // levels.find((l) => l.academic_program_level.id == values.academicProgramLevelId)
          //   ?.academic_year.id || '';

          let formData = new FormData();
          formData.append('file', values.file);
          //   formData.append('academicProgramLevelId', values.academicProgramLevelId);
          formData.append('academyId', values.academyId);
          formData.append('intakeProgramId', values.intakeProgramId);
          formData.append('userType', values.userType);
          //   formData.append('academicYearId', academicYearId?.toString());

          await mutateAsync(formData, {
            onSuccess(data) {
              const successfullyImportedUsers: AssignUserRole[] =
                data.data.data.success.map((success) => {
                  return {
                    user_id: success.id.toString(),
                    role_id: parseInt(values.roleId),
                    description: '',
                    id: '',
                  };
                });

              if (values.roleId) {
                mutate(successfullyImportedUsers, {
                  onSuccess() {
                    toast.success('Users role assigned successfully');
                  },

                  onError(error: any) {
                    toast.error('Error assigning users role', error.response.message);
                  },
                });
              }

              queryClient.invalidateQueries(['users']);
              queryClient.invalidateQueries(['users/institution']);
              queryClient.invalidateQueries([
                'users/academy/type',
                values.academyId,
                values.userType,
              ]);

              setimportReport(data.data.data);
            },
            onError(error: any) {
              toast.error(error.response.data.message);
            },
          });
        } else toast.error('Please attach excel file.');
      })
      .catch((err) => {
        const validatedErr: ImportErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ImportErrors] = el.message;
        });
        setErrors(validatedErr);
        console.log('invalid', err.inner);
      });
  }

  const handleUpload = (files: FileList | null) => {
    setValues({ ...values, file: files ? files[0] : null });
  };

  function handleChange(e: ValueType) {
    console.log(values);
    setValues({ ...values, [e.name]: e.value });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        {picked_role?.type === RoleType.INSTITUTION ? (
          <SelectMolecule
            error={errors.academyId}
            options={getDropDownOptions({ inputs: academies || [] })}
            name="academyId"
            value={values.academyId}
            placeholder={'Academy to be enrolled'}
            handleChange={handleChange}>
            Academy
          </SelectMolecule>
        ) : (
          <InputMolecule
            readOnly
            value={academy?.data.data.name}
            name={'academyId'}
            placeholder={academyLoading ? 'Loading academy...' : ''}>
            Academy
          </InputMolecule>
        )}

        <SelectMolecule
          error={errors.roleId}
          placeholder="Select role"
          options={getDropDownOptions({ inputs: roleOptions })}
          value={values.roleId}
          name="roleId"
          handleChange={handleChange}>
          Select role
        </SelectMolecule>

        {userType === UserType.STUDENT ? (
          <div>
            <SelectMolecule
              error={errors.program}
              options={
                academic_programs.map((p) => ({
                  value: p.id,
                  label: p.name,
                })) as SelectData[]
              }
              value={values.program}
              name="program"
              placeholder={t('Program')}
              handleChange={handleChange}>
              {t('Program')}
            </SelectMolecule>
            <SelectMolecule
              error={errors.intakeProgramId}
              options={
                intakes?.map((intk) => ({
                  value: intk.id,
                  label: intk.intake.title,
                })) as SelectData[]
              }
              value={values.intakeProgramId}
              name="intakeProgramId"
              handleChange={handleChange}>
              Intake
            </SelectMolecule>
            {/* <SelectMolecule
              options={
                levels.map((lv) => ({
                  value: lv.academic_program_level.id,
                  label: lv.academic_program_level.level.name,
                })) as SelectData[]
              }
              name="academicProgramLevelId"
              placeholder={'Program'}
              handleChange={handleChange}>
              Level
            </SelectMolecule> */}
          </div>
        ) : (
          <></>
        )}
        <div className="py-2">
          <FileUploader
            allowPreview={false}
            handleUpload={handleUpload}
            accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}>
            <Button type="button" styleType="outline" icon={true}>
              <span className="flex items-center">
                <Icon name={'attach'} fill="primary" />
                <span className="pr-3">Attach file</span>
              </span>
            </Button>
          </FileUploader>
        </div>
        <div className="py-2">
          <Button type="submit" disabled={isLoading}>
            Save
          </Button>
        </div>
      </form>
      <div className="pt-2">
        <a
          href="/documents/Import users elms.xlsx"
          target="_blank"
          download
          className="text-sm font-bold text-primary-600 flex items-center">
          <Icon name="download" fill="primary" />
          <span> Download template</span>
        </a>
      </div>

      <PopupMolecule
        closeOnClickOutSide={false}
        title="Feedback on import"
        open={importReport ? true : false}
        onClose={history.goBack}>
        <div className="w-96">
          <Heading fontWeight="medium" fontSize="lg" color="success">
            File scanned sucessfully.
          </Heading>
          <div className="my-6 overflow-y-auto overflow-x-hidden max-h-60">
            {importReport &&
              Object.keys(importReport.failures).map((key) => (
                <p key={key} className="text-error-500 p-2 text-sm rounded-sm">
                  {`On row ${key}: ${importReport.failures[key]}`}
                </p>
              ))}
          </div>

          <Button
            onClick={() => {
              history.goBack();
            }}>
            Close
          </Button>
        </div>
      </PopupMolecule>
    </>
  );
}
