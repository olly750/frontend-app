import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import useAuthenticator from '../../hooks/useAuthenticator';
import {
  getProgramsByIntake,
  intakeStore,
} from '../../store/administration/intake.store';
import { IntakeParamType, Link as LinkList, Privileges } from '../../types';
import { IntakeProgramInfo } from '../../types/services/intake-program.types';
import { advancedTypeChecker } from '../../utils/getOption';
import { IProgramData } from '../programs/AcademicPrograms';
import AddAcademicProgramToIntake from '../programs/AddAcademicProgramToIntake';
import NewAcademicProgram from '../programs/NewAcademicProgram';
import UpdateAcademicProgram from '../programs/UpdateAcademicProgram';
import EditIntakeLevelModule from './EditIntakeLevelModule';
import IntakeProgramDetails from './IntakeProgramDetails';
import NewIntakeLevelModule from './NewIntakeLevelModule';
import NewIntakeProgramLevel from './NewIntakeProgramLevel';

function IntakePrograms() {
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const { intakeId } = useParams<IntakeParamType>();
  const location = useLocation();
  const { t } = useTranslation();

  const list: LinkList[] = [
    { to: 'home', title: 'home' },
    { to: 'intakes', title: 'intakes' },
    { to: `${url}`, title: t('Program') },
  ];
  const { user } = useAuthenticator();

  const { data, isLoading, refetch } = getProgramsByIntake(intakeId);
  const programInfo = data?.data.data || [];

  const intake = intakeId ? intakeStore.getIntakeById(intakeId!, true) : null;

  useEffect(() => {
    if (location.pathname === path || location.pathname === `${path}/`) {
      refetch();
    }
  }, [location, path, refetch]);

  let programs: IProgramData[] = [];

  programInfo?.map((p) => {
    let pg = p as IntakeProgramInfo;

    let prog: IProgramData = {
      id: pg.program.id,
      status: {
        type: advancedTypeChecker(pg.program.generic_status),
        text: pg.program.generic_status.toString(),
      },
      code: pg.program?.department.name,
      title: pg.program.name,
      subTitle: pg.program.type.replaceAll('_', ' '),
      description: pg.program.description,
      department: pg.program.department,
      total_num_modules: pg.program.total_num_modules,
      incharge_names: pg.program.current_admin_names,
      intake_prog_id: pg.id.toString(),
    };

    programs.push(prog);
  });


 
  function submited() {
    refetch();
    history.goBack();
  }

  return (
    <main className="px-4">
      <Switch>
        <Route
          exact
          path={`${path}`}
          render={() => {
            return (
              <>
                <section>
                  <BreadCrumb list={list} />
                </section>
                <section>
                  <TableHeader
                    totalItems={programs.length}
                    title={`${intakeId ? intake?.data?.data.data.title : t('Program')}`}
                    showSearch={false}>
                    <Permission privilege={Privileges.CAN_CREATE_PROGRAMS_IN_INTAKE}>
                      <Link to={`${url}/add-program-to-intake?intakeId=${intakeId}`}>
                        <Button>Add {t('Program')} To Intake</Button>
                      </Link>
                    </Permission>
                  </TableHeader>
                </section>
                <section className="flex flex-wrap justify-start gap-2 mt-2">
                  {programs.length === 0 && isLoading ? (
                    <Loader />
                  ) : programs.length > 0 ? (
                    programs.map((Common) => {
                      return (
                        <div className="p-1 mt-3" key={Common.id}>
                          <CommonCardMolecule
                            className="cursor-pointer"
                            data={Common}
                            handleClick={() =>
                              history.push(`${url}/${Common.id}/${Common.intake_prog_id}`)
                            }>
                            {/* <div className="flex items-center gap-2 pb-6s">
                              <Heading color="txt-secondary" fontSize="sm">
                                {t('Program')} in charge:
                              </Heading>
                              <div className="flex items-center">
                                <Heading fontSize="sm">{Common.incharge_names}</Heading>
                              </div>
                            </div> */}
                          </CommonCardMolecule>
                        </div>
                      );
                    })
                  ) : (
                    <NoDataAvailable
                      privilege={Privileges.CAN_CREATE_PROGRAMS_IN_INTAKE}
                      icon="program"
                      buttonLabel={'Add new ' + t('Program') + ' to intake'}
                      title={'No ' + t('Program') + ' available in this intake'}
                      handleClick={() =>
                        history.push(`${url}/add-program-to-intake?intakeId=${intakeId}`)
                      }
                      description={`There are no ` + t('Program') + ` added yet`}
                    />
                  )}
                </section>
              </>
            );
          }}
        />
        {/* add academic program to intake*/}
        <Route
          exact
          path={`${url}/add-program-to-intake`}
          render={() => {
            return (
              <PopupMolecule title={t('Program')} open={true} onClose={history.goBack}>
                <AddAcademicProgramToIntake submited={submited} />
              </PopupMolecule>
            );
          }}
        />

        {/* create academic program */}
        <Route
          exact
          path={`${path}/add`}
          render={() => {
            return <NewAcademicProgram />;
          }}
        />
        {/* add levels to intake program */}
        <Route
          exact
          path={`${path}/:id/:intakeProg/add-level`}
          render={() => <NewIntakeProgramLevel />}
        />
        {/* add module to intake program level */}
        <Route
          exact
          path={`${path}/:id/:intakeProg/:level/add-module`}
          render={() => <NewIntakeLevelModule />}
        />

        {/* edit module to intake program level */}
        <Route
          exact
          path={`${path}/:id/:intakeProg/:level/edit-module/:moduleId`}
          render={() => <EditIntakeLevelModule />}
        />

        {/* modify academic program */}
        <Route path={`${path}/:id/edit`} render={() => <UpdateAcademicProgram />} />

        {/* show intake academic program details */}
        <Route path={`${path}/:id/:intakeProg`} render={() => <IntakeProgramDetails />} />
      </Switch>
    </main>
  );
}

export default IntakePrograms;
