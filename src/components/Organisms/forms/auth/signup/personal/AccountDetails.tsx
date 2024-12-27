import React, { FormEvent, useEffect, useState } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import usersStore from '../../../../../../store/administration/users.store';
import { CommonFormProps, CommonStepProps, ValueType } from '../../../../../../types';
import {
  AccountDetail,
  SendCommunicationMsg,
  UserInfo,
} from '../../../../../../types/services/user.types';
import {
  getLocalStorageData,
  setLocalStorageData,
} from '../../../../../../utils/getLocalStorageItem';
import { getDropDownStatusOptions } from '../../../../../../utils/getOption';
import { accountDetailsSchema } from '../../../../../../validations/complete-profile/complete-profile.validation';
import Button from '../../../../../Atoms/custom/Button';
import Heading from '../../../../../Atoms/Text/Heading';
import DropdownMolecule from '../../../../../Molecules/input/DropdownMolecule';
import InputMolecule from '../../../../../Molecules/input/InputMolecule';
import PopupMolecule from '../../../../../Molecules/Popup';
import UpdatePassword from './UpdatePassword';

interface Account<E> extends CommonStepProps, CommonFormProps<E> {}

interface AccountDetailsErrors {
  username: string;
  pin: string;
  send_communication_msg: string;
  email: string;
  phone: string;
}

const initialErrorState: AccountDetailsErrors = {
  username: '',
  pin: '',
  send_communication_msg: '',
  email: '',
  phone: '',
};

function AccountDetails<E>({
  display_label,
  prevStep,
  isVertical,
  nextStep,
  fetched_id,
}: Account<E>) {
  const { url, path } = useRouteMatch();
  const history = useHistory();

  const [accountDetails, setAccountDetails] = useState<AccountDetail>({
    username: '',
    pin: 0,
    email: '',
    phone: '',
    // password: '',
    // doc_type: '',
    // confirm_password: '',
    send_communication_msg: SendCommunicationMsg.EMAIL,
  });

  const [errors, setErrors] = useState<AccountDetailsErrors>({
    username: '',
    pin: '',
    send_communication_msg: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: ValueType) => {
    setAccountDetails({ ...accountDetails, [e.name]: e.value });
  };
  const moveBack = () => {
    prevStep && prevStep();
  };
  const moveForward = (e: FormEvent) => {
    e.preventDefault();
    let data: any = getLocalStorageData('user');
    let newObj = Object.assign({}, data, accountDetails);

    Object.keys(newObj).map((val) => {
      if (!newObj[val]) newObj[val] = '';
    });

    const validatedForm = accountDetailsSchema.validate(accountDetails, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        setLocalStorageData('user', newObj);
        nextStep(true);
      })
      .catch((err) => {
        const validatedErr: AccountDetailsErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof AccountDetailsErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };
  const user = usersStore.getUserById(fetched_id?.toString() || '');
  const [userInfo] = useState<UserInfo>(getLocalStorageData('user'));

  //when information change from the backend
  useEffect(() => {
    let personInfo = user.data?.data.data;
    personInfo &&
      !userInfo &&
      setAccountDetails((old) => {
        return { ...old, ...personInfo };
      });
  }, [user.data?.data.data, userInfo]);

  //when user comes back to this step
  useEffect(() => {
    setAccountDetails((old) => {
      {
        return { ...old, ...userInfo };
      }
    });
  }, [userInfo]);

  return (
    <div className="flex flex-col gap-4">
      {!isVertical && (
        <Heading fontSize="base" fontWeight="semibold">
          {display_label}
        </Heading>
      )}
      <form onSubmit={moveForward}>
        <div className="flex flex-col gap-4">
          <DropdownMolecule
            error={errors.send_communication_msg}
            hasError={errors.send_communication_msg !== ''}
            handleChange={handleChange}
            name="send_communication_msg"
            placeholder="Select way of communication"
            defaultValue={getDropDownStatusOptions(SendCommunicationMsg).find(
              (msg) => msg.value === accountDetails.send_communication_msg,
            )}
            options={getDropDownStatusOptions(SendCommunicationMsg)}>
            How would you like to be communicated?
          </DropdownMolecule>
          <InputMolecule
            required={false}
            error={errors.username}
            name="username"
            placeholder="username"
            value={accountDetails.username}
            handleChange={handleChange}>
            Username
          </InputMolecule>
          <InputMolecule
            required={false}
            type={'email'}
            error={errors.email}
            name="email"
            placeholder="email"
            value={accountDetails.email}
            handleChange={handleChange}>
            Email
          </InputMolecule>
          <InputMolecule
            required={false}
            error={errors.phone}
            name="phone"
            placeholder="Phone number"
            value={accountDetails.phone}
            handleChange={handleChange}>
            Phone number
          </InputMolecule>
          <Link to={`${url}/update-password`}>
            <Button>Update Password</Button>
          </Link>
        </div>
        <div className="flex justify-between w-80">
          {prevStep && (
            <Button
              styleType="text"
              hoverStyle="no-underline"
              color="txt-secondary"
              onClick={() => moveBack()}>
              Back
            </Button>
          )}
          <Button type="submit">Save</Button>
        </div>
      </form>
      <Switch>
        {/* update password */}
        <Route
          exact
          path={`${path}/update-password`}
          render={() => {
            return (
              <PopupMolecule title="Update Password" open={true} onClose={history.goBack}>
                <UpdatePassword onSubmit={() => {}} />
              </PopupMolecule>
            );
          }}
        />
      </Switch>
    </div>
  );
}

export default AccountDetails;
