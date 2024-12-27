import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CardHeadMolecule from '../../components/Molecules/CardHeadMolecule';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import Tooltip from '../../components/Molecules/Tooltip';
import programStore from '../../store/administration/program.store';
import { CommonCardDataType, Link as LinkList } from '../../types';
import { DivisionInfo } from '../../types/services/division.types';
import { ProgramInfo } from '../../types/services/program.types';
import { advancedTypeChecker } from '../../utils/getOption';
import AddAcademicProgramToIntake from './AddAcademicProgramToIntake';
import NewAcademicProgram from './NewAcademicProgram';
import ProgramDetails from './ProgramDetails';
import UpdateAcademicProgram from './UpdateAcademicProgram';

export interface IProgramData extends CommonCardDataType {
  department: DivisionInfo;
  total_num_modules?: number;
  incharge_names: string;
  intake_prog_id?: string;
}

export default function AcademicProgram() {
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const { search } = useLocation();
  const location = useLocation();
  const { t } = useTranslation();

  const list: LinkList[] = [
    { to: 'home', title: 'home' },
    { to: 'users', title: 'users' },
    { to: 'faculty', title: t('Faculty') },
    { to: `${url}`, title: t('Program') },
  ];

  const dp = new URLSearchParams(search).get('dp');

  const { data, refetch, isLoading } = dp
    ? programStore.getProgramsByDepartment(dp?.toString() || '')
    : programStore.fetchPrograms();

  const programInfo = data?.data.data || [];

  useEffect(() => {
    if (location.pathname === path || location.pathname === `${path}/`) {
      refetch();
    }
  }, [location, path, refetch]);

  let programs: IProgramData[] = [];

  programInfo?.map((prog) => {
    prog = prog as ProgramInfo;

    let program: IProgramData = {
      id: prog.id,
      status: {
        type: advancedTypeChecker(prog.generic_status),
        text: prog.generic_status.toString(),
      },
      code: prog.code,
      title: prog.name,
      subTitle: prog.type.replaceAll('_', ' '),
      description: prog.description,
      department: prog.department,
      total_num_modules: prog.total_num_modules,
      incharge_names: prog.current_admin_names,
    };

    programs.push(program);
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
                  <BreadCrumb list={list}></BreadCrumb>
                </section>
                <section>
                  <TableHeader
                    totalItems={programs.length}
                    title={t('Program')}
                    showSearch={false}
                  />
                </section>
                <section className="flex flex-wrap justify-start gap-2 mt-2">
                  {programs.length === 0 && isLoading ? (
                    <Loader />
                  ) : programs.length > 0 ? (
                    programs.map((Common) => (
                      <Tooltip
                        key={Common.code}
                        trigger={
                          <div className="p-1 mt-3">
                            <CommonCardMolecule
                              className="cursor-pointer"
                              data={Common}
                              handleClick={() =>
                                dp ? history.push(`/dashboard/programs/${Common.id}`) : {}
                              }
                            />
                          </div>
                        }
                        open>
                        <div className="w-full px-6 py-4">
                          <CardHeadMolecule
                            title={Common.title}
                            code={Common.code}
                            status={Common.status}
                            description={''}
                          />

                          {/* first column */}

                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                {Common.department.division_type}
                              </Heading>
                              <Heading fontSize="sm" fontWeight="semibold">
                                {Common.department.name}
                              </Heading>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                Modules
                              </Heading>
                              <Heading fontSize="sm" fontWeight="semibold">
                                {Common.total_num_modules || 0}
                              </Heading>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                {t('Program')} Type
                              </Heading>
                              <Heading fontSize="sm" fontWeight="semibold">
                                {Common.subTitle}
                              </Heading>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Heading color="txt-secondary" fontSize="sm">
                                Program in charge
                              </Heading>
                              <div className="flex items-center">
                                {/* <div className="">
                                  <Avatar
                                    size="24"
                                    alt="user1 profile"
                                    className=" rounded-full  border-2 border-main transform hover:scale-125"
                                    src="https://randomuser.me/api/portraits/men/1.jpg"
                                  />
                                </div> */}
                                <Heading fontSize="sm" fontWeight="semibold">
                                  {Common.incharge_names}
                                </Heading>
                              </div>
                            </div>
                          </div>

                          {/* remarks section */}
                          <div className="flex flex-col mt-8 gap-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Remarks
                            </Heading>
                            <Heading fontSize="sm" color="txt-secondary">
                              {Common.description}
                            </Heading>
                          </div>
                          <div className="mt-4 space-x-4">
                            <Link to={`/dashboard/programs/${Common.id}/edit`}>
                              <Button>Edit {t('Program')}</Button>
                            </Link>
                            {/* <Button styleType="outline">Change Status</Button> */}
                          </div>
                        </div>
                      </Tooltip>
                    ))
                  ) : (
                    <NoDataAvailable
                      buttonLabel={'Add new ' + t('Program')}
                      showButton={false}
                      title={'No ' + t('Program') + ' available'}
                      handleClick={() => history.push(`/dashboard/programs/add?dp=${dp}`)}
                      description={
                        'There are no ' +
                        t('Program') +
                        ' added yet, click on the below button to add some!'
                      }
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
        {/* modify academic program */}
        <Route path={`${path}/:id/edit`} render={() => <UpdateAcademicProgram />} />

        {/* show academic program details */}
        <Route path={`${path}/:id`} render={() => <ProgramDetails />} />
      </Switch>
    </main>
  );
}
