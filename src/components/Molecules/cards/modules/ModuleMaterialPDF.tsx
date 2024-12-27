import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { getPrivilegesByRole } from '../../../../store/administration';
import { CommonCardDataType, ParamType, Privileges } from '../../../../types';
import cookie from '../../../../utils/cookie';
import Permission from '../../../Atoms/auth/Permission';
import Button from '../../../Atoms/custom/Button'; 

interface IProps {
  attachment: any;
  showMenu?: string;
  intakeProg?: string;
}

export default function ModuleMaterialPDF({ attachment, intakeProg = '', showMenu }: IProps) {
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
 
  // console.log("attachment",attachment)

  const goToDisplaypdf = () => {
 
    history.push(`/dashboard/modules/${id}/pdf-file?attachment=${attachment.id}`);
  };
  let filename = attachment?.path_to_file.replace(/^.*[\\/]/, '').slice(36) || '';
  
  return (<><button
    // styleType="outline"
    // className="outline-none mt-4"
    //@ts-ignore
    style={{color:'blue'}} 
    onClick={() => goToDisplaypdf()}
    >
    {filename}
  </button><br/></>
 
  );
}
