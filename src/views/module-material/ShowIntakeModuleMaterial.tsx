import React from 'react';
import toast from 'react-hot-toast';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import ModuleMaterialPDF from '../../components/Molecules/cards/modules/ModuleMaterialPDF';
import { queryClient } from '../../plugins/react-query';
import { moduleMaterialStore } from '../../store/administration/module-material.store';
import { ParamType, Privileges } from '../../types';
import usePickedRole from '../../hooks/usePickedRole';
import { ModuleMaterialAttachmentInfo } from '../../types/services/module-material.types';
import { downloadAttachment } from '../../utils/file-util';

function ShowIntakeModuleMaterial({ materialId }: { materialId: string }) {


  const matAttachments =
    moduleMaterialStore.getIntakeModuleMaterialAttachments(materialId);

  const attachments = matAttachments.data?.data.data;

  return (
    <>
      <Heading fontSize="sm" color="txt-secondary" className="p-4 underline">
      <Permission privilege={Privileges.CAN_ACTIVATE_AND_DESACTIVATE_MODULE_MATERIAL}>
        ({attachments?.length}) Supporting files
        </Permission>
      </Heading>
      {attachments?.map((attach) => (
        <ShowAttachment attach={attach} key={attach.id} />
      ))}
    </>
  );
}

function ShowAttachment({ attach }: { attach: ModuleMaterialAttachmentInfo }) {

  
  const { path, url } = useRouteMatch();
  const { search } = useLocation();
  const intkPrg = new URLSearchParams(search).get('intkPrg') || '';
  const showMenu = new URLSearchParams(search).get('showMenus') || '';
  const Mod = new URLSearchParams(search).get('Mod') || '';
  const picked_role = usePickedRole();

  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  const attachment = moduleMaterialStore.getFileById(attach.attachment_id).data?.data
    .data;
  const updateModuleMaterialAttachmentStatus =
    moduleMaterialStore.changeModuleMaterialAttachmentStatus();

  const attachment_status = attach.intake_module_attachment_status;

  let filename = attachment?.path_to_file.replace(/^.*[\\/]/, '').slice(36) || '';

  async function downloadAttach() {
    const fileUrl = await downloadAttachment(
      attachment?.original_file_name.toString() || '',
      '/attachments/downloadByFilename/',
    );
    let element = document.createElement('a');
    element.setAttribute('href', fileUrl);
    element.setAttribute('download', filename);

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  async function activateAttachment(intake_module_material_attachment_id: any) {
    const status: string = 'DESACTIVATED';

    updateModuleMaterialAttachmentStatus.mutate(
      {
        intake_module_material_attachment_id: intake_module_material_attachment_id,
        status: status,
      },
      {
        onSuccess: () => {
          toast.success('material is desactivated to student', { duration: 3000 });

          // queryClient.invalidateQueries(['intakematerials']);
          // history.push('/dashboard/evaluations');
          window.location.href = `${url}?showMenus=${showMenu}&Mod=${Mod}&intkPrg=${intkPrg}`;
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  }
  async function desactivateAttachment(intake_module_material_attachment_id: any) {
    const status: string = 'ACTIVATED';

    updateModuleMaterialAttachmentStatus.mutate(
      {
        intake_module_material_attachment_id: intake_module_material_attachment_id,
        status: status,
      },
      {
        onSuccess: () => {
          toast.success('material is activated to student', { duration: 3000 });
          window.location.href = `${url}?showMenus=${showMenu}&Mod=${Mod}&intkPrg=${intkPrg}`;
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  }
  return (
    <>
      {hasPrivilege(Privileges.CAN_ACTIVATE_AND_DESACTIVATE_MODULE_MATERIAL) ? (<> 
      
     {attachment?.file_type === 'application/pdf' ? (
        <div className="flex items-center justify-between w-4/5">
          <div className="flex items-center max-w-full"> 
            
            <Icon name="pdf" />
            {attachment_status === 'ACTIVATED' ? (
              <ModuleMaterialPDF
                attachment={attachment}
                showMenu={showMenu}
                intakeProg={intkPrg}
              />
            ) : (
              <>
                 <p className="truncate" >
                 <ModuleMaterialPDF
                attachment={attachment}
                showMenu={showMenu}
                intakeProg={intkPrg}
              />
                </p>
              </>
            )}{' '}
          </div>
          <Permission privilege={Privileges.CAN_ACTIVATE_AND_DESACTIVATE_MODULE_MATERIAL}>
            {attachment_status === 'ACTIVATED' ? (
              <Button
                className="mt-2 mb-4 mx-20"
                styleType="outline"
                onClick={() => activateAttachment(attach.id)}>
                DESACTIVATE
              </Button>
            ) : (
              <Button
                className="mt-2 mb-4 mx-20"
                styleType="outline"
                onClick={() => desactivateAttachment(attach.id)}>
                ACTIVATE
              </Button>
            )}
          </Permission>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-4/5">
            <div className="flex items-center max-w-full">
              <Icon
                name={
                  attachment?.file_type === 'application/pdf'
                    ? 'pdf'
                    : attachment?.file_type === 'application/msword'
                    ? 'word'
                    : attachment?.file_type === 'application/vnd.ms-excel'
                    ? 'excel'
                    : attachment?.file_type === 'application/vnd.ms-powerpoint'
                    ? 'powerpoint'
                    : attachment?.file_type ===
                      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    ? 'powerpoint'
                    : attachment?.file_type === 'application/PowerPoint Presentation'
                    ? 'powerpoint'
                    : attachment?.file_type === 'text/plain'
                    ? 'text-file'
                    : // : attachment?.file_type.includes('image/')
                      // ? 'png'
                      'png'
                }
              />
              {attachment_status === 'ACTIVATED' ? (
                <>
                  {' '}
                  <p className="truncate">{filename}</p>
                  <button onClick={downloadAttach}>
                    <Icon name="download" fill="primary" />
                  </button>
                </>
              ) : (
                <p className="truncate">
                 {filename}
                </p>
              )}
            </div>

            <Permission
              privilege={Privileges.CAN_ACTIVATE_AND_DESACTIVATE_MODULE_MATERIAL}>
              {attachment_status === 'ACTIVATED' ? (
                <Button
                  className="mt-2 mb-4 mx-20"
                  styleType="outline"
                  onClick={() => activateAttachment(attach.id)}>
                  DESACTIVATE
                </Button>
              ) : (
                <Button
                  className="mt-2 mb-4 mx-20"
                  styleType="outline"
                  onClick={() => desactivateAttachment(attach.id)}>
                  ACTIVATE
                </Button>
              )}
            </Permission>
          </div>

          <div id="downloadme"></div>
        </>
      )}

</>):(<>
  {attachment?.file_type === 'application/pdf' ? (
        <div className="flex items-center justify-between w-4/5">
          <div className="flex items-center max-w-full"> 
          {attachment_status === 'ACTIVATED' ? (<>
            <Icon name="pdf" />
           
              <ModuleMaterialPDF
                attachment={attachment}
                showMenu={showMenu}
                intakeProg={intkPrg}
              />
           </> ):null}
          </div>
          </div>
  ): (
    <>
      <div className="flex items-center justify-between w-4/5">
        <div className="flex items-center max-w-full">
        {attachment_status === 'ACTIVATED' ? (<>
          <Icon
            name={
              attachment?.file_type === 'application/pdf'
                ? 'pdf'
                : attachment?.file_type === 'application/msword'
                ? 'word'
                : attachment?.file_type === 'application/vnd.ms-excel'
                ? 'excel'
                : attachment?.file_type === 'application/vnd.ms-powerpoint'
                ? 'powerpoint'
                : attachment?.file_type ===
                  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ? 'powerpoint'
                : attachment?.file_type === 'application/PowerPoint Presentation'
                ? 'powerpoint'
                : attachment?.file_type === 'text/plain'
                ? 'text-file'
                : // : attachment?.file_type.includes('image/')
                  // ? 'png'
                  'png'
            }
          />
          {attachment_status === 'ACTIVATED' ? (
            <>
              {' '}
              <p className="truncate">{filename}</p>
              <button onClick={downloadAttach}>
                <Icon name="download" fill="primary" />
              </button>
            </>
          ) : (
            <p className="truncate">
             {filename}
            </p>
          )}    </> ):null}
        </div>
 
      </div>

      <div id="downloadme"></div>
    </>
  )}


</>)}

    </>
  );
}

export default ShowIntakeModuleMaterial;
