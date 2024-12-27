import React from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';

import Avatar from '../../../components/Atoms/custom/Avatar';
import Badge from '../../../components/Atoms/custom/Badge';
import Button from '../../../components/Atoms/custom/Button';
import Icon from '../../../components/Atoms/custom/Icon';
import Heading from '../../../components/Atoms/Text/Heading';
import ILabel from '../../../components/Atoms/Text/ILabel';
import usernextkinStore from '../../../store/administration/usernextkin.store';
import { GenericStatus } from '../../../types';
import { UserInfo } from '../../../types/services/user.types';

function NextOfKinCard({ user }: { user: UserInfo }) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { data: nextOfKin } = usernextkinStore.getHisNextKinById(user.id + '');
  const unDeletedNextOfKins =
    nextOfKin?.data.data.filter((kin) => kin.generic_status !== GenericStatus.DELETED) ||
    [];

  return (
    <div className="max-w-sm py-4 px-6 bg-main rounded-md max-h-80 overflow-auto">
      <Heading fontWeight="semibold" fontSize="base" className="pt-6 pb-7">
        Next of Kin
      </Heading>
      <div className="flex flex-col items-end -mt-16 mb-6 ">
        <Button
          styleType="outline"
          color="primary"
          className="px-0"
          onClick={() => history.push(`${url}/${user.id}/add-next-kin`)}>
          Add
        </Button>
      </div>
      {unDeletedNextOfKins.length === 0 ? (
        <Badge
          fontWeight="medium"
          badgecolor="secondary"
          badgetxtcolor="txt-secondary"
          fontSize="sm"
          className="mx-2">
          The next of kins for this user are currently not specificied
        </Badge>
      ) : (
        unDeletedNextOfKins.map((kin) => (
          <div key={kin.id} className="flex justify-evenly h-16 w-full items-center mb-6">
            <Avatar src="/images/default-pic.png" alt="person logo" size="48" />
            <div className="flex flex-col">
              <div>
                <p>
                  <ILabel size="sm" weight="semibold" color="primary">
                    {kin.next_of_kin.first_name + ' ' + kin.next_of_kin.last_name}
                  </ILabel>
                </p>
                <p className="text-txt-secondary text-sm py">{kin.next_of_kin.email}</p>
                <p className="text-txt-secondary text-sm py">
                  {kin.next_of_kin.place_of_residence}
                </p>
              </div>
              <div>
                <p>
                  <ILabel size="sm" weight="medium" color="primary">
                    {kin.next_of_kin.relationship}
                  </ILabel>
                </p>
                <p className="text-txt-primary font-semibold py-2 text-sm">
                  {kin.next_of_kin.phone_number}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end mt-2">
              <Link to={`${url}/remove-next-kin/${user.id}/${kin.id}`}>
                <Button icon styleType="text">
                  <Icon name="close" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NextOfKinCard;
