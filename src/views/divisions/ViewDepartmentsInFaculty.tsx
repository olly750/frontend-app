import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import { divisionStore } from '../../store/administration/divisions.store';
import { ParamType } from '../../types';
import { DivisionInfo } from '../../types/services/division.types';

interface FilteredData
  extends Pick<
    DivisionInfo,
    'id' | 'name' | 'description' | 'generic_status' | 'total_num_childreen'
  > {}

export default function ViewDepartmentsInFaculty() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { t } = useTranslation();
  const { data, isLoading, isSuccess } = divisionStore.getDepartmentsInFaculty(id);
  const { data: facultyInfo } = divisionStore.getDivisionByType('FACULTY');
  const [departments, setDepartments] = useState<FilteredData[]>();

  const filteredFaculty = facultyInfo?.data.data.find(
    (faculty: DivisionInfo) => faculty.id == id,
  );

  const actions = [
    {
      name: 'Edit Department',
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/divisions/departments/${id}/edit`); // go to edit role
      },
    },
    {
      name: 'View ' + t('Program'),
      handleAction: (id: string | number | undefined) => {
        history.push(`/dashboard/programs/${id}/view-program`); // go to edit role
      },
    },
  ];

  useEffect(() => {
    // extract department data to display
    let formattedDeparts: any = [];

    const filteredInfo = data?.data.data.map((department: DivisionInfo) =>
      _.pick(department, [
        'id',
        'name',
        'description',
        'generic_status',
        'total_num_childreen',
      ]),
    );

    filteredInfo?.map((department: any) => {
      let filteredData: any = {
        id: department.id.toString(),
        decription: department.description,
        name: department.name,
        status: department.generic_status,
        programs: department.total_num_childreen,
      };
      formattedDeparts.push(filteredData);
    });

    data?.data.data && setDepartments(formattedDeparts);
  }, [data]);

  return (
    <div>
      <section>
        <TableHeader
          title={`${filteredFaculty?.name} / Departments`}
          totalItems={departments?.length || 0}
          //   totalItems={faculties?.length || 0}
        ></TableHeader>
      </section>

      <section>
        {isLoading && 'Department loading...'}
        {isSuccess && departments?.length === 0 && 'No Departments found, try to add one'}
        {departments?.length && (
          <Table<FilteredData>
            statusColumn="status"
            data={departments}
            uniqueCol={'id'}
            hide={['id']}
            actions={actions}
          />
        )}
      </section>
    </div>
  );
}
