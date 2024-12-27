import React, { useState } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewVenue from '../../components/Organisms/schedule/venue/NewVenue';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { getAllVenues } from '../../store/timetable/venue.store';
import { Privileges } from '../../types';

export default function Venues() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const [query, setQuery] = useState('');

  const handleClose = () => {
    history.goBack();
  };

  const picked_role = usePickedRole();

  const { data, isLoading } = getAllVenues(picked_role?.academy_id);
  const venues = data?.data.data.filter((v) => v.name.toLowerCase().includes(query));

  return (
    <Permission privilege={Privileges.CAN_ACCESS_VENUES}>
      <TableHeader
        totalItems={0}
        title={'Venues'}
        showBadge={false}
        handleSearch={(e) => setQuery(e.value.toString().trim().toLowerCase())}>
        <Permission privilege={Privileges.CAN_CREATE_VENUE}>
          <Link to={`/dashboard/schedule/venues/new`}>
            <Button>New venue</Button>
          </Link>
        </Permission>
      </TableHeader>
      {isLoading ? (
        <Loader />
      ) : venues?.length === 0 ? (
        <NoDataAvailable
          title={'No venues registered'}
          description={
            'No venues registered so far. Please register one with button below'
          }
          buttonLabel="New venue"
          handleClick={() => history.push(`${path}/new`)}
          privilege={Privileges.CAN_CREATE_VENUE}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues?.map((venue) => (
            <div
              key={venue.id}
              className="bg-main shadow rounded-md p-4 border-1 border-transparent hover:border-primary-500 cursor-pointer">
              <Heading fontSize="sm" color="txt-secondary" fontWeight="semibold">
                {venue.venue_type}
              </Heading>
              <Heading className="pt-6" fontSize="sm" fontWeight="bold">
                {venue.name}
              </Heading>
            </div>
          ))}
        </div>
      )}
      <Switch>
        <Route
          exact
          path={`${path}/new`}
          render={() => (
            <PopupMolecule title="New venue" open onClose={handleClose}>
              <NewVenue />
            </PopupMolecule>
          )}
        />
      </Switch>
    </Permission>
  );
}
