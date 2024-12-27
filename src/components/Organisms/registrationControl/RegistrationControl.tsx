import { t } from 'i18next';
import moment from 'moment';
import React from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import usePickedRole from '../../../hooks/usePickedRole';
import { queryClient } from '../../../plugins/react-query';
import registrationControlStore from '../../../store/administration/registrationControl.store';
import { GenericStatus, Privileges, ValueType } from '../../../types';
import { IRegistrationControlInfo } from '../../../types/services/registrationControl.types';
import { ActionsType } from '../../../types/services/table.types';
import Permission from '../../Atoms/auth/Permission';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';
import Loader from '../../Atoms/custom/Loader';
import Heading from '../../Atoms/Text/Heading';
import ILabel from '../../Atoms/Text/ILabel';
import NoDataAvailable from '../../Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../Molecules/Popup';
import Table from '../../Molecules/table/Table';
import TableHeader from '../../Molecules/table/TableHeader';
import NewRegistrationControl from '../forms/regcontrol/NewRegistrationControl';
import UpdateRegControl from '../forms/regcontrol/UpdateRegControl';
import NewIntake from '../intake/NewIntake';
import RegControlDetails from './RegControlDetails';

export default function RegistrationControl() {
  const { url } = useRouteMatch();
  const history = useHistory();
  const picked_role = usePickedRole();
  const { data, isLoading, isSuccess } =
    registrationControlStore.fetchRegControlByAcademy(picked_role?.academy_id!);

  function intakeCreated() {
    queryClient.invalidateQueries([
      'intakes/registrationControl',
      'intakes/academy',
      'intakeProgram/studentId',
      'instructor/program',
    ]);
    history.goBack();
  }

  interface IRegistrationInfo {
    'start date': string;
    'end date': string;
    description: string;
    status: GenericStatus;
    id: string | number | undefined;
    // 'academy name': string;
  }

  let RegistrationControls: IRegistrationInfo[] = [];
  let RegInfo = data?.data.data;

  if (RegInfo?.length! > 0) {
    RegInfo?.map((obj: IRegistrationControlInfo) => {
      obj.expected_end_date = moment(obj.expected_end_date).format('MMM D YYYY');
      obj.expected_start_date = moment(obj.expected_start_date).format('MMM D YYYY');

      let {
        description,
        generic_status,
        id,
        // academy: { name }, //destructure name inside academy obj
        expected_start_date,
        expected_end_date,
      } = obj;

      let registrationcontrol: IRegistrationInfo = {
        'start date': expected_start_date,
        'end date': expected_end_date,
        description,
        // 'academy name': name,
        status: generic_status,
        id: id,
      };
      RegistrationControls.push(registrationcontrol);
    });
  }

  const controlActions: ActionsType<IRegistrationInfo>[] = [];

  controlActions.push({
    name: 'Edit period',
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}/edit`); // go to edit reg control
    },
    privilege: Privileges.CAN_MODIFY_REG_CONTROL,
  });

  controlActions.push({
    name: t('View_period'),
    handleAction: (id: string | number | undefined) => {
      history.push(`${url}/${id}`); // go to add new intake to this reg control
    },
  });

  controlActions.push({
    name: 'Manage Intakes',
    handleAction: (id: string | number | undefined) => {
      history.push(`/dashboard/intakes?regId=${id}`); // go to add new intake to this reg control
    },
    privilege: Privileges.CAN_ACCESS_INTAKES,
  });

  function handleClose() {
    history.goBack();
  }
  console.log(controlActions);

  return (
    <Switch>
      <Route
        exact
        path={`${url}`}
        render={() => (
          <>
            <div className="flex flex-wrap justify-start items-center">
              <ILabel size="sm" color="gray" weight="medium">
                Institution Admin
              </ILabel>
              <Icon name="chevron-right" />

              <ILabel size="sm" color="gray" weight="medium">
                Academies
              </ILabel>
              <Icon name="chevron-right" fill="gray" />
              <Heading fontSize="sm" color="primary" fontWeight="medium">
                Registration period
              </Heading>
            </div>
            <TableHeader
              title="Registration period"
              totalItems={RegistrationControls.length}
              showSearch={false}>
              <Permission privilege={Privileges.CAN_CREATE_REG_CONTROL}>
                <Link to={`${url}/add`}>
                  <Button>Add new reg control</Button>
                </Link>
              </Permission>
            </TableHeader>

            <div className="mt-14">
              {isLoading && <Loader />}
              {isSuccess && RegistrationControls.length > 0 ? (
                <Table<IRegistrationInfo>
                  statusColumn="status"
                  data={RegistrationControls}
                  actions={controlActions}
                  uniqueCol={'id'}
                  hide={['id']}
                />
              ) : (
                ''
              )}

              {!isLoading && RegistrationControls.length < 1 && (
                <NoDataAvailable
                  icon="reg-control"
                  buttonLabel="Add new Registration period"
                  privilege={Privileges.CAN_CREATE_REG_CONTROL}
                  title={'No Registration Period Available'}
                  handleClick={() => {
                    history.push(`${url}/add`);
                  }}
                  description="No registration period currently added. Please add some or wait for the admin to add them"
                />
              )}
            </div>
          </>
        )}
      />

      {/* add reg control popup */}
      <Route
        exact
        path={`${url}/add`}
        render={() => {
          return (
            <PopupMolecule title="New Registration Period" open onClose={handleClose}>
              <NewRegistrationControl />
            </PopupMolecule>
          );
        }}
      />
      <Route
        exact
        path={`${url}/:id`}
        render={() => {
          return <RegControlDetails />;
        }}
      />

      {/* modify reg control */}
      <Route
        exact
        path={`${url}/:id/edit`}
        render={() => {
          return (
            <PopupMolecule title="Update Control" open onClose={handleClose}>
              <UpdateRegControl />
            </PopupMolecule>
          );
        }}
      />
      {/* add intake to reg control */}
      <Route
        exact
        path={`${url}/:id/add-intake`}
        render={() => {
          return (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="New intake"
              open
              onClose={handleClose}>
              <NewIntake handleSuccess={intakeCreated} />
            </PopupMolecule>
          );
        }}
      />
    </Switch>
  );
}
