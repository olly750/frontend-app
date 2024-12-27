import React, { useMemo } from 'react';

import { statusColors } from '../../../global/global-vars';
import { Color, Status } from '../../../types';
import { StatusActionType } from '../../../types/services/table.types';
import { advancedTypeChecker } from '../../../utils/getOption';
import Tooltip from '../../Molecules/Tooltip';
import Badge from './Badge';
import Button from './Button';

type RowProps<T> = {
  // data: Record<string, any>; This type should be revised
  data: any;
  identifier: string | number | symbol;
  uniqueCol?: T[keyof T];
  colsToHide?: (string | number | symbol)[];
  hasStatus?: boolean;
  statusActions?: StatusActionType<any>[];
};

function Row<T>({
  data,
  identifier,
  uniqueCol,
  colsToHide,
  hasStatus = false,
  statusActions,
}: RowProps<T>) {
  let status;
  if (data && hasStatus) {
    status = data as unknown as string;
  }

  const sanitizedData = !Number.isNaN(Number(data)) ? data : data ? data : '---';

  return (
    <td
      className={`px-4 py-2 ${colsToHide?.includes(identifier) ? 'hidden' : ''} ${
        hasStatus ? 'text-xs' : ''
      }`}>
      {statusActions && hasStatus ? (
        <Tooltip
          on="click"
          trigger={
            hasStatus && status ? (
              <Badge
                className="cursor-pointer"
                badgecolor={statusColors[status.toLowerCase() as Status] as Color}
                badgetxtcolor={statusColors[status.toLowerCase() as Status] as Color}>
                {sanitizedData}
              </Badge>
            ) : (
              <span>{sanitizedData}</span>
            )
          }
          open>
          <ul>
            {statusActions?.map(({ name, type, handleStatusAction }) => (
              <li className="hover:bg-secondary" key={name}>
                <Button
                  styleType="text"
                  hoverStyle="no-underline"
                  color="txt-primary"
                  onClick={() => (uniqueCol ? handleStatusAction(uniqueCol) : {})}>
                  <span className={`hover:text-${advancedTypeChecker(type)}-500`}>
                    {name}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </Tooltip>
      ) : hasStatus && status ? (
        <Badge
          className="cursor-pointer"
          badgecolor={statusColors[status.toLowerCase() as Status] as Color}
          badgetxtcolor={statusColors[status.toLowerCase() as Status] as Color}>
          {sanitizedData}
        </Badge>
      ) : (
        <span>{sanitizedData}</span>
      )}
    </td>
  );
}

export default Row;
