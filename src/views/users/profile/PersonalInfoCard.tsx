import moment from 'moment';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Avatar from '../../../components/Atoms/custom/Avatar';
import Badge from '../../../components/Atoms/custom/Badge';
import Button from '../../../components/Atoms/custom/Button';
import Icon from '../../../components/Atoms/custom/Icon';
import Heading from '../../../components/Atoms/Text/Heading';
import InputMolecule from '../../../components/Molecules/input/InputMolecule';
import PopupMolecule from '../../../components/Molecules/Popup';
import useAuthenticator from '../../../hooks/useAuthenticator';
import usePickedRole from '../../../hooks/usePickedRole';
import locationStore from '../../../store/administration/location.store';
import usersStore from '../../../store/administration/users.store';
import UpdateAlias from '../../../store/aliasname';
import { ParamType, Privileges } from '../../../types';
import { DocType, MaritalStatus, UserInfo } from '../../../types/services/user.types';
import { usePicture } from '../../../utils/file-util';
import { advancedTypeChecker, titleCase } from '../../../utils/getOption';

function PersonalInfoCard({ user }: { user: UserInfo }) {
  const [canAddAlias, setCanAddAlias] = useState(false);
  const [alias, setAlias] = useState({ alias_first_name: '', alias_last_name: '' });
  const { id } = useParams<ParamType>();
  const picked_role = usePickedRole();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const { url } = useRouteMatch();
  const history = useHistory();

  const { user: authUser } = useAuthenticator();

  const residence = locationStore.getLocationsById(
    user.person?.residence_location_id + '',
  ).data?.data.data;

  const place_of_birth = locationStore.getLocationsById(
    user.person?.place_of_birth_id + '',
  ).data?.data.data;
  function handleChange(e: any) {
    // if (e.name == 'alias_first_name') {
    //   setAlias({ alias_first_name: e.value, });
    // }
    // if (e.name == 'alias_last_name') {
    //   setAlias((prev) => {
    //     return { alias_last_name: e.value };
    //   });
    // }

    setAlias((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }
  // console.log(user.person);
  const handleSubmit = async () => {
    const res = await UpdateAlias(user.person?.id, {
      aFName: alias.alias_first_name,
      aLName: alias.alias_last_name,
    });
    // console.log(res);
    if (res.status == 200) {
      toast.success(`Successfully added alias`, { duration: 5000 });
      setCanAddAlias(false);
      window.location.reload();
    } else toast.error(`Failed`, { duration: 5000 });
  };

  return (
    <>
      <div className="max-w-sm py-4 px-6 bg-main rounded-md">
        {user.generic_status && (
          <div className="grid grid-cols-1 md:grid-cols-2 mb-20">
            <div>
              <Link to={`${url}/edit-compl-prof`}>
                <Icon name="edit" className="-rotate-90" stroke="primary" />
              </Link>
            </div>
            <div className="px-24 py-2">
              <Badge badgecolor={advancedTypeChecker(user.generic_status)}>
                {user.generic_status}
              </Badge>
            </div>
          </div>
          //   <div className="flex flex-col items-end mt-8">

          // </div>
        )}
        <div className="bg-secondary py-5 flex flex-col justify-center items-center">
          <div className="relative  border-primary-400">
            <Avatar
              className="border-4 object-cover border-primary-500 -mt-20"
              size="120"
              src={usePicture(user.profile_attachment_id, user.id)}
              alt="photo"
            />

            {Privileges.CAN_UPDATE_USER_PROFILE_PICTURE && (
              <div className="absolute top-0 right-0">
                <Button
                  styleType="text"
                  type="button"
                  onClick={() => history.push(`${url}/edit-prof`)}>
                  <Icon
                    bgColor="main"
                    size={20}
                    useheightandpadding={false}
                    className="rounded-2xl p-5"
                    fill="primary"
                    name="camera"
                  />
                </Button>
              </div>
            )}

            {/* {authUser?.id === id && (
              <div className="absolute top-0 right-0">
                <Button
                  styleType="text"
                  type="button"
                  onClick={() => history.push(`${url}/edit-prof`)}>
                  <Icon
                    bgColor="main"
                    size={20}
                    useheightandpadding={false}
                    className="rounded-2xl p-5"
                    fill="primary"
                    name="camera"
                  />
                </Button>
              </div>
            )} */}
          </div>
          <div className="flex flex-col justify-center items-center py-7">
            <Heading fontSize="lg" fontWeight="semibold">
              {user.person?.current_rank?.abbreviation || ''}{' '}
              {user.person?.first_name + ' ' + user.person?.last_name}
            </Heading>
            {/* <p className="py-2 font-normal text-sm border-b-2 text-txt-secondary">
              {titleCase(user.user_type).replaceAll('_', ' ')}
            </p> */}
            <p className="py-2 font-medium text-sm">{user.email}</p>
            <p className="py-2 font-medium text-sm">{user.phone}</p>
            {hasPrivilege(Privileges.CAN_HAVE_ALIAS) &&
            user.person?.alias_first_name == null &&
            user.person?.alias_last_name == null ? (
              <Button onClick={() => setCanAddAlias(true)}>Add Alias</Button>
            ) : (
              ''
            )}
          </div>
          {canAddAlias && (
            <PopupMolecule open={true} onClose={() => setCanAddAlias(false)}>
              <InputMolecule
                // error={errors.first_name}
                name="alias_first_name"
                placeholder="First alias"
                value={alias.alias_first_name}
                handleChange={handleChange}>
                First Alias
              </InputMolecule>
              <InputMolecule
                // error={errors.first_name}
                name="alias_last_name"
                placeholder="Second alias"
                value={alias.alias_last_name}
                handleChange={handleChange}>
                Second Alias
              </InputMolecule>
              {/* <input
              style={{
                marginRight: '0.5rem',
                height: '40px',
                border: 'solid 2px',
              }}
              value={''}
              name={'First ALias'}
              // ref={RenameRef}
              // onChange={(e: any) =>
              //   setRenameVal((prev) => {
              //     return { ...prev, name: e.target.value };
              //   })
              // }
            /> */}
              <Button style={{ marginTop: '1rem' }} onClick={handleSubmit}>
                Save
              </Button>
            </PopupMolecule>
          )}
        </div>
        <div className="personal-information py-6">
          <Heading fontWeight="semibold" fontSize="base" className="pb-5">
            Personal Information
          </Heading>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Enter in system</p>
            <p className="py-3">{moment(user.created_on).format('ddd, YYYY-MM-DD')}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Service number</p>
            <p className="py-3">{user.person?.service_number || '----'}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Date of birth</p>
            <p className="py-2">{user.person?.birth_date || '----'}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-sm">Place of birth / Origin</p>
            {place_of_birth && user.person?.place_of_birth === 'Rwanda' ? (
              <p className="py-2 text-sm">
                {place_of_birth?.parent?.parent?.parent?.parent?.parent?.name},{' '}
                {place_of_birth?.parent?.parent?.parent?.name} -{' '}
                {place_of_birth?.parent?.parent?.name} - {place_of_birth?.parent?.name} -{' '}
                {place_of_birth?.name}
              </p>
            ) : (
              <p className="py-2">{user.person?.place_of_birth || '----'}</p>
            )}
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Birth description</p>
            <p className="py-2">{user.person?.place_of_birth_description || '----'}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Education level</p>
            <p className="py-2">
              {user.person?.education_level?.toLowerCase() || '----'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Gender</p>
            <p className="py-2">{user.person?.sex || '----'}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Marital Status</p>
            <p className="py-2">
              {user.person ? titleCase(user.person.marital_status) || '----' : '----'}
            </p>
          </div>
          {user.person?.marital_status === MaritalStatus.WIDOWED ||
          user.person?.marital_status === MaritalStatus.MARRIED ? (
            <div className="flex items-center gap-6">
              <p className="py-2 text-txt-secondary text-base">Spouse Name</p>
              <p className="py-2">{user.person?.spouse_name || '----'}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">
              {user.person?.doc_type.replaceAll('_', ' ')}
            </p>
            <p className="py-2">{user.person?.nid}</p>
          </div>
          {user.person?.doc_type === DocType.PASSPORT ? (
            <div className="flex items-center gap-6">
              <p className="py-2 text-txt-secondary text-base">Passport Expiry Date</p>
              <p className="py-2">{user.person?.document_expire_on || '-----'}</p>
            </div>
          ) : null}
          {user.person?.religion && (
            <div className="flex items-center gap-6">
              <p className="py-2 text-txt-secondary text-base">Religion</p>
              <p className="py-2">
                {user.person.religion || '----'} <br />
              </p>
            </div>
          )}
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Blood group</p>
            <p className="py-2">
              {user.person?.blood_group || '----'} <br />
            </p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Father&apos;s names</p>
            <p className="py-2">{user.person?.father_names || '----'}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-base">Mother&apos;s names</p>
            <p className="py-2">{user.person?.mother_names || '----'}</p>
          </div>
          <div className="flex items-center gap-6">
            <p className="py-2 text-txt-secondary text-sm">Residence Address</p>
            {residence && user.person?.place_of_residence === 'Rwanda' ? (
              <p className="py-2 text-sm">
                {residence?.parent?.parent?.parent?.parent?.parent?.name},{' '}
                {residence?.parent?.parent?.parent?.name} -{' '}
                {residence?.parent?.parent?.name} - {residence?.parent?.name} -{' '}
                {residence?.name}
              </p>
            ) : (
              <p className="py-2"> {user.person?.place_of_residence || '----'}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PersonalInfoCard;
