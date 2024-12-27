import React from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Panel from '../../components/Atoms/custom/Panel';
import Heading from '../../components/Atoms/Text/Heading';
import Accordion from '../../components/Molecules/Accordion';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Tiptap from '../../components/Molecules/editor/Tiptap';
// import useAuthenticator from '../../hooks/useAuthenticator';
import { moduleMaterialStore } from '../../store/administration/module-material.store';
import { ParamType, Privileges } from '../../types';
import { MaterialType } from '../../types/services/module-material.types';
import NewIntakeModuleMaterial from './NewIntakeModuleMaterial';
import NewIntakeModuleMaterialAttach from './NewIntakeModuleMaterialAttach';
import NewManualAttachment from './NewManualAttachment';
import ShowIntakeModuleMaterial from './ShowIntakeModuleMaterial';
import Icon from '../../components/Atoms/custom/Icon';

function IntakeModuleMaterials() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { path, url } = useRouteMatch();

  const { search } = useLocation();
  const showMenu = new URLSearchParams(search).get('showMenus');
 
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';
  const mod = new URLSearchParams(search).get('Mod') || '';
 
  const { data: moduleMaterial, isLoading } =
    moduleMaterialStore.getIntakeLevelModuleMaterialByIntakeLevelModule(mod);
  const moduleMaterials = moduleMaterial?.data.data || [];

  // const { user } = useAuthenticator();


 
 
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
              <div className="w-full py-12 bg-transparent">
                <div className="text-center">

                <div className="rounded-full inline-block py-3 px-3 bg-lightgreen bg-opacity-35">
                    <Icon
                        name="subject"
                        size={32} 
                    />
                  </div>
                </div>
                <p className="text-base font-semibold pt-4 pb-2 text-center">No learning materials available</p>
                <div className="mx-auto w-full md:w-3/4 lg:w-1/2 xl:w-1/3 ">
                    <p className="text-sm font-medium text-txt-secondary text-center">
                    There are no learning materials currently added on this module
                    </p>
                </div>
              </div>
 
              ) : (
                <div className="pt-3 w-4/5">
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
                          <Permission privilege={Privileges.CAN_CREATE_MODULE_MATERIALS}>
                            <Button
                              className="mt-2 mb-4 mx-20"
                              styleType="outline"
                              onClick={() =>
                                history.push(
                                  `${url}/add-material-attachment/${mat.id}?showMenus=${showMenu}&Mod=${mod}&intkPrg=${intakeProg}`,
                                )
                              }>
                              Add supporting files
                            </Button>
                            <Button
                              className="mt-2 mb-4 mx-20" 
                              // styleType="outline"
                              onClick={() =>
                                history.push(
                                  `${url}/add-manual-attachment/${mat.id}?showMenus=${showMenu}&Mod=${mod}&intkPrg=${intakeProg}&intkmod=${mat.id}`,
                                )
                              }>
                              Add course manual
                            </Button>
                          </Permission>
                          <ShowIntakeModuleMaterial materialId={mat.id + ''} />
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
      {/* show module details */}
      <Route
        exact
        path={`${path}/add-module-material`}
        render={() => {
          return <NewIntakeModuleMaterial />;
        }}
      />
      {/* show module details */}
     <Route
        exact
        path={`${path}/add-material-attachment/:materialId`}
        render={() => {
          return <NewIntakeModuleMaterialAttach />;
        }}
      />  
        <Route
        exact
        path={`${path}/add-manual-attachment/:materialId`}
        render={() => {
          return <NewManualAttachment />;
        }}
      />  
    </Switch>
  );
}

export default IntakeModuleMaterials;
