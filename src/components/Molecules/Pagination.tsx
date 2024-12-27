import React from 'react';

import Icon from '../Atoms/custom/Icon';
import Indicator from '../Atoms/custom/Indicator';

type PaginationProps = {
  totalElements: number;
  paginate: (_pnber: number) => void;
  currentPage: number;
  rowsPerPage?: number;
  totalPages?: number;
};
const Pagination = ({ totalPages = 1, paginate, currentPage = 0 }: PaginationProps) => {
  const pageNumbers = [1];

  for (let i = 1; i < totalPages; i++) {
    pageNumbers.push(i + 1);
  }

  const onNext = () => {
    paginate(currentPage + 1);
  };

  const onPrev = () => {
    paginate(currentPage - 1);
  };

  return totalPages > 1 ? (
    <div className="py-2">
      <nav className="my-2 flex justify-end">
        <ul className="flex pl-0 rounded list-none flex-wrap justify-center">
          <button
            aria-label="left-arrow"
            className="mr-3"
            onClick={onPrev}
            disabled={currentPage === 0}>
            <Icon name="left-arrow" size={12} stroke="none" />
          </button>
          <li className="space-x-2">
            {pageNumbers.map((number) => (
              <Indicator
                key={number}
                isCircular={false}
                isActive={currentPage + 1 === number}
                hasError={false}
                isComplete={false}
                clicked={() => paginate(number - 1)}>
                {number}
              </Indicator>
            ))}
          </li>
          <button
            aria-label="right-arrow"
            className="ml-3"
            onClick={onNext}
            disabled={currentPage === totalPages - 1}>
            <Icon name="right-arrow" size={12} stroke="none" />
          </button>
        </ul>
      </nav>
    </div>
  ) : (
    <></>
  );
};
export default Pagination;
