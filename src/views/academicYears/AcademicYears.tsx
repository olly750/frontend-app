import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import usePickedRole from '../../hooks/usePickedRole';
import academicyearsStore from '../../store/administration/academicyears.store';
import { Link as Links, Privileges } from '../../types';
import { IAcademicYearInfo } from '../../types/services/academicyears.types';
import { ActionsType } from '../../types/services/table.types';
import AcademicPeriod from '../academicPeriods/AcademicPeriod';
import NewAcademicPeriod from '../academicPeriods/NewAcademicPeriod';
import UpdateAcademicPeriod from '../academicPeriods/UpdateAcademicPeriod';
import NewAcademicYear from './NewAcademicYear';
import UpdateAcademicYear from './UpdateAcademicYear';

export interface FilteredData
  extends Pick<
    IAcademicYearInfo,
    'id' | 'name' | 'academyId' | 'planned_start_on' | 'planned_end_on' | 'status'
  > {}

export default function AcademicYears() {
  const list: Links[] = [
    { to: 'home', title: 'home' },
    { to: 'academic-years', title: 'Academic years' },
  ];
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const picked_role = usePickedRole();
  const [years, setYears] = useState<FilteredData[]>([]);
  let actions: ActionsType<FilteredData>[] | undefined = [];

  const {
    data: academicYears,
    isLoading,
    isSuccess,
  } = academicyearsStore.fetchAcademicYears(picked_role?.academy_id + '');

  actions?.push({
    name: 'Edit year',
    handleAction: (id: string | number | undefined) => {
      history.push(`${path}/${id}/edit`); // go to edit year
    },
    privilege: Privileges.CAN_MODIFY_ACADEMIC_YEAR,
  });

  actions?.push({
    name: 'Manage Period',
    handleAction: (id: string | number | undefined) => {
      history.push(`${path}/${id}/period`); // go to manage period
    },
    privilege: Privileges.CAN_ACCESS_ACADEMIC_YEAR,
  });

  useEffect(() => {
    let formattedYears: any = [];
    // filter data to display
    const filteredData = academicYears?.data.data.map((level) =>
      _.pick(level, [
        'id',
        'name',
        'planned_start_on',
        'planned_end_on',
        'status',
        'total_num_programs',
        'total_num_faculties',
      ]),
    );

    filteredData?.map((year: any) => {
      let filteredInfo = {
        id: year.id.toString(),
        name: year.name,
        'start date': moment(year.planned_start_on).format('YYYY-MM-DD'),
        'end on': moment(year.planned_end_on).format('YYYY-MM-DD'),
        status: year.status,
        programs: year.total_num_programs,
        faculties: year.total_num_faculties,
      };
      formattedYears.push(filteredInfo);
    });

    academicYears?.data.data && setYears(formattedYears);
  }, [academicYears, academicYears?.data.data]);

  return (
    <Switch>
      {/* list all academic years */}
      <Route
        exact
        path={`${path}`}
        render={() => (
          <>
            <section>
              <BreadCrumb list={list} />
            </section>

            <section>
              <TableHeader
                title="Academic years"
                totalItems={years?.length || 0}
                showSearch={false}>
                {/* {years.length > 0 && ( */}
                <Permission privilege={Privileges.CAN_CREATE_ACADEMIC_YEAR}>
                  <Link to={`${url}/new`}>
                    <Button>Add year</Button>
                  </Link>
                </Permission>
                {/* )} */}
              </TableHeader>
            </section>

            <section>
              {isLoading && years?.length === 0 && <Loader />}

              {isSuccess && years?.length > 0 ? (
                <Table<FilteredData>
                  statusColumn="status"
                  data={years}
                  uniqueCol={'id'}
                  hide={['id']}
                  actions={actions}
                />
              ) : isSuccess && years.length === 0 ? (
                <NoDataAvailable
                  icon="program"
                  buttonLabel="Add new year"
                  title={'No years available'}
                  handleClick={() => history.push(`${url}/new`)}
                  description="No academic years have been added yet."
                  privilege={Privileges.CAN_CREATE_ACADEMIC_YEAR}
                />
              ) : null}
            </section>
          </>
        )}
      />

      {/* update year popup */}
      <Route
        exact
        path={`${path}/:id/edit`}
        render={() => {
          return (
            <PopupMolecule title="Update Academic year" open onClose={history.goBack}>
              <UpdateAcademicYear academicYears={years} />
            </PopupMolecule>
          );
        }}
      />

      {/* add new year popup */}
      <Route
        exact
        path={`${path}/new`}
        render={() => {
          return (
            <PopupMolecule title="New academic year" open onClose={history.goBack}>
              <NewAcademicYear />
            </PopupMolecule>
          );
        }}
      />
      {/* show academic period popup */}
      <Route
        exact
        path={`${path}/:id/period`}
        render={() => {
          return <AcademicPeriod />;
        }}
      />
      {/* add academic period popup */}
      <Route
        exact
        path={`${path}/:id/period/add`}
        render={() => {
          return (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="New Academic period"
              open
              onClose={history.goBack}>
              <NewAcademicPeriod />
            </PopupMolecule>
          );
        }}
      />
      {/* change academic period popup */}
      <Route
        exact
        path={`${path}/:id/period/edit`}
        render={() => {
          return (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Change academic period"
              open
              onClose={history.goBack}>
              <UpdateAcademicPeriod />
            </PopupMolecule>
          );
        }}
      />
    </Switch>
  );
}
