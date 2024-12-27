import React from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../../components/Atoms/custom/Button';
import Loader from '../../../components/Atoms/custom/Loader';
import Panel from '../../../components/Atoms/custom/Panel';
import Heading from '../../../components/Atoms/Text/Heading';
import Accordion from '../../../components/Molecules/Accordion';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import Tiptap from '../../../components/Molecules/editor/Tiptap';
import useAuthenticator from '../../../hooks/useAuthenticator';
import { useInstructorByUserId } from '../../../hooks/useInstructorByUserId';
import { moduleMaterialStore } from '../../../store/administration/module-material.store';
import { ParamType } from '../../../types';
import { MaterialType } from '../../../types/services/module-material.types';

function ModuleMaterials() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { data: moduleMaterial, isLoading } =
    moduleMaterialStore.getModuleMaterialByModule(id);
  const moduleMaterials = moduleMaterial?.data.data || [];
  const { user } = useAuthenticator();
  const { search } = useLocation();
  const showMenu = new URLSearchParams(search).get('showMenus');
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';
  const instructorInfo = useInstructorByUserId(user?.id.toString() || '');

  return (
    <Switch>
      <Route
        exact
        path={`${path}`}
        render={() => (
          <div className="flex flex-col gap-4 z-0 pt-6">
            <div className="flex justify-between items-center">
              <Heading fontSize="base" fontWeight="semibold">
                Learning materials ({moduleMaterial?.data.data.length || 0})
              </Heading>
            </div>
            <>
              {isLoading ? (
                <Loader />
              ) : moduleMaterials.length === 0 ? (
                <NoDataAvailable
                  showButton={instructorInfo?.length !== 0}
                  // privilege={Privileges.CAN_CREATE_SYLLABUS}
                  icon="subject"
                  title={'No learning materials available'}
                  description={
                    'There are no learning materials currently added on this module'
                  }
                  handleClick={() => history.push(`${url}/add-material`)}
                />
              ) : (
                <div className="pt-3 w-2/5">
                  <Accordion>
                    {moduleMaterials.map((mat) => {
                      return (
                        <Panel
                          width="w-full"
                          bgColor="main"
                          key={mat.title}
                          title={mat.title}
                          badge={{
                            text: mat.type,
                            type: MaterialType[mat.type],
                          }}>
                          <div className="font-medium text-gray-600 text-sm py-4">
                            <Tiptap
                              editable={false}
                              viewMenu={false}
                              handleChange={() => {}}
                              content={mat.content}
                            />
                          </div>
                          {instructorInfo?.length !== 0 && (
                            <Button
                              className="mt-2 mb-4 mx-20"
                              styleType="outline"
                              onClick={() =>
                                history.push(
                                  `${url}/add-material/${mat.id}?showMenus=${showMenu}&intkPrg=${intakeProg}`,
                                )
                              }>
                              Add supporting files
                            </Button>
                          )}
                        </Panel>
                      );
                    })}
                  </Accordion>
                </div>
              )}
            </>
          </div>
        )}
      />
    </Switch>
  );
}

export default ModuleMaterials;
