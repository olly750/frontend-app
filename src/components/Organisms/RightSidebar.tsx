/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useAuthenticator from '../../hooks/useAuthenticator';
import { ValueType } from '../../types';
import { SelectorActionType } from '../../types/services/table.types';
import { UserView } from '../../types/services/user.types';
import Avatar from '../Atoms/custom/Avatar';
import Button from '../Atoms/custom/Button';
import Icon from '../Atoms/custom/Icon';
import Loader from '../Atoms/custom/Loader';
import Checkbox from '../Atoms/Input/CheckBox';
import Heading from '../Atoms/Text/Heading';
import NoDataAvailable from '../Molecules/cards/NoDataAvailable';
// import SearchMolecule from '../Molecules/input/SearchMolecule';

interface IRightSidebar {
  label: string;
  open: boolean;
  handleClose: () => void;
  data: UserView[];
  selectorActions?: SelectorActionType[];
  dataLabel: string;
  isLoading: boolean;
  unselectAll: boolean;
}

function RightSidebar({
  label,
  open,
  handleClose,
  selectorActions,
  data,
  isLoading,
  dataLabel = '',
  unselectAll,
}: IRightSidebar) {
  // const handleSearch = () => {};
  const [selected, setSelected] = useState(new Set(''));
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [searchRes, setSearchRes] = useState<any>([]);
  const [wasChanged, setWasChanged] = useState(false);
  // const [newdata, setNewData] = useState<any>();
  const { user: authUser } = useAuthenticator();
  const changeSelect = useCallback(
    (id: string, status: boolean) => {
      data.map((row) => {
        if (row.id) {
          if (row.id == id) {
            row.selected = status;
          }
        }
        return row;
      });
    },

    [data],
  );

  useEffect(() => {
    if (search.length > 0) {
      const filteredData = data.filter((item: any) => {
        return (item.first_name.toLowerCase() || item.last_name.toLowerCase()).includes(
          search,
        );
      });
      setSearchRes(filteredData);

      // console.log(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    selected.forEach((sel) => changeSelect(sel, true));
  }, [changeSelect, selected]);

  useEffect(() => {
    unSelectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unselectAll]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });
  //handle single select
  function _handleSelect(e: ValueType<HTMLInputElement>) {
    const val = e.value?.toString(); //stringfy value
    const newSelected = new Set(Array.from(selected));
    newSelected.has(val) ? newSelected.delete(val) : newSelected.add(val);
    setSelected(newSelected);

    // if value exist we chop it
    if (val && selected.has(val)) {
      setSelected((prev) => {
        prev.delete(val);
        return prev;
      });
      changeSelect(val, false);
    }
    // else we add it
    else if (val) {
      setSelected((prev) => prev.add(val));
      changeSelect(val, true);
    }

    // if (handleSelect) handleSelect(Array.from(selected));
  }

  // handle select all
  function _handleSelectAll() {
    // when set is full we uncheck
    if (selected.size === data.length) {
      unSelectAll();
    } else {
      selectAll();
    }
  }

  function selectAll() {
    const newSelRow = new Set('');
    // else when set is not full we add  all ids
    _.map(data, 'id').forEach((val) => {
      changeSelect(val + '', true); // mark current rows in table as selected
      newSelRow.add(val + '');
    });
    setSelected(new Set([...newSelRow])); // add new selected list in selected state
    // if (handleSelect) handleSelect(Array.from(newSelRow));
  }
  function unSelectAll() {
    setSelected(new Set('')); // set set to empty, since we unselected each and everything

    _.map(data, 'id').forEach((val) => {
      changeSelect(val + '', false); // unmark all current rows in table as selected
    });
  }

  function closeBar() {
    handleClose();
    // if (inputRef.current) {
    //   inputRef.current.value = '';
    // }
    wasChanged && setSearch('');

    setWasChanged(false);
  }

  const handleSearch = (e: any) => {
    setSearch(e.target.value.trim());
    setWasChanged(true);
  };
  // console.log(data);
  // console.log(searchRes);
  return (
    <div
      className={`bg-main z-50 shadow min-h-screen overflow-y-auto h-full w-96 px-6 absolute right-0 top-0 sidebar-menu ${
        open ? 'block' : 'hidden'
      }`}>
      <div className="flex justify-between">
        <Heading fontSize="lg" fontWeight="semibold" className="pt-3">
          {label}
        </Heading>
        <Button styleType="text" icon onClick={() => closeBar()} className="self-end">
          <Icon name="close" fill="txt-secondary" size={18} />
        </Button>
      </div>

      {data.length > 0 && (
        <input
          style={{ padding: '8px', boxShadow: 'inset 0 0 0 1px black' }}
          value={search}
          ref={inputRef}
          placeholder="Search"
          onChange={handleSearch}
        />
      )}

      <div className="pt-4">
        {selected.size > 0 && (
          <div className="rounded mb-3 py-2 bg-main flex justify-between">
            <div>
              <p className="p-2">
                <strong>{selected.size}</strong> rows selected
              </p>
            </div>
            <div className="px-4">
              {selectorActions?.map((action) => (
                <Button
                  key={action.name + Math.random()}
                  styleType="outline"
                  onClick={() => action.handleAction(Array.from(selected))}>
                  {action.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        {/* <div className="py-4">
          <SearchMolecule
            placeholder="Search students"
            handleChange={handleSearch}
            width="w-48"
          />
        </div> */}

        <Heading fontSize="sm" fontWeight="semibold" color="primary" className="pb-4">
          {dataLabel}
        </Heading>

        {isLoading ? (
          <Loader />
        ) : data.length === 0 || (wasChanged && searchRes.length === 0) ? (
          <NoDataAvailable
            title={'No data available'}
            icon="user"
            description={'Please add some data first'}
            showButton={false}
          />
        ) : (
          <>
            <div className="flex gap-2 pb-4">
              <Checkbox
                checked={selected.size === data.length}
                handleChange={() => _handleSelectAll()}
                name={'user'}
                value={'all'}
              />

              <Heading fontSize="base" fontWeight="semibold">
                Select all
              </Heading>
            </div>
            {search.length === 0
              ? data.map((user, i) => (
                  <div className="flex w-full items-center pb-6 gap-4" key={i}>
                    <Checkbox
                      checked={user.selected}
                      handleChange={_handleSelect}
                      name={'user'}
                      value={user.id.toString()}
                    />

                    <Avatar
                      src={user.image_url || '/images/default-pic.png'}
                      size="48"
                      alt=""
                    />
                    <Heading fontSize="sm" fontWeight="semibold" className="text-center">
                      {user.rank || null} {user.first_name} {user.last_name}
                    </Heading>
                  </div>
                ))
              : searchRes.map((user: any, i: any) => (
                  <div className="flex w-full items-center pb-6 gap-4" key={i}>
                    <Checkbox
                      checked={user.selected}
                      handleChange={_handleSelect}
                      name={'user'}
                      value={user.id.toString()}
                    />

                    <Avatar
                      src={user.image_url || '/images/default-pic.png'}
                      size="48"
                      alt=""
                    />
                    <Heading fontSize="sm" fontWeight="semibold" className="text-center">
                      {user.rank || null} {user.first_name} {user.last_name}
                    </Heading>
                  </div>
                ))}
          </>
        )}
      </div>
    </div>
  );
}

export default RightSidebar;
