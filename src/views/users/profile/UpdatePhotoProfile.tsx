import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import Avatar from '../../../components/Atoms/custom/Avatar';
import Button from '../../../components/Atoms/custom/Button';
import Icon from '../../../components/Atoms/custom/Icon';
import FileUploader from '../../../components/Atoms/Input/FileUploader';
import Heading from '../../../components/Atoms/Text/Heading';
import usersStore from '../../../store/administration/users.store';
import { UserInfo } from '../../../types/services/user.types';
import { fileToBlob, getImage, invalidateCacheImage } from '../../../utils/file-util';

function UpdatePhotoProfile({ user }: { user: UserInfo }) {
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const { mutateAsync: mutateAddProfile, isLoading } = usersStore.addProfile();

  const handleUpload = async (files: FileList | null) => {
    setProfileFile(files ? files[0] : null);
    if (files) setProfileSrc(URL.createObjectURL(await fileToBlob(files[0])));
  };

  const [profileSrc, setProfileSrc] = useState('/images/default-pic.png');

  useEffect(() => {
    if (user.profile_attachment_id)
      getImage(user.profile_attachment_id, user.id.toString(), 'profile').then(
        (imageSrc) => {
          if (imageSrc) setProfileSrc(imageSrc);
        },
      );
  }, [user]);

  const history = useHistory();

  async function handleSubmit() {
    if (profileFile !== null) {
      let toastId = toast.loading('Uploading photo....');
      let data = new FormData();

      data.append('description', `${user.username} s public logo`);
      data.append('purpose', 'Add an identifier for user');
      data.append('profileFile', profileFile);

      await mutateAddProfile(
        { id: user.id + '', info: data },
        {
          onSuccess(data) {
            toast.success('succesfully uploaded', { id: toastId });
            invalidateCacheImage(
              data.data.profile_attachment_id,
              user.id.toString(),
            ).then((img) => {
              if (img) setProfileSrc(img);
              history.goBack();
            });
          },
          onError(error: any) {
            toast.error(error.response.data.message, { id: toastId });
          },
        },
      );
    } else {
      toast.error('No file uploaded');
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Heading className="py-4">
        {`${user.person?.current_rank?.abbreviation || ''}  ${
          user.first_name + ' ' + user.last_name
        }`}
        &apos;s profile
      </Heading>
      <div className="flex flex-col items-center w-32">
        <Avatar
          className="border-4 object-cover border-primary-500"
          size="120"
          src={profileSrc}
          alt="photo"
        />
        <FileUploader
          allowPreview={false}
          handleUpload={handleUpload}
          accept={'image/jpeg, image/png'}>
          <div className="flex flex-col">
            <img
              src={profileSrc || '../../../..//images/fall_back_prof_pic.jpg'}
              alt="profile"
              className="border-4 border-primary-500 max-w-xs max-h-80"
            />
            <Icon
              bgColor="main"
              size={20}
              useheightandpadding={false}
              className="rounded-2xl p-5 self-end mx-3 -mt-12"
              fill="primary"
              name="camera"
            />
          </div>
        </FileUploader>
      </div>
      <Button className="mt-4" isLoading={isLoading} onClick={handleSubmit}>
        Change Profile
      </Button>
    </div>
  );
}

export default UpdatePhotoProfile;
