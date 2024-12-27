import React, { FormEvent, useEffect, useState } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

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
// import InputMolecule from '../../../../../Molecules/input/InputMolecule';
import PopupMolecule from '../../../../../Molecules/Popup';
import UpdatePassword from './UpdatePassword';

interface Account<E> extends CommonStepProps, CommonFormProps<E> {
  user?: UserInfo;
}

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

function UpdateAccountDetails<E>({
  display_label,
  prevStep,
  isVertical,
  nextStep,
  user,
}: Account<E>) {
  const { url, path } = useRouteMatch();
  const history = useHistory();

  const [accountDetails, setAccountDetails] = useState<AccountDetail>({
    username: '',
    email: '',
    pin: 0,
    phone: '',
    // password: '',
    // doc_type: '',
    // confirm_password: '',
    send_communication_msg: SendCommunicationMsg.EMAIL,
  });

  const [errors, setErrors] = useState<AccountDetailsErrors>({
    username: '',
    email: '',
    phone: '',
    pin: '',
    send_communication_msg: '',
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

  const [userInfo] = useState<UserInfo>(getLocalStorageData('user'));

  //when information change from the backend
  useEffect(() => {
    let personInfo = user;
    personInfo &&
      !userInfo &&
      setAccountDetails((old) => {
        return { ...old, ...personInfo };
      });
  }, [user, userInfo]);

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
          <Button type="submit">Save & Finish</Button>
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

export default UpdateAccountDetails;
