import moment from 'moment';
import React from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';

import Badge from '../../../components/Atoms/custom/Badge';
import Button from '../../../components/Atoms/custom/Button';
import Icon from '../../../components/Atoms/custom/Icon';
import Panel from '../../../components/Atoms/custom/Panel';
import Heading from '../../../components/Atoms/Text/Heading';
import Accordion from '../../../components/Molecules/Accordion';
import { experienceStore } from '../../../store/administration/experience.store';
import { PersonInfo } from '../../../types/services/user.types';
import { titleCase } from '../../../utils/getOption';

function EducationBackgroundCard({ person }: { person: PersonInfo }) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const experience =
    experienceStore.getPersonExperiences(person.id + '').data?.data.data || [];
  return (
    <div className="max-w-sm py-4 px-6 bg-main rounded-md max-h-full overflow-auto">
      <Heading fontWeight="semibold" fontSize="base" className="pt-6 pb-7">
        Experiences
      </Heading>
      <div className="flex flex-col items-end -mt-16 mb-6">
        <Button
          styleType="outline"
          color="primary"
          className="px-0"
          onClick={() => history.push(`${url}/new-experience`)}>
          Add
        </Button>
      </div>
      {experience.length === 0 ? (
        <Badge
          fontWeight="medium"
          badgecolor="secondary"
          badgetxtcolor="txt-secondary"
          fontSize="sm"
          className="mx-2">
          Experiences are currently not specificied
        </Badge>
      ) : (
        <Accordion>
          {experience.map((exp) => (
            <Panel
              bgColor="secondary"
              key={exp.id}
              title={titleCase(exp.type.replaceAll('_', ' '))}>
              <div className="flex text-sm py-2">
                <p className="text-txt-secondary pr-2">Level: </p>
                <p className="text-txt-primary px-2">{exp.level}</p>
              </div>
              <div className="flex text-sm py-2">
                <p className="text-txt-secondary pr-1">Occupation: </p>
                <p className="text-txt-primary px-2">{exp.occupation}</p>
              </div>
              <div className="flex text-sm py-2">
                <p className="text-txt-secondary pr-1">Location: </p>
                <p className="text-txt-primary px-2">{exp.location}</p>
              </div>
              <div className="flex text-sm py-2">
                <p className="text-txt-secondary pr-1">Description: </p>
                <p className="text-txt-primary px-2">{exp.description}</p>
              </div>
              <div className="flex text-sm py-2">
                <p className="text-txt-secondary pr-2">From: </p>
                <p className="text-txt-primary px-2">
                  {moment(exp.start_date).format('ddd, YYYY-MM-DD')}
                </p>
              </div>
              <div className="flex text-sm pt-2">
                <p className="text-txt-secondary pr-1">To: </p>
                <p className="text-txt-primary px-2">
                  {moment(exp.end_date).format('ddd, YYYY-MM-DD')}
                </p>
              </div>
              <div className="flex text-sm py-2">
                <p className="text-txt-secondary pr-1">Documentation title: </p>
                <p className="text-txt-primary px-2">{exp.proof}</p>
              </div>
              <div className="flex flex-col items-end">
                <Link to={`${url}/edit-experience/${exp.id}`}>
                  <Button icon styleType="text">
                    <Icon name="edit" size={20} />
                  </Button>
                </Link>
              </div>
            </Panel>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default EducationBackgroundCard;
