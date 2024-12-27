import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);

export default function IntakesDashBoard() {
  const [intakes, setIntakes] = useState<any>([]);
  const { id } = useParams<any>();
  const history = useHistory();
  useEffect(() => {
    axios(`${ADMIN_BASE_URL}/intakes/getIntakesByProgram/${id}`, {
      method: 'get',
      headers: { Authorization: `Bearer ${tok.token}` },
    }).then((data) => {
      const data1 = [];
      data1.push(...data.data.data);
      setIntakes(data1);
    });
  }, [id]);

  return (
    <>
      <div
        className="bg-primary-500  text-white p-6"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '10%',
          height: '0.1rem',
          marginTop: '10px',
          marginBottom: '3px',
          borderRadius: '20rem',
        }}>
        {intakes.length} intake{intakes.length > 1 ? 's' : ''}
      </div>

      <section className="flex flex-wrap justify-start gap-4 mt-2">
        {intakes.map((item: any) => {
          console.log(item);
          return (
            <div key={item.code + Math.random() * 10} className="p-1 mt-3">
              <CommonCardMolecule
                data={item.intake}
                handleClick={() =>
                  history.push(`/dashboard/intakes/programs/${item.intake.id}`)
                }>
                {/* <Permission privilege={Privileges.CAN_MODIFY_INTAKE}> */}
                <div className="mt-4 space-x-4 z-30">
                  <span
                    style={{
                      borderRadius: '20px',
                      color: 'green',
                      backgroundColor: ` ${
                        item.generic_status === 'ACTIVE'
                          ? 'rgb(233, 246, 242)'
                          : 'rgb(233, 235, 250)'
                      }`,
                      padding: '10px',
                    }}>
                    {item.generic_status}
                  </span>
                </div>
                {/* </Permission> */}
              </CommonCardMolecule>
            </div>
          );
        })}
      </section>
    </>
  );
}
