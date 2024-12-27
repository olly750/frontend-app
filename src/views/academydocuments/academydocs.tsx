/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import Input from '../../components/Atoms/Input/Input';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import DeleteFolder from '../../store/academicDocuments/DeleteFolder';
import GetAcademyFolders from '../../store/academicDocuments/GetAcademyFolders';
import UpdateFolder from '../../store/academicDocuments/UpdateFolder';
import { Privileges } from '../../types';
import folderImage from './assets/folder.png';
// import { Route } from 'react-router-dom';
export default function AcademyDocs() {
  const picked_role = usePickedRole();
  const history = useHistory();
  const [viewIcon, setViewIcon] = useState(false);
  const [folders, setFolders] = useState<any>([]);
  const [search, setSearch] = useState('');
  const [searchRes, setSearchRes] = useState<any>([]);
  const [isLoading, setIsloading] = useState(true);
  const [wasChanged, setWasChanged] = useState(false);
  const [clear, setclear] = useState(false);
  const [renameVal, setRenameVal] = useState({ name: '', id: null, refetch: false });
  const [rename, setRename] = useState(false);
  const { url } = useRouteMatch();
  const inputRef = useRef<any>();
  const RenameRef = useRef<any>();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  useEffect(() => {
    const getFolders = async () => {
      const res = await GetAcademyFolders(picked_role?.academy_id);
      if (res.length === 0) {
        setIsloading(false);
      }
      setIsloading(false);
      const filteredArray: any[] = [];
      res.map((elem: any) => {
        filteredArray.push({
          id: elem.id,
          name: elem.folder_name,
          academy: elem.academy.id,
        });
      });

      setFolders(filteredArray);
    };
    if (picked_role?.academy_id || wasChanged || renameVal.refetch) {
      getFolders();
      setRenameVal((prev) => {
        return { ...prev, refetch: false };
      });
    }
  }, [picked_role?.academy_id, renameVal.refetch, wasChanged]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (inputRef.current) {
      inputRef.current.value && setclear(true);
    }
    if (search.length === 0) {
      setclear(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  useEffect(() => {
    if (search.length > 0) {
      const filteredData = folders.filter((item: any) => {
        return (item.name.toLowerCase() || item.id.toLowerCase()).includes(search);
      });
      setSearchRes(filteredData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const actions = [
    {
      name: 'View Documents',
      handleAction: (id: any) => {
        history.push(`/dashboard/academydocuments/${id}`);
      },
    },
    {
      name: 'Rename Folder',
      handleAction: async (id: any) => {
        setRename(true);
        // RenameRef.current.focus();
        setRenameVal((prev) => {
          return { ...prev, id: id };
        });
        // console.log(folders);
        // const res = await UpdateFolder('test', id);
        // console.log(res);
      },
    },
    {
      name: 'Delete Folder',
      handleAction: async (id: any) => {
        if (!hasPrivilege(Privileges.CAN_DELETE_ACADEMY_DOCUMENTS)) {
          return;
        }
        const res = await DeleteFolder(id);
        if (res.status === 200) {
          toast.success(`Successfully deleted a folder`, { duration: 5000 });
          window.location.reload();
        } else toast.error(`Failed to delete a folder`, { duration: 5000 });
        // setWasChanged(true);
        window.location.reload();
      },
    },
  ];
  // const handleClick = () => {};
  const handleSearch = (e: any) => {
    setSearch(e.target.value.trim());
    // setWasChanged(true);
  };
  const handleRename = async () => {
    if (renameVal.name.length === 0) {
      toast.error(`Name Can't be empty`, { duration: 5000 });
      return;
    }
    const res = await UpdateFolder(renameVal.name, renameVal.id);

    if (res.status === 'OK') {
      setRename(false);
      setRenameVal((prev) => {
        return { ...prev, name: '', refetch: true };
      });
      toast.success(`Successfully Renamed`, { duration: 5000 });
    } else toast.error(`Failed to rename`, { duration: 5000 });
  };

  return (
    <>
      <PopupMolecule open={rename}>
        <input
          style={{
            marginRight: '0.5rem',
            height: '40px',
            border: 'solid 2px',
          }}
          value={renameVal.name}
          name={'Rename'}
          ref={RenameRef}
          onChange={(e: any) =>
            setRenameVal((prev) => {
              return { ...prev, name: e.target.value };
            })
          }
        />
        <Button style={{ marginTop: '1rem' }} onClick={handleRename}>
          Rename
        </Button>
      </PopupMolecule>
      <TableHeader title="Folders" totalItems={folders.length} showSearch={false}>
        <div className="flex items-end">
          {hasPrivilege(Privileges.CAN_UPLOAD_ACADEMY_DOCUMENTS) && (
            <Link to={`${url}/add`}>
              <Button>Add Folder</Button>
            </Link>
          )}
          <button style={{ marginLeft: '4rem' }} onClick={() => setViewIcon(!viewIcon)}>
            <Icon name={'switch'} />
          </button>
        </div>
      </TableHeader>
      <input
        style={{
          padding: '8px',
          boxShadow: 'inset 0 0 0 1px black',
          marginBottom: '10px',
        }}
        value={search}
        ref={inputRef}
        placeholder="Search"
        onChange={handleSearch}
      />
      {isLoading && <Loader />}
      {isLoading === false && folders.length === 0 ? (
        <NoDataAvailable
          title={'No data available'}
          icon="user"
          description={'Please add some data'}
          showButton={false}
        />
      ) : (
        ''
      )}
      {hasPrivilege(Privileges.CAN_ACCESS_ACADEMY_DOCUMENTS_FOLDERS) &&
      viewIcon &&
      folders.length > 0 ? (
        <div
          className="rounded border-2 border-[#e9ecef] flex flex-col gap-7 p-6 bg-main"
          style={{
            display: 'grid',
            gridTemplateColumns:
              ' fit-content(8ch) fit-content(8ch) fit-content(8ch) fit-content(8ch) fit-content(8ch) fit-content(8ch) fit-content(8ch)  fit-content(8ch) fit-content(8ch) fit-content(8ch) fit-content(8ch) 1fr',
            gridRowGap: '10px',
            gridColumnGap: '10px',
          }}>
          {folders.map((elem: any) => {
            return (
              <ul
                key={elem.id}
                style={{
                  // border: '1px solid green',
                  //   border: '2px solid',
                  maxWidth: '50%',
                  height: '100%',

                  display: 'inline-block',
                  marginTop: '4%,0,0,0',
                  padding: '0',
                }}>
                <li
                  style={{
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => history.push(`/dashboard/academydocuments/${elem.id}`)}>
                  <div
                    style={{
                      height: '100px',
                      width: '100px',
                      // border: '1px solid red',
                      display: 'inline-block',
                    }}>
                    <img src={folderImage} alt="" />
                    <p>{elem.name}</p>
                  </div>
                </li>
              </ul>
            );
          })}
        </div>
      ) : (
        ''
      )}

      {hasPrivilege(Privileges.CAN_ACCESS_ACADEMY_DOCUMENTS_FOLDERS) &&
      !viewIcon &&
      folders.length > 0 ? (
        <Table<any>
          hide={['id', 'academy']}
          data={searchRes.length === 0 || clear === false ? folders : searchRes}
          uniqueCol={'id'}
          actions={actions}
        />
      ) : (
        ''
      )}
    </>
  );
}
