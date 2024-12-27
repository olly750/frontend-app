import React from 'react';
import { useTranslation } from 'react-i18next';

import { Link } from '../../../types';
import Heading from '../../Atoms/Text/Heading';
import BreadCrumb from '../../Molecules/BreadCrumb';
import InputMolecule from '../../Molecules/input/InputMolecule';
import Table from '../../Molecules/table/Table';

export default function IntakeModules() {
  const { t } = useTranslation();
  const list: Link[] = [
    { to: 'home', title: 'Institution Admin' },
    { to: 'faculty', title: t('Faculty') },
    { to: 'programs', title: t('Program') },
    { to: 'intakes', title: 'Intakes' },
    { to: 'modules', title: 'Modules' },
  ];

  const data = [
    {
      choose: 19,
      'Module Name/ Code': 'Col Florin Sandberg',
      Prerequisites: 'Student / Sr',
      Program: 7869046715,
      status: 'Active',
    },
    {
      choose: 10,
      'Module Name/ Code': 'Col Florin Sandberg',
      Prerequisites: 'Student / Sr',
      Program: 7869046715,
      status: 'Pending',
    },
    {
      choose: 11,
      'Module Name/ Code': 'Col Florin Sandberg',
      Prerequisites: 'Student / Sr',
      Program: 7869046715,
      status: 'Active',
    },
    {
      choose: 15,
      'Module Name/ Code': 'Col Florin Sandberg',
      Prerequisites: 'Student / Sr',
      Program: 7869046715,
      status: 'Inactive',
    },
  ];

  const intakeActions = [
    { name: 'Add intake', handleAction: () => {} },
    { name: 'Edit intake', handleAction: () => {} },
    { name: 'View', handleAction: () => {} },
  ];

  const handleChange = (_e: any) => {};
  return (
    <div>
      <BreadCrumb list={list} />
      <Heading fontSize="lg" fontWeight="semibold">
        Add modules to an Intake
      </Heading>
      <Heading fontSize="tiny" fontWeight="medium" color="txt-secondary">
        Let’s add many modules on this intake
      </Heading>
      <div className="pt-5">
        <InputMolecule
          name="intake"
          placeholder="Select intake"
          value={''}
          handleChange={(e) => handleChange(e)}>
          Intake
        </InputMolecule>
        <InputMolecule
          name="program"
          placeholder={'Select ' + t('Program')}
          value={''}
          handleChange={(e) => handleChange(e)}>
          {t('Program')}
        </InputMolecule>
      </div>
      <Table statusColumn="status" data={data} actions={intakeActions} />
    </div>
  );
}
