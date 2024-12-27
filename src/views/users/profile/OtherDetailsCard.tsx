import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Badge from '../../../components/Atoms/custom/Badge';
import Button from '../../../components/Atoms/custom/Button';
import Icon from '../../../components/Atoms/custom/Icon';
import Heading from '../../../components/Atoms/Text/Heading';
import diseasesStore from '../../../store/administration/diseases.store';
import hobbiesStore from '../../../store/administration/hobbies.store';
import languagesStore from '../../../store/administration/languages.store';
import { UserInfo } from '../../../types/services/user.types';

export default function OtherDetailsCard({ user }: { user: UserInfo }) {
  const hobbies =
    hobbiesStore.getUserHobby(user.person?.id.toString() || '').data?.data.data || [];
  const chronicDiseases =
    diseasesStore.getPersonDisease(user.person?.id.toString() || '').data?.data.data ||
    [];
  const languages =
    languagesStore.getLanguageByPerson(user.person?.id.toString() || '').data?.data
      .data || [];
  const { url } = useRouteMatch();
  const history = useHistory();

  return (
    <div className="max-w-sm py-4 px-6 bg-main rounded-md">
      <Heading fontWeight="semibold" fontSize="base" className="pb-5">
        Other Personal Information
      </Heading>
      <div className="flex flex-col gap-6">
        <div className="other-information bg-secondary py-5">
          <div className="flex items-center justify-between">
            <Heading fontWeight="semibold" fontSize="base" className="px-5 py-2">
              Languages
            </Heading>
            <Button
              styleType="text"
              icon
              color="primary"
              className="pr-6"
              onClick={() => history.push(`${url}/add-language/${user.person?.id}`)}>
              <Icon name="add" size={18} fill={'primary'} useheightandpadding={false} />{' '}
              add
            </Button>
          </div>
          <div>
            {languages?.length === 0 ? (
              <Badge
                fontWeight="medium"
                fontSize="sm"
                badgecolor="main"
                badgetxtcolor="txt-secondary"
                className="mx-2">
                Languages are currently not specificied
              </Badge>
            ) : (
              languages?.map((lang) => (
                <Badge
                  key={lang.id}
                  badgecolor="main"
                  badgetxtcolor="txt-secondary"
                  className="mx-2">
                  {lang.name}
                </Badge>
              ))
            )}
          </div>
        </div>
        <div className="other-information bg-secondary pb-5">
          <div className="flex items-center justify-between">
            <Heading fontWeight="semibold" fontSize="base" className="px-5 py-2">
              Hobbies
            </Heading>
            <Button
              styleType="text"
              icon
              color="primary"
              className="pr-6"
              onClick={() => history.push(`${url}/add-hobby/${user.person?.id}`)}>
              <Icon name="add" size={18} fill={'primary'} useheightandpadding={false} />{' '}
              add
            </Button>
          </div>
          <div>
            {hobbies?.length === 0 ? (
              <Badge
                fontWeight="medium"
                fontSize="sm"
                badgecolor="main"
                badgetxtcolor="txt-secondary"
                className="mx-2">
                Hobbies are currently not specificied
              </Badge>
            ) : (
              hobbies?.map((hobby) => (
                <Badge
                  key={hobby.id}
                  badgecolor="main"
                  badgetxtcolor="txt-secondary"
                  className="mx-2">
                  {hobby.name}
                </Badge>
              ))
            )}
          </div>
        </div>
        <div className="other-information bg-secondary pb-3">
          <div className="flex items-center justify-between">
            <Heading fontWeight="semibold" fontSize="base" className="px-5 py-2">
              Chronic Disease
            </Heading>
            <Button
              styleType="text"
              icon
              color="primary"
              className="pr-6"
              onClick={() => history.push(`${url}/add-chronic/${user.person?.id}`)}>
              <Icon name="add" size={18} fill={'primary'} useheightandpadding={false} />{' '}
              add
            </Button>
          </div>
          <div>
            {chronicDiseases?.length === 0 ? (
              <Badge
                fontWeight="medium"
                badgecolor="main"
                fontSize="sm"
                badgetxtcolor="txt-secondary"
                className="mx-2">
                Chronic diseases are currently not specificied
              </Badge>
            ) : (
              chronicDiseases?.map((dis) => (
                <Badge
                  key={dis.id}
                  badgecolor="main"
                  badgetxtcolor="txt-secondary"
                  className="mx-2">
                  {dis.disease.name}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
