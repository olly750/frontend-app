import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { getPrivilegesByRole } from '../../../../store/administration';
import { CommonCardDataType, ParamType, Privileges } from '../../../../types';
import cookie from '../../../../utils/cookie';
import Permission from '../../../Atoms/auth/Permission';
import Button from '../../../Atoms/custom/Button';
import CommonCardMolecule from '../CommonCardMolecule';

interface IProps {
  subject: CommonCardDataType;
  showMenu?: string;
  intakeProg?: string;
}

export default function SubjectCard({ subject, intakeProg = '', showMenu }: IProps) {
  const history = useHistory();
  const [privileges, setPrivileges] = useState<string[]>();
  const { id } = useParams<ParamType>();
 
  const picked_role_cookie = cookie.getCookie('user_role') || '';
  const { data: role_privilege } = getPrivilegesByRole(picked_role_cookie);

  useEffect(() => {
    const _privileges = role_privilege?.data.data?.map(
      (privilege) => privilege.privilege.name,
    );
    if (_privileges) setPrivileges(_privileges);
  }, [role_privilege?.data.data]);

  const goToEdit = (e: Event) => {
    e.stopPropagation();
    history.push(`/dashboard/modules/${id}/edit-subject/${subject.id}`);
  };

  return (
    <CommonCardMolecule
      data={subject}
      handleClick={() =>
        showMenu && showMenu === 'true'
          ? privileges?.includes(Privileges.CAN_ACCESS_LESSON)
            ? history.push({
                pathname: `/dashboard/modules/subjects/${subject.id}`,
                search: `?intkPrg=${intakeProg}`,
              })
            : privileges?.includes(Privileges.CAN_ACCESS_EVALUATIONS)
            ? history.push({
                pathname: `/dashboard/modules/subjects/${subject.id}/evaluations`,
                search: `?intkPrg=${intakeProg}`,
              })
            : history.push({
                pathname: `/dashboard/modules/subjects/${subject.id}/instructors`,
                search: `?intkPrg=${intakeProg}`,
              })
          : {}
      }>
      {/* <p className="pt-3">
        Total subjects:
        <span className="px-1 text-primary-500">{'None'}</span>
      </p> */}
      <Permission privilege={Privileges.CAN_CREATE_SUBJECTS}>
        <Button
          styleType="outline"
          className="outline-none mt-4"
          //@ts-ignore
          onClick={(e: Event) => goToEdit(e)}>
          Edit
        </Button>
      </Permission>
    </CommonCardMolecule>
  );
}
