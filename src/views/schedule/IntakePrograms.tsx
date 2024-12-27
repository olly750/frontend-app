import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link as BrowserLink,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import TableHeader from '../../components/Molecules/table/TableHeader';
import {
  getProgramsByIntake,
  intakeStore,
} from '../../store/administration/intake.store';
import { CommonCardDataType, ParamType, Privileges } from '../../types';
import { advancedTypeChecker } from '../../utils/getOption';
import ProgramLevelClasses from './ProgramsLevelClases';

interface IntakeProgramType extends CommonCardDataType {
  incharge_names: string;
}

export default function IntakePrograms() {
  const { id } = useParams<ParamType>();

  const { t } = useTranslation();

  const { data, isLoading } = getProgramsByIntake(id);
  const intakeInfo = intakeStore.getIntakeById(id).data?.data.data;

  const history = useHistory();
  const { path, url } = useRouteMatch();

  let programs: IntakeProgramType[] = [];

  data?.data.data.map((p) => {
    let prog: IntakeProgramType = {
      id: p.id,
      status: {
        type: advancedTypeChecker(p.generic_status),
        text: p.generic_status.toString(),
      },
      code: p.program.code,
      title: p.program.name,
      subTitle: p.program.type.replaceAll('_', ' '),
      description: p.program.description,
      incharge_names: p.program.current_admin_names,
    };

    programs.push(prog);
  });

  return (
    <div>
      <Switch>
        <Route exact path={`${url}/:intakeProgramId`} component={ProgramLevelClasses} />
        <Route
          path={`${path}`}
          render={() => (
            <>
              <TableHeader
                totalItems={`${programs.length} programs`}
                title={isLoading ? 'loading....' : intakeInfo?.title || ''}>
                <div className="flex gap-4">
                  <Permission privilege={Privileges.CAN_CREATE_EVENT}>
                    <BrowserLink to={`/dashboard/schedule/events/new`}>
                      <Button>Add event</Button>
                    </BrowserLink>
                  </Permission>
                  <Permission privilege={Privileges.CAN_CREATE_VENUE}>
                    <BrowserLink to={`/dashboard/schedule/venues/new`}>
                      <Button styleType="outline">Add Venue</Button>
                    </BrowserLink>
                  </Permission>
                </div>
              </TableHeader>
              <div className="mt-4 flex gap-4 flex-wrap">
                {programs.length === 0 && isLoading ? (
                  <Loader />
                ) : (
                  programs.map((program) => (
                    <CommonCardMolecule
                      key={program.id}
                      data={program}
                      handleClick={() => history.push(`${url}/${program.id}`)}>
                      <div className="flex items-center gap-2 pb-6s">
                        <Heading color="txt-secondary" fontSize="sm">
                          {t('Program')} in charge:
                        </Heading>
                        <div className="flex items-center">
                          <Heading fontSize="sm">{program.incharge_names}</Heading>
                        </div>
                      </div>
                    </CommonCardMolecule>
                  ))
                )}
              </div>
            </>
          )}
        />
      </Switch>
    </div>
  );
}
