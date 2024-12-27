/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import { CommonCardDataType } from '../../../../../types';
import { IRegistrationControlInfo } from '../../../../../types/services/registrationControl.types';
import { advancedTypeChecker } from '../../../../../utils/getOption';
import Heading from '../../../../Atoms/Text/Heading';
import CommonCardMolecule from '../../../../Molecules/cards/CommonCardMolecule';

type IProps = {
  handleClick: (_program: IRegistrationInfo) => void;
  data: IRegistrationControlInfo[];
};

interface IRegistrationInfo extends CommonCardDataType {
  id: string | number | undefined;
}

//   status: { type: 'success', text: 'Active' },
//   code: 'RMA Gako',
//   title: 'A short description of registration period',
//   description: '02 Sep 2021 - 02 Nov 2021',
//   programs: [
//     { value: 'cadetteprogram', label: 'Cadette Program' },
//     { value: 'program', label: 'Program' },
//     { value: 'cadette', label: 'Cadette' },
//     { value: 'progra', label: 'Progra' },
//   ],
// },

export default function SignInWithRegControl({ data, handleClick }: IProps) {
  let RegistrationControls: IRegistrationInfo[] = [];
  let RegInfo = data;

  RegInfo?.map((obj: IRegistrationControlInfo) => {
    let {
      expected_start_date,
      expected_end_date,
      description,
      generic_status,
      id,
      academy: { name }, //destructure name inside academy obj
    } = obj;

    let registrationcontrol: IRegistrationInfo = {
      status: { type: advancedTypeChecker(generic_status), text: generic_status },
      code: name,
      title: description,
      description: `${expected_start_date} - ${expected_end_date}`,
      id: id,
    };
    RegistrationControls.push(registrationcontrol);
  });

  return (
    <>
      <div className="flex justify-center items-center py-6">
        <Heading color="primary" fontSize="2xl" fontWeight="semibold">
          Open registrations
        </Heading>
      </div>
      <div className="p-7 pl-8 flex gap-5 flex-wrap items-start justify-start">
        {RegistrationControls.map((program) => (
          <div key={program.code} className="py-4" onClick={() => handleClick(program)}>
            <CommonCardMolecule
              className="cursor-pointer border-4 border-transparent transition-all hover:border-primary-500 "
              data={program}
            />
          </div>
        ))}
      </div>
    </>
  );
}
