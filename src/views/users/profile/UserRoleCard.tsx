import React, { useState } from 'react';
import toast from 'react-hot-toast';

import Permission from '../../../components/Atoms/auth/Permission';
import Badge from '../../../components/Atoms/custom/Badge';
import Button from '../../../components/Atoms/custom/Button';
import Icon from '../../../components/Atoms/custom/Icon';
import Heading from '../../../components/Atoms/Text/Heading';
import Confirmation from '../../../components/Molecules/Confirmation';
import { queryClient } from '../../../plugins/react-query';
import usersStore from '../../../store/administration/users.store';
import { Privileges } from '../../../types';
import { UserInfo } from '../../../types/services/user.types';
import { advancedTypeChecker } from '../../../utils/getOption';

function UserRoleCard({ user }: { user: UserInfo }) {
  const { data } = usersStore.getUserRoles(user.id + '');
  const { mutate, isLoading } = usersStore.revokeRole();
  const [confirm, setConfirm] = useState(false);

  const revokeUserRole = async (roleId: number) => {
    await mutate(roleId, {
      onSuccess(data) {
        toast.success(data.data.message);
        queryClient.invalidateQueries('user/roles');
      },
      onError(error: any) {
        toast.error(error.response.data.message);
      },
    });
  };

  return (
    <div className="max-w-sm py-4 px-6 bg-main rounded-md overflow-auto">
      <Heading fontWeight="semibold" fontSize="base" className="pt-6 pb-7">
        {user.person?.current_rank?.abbreviation || ''}{' '}
        {user.person?.first_name + ' ' + user.person?.last_name}
        &apos;s roles
      </Heading>
      <div className="bg-secondary py-5">
        {data?.data.data.length === 0 ? (
          <Badge
            fontWeight="medium"
            fontSize="sm"
            badgecolor="main"
            badgetxtcolor="txt-secondary"
            className="mx-2">
            No roles are currently specificied
          </Badge>
        ) : (
          data?.data.data.map((role) => (
            <Badge
              key={role.id}
              fontWeight="medium"
              fontSize="sm"
              badgecolor="main"
              badgetxtcolor={advancedTypeChecker(role.role.status)}
              className="m-2">
              <div className="flex items-center justify-between w-24">
                <p>{role.role.name}</p>
                <Permission privilege={Privileges.CAN_ASSIGN_ROLE}>
                  <Button
                    styleType="text"
                    type="button"
                    isLoading={isLoading}
                    onClick={() => setConfirm(true)}>
                    <Icon size={12} name={'close'} />
                  </Button>

                  <Confirmation
                    onConfirmationClose={() => setConfirm(false)}
                    onConfirmationSubmit={() => revokeUserRole(+role.id)}
                    showConfirmation={confirm}
                    title={'Remove user role'}
                    noLabel="No"
                    yesLabel="Yes">
                    Are you sure you want to revoke this role?
                  </Confirmation>
                </Permission>
              </div>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}

export default UserRoleCard;
