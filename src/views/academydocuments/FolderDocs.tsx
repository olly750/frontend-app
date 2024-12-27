/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import usePickedRole from '../../hooks/usePickedRole';
import GetFolderDocs from '../../store/academicDocuments/GetFolderDocs';
import { Privileges } from '../../types';
import { DeleteAttachmentById, downloadAttachmentByName } from '../../utils/file-util';
import back from './assets/icon.png';
import UploadDocuments from './UploadDocuments';

export default function FolderDocs() {
  const picked_role = usePickedRole();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const [pop, setPop] = useState(false);
  const [file, setFile] = useState({ id: '', name: '' });
  const [data, setData] = useState<any>([]);
  const [prompt, setPrompt] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const folderId = useParams<any>();
  const history = useHistory();
  //   var truncatedString = '';
  // let file_name = '';
  // var file_id: any;
  useEffect(() => {
    const getFiles = async () => {
      const res = await GetFolderDocs(folderId?.folderid);
      // console.log(res);
      if (res.length === 0) {
        setIsloading(false);
      }

      setData(res);
      setIsloading(false);
    };
    getFiles();
  }, [folderId?.folderid, setPop]);

  async function downloadDoc(filename: string) {
    const res = await downloadAttachmentByName(filename);
    console.log(res.url);
    if (res.status === 500 || res.status !== 200) {
      toast.error(`Failed to download`, { duration: 5000 });
      return;
    }
    let element = document.createElement('a');
    element.setAttribute('href', res.url);
    element.setAttribute('download', filename);

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const handleClick = (name: any, id: any) => {
    setFile({ id, name });
    // file_id = id;
    console.log(id);
    hasPrivilege(Privileges.CAN_DELETE_ACADEMY_DOCUMENTS) && setPrompt(true);
    hasPrivilege(Privileges.CAN_DOWNLOAD_ACADEMY_DOCUMENTS) && setPrompt(true);
  };

  const handleClose = () => {
    setPop(false);
    setPrompt(false);
    // history.goBack();

    isReload && window.location.reload();
  };
  const handleDelete = async (id: any) => {
    const res = await DeleteAttachmentById(id);
    if (res.status === 200) {
      toast.success(`Successfully deleted file`, { duration: 5000 });
      setIsReload(true);
    } else toast.error(`Failed to delete`, { duration: 5000 });
    console.log(res);
  };
  // console.log(data);
  // console.log(file);

  return (
    <>
      {pop && (
        <PopupMolecule open={true} onClose={handleClose}>
          <UploadDocuments setIsReload={setIsReload} folderId={folderId?.folderid} />
        </PopupMolecule>
      )}
      <button onClick={() => history.goBack()}>
        <img src={back} alt={''} width={'40px'} />
      </button>
      {prompt && (
        <PopupMolecule open={true} onClose={handleClose}>
          <div style={{ marginTop: '1rem' }}>
            {hasPrivilege(Privileges.CAN_DOWNLOAD_ACADEMY_DOCUMENTS) && (
              <Button
                style={{ marginRight: '2rem' }}
                onClick={() => {
                  downloadDoc(file.name);
                }}>
                Download
              </Button>
            )}
            {hasPrivilege(Privileges.CAN_DELETE_ACADEMY_DOCUMENTS) && (
              <Button
                styleType="outline"
                color="error"
                onClick={() => handleDelete(file.id)}>
                Delete
              </Button>
            )}
          </div>
        </PopupMolecule>
      )}
      {/* <PopupMolecule open={true} onClose={handleClose}>
        <div style={{ marginTop: '1rem' }}>
          <Button style={{ marginRight: '2rem' }} styleType="outline" color="error">
            Delete
          </Button>
          <Button>Download</Button>
        </div>
      </PopupMolecule> */}
      <section
        className="mr-20 rounded border-2 border-[#e9ecef] flex flex-col gap-7 p-6 bg-main"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'auto',
        }}>
        <div style={{ gridColumn: '1 / -1', gridRow: '1 / 1' }}>
          {!isLoading && data.length === 0 ? (
            <NoDataAvailable
              title={'No data available'}
              icon="user"
              description={'Please add some data'}
              showButton={false}
            />
          ) : (
            ''
          )}
        </div>
        <div style={{ gridColumn: '1 / -1', gridRow: '1 / 1' }}>
          {hasPrivilege(Privileges.CAN_UPLOAD_ACADEMY_DOCUMENTS) && (
            <Button onClick={() => setPop(true)}>Add documents</Button>
          )}
        </div>
        {isLoading && <Loader />}
        {hasPrivilege(Privileges.CAN_ACCESS_ACADEMY_DOCUMENTS) &&
          data.map((elem: any) => {
            return (
              <div
                tabIndex={0}
                role={'button'}
                key={elem.id}
                style={{ padding: '10px' }}
                onClick={() => handleClick(elem?.original_file_name, elem.id)}>
                <Icon
                  size={60}
                  name={`${
                    elem.content_format === '.pdf'
                      ? 'pdf'
                      : elem.content_format === '.png'
                      ? 'png'
                      : elem.content_format === '.pptx'
                      ? 'powerpoint'
                      : elem.content_format === '.docx'
                      ? 'word'
                      : elem.content_format === '.xlsx'
                      ? 'excel'
                      : 'text-file'
                  }`}
                />
                <p style={{ cursor: 'pointer' }}>
                  {elem.original_file_name.substring(36)}
                  {/* {showFull && elem.original_file_name.substring(36).length < 30
                  ? elem.original_file_name.substring(36)
                  : elem.original_file_name.substring(36).substring(0, 22) + '...'} */}
                </p>
              </div>
            );
          })}
      </section>
    </>
  );
}
