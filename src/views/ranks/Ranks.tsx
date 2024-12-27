import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewRank from '../../components/Organisms/forms/ranks/NewRank';
import UpdateRank from '../../components/Organisms/forms/ranks/UpdateRank';
import { rankStore } from '../../store/administration/rank.store';
import { Privileges } from '../../types';
import { RankRes } from '../../types/services/rank.types';
import { ActionsType } from '../../types/services/table.types';

interface FilteredRanks
  extends Pick<RankRes, 'id' | 'name' | 'description' | 'category' | 'institution_id'> {}

export default function Ranks() {
  const { url, path } = useRouteMatch();
  const [ranks, setRanks] = useState<FilteredRanks[]>();
  const history = useHistory();
  const location = useLocation();

  const { data, isSuccess, isLoading, refetch } = rankStore.getRanks(); // fetch ranks

  useEffect(() => {
    // filter data to display
    data?.data.data.sort((a, b) => a.priority - b.priority);
    const filterdData = data?.data.data.map((rank) =>
      _.pick(rank, ['id', 'abbreviation', 'name', 'description', 'category', 'priority']),
    );

    data?.data.data && setRanks(filterdData);
  }, [data]);

  let actions: ActionsType<FilteredRanks>[] = [];

  actions?.push(
    {
      name: 'Edit rank',
      handleAction: (id: string | number | undefined) => {
        history.push(`${path}/${id}/edit`); // go to edit rank
      },
      privilege: Privileges.CAN_MODIFY_RANKS,
    },
    {
      name: 'Delete rank',
      handleAction: (id: string | number | undefined) => {
        console.log('delete rank', id);
      },
      privilege: Privileges.CAN_MODIFY_RANKS,
    },
  );

  // re fetch data whenever user come back on this page
  useEffect(() => {
    if (location.pathname === path || location.pathname === `${path}/`) {
      refetch();
    }
  }, [location, path, refetch]);

  function submited() {}
  function handleSearch() {}

  function handleSelect(_selected: string[] | null) {}

  return (
    <main>
      <section>
        <BreadCrumb list={[{ title: 'Ranks', to: 'ranks' }]} />
      </section>
      <section>
        <TableHeader
          title="Ranks"
          totalItems={ranks && ranks.length > 0 ? ranks.length : 0}
          showSearch={false}
          handleSearch={handleSearch}>
          <Link to={`${url}/add`}>
            <Permission privilege={Privileges.CAN_CREATE_RANKS}>
              <Button>Add Rank</Button>
            </Permission>
          </Link>
        </TableHeader>
      </section>
      <section>
        {isLoading && <Loader />}
        {ranks && ranks.length > 0 && isSuccess ? (
          <Table<FilteredRanks>
            hide={['id']}
            handleSelect={handleSelect}
            statusColumn="status"
            data={ranks}
            uniqueCol={'id'}
            actions={actions}
          />
        ) : isSuccess && ranks?.length === 0 ? (
          <NoDataAvailable
            privilege={Privileges.CAN_CREATE_RANKS}
            icon="role"
            buttonLabel="Add new rank"
            title={'No ranks available'}
            handleClick={() => history.push(`${url}/add`)}
            description="There are no ranks added yet. Click below to add some"
          />
        ) : null}
      </section>

      <Switch>
        {/* create rank */}
        <Route
          exact
          path={`${path}/add`}
          render={() => {
            return (
              <PopupMolecule title="New Rank" open={true} onClose={history.goBack}>
                <NewRank onSubmit={submited} />
              </PopupMolecule>
            );
          }}
        />

        {/* modify rank */}
        <Route
          exact
          path={`${path}/:id/edit`}
          render={() => {
            return (
              <PopupMolecule title="Update Rank" open onClose={history.goBack}>
                <UpdateRank onSubmit={submited} />
              </PopupMolecule>
            );
          }}
        />
      </Switch>
    </main>
  );
}
