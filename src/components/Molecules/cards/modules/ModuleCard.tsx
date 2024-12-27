
import React from 'react';
import { useHistory } from 'react-router-dom';

import { CommonCardDataType, Privileges } from '../../../../types';
import Permission from '../../../Atoms/auth/Permission';
import Button from '../../../Atoms/custom/Button';
import CommonCardMolecule from '../CommonCardMolecule';

interface IProps {
  course: CommonCardDataType;
  showMenus?: boolean;
  intakeProgMod?: boolean;
  intakeProg?: string;
  editUrl?: string;
}

export default function ModuleCard({
  course,
  showMenus = true,
  intakeProgMod,
  intakeProg = '',
  editUrl,
}: IProps) {
  const history = useHistory();

  const goToEdit = (e: Event) => {
    e.stopPropagation();
    if (editUrl) history.push(editUrl);
    else history.push(`/dashboard/modules/${course.id}/edit`);
  };

  const goToAddSubject = (e: Event) => {
    e.stopPropagation();
    history.push(`/dashboard/modules/${course.id}/add-subject`);
  };
  // console.log("course",course?.intake_module_id)

  return (
    <div className="p-2 mt-3">
      <CommonCardMolecule
        data={course}
        handleClick={() => {
          history.push({
            pathname: `/dashboard/modules/${course.id}/subjects`,
            search: `?showMenus=${showMenus}&intakeProgMod=${intakeProgMod}&Mod=${course?.intake_module_id}&intkPrg=${intakeProg}`,
          });
        }}>
        <div className="pt-2 flex justify-around gap-2">
          <Permission
            privilege={
              showMenus
                ? Privileges.CAN_CREATE_INTAKE_PROGRAM_MODULE_SUBJECTS
                : Privileges.CAN_CREATE_SUBJECTS
            }>
            <Button
              //@ts-ignore
              onClick={(e: Event) => goToAddSubject(e)}>
              Add subject
            </Button>
          </Permission>
          <Permission
            privilege={
              showMenus
                ? Privileges.CAN_MODIFY_INTAKE_PROGRAM_MODULES
                : Privileges.CAN_MODIFY_MODULES
            }>
            <Button
              styleType="outline"
              className="outline-none"
              //@ts-ignore
              onClick={(e: Event) => goToEdit(e)}>
              Edit
            </Button>
          </Permission>
        </div>
      </CommonCardMolecule>
      {/* <BrowserLink
              className="outline-none"
              to={`/dashboard/modules/${course.id}/subjects`}>
              <Button styleType="outline">Start module</Button>
            </BrowserLink> */}
    </div>
  );
}
