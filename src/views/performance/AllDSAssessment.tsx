import { Editor } from '@tiptap/react';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import ILabel from '../../components/Atoms/Text/ILabel';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Tiptap from '../../components/Molecules/editor/Tiptap';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import { getClassById } from '../../store/administration/class.store';
import usersStore from '../../store/administration/users.store';
import {
  getDSCriticsReport,
  reportStore,
} from '../../store/evaluation/school-report.store';
import { Privileges, ValueType } from '../../types';
import { DSAssessForm } from '../../types/services/report.types';
import { UserInfo } from '../../types/services/user.types';
import { getDropDownOptions } from '../../utils/getOption';
import DSAssessmentSheet from './DSAssessmentSheet';

interface IParamType {
  classId: string;
}

interface DSTable {
  id: string;
  author: string;
  receiver: string;
  week_number: number;
}

export default function AllDSAssessment() {
  const history = useHistory();

  const { path, url } = useRouteMatch();
  const { classId } = useParams<IParamType>();
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();
  const { data: classInfo } = getClassById(classId);

  let periodOfThisClass = classInfo?.data.data.intake_academic_year_period_id;

  const {
    data: performance,
    isIdle,
    isLoading,
  } = getDSCriticsReport(periodOfThisClass || 0);
  let data: DSTable[] = [];

  performance?.data.data.forEach((record) => {
    if (record.receiver.adminId === user?.id || record.author.adminId === user?.id) {
      let processed: DSTable = {
        id: record.id,
        author: record.author.username,
        receiver: record.receiver.username,
        week_number: record.week,
      };
      data.push(processed);
    }
  });

  const recipients =
    usersStore.getUsersByAcademy(picked_role?.academy_id.toString() || '').data?.data.data
      .content || [];

  function handleSearch(_e: ValueType) {}

  const actions = [
    {
      name: 'View details',
      handleAction: (id: string | number | undefined) => {
        history.push(`${url}/ds-assessment/${id}`); // go to view user profile
      },
    },
  ];

  function handleChange(e: ValueType) {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  }

  function handleLabelChange(editor: Editor) {
    setDetails((details) => ({ ...details, label: editor.getHTML() }));
  }
  function handleValueChange(editor: Editor) {
    setDetails((details) => ({ ...details, value: editor.getHTML() }));
  }

  const [open, setOpen] = useState(false);

  const { mutate, isLoading: isSaving } = reportStore.addDSCritique();

  const [details, setDetails] = useState<DSAssessForm>({
    term: 0,
    label: '',
    receiver: '',
    value: '',
    week: 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (details.receiver === '') {
      toast.error(`Please select recipient is required`);
    } else if (details.label === '') {
      toast.error(`Please enter item of instruction`);
    } else if (details.value === '') {
      toast.error(`Please enter comment`);
    } else if (details.week === 0) {
      toast.error(`Please enter week number`);
    } else {
      mutate(
        { ...details, term: periodOfThisClass || 0 },
        {
          onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries([
              'reports/student/level/critics',
              periodOfThisClass,
            ]);
            setOpen(false);
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        },
      );
    }
  };

  return (
    <Switch>
      <Route
        path={`${path}`}
        exact
        render={() => (
          <>
            <div>
              <div className="flex justify-between mb-5">
                <Button
                  styleType={'text'}
                  onClick={() => history.goBack()}
                  icon
                  className="flex items-center p-2 hover:underline">
                  <Icon name="chevron-left" fill="primary" size={16} />
                  Back
                </Button>
                <Permission privilege={Privileges.CAN_WRITE_WEEKLY_CRITICS}>
                  <Button
                    styleType="outline"
                    onClick={() => {
                      setOpen(!open);
                    }}>
                    Write DS Critics
                  </Button>
                </Permission>
              </div>
              {isIdle || isLoading ? (
                <Loader />
              ) : data.length === 0 ? (
                <NoDataAvailable
                  icon="academy"
                  fill={false}
                  showButton={false}
                  title={'DS Critics report has not been processed'}
                  description="This report has not been processed yet or you are currently not allowed to see it"
                  privilege={Privileges.CAN_ACCESS_REPORTS}
                />
              ) : (
                <>
                  <TableHeader
                    title={`DS Assessments reports`}
                    totalItems={data.length}
                    handleSearch={handleSearch}
                  />

                  <Table
                    statusColumn="status"
                    data={data}
                    actions={actions}
                    hide={['id']}
                    uniqueCol="id"
                  />
                </>
              )}
            </div>
            <PopupMolecule
              title="Write DS critics on level"
              closeOnClickOutSide={false}
              open={open}
              onClose={() => setOpen(false)}>
              <form onSubmit={handleSubmit}>
                <div>
                  <ILabel className="py-4 font-semibold">To (Recipient)</ILabel>
                  <SelectMolecule
                    handleChange={handleChange}
                    name={'receiver'}
                    options={getDropDownOptions({
                      inputs: recipients,
                      labelName: ['first_name', 'last_name'],
                      //@ts-ignore
                      getOptionLabel: (rec: UserInfo) =>
                        `${rec.person?.current_rank?.abbreviation || ''} ${
                          rec.first_name
                        } ${rec.last_name}`,
                    })}
                  />
                </div>
                <div>
                  <ILabel className="py-4 font-semibold">Week number</ILabel>
                  <InputMolecule
                    type="number"
                    name={'week'}
                    handleChange={handleChange}
                    value={details.week}
                  />
                </div>
                <div>
                  <ILabel className="py-4 font-semibold">Item of instruction</ILabel>
                  <Tiptap handleChange={handleLabelChange} content={details.label} />
                </div>
                <div>
                  <ILabel className="py-4 font-semibold">Comments</ILabel>
                  <Tiptap handleChange={handleValueChange} content={details.value} />
                </div>
                <Button type="submit" isLoading={isSaving}>
                  Save
                </Button>
              </form>
            </PopupMolecule>
          </>
        )}
      />
      <Route exact path={`${path}/ds-assessment/:dsid`} component={DSAssessmentSheet} />
    </Switch>
  );
}
