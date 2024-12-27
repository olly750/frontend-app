export interface LocationLevel {
  id: number;
  code: string;
  name: string;
  createdOn: string;
  createdById: number;
  createdByUsername: string;
  updatedById: number;
  updatedByUsername: string;
  updatedOn: string;
}

export interface LocationInfo {
  id: number;
  code: string;
  name: string;
  description: string;
  createdOn: string;
  createdById: number;
  createdByUsername: string;
  updatedById: string;
  updatedByUsername: string;
  updatedOn: string;
  levelId: string;
  parentId: string;
  parent?: LocationInfo;
  level: LocationLevel;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}
export interface PagedLocationInfo {
  content: LocationInfo[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}
