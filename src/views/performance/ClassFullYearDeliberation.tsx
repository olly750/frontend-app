import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import Table from '../../components/Molecules/table/Table';
import Promote from '../../components/Organisms/forms/deliberation/Promote';
import { getClassById, getStudentsByClass } from '../../store/administration/class.store';
import { getClassTermlyOverallReport } from '../../store/evaluation/school-report.store';
import { IPerformanceTable } from '../../types/services/report.types';
import { calculateGrade } from '../../utils/school-report';

interface IParamType {
  levelId: string;
  classId: string;
}

export default function ClassFullYearDeliberation() {
  const history = useHistory();
  const { url, path } = useRouteMatch();

  const { classId } = useParams<IParamType>();
  const { data: classInfo } = getClassById(classId);
  const { data: studentsData } = getStudentsByClass(classId) || [];

  let periodOfThisClass = classInfo?.data.data.intake_academic_year_period_id;

  const {
    data: performance,
    isIdle,
    isLoading,
    isError,
  } = getClassTermlyOverallReport(classId, periodOfThisClass + '', !!periodOfThisClass);

  let data: IPerformanceTable[] = [];
  performance?.data.data.sort((a, b) => {
    return a.position - b.position;
  });
  performance?.data.data.forEach((record) => {
    studentsData?.data.data.forEach((student) => {
      console.log('hello');

      if (record.student.admin_id === student.student.id) {
        let processed: IPerformanceTable = {
          rank: student.student.user.person?.current_rank?.abbreviation || '',
          first_name: student.student.user.first_name,
          last_name: student.student.user.last_name,
          // reg_number: record.student.reg_number,
          id: record.id,
        };

        processed[`total /${record.total_marks}`] = `${
          record.quiz_obtained_marks + record.exam_obtained_marks
        }`;

        processed['Grade'] = calculateGrade(
          record.quiz_obtained_marks + record.exam_obtained_marks,
          record.total_marks,
        );

        processed['position'] = record.position;
        processed['promotion_status'] = record.promotion_status;
        data.push(processed);
      }
    });
  });

  const studentActions = [
    {
      name: 'Promote',
      handleAction: (id: string | number | undefined) => {
        console.log(id);
        history.push(`${url}/${id}/promotion`);
      },
    },
  ];
  const { t } = useTranslation();

  return (
    <div>
      <Switch>
        <Route
          path={`${path}/:reportId/promotion`}
          render={() => {
            return (
              <PopupMolecule
                title="Student Promotion"
                open
                onClose={history.goBack}
                closeOnClickOutSide={false}>
                <Promote />
              </PopupMolecule>
            );
          }}
        />
      </Switch>
      {isIdle || isLoading ? (
        <Loader />
      ) : isError ? (
        <div>
          <h2 className="text-error-500 py-2 mb-3 font-medium tracking-widest">
            Error Occurred: {t('Class')} Deliberation can&apos;t take place as there are
            no students in {t('Class')}
          </h2>
          <Button styleType="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      ) : data.length === 0 ? (
        <NoDataAvailable
          title={'No marks for this association found'}
          description={
            'No data associated with this ' +
            t('Class') +
            ' an this ' +
            t('Period') +
            ' found. try changing the ' +
            t('Period')
          }
          showButton={false}
        />
      ) : (
        <div>
          <div className="flex items-center pt-4 pb-6 gap-4">
            <Button
              styleType={'text'}
              onClick={() => history.goBack()}
              icon
              className="flex items-center p-2 hover:underline">
              <Icon name="chevron-left" fill="primary" size={16} />
              Back
            </Button>
            <Heading fontSize="2xl" fontWeight="bold" className="text-primary-600">
              {`${classInfo?.data.data.class_name || t('Class')} Promotions`}
            </Heading>
          </div>
          <Table
            statusColumn="promotion_status"
            anotherStatusColumn="enroll_to"
            data={data}
            actions={studentActions}
            hide={['id']}
            uniqueCol="id"
          />
        </div>
      )}
    </div>
  );
}
