import React from 'react';

import { ValueType } from '../../../types';
import Badge from '../../Atoms/custom/Badge';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';
import Heading from '../../Atoms/Text/Heading';
import SearchMolecule from '../input/SearchMolecule';

type ITableHeader = {
  title?: string;
  totalItems?: number | string;
  children?: React.ReactNode;
  showSearch?: boolean;
  value?: string;
  showBadge?: boolean;
  usePadding?: boolean;
  handleClick?: () => void;
  handleSearch?: (_e: ValueType) => void;
  isSearching?: boolean;
};

export default function TableHeader({
  title,
  totalItems,
  handleSearch,
  handleClick,
  value = '',
  children,
  showBadge = true,
  showSearch = true,
  usePadding = true,
  isSearching = false,
}: ITableHeader) {
  const handleChange = (e: ValueType) => {
    if (showSearch && handleSearch) {
      handleSearch(e);
      // setValue(e.value + '');
    }
  };

  return (
    <div className={`pt-4 ${usePadding && 'pb-6'}`}>
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex gap-2 items-center">
          <Heading fontSize="2xl" fontWeight="bold" className="text-primary-600">
            {title}
          </Heading>

          {showBadge && (
            <Badge
              badgetxtcolor="main"
              badgecolor="primary"
              fontWeight="normal"
              className="h-6 flex justify-center items-center">
              {totalItems}
            </Badge>
          )}
        </div>
        {showSearch && (
          <div className="flex flex-wrap justify-start items-center">
            <SearchMolecule value={value} handleChange={handleChange} />
            <Button disabled={isSearching} onClick={handleClick} icon>
              <Icon name="search" stroke={'main'} />
            </Button>
            {/* <button
              disabled={isSearching}
              onClick={handleClick}
              aria-label="search"
              className="border p-0 bg-primary-400 rounded-md hover:bg-primary-500 hover:shadow-lg focus:bg-primary-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary active:shadow-md transition duration-150 ease-in-out flex items-center">
              <Icon name="search" stroke={'main'} />
            </button> */}
          </div>
        )}

        <div className="flex gap-3">{children}</div>
      </div>
    </div>
  );
}
