import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import NewPrivilege from '../../components/Organisms/forms/privilege/NewPrivilege';
import { privilegeStore } from '../../store/administration';
import { PrivilegeRes, ValueType } from '../../types';

export default function PrivilegesView() {
  const { path } = useRouteMatch();
  const [filteredPrivileges, setFilteredPrivileges] = useState<PrivilegeRes[]>([]);
  const history = useHistory();
  const [filter, setFilter] = useState(false);
  const { data: privileges, isSuccess, isLoading } = privilegeStore.getPrivileges(); // get privileges

  useEffect(() => {
    privileges?.data?.data && setFilteredPrivileges(privileges?.data?.data);
  }, [privileges?.data?.data]);

  const actions = [
    {
      name: 'Edit Privillege',
      handleAction: (id: string | undefined) => {
        history.push(`${path}/${id}/edit`); // go to edit page
      },
    },
  ];

  function submited() {}
  function handleSearch(_e: ValueType) {
    const value = _e.value + '';
    const filterePrivilege = debounce(() => {
      if (value)
        setFilteredPrivileges(
          privileges?.data.data?.filter((priv) => {
            return priv.featureType.toLowerCase().includes(value.toLowerCase());
          }) || [],
        );
    }, 500);

    filterePrivilege();
  }

  const handleClick = () => {
    setFilter(!filter);
  };

  return (
    <main>
      <section>
        <BreadCrumb list={[{ title: 'Privileges', to: 'privilege' }]} />
      </section>
      <section>
        <TableHeader
          title="Privileges"
          totalItems={
            filteredPrivileges && filteredPrivileges.length > 0
              ? filteredPrivileges.length
              : 0
          }
          handleSearch={handleSearch}
          handleClick={handleClick}></TableHeader>
      </section>
      <section>
        {isLoading && <Loader />}
        {isSuccess && filteredPrivileges.length > 0 ? (
          <Table<PrivilegeRes>
            uniqueCol="id"
            statusColumn="status"
            hide={['id']}
            data={filteredPrivileges}
            actions={actions}
          />
        ) : isSuccess && filteredPrivileges.length === 0 ? (
          <NoDataAvailable
            buttonLabel="Add new privilege"
            title={'No privilege available'}
            handleClick={() => {}}
            description="There are no priviledges added yet"
            showButton={false}
          />
        ) : null}
      </section>

      <Switch>
        {/* edit page */}
        <Route
          exact
          path={`${path}/:id/edit`}
          render={() => {
            return (
              <PopupMolecule title="Edit Privilege" open={true} onClose={history.goBack}>
                <NewPrivilege onSubmit={submited} />
              </PopupMolecule>
            );
          }}
        />
      </Switch>
    </main>
  );
}
