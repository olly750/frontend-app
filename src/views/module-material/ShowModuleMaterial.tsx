import React from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import ModuleMaterialPDF from '../../components/Molecules/cards/modules/ModuleMaterialPDF';
import { moduleMaterialStore } from '../../store/administration/module-material.store';
import { ModuleMaterialAttachmentInfo } from '../../types/services/module-material.types';
import { downloadAttachment } from '../../utils/file-util';

function ShowModuleMaterial({ materialId }: { materialId: string }) {

 


  const matAttachments = moduleMaterialStore.getModuleMaterialAttachments(materialId);

  const attachments = matAttachments.data?.data.data;
 
  return (
    <>
      <Heading fontSize="sm" color="txt-secondary" className="p-4 underline">
        ({attachments?.length}) Supporting files
      </Heading>
      {attachments?.map((attach) => (
        <ShowAttachment attach={attach} key={attach.id}/>
      ))}
    </>
  );
}

function ShowAttachment({ attach }: { attach: ModuleMaterialAttachmentInfo }) {

  const { search } = useLocation(); 
  const intkPrg = new URLSearchParams(search).get('intkPrg') || '';
  const showMenu = new URLSearchParams(search).get('showMenus') || '';

 

  const attachment = moduleMaterialStore.getFileById(attach.attachment_id).data?.data
    .data;

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
 
  return (
    <> 
    
    {attachment?.file_type === 'application/pdf' ?
    <div className="flex items-center justify-between w-4/5">
    <div className="flex items-center max-w-full">
    <Icon name='pdf'/>
     <ModuleMaterialPDF
     attachment={attachment}
     showMenu={showMenu}
     
      intakeProg={intkPrg}
   />
   </div>
   </div>
    :<><div className="flex items-center justify-between w-4/5">
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
            : attachment?.file_type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            ? 'powerpoint'
            : attachment?.file_type === 'application/PowerPoint Presentation'
            ? 'powerpoint'
           
            : attachment?.file_type === 'text/plain'
            ? 'text-file'
            : attachment?.file_type.includes('image/')
            ? 'png'
            : 'pdf'
        }
      />
      <p className="truncate">{filename}</p>
    </div>
    <button onClick={downloadAttach}>
      <Icon name="download" fill="primary" />
    </button>
  </div>

  <div id="downloadme"></div>
  </>
    
    }
      
    </>
  );
}

export default ShowModuleMaterial;
