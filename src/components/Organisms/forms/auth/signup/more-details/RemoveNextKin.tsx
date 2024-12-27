import React from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import { queryClient } from '../../../../../../plugins/react-query';
import usernextkinStore from '../../../../../../store/administration/usernextkin.store';
import {
  BasicPersonInfo,
  DocType,
  GenderStatus,
  MaritalStatus,
} from '../../../../../../types/services/user.types';
import Confirmation from '../../../../../Molecules/Confirmation';
import ConfirmationOrganism from '../../../../ConfirmationOrganism';

interface KinParam {
  userId: string;
  kinid: string;
}

export default function RemoveNextKin() {
  const { userId, kinid } = useParams<KinParam>();
  const { mutate } = usernextkinStore.removeUserNextKin();

  const { data: next_of_kin } = usernextkinStore.getHisNextKinById(userId);

  const nextKinToUpdate = next_of_kin?.data.data.find((kin) => kin.id == kinid);

  const history = useHistory();

  const removeKin = () => {
    let payload: BasicPersonInfo = {
      id: kinid,
      user_id: userId,
      first_name: nextKinToUpdate?.next_of_kin.first_name || '',
      last_name: nextKinToUpdate?.next_of_kin.last_name || '',
      email: nextKinToUpdate?.next_of_kin.email || '',
      phone_number: nextKinToUpdate?.next_of_kin.phone_number || '',
      sex:
        nextKinToUpdate?.next_of_kin.sex == null
          ? GenderStatus.MALE
          : nextKinToUpdate?.next_of_kin.sex,
      birth_date: nextKinToUpdate?.next_of_kin.birth_date || '',
      relationship: nextKinToUpdate?.next_of_kin.relationship || '',
      residence_location_id: nextKinToUpdate?.residence_id || 0,
      doc_type:
        nextKinToUpdate?.next_of_kin.doc_type == null
          ? DocType.NID
          : nextKinToUpdate?.next_of_kin.doc_type,
      document_expire_on: nextKinToUpdate?.next_of_kin.document_expire_on || '',
      nid: nextKinToUpdate?.next_of_kin.nid || '',
      place_of_residence: nextKinToUpdate?.next_of_kin.place_of_residence || '',
      marital_status: nextKinToUpdate?.next_of_kin.marital_status || MaritalStatus.SINGLE,
      spouse_name: nextKinToUpdate?.next_of_kin.spouse_name || '',
      nationality: '',
    };
    if (nextKinToUpdate) {
      mutate(
        {
          user_id: userId,
          next_of_kins: [payload],
        },
        {
          onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['next/user_id', userId]);
            //if user is already logged in, redirect to user profile else redirect to login
            history.push(`/dashboard/user/${userId}/profile`);
          },
          onError(_error) {
            toast.error('Failed');
          },
        },
      );
    }
  };

  return (
    <Confirmation
      onConfirmationSubmit={removeKin}
      onConfirmationClose={() => history.goBack()}
      showConfirmation
      title={'Remove next of kin'}
      noLabel="No"
      yesLabel="Yes">
      Are you sure you want to remove this next of kin?
    </Confirmation>
  );
}
