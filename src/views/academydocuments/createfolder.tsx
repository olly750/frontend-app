import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
// import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import CreateFolderStructure from '../../store/academicDocuments/CreateFolder';
// import academyStore from '../../store/administration/academy.store';
export default function CreateFolder() {
  // const { user } = useAuthenticator();
  const picked_role = usePickedRole();
  // if (user?.institution_id) {
  //   const academy_info = academyStore.getAcademiesByInstitution(user?.institution_id).data
  //     ?.data;
  //   // console.log(academy_info);
  // }

  const [folder, setFolder] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [postData, setPostdata] = useState(false);
  useEffect(() => {
    const SubmitForm = async () => {
      // if (folder.length === 0) {
      //   setPostdata(true);
      //   toast.error(`Name can't be empty`, { duration: 5000 });
      //   return;
      // }
      setDisabled(true);
      setPostdata(false);
      const res = await CreateFolderStructure(folder, picked_role?.academy_id);
      setDisabled(false);
      setFolder('');

      if (res.status === 'OK') {
        toast.success(`Successfully created a folder`, { duration: 5000 });
      } else toast.error(`Failed to create a folder`, { duration: 5000 });
    };

    if (postData) {
      SubmitForm();
    }
  });

  const history = useHistory();
  const handleInput = (e: any) => {
    setFolder(e.value);
  };

  return (
    <>
      <PopupMolecule title={'Create Folder'} open onClose={history.goBack}>
        <InputMolecule
          handleChange={(e) => handleInput(e)}
          name="folder"
          placeholder="folder name"
          value={folder}
        />
        <Button
          disabled={disabled}
          onClick={() => {
            if (folder.length === 0) {
              toast.error(`Name can't be empty`, { duration: 5000 });
            } else {
              setPostdata(true);
            }
          }}>
          Save
        </Button>
      </PopupMolecule>
    </>
  );
}
