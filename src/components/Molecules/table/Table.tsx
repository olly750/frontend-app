import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { ValueType } from '../../../types';
import {
  ActionsType,
  Selected,
  SelectorActionType,
  StatusActionType,
} from '../../../types/services/table.types';
import Permission from '../../Atoms/auth/Permission';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';
import Row from '../../Atoms/custom/Row';
import Checkbox from '../../Atoms/Input/CheckBox';
import Select from '../../Atoms/Input/Select';
import Pagination from '../Pagination';
import Tooltip from '../Tooltip';

interface TableProps<T> {
  data: (T & Selected)[];
  uniqueCol?: keyof T;
  showNumbering?: boolean;
  showSelect?: boolean;
  hide?: (keyof T)[];
  actions?: ActionsType<T>[];
  statusActions?: StatusActionType<T>[];
  selectorActions?: SelectorActionType[];
  handleClick?: () => void;
  statusColumn?: string;
  anotherStatusColumn?: string;
  handleSelect?: (_selected: string[] | null) => void;
  unselectAll?: boolean;

  //pagination
  showPagination?: boolean;
  rowsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
  onPaginate?: (_page: number) => void;
  onChangePageSize?: (_size: number) => void;
  tableId?: string;
}

export default function Table2<T>({
  uniqueCol,
  hide = [],
  showNumbering = true,
  data,
  actions,
  statusActions,
  selectorActions,
  anotherStatusColumn,
  statusColumn,
  handleSelect,
  unselectAll = false,
  //pagination
  rowsPerPage = 25,
  totalPages = 1,
  currentPage = 0,
  onPaginate,
  onChangePageSize,
  showSelect = true,
  showPagination = true,
  tableId = 'table',
}: TableProps<T>) {
  const countsToDisplay = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
  ];

  const [currentRows, setCurrentRows] = useState(data);
  const [selected, setSelected] = useState(new Set(''));

  const colsToHide: (keyof (T & Selected))[] = ['selected'];
  hide.length > 0 && colsToHide.push(...hide); // add unique col to elements that gonna be hidden

  const changeSelect = useCallback(
    (id: string, status: boolean) => {
      const cr = currentRows.map((row) => {
        if (uniqueCol) {
          // @ts-ignore
          if (row[uniqueCol] == id) row.selected = status;
        }
        return row;
      });
      setCurrentRows(cr);
    },
    [currentRows, uniqueCol],
  );

  useEffect(() => {
    selected.forEach((sel) => changeSelect(sel, true));
    setCurrentRows(data);
  }, [changeSelect, data, selected]);

  // handle paginate
  const paginate = (pageNumber: number) => {
    if (onPaginate) onPaginate(pageNumber);
  };

  // handle select all
  function _handleSelectAll() {
    // when set is full we uncheck
    if (selected.size === currentRows.length) {
      unSelectAll();
    } else {
      selectAll();
    }
  }

  function selectAll() {
    const newSelRow = new Set('');

    // else when set is not full we add  all ids
    _.map(currentRows, 'id').forEach((val) => {
      changeSelect(val, true); // mark current rows in table as selected
      newSelRow.add(val + '');
    });
    setSelected(new Set([...newSelRow])); // add new selected list in selected state
    if (handleSelect) handleSelect(Array.from(newSelRow));
  }

  const unSelectAll = useCallback(() => {
    setSelected(new Set('')); // set set to empty, since we unselected each and everything

    _.map(currentRows, 'id').forEach((val) => {
      changeSelect(val, false); // unmark all current rows in table as selected
    });

    if (handleSelect) handleSelect([]);
  }, [changeSelect, currentRows, handleSelect]);

  //handle single select
  function _handleSelect(e: ValueType<HTMLInputElement>) {
    const val = e.value?.toString(); //stringfy value

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

    if (handleSelect) handleSelect(Array.from(selected));
  }

  useEffect(() => {
    unSelectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unselectAll]);

  function handleCountSelect(e: ValueType) {
    if (onChangePageSize) onChangePageSize(parseInt(e.value + ''));
  }

  const getKeys = () => {
    const keys = Object.keys(currentRows[0]) as (keyof (T & Selected))[];
    // return keys.filter((item) => !colsToHide.includes(item));
    return keys;
  };

  const getHeader = () => {
    let keys = getKeys();
    // eslint-disable-next-line no-undef
    let header: JSX.Element[] = [];

    {
      uniqueCol &&
        showSelect &&
        header.push(
          <th className="pl-4" key={uniqueCol.toString()}>
            <Checkbox
              checked={selected.size === currentRows.length}
              handleChange={() => _handleSelectAll()}
              name={uniqueCol.toString()}
              value={'all'}
            />
          </th>,
        );
    }

    showNumbering &&
      header.push(
        <th className="pl-4">{/* <th className="pl-4" key={Math.random()}> */} №</th>,
      );

    /**
     * show dynamic headers, but exclude keys that are marked as to be hidden, in @link row
     */
    const dynamicHeaders = keys.map((key, i) => (
      <th
        className={`px-4 py-5 capitalize ${colsToHide.includes(key) ? 'hidden' : ''}`}
        key={i}>
        {key.toString().replaceAll('_', ' ')}
      </th>
    ));

    header.push(...dynamicHeaders);

    return header;
  };

  const getRowsData = () => {
    let keys = getKeys();
    return currentRows.map((row, index) => (
        <tr
            key={index}
            className={`hover:bg-[#e7edec] cursor-pointer ${
              row.status === 'MARKED' ? 'bg-[#f3f0a4]' : 'bg-[#fff]'
            }`}
          >
        {uniqueCol && showSelect && (
          <td className="pl-4">
            <Checkbox
              checked={row.selected}
              handleChange={_handleSelect}
              name={uniqueCol.toString()}
              value={row[uniqueCol] + ''}></Checkbox>
          </td>
        )}
        {showNumbering && (
          <td className="pl-4"> {rowsPerPage * currentPage + index + 1}</td>
        )}

        {keys.map((key) => {
          let val = row[key];
          let uniqueColumn: T[keyof T] | Selected['selected'] | undefined = uniqueCol
            ? row[uniqueCol]
            : undefined;

          let hasStatus =
            key.toString().toLowerCase() === statusColumn ||
            key.toString().toLowerCase() === anotherStatusColumn;

          return (
            <Row
              key={key.toString()}
              identifier={key}
              data={val}
              uniqueCol={uniqueColumn}
              colsToHide={colsToHide}
              hasStatus={hasStatus}
              statusActions={statusActions}
            />
          );
        })}
        {actions && actions.length > 0 ? (
          <td className="flex space-x-6 cursor-pointer actions">
            <Tooltip
              position="left center"
              on="click"
              trigger={
                <button aria-label="more" type="button" onClick={() => {}}>
                  <Icon name="more" stroke={'txt-secondary'} fill={'txt-secondary'} />
                </button>
              }
              open>
              <ul>
                {actions.map(({ name, handleAction, privilege }) =>
                  privilege ? (
                    <Permission privilege={privilege} key={name}>
                      <li className="hover:bg-secondary">
                        <Button
                          styleType="text"
                          hoverStyle="no-underline"
                          color="txt-primary"
                          onClick={() => handleAction(uniqueCol && row[uniqueCol])}>
                          {name}
                        </Button>
                      </li>
                    </Permission>
                  ) : (
                    <li className="hover:bg-secondary" key={name}>
                      <Button
                        styleType="text"
                        hoverStyle="no-underline"
                        color="txt-primary"
                        onClick={() => handleAction(uniqueCol && row[uniqueCol])}>
                        {name}
                      </Button>
                    </li>
                  ),
                )}
              </ul>
            </Tooltip>
          </td>
        ) : null}
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto rounded-lg text-sm">
      {selected.size > 0 && (
        <div className="rounded mb-3 py-2 bg-main flex justify-between text-primary-600">
          <div>
            <p className=" px-4 py-2">
              <strong>{selected.size}</strong> rows selected
            </p>
          </div>
          <div className="px-4 flex gap-2">
            {selectorActions?.map((action) =>
              action.privilege ? (
                <Permission privilege={action.privilege}>
                  <Button
                    styleType="outline"
                    onClick={() => action.handleAction(Array.from(selected))}>
                    {action.name}
                  </Button>
                </Permission>
              ) : (
                <Button
                  styleType="outline"
                  onClick={() => action.handleAction(Array.from(selected))}>
                  {action.name}
                </Button>
              ),
            )}
          </div>
        </div>
      )}

      <table
        className="table-auto border-collapse font-medium bg-main w-full m-auto"
        id={tableId}>
        <thead>
          <tr className="text-left text-primary-500 border-b border-[#255d57] bg-[#e7edec]">
            {getHeader()}
            {actions && actions.length > 0 ? (
              <th className="px-4 py-2 text-primary-500 actions">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>{getRowsData()}</tbody>
      </table>
      {showPagination && (
        <div className="flex justify-between mt-4 mb-5">
          <div className="flex items-center py-2">
            <span>Show</span>

            <Select
              className="px-3"
              width="32"
              // height={30}
              value={rowsPerPage.toString()}
              handleChange={handleCountSelect}
              name="rowstoDisplay"
              options={countsToDisplay}></Select>
            <span>Entries</span>
          </div>
          <Pagination
            totalElements={data.length}
            paginate={paginate}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
