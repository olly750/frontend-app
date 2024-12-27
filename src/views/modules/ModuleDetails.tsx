import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import PopupMolecule from '../../components/Molecules/Popup';
import TabNavigation, { TabType } from '../../components/Molecules/tabs/TabNavigation';
import AddPrerequesitesForm from '../../components/Organisms/forms/modules/AddPrerequisiteForm';
import UpdateModuleForm from '../../components/Organisms/forms/modules/UpdateModuleForm';
import EditSubjectForm from '../../components/Organisms/forms/subjects/EditSubjectForm';
import NewSubjectForm from '../../components/Organisms/forms/subjects/NewSubjectForm';
import { moduleStore } from '../../store/administration/modules.store';
import { Link, ParamType, Privileges } from '../../types';
import { advancedTypeChecker } from '../../utils/getOption';
import ModuleEvaluationAttempt from '../evaluation/ModuleEvaluationAttempt';
import ModuleEvaluations from '../evaluation/ModuleEvaluations';
import ModuleMaterials from '../module-material/ModuleMaterials';
import IntakeModuleMaterials from '../module-material/IntakeModuleMaterials';
import { IProgramData } from '../programs/AcademicPrograms';
import Subjects from '../subjects/Subjects';
import InstructorsOnModule from '../users/InstructorsOnModule';
import Prerequisites from './paths/Prerequisites';
import AttachmentView from '../module-material/AttachmentView';

export default function ModuleDetails() {
  const [route, setCurrentPage] = useState('SUBJECTS');

  const { id } = useParams<ParamType>();
  const { path, url } = useRouteMatch();
  const { search } = useLocation();
  const showMenu = new URLSearchParams(search).get('showMenus');
  const intakeProgMod = new URLSearchParams(search).get('intakeProgMod');
  const Mod = new URLSearchParams(search).get('Mod');
  const intakeProg = new URLSearchParams(search).get('intkPrg') || ''; 
  const history = useHistory();
  let moduleData: IProgramData | undefined;
  const module = moduleStore.getModuleById(id).data?.data.data;

  const { t } = useTranslation();
  let tabs: TabType[] = [];
  // {
  //   label: 'Module Info',
  //   href: `${url}`,
  // },
  tabs.push({
    label: 'Subjects',
    href: `${url}/subjects?showMenus=${showMenu}&Mod=${Mod}&intkPrg=${intakeProg}`,
    privilege: Privileges.CAN_ACCESS_SUBJECTS,
  });
  // tabs.push({
  //   label: 'Module Prerequisites',
  //   href: `${url}/prereqs?showMenus=${showMenu}&Mod=${Mod}&intkPrg=${intakeProg}`,
  //   privilege: Privileges.CAN_ACCESS_MODULE_PREREQUISITES,
  // });

  // if (!showMenu || showMenu == 'false') {
  //   tabs.push({
  //     label: 'Materials',
  //     href: `${url}/materials?showMenus=${showMenu}&intkPrg=${intakeProg}`,
  //     privilege: Privileges.CAN_ACCESS_MODULE_MATERIALS,
  //   });
  // }

  if (showMenu && showMenu == 'true') {
    tabs.push({
      label: t('Instructor'),
      href: `${url}/instructors?showMenus=${showMenu}&Mod=${Mod}&intkPrg=${intakeProg}`,
    });


    if (intakeProgMod == 'false') {
      tabs.push({
        label: 'Course Manual',
        href: `${url}/materials?showMenus=${showMenu}&intkPrg=${intakeProg}`,
        privilege: Privileges.CAN_TEACH_IN_INTAKE_PROGRAM_LEVELS,
      });
    }

    // if (!intakeProgMod || intakeProgMod == 'true') {
      tabs.push({
        label: 'intake Materials',
        href: `${url}/intakematerials?showMenus=${showMenu}&Mod=${Mod}&intkPrg=${intakeProg}`,
        privilege: Privileges.CAN_ACCESS_MODULE_MATERIALS,
      });
    // }

    // tabs.push({
    //   label: 'Manage Evaluation',
    //   href: `${url}/evaluations/manage?showMenus=${showMenu}&intkPrg=${intakeProg}`,
    //   privilege: Privileges.CAN_MANAGE_EVALUATIONS,
    // });

    // tabs.push({
    //   label: 'Evaluation',
    //   href: `${url}/evaluations/attempt?showMenus=${showMenu}&intkPrg=${intakeProg}`,
    //   privilege: Privileges.CAN_ANSWER_EVALUATION,
    // });
  }

  if (module) {
    moduleData = {
      status: {
        type: advancedTypeChecker(module.generic_status),
        text: module.generic_status.toString(),
      },
      code: module.code,
      title: module.name,
      subTitle: module.program.type,
      description: module.description,
      department: module.program.department,
      total_num_modules: module.total_num_subjects,
      incharge_names: '',
      // incharge: program.incharge && program.incharge.user.username,
    };
  }

  useEffect(() => {
    var lastUrl: string = location.href;
    new MutationObserver(() => {
      const loc = location.href.split('?')[0];
      if (loc !== lastUrl) {
        lastUrl = loc;
        if (lastUrl.endsWith('subjects')) {
          setCurrentPage('SUBJECTS');
        } else if (lastUrl.endsWith('materials')) {
          setCurrentPage('MATERIALS');
        } else if (lastUrl.endsWith('intakematerials')) {
          setCurrentPage('IntakeModuleMaterials');
        } else if (lastUrl.endsWith('prereqs')) {
          setCurrentPage('PREREQS');
        }
        // else if (lastUrl.endsWith('syllabus')) {
        //   setCurrentPage('SYLLABUS');
        // }
        else if (lastUrl.endsWith('evaluations')) {
          setCurrentPage('EVALUATIONS');
        } else if (lastUrl.endsWith(id)) {
          setCurrentPage('SUBJECTS');
        } else {
          setCurrentPage('');
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }, [id]);

  // function handleSearch() {}
  function handleClose() {
    history.goBack();
  }

  const list: Link[] = [
    { to: 'home', title: 'home' },
    { to: 'subjects', title: t('Faculty') },
    { to: 'subjects', title: t('Program') },
    { to: 'modules', title: 'Modules' },
    {
      to: moduleData?.id + '',
      title: moduleData?.title + '',
    },
  ];

  return (
    <>
      <main className="px-4">
        <section>
          <BreadCrumb list={list} />
        </section>
        <div className="mt-11 pb-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex gap-2 items-center">
              <Heading className="capitalize" fontSize="2xl" fontWeight="bold">
                {moduleData?.title} module
              </Heading>
            </div>
            {/* <div className="flex flex-wrap justify-start items-center">
              <SearchMolecule handleChange={handleSearch} />
              <button className="border p-0 rounded-md mx-2">
                <Icon name="filter" />
              </button>
            </div> */}

            {route == 'SUBJECTS' && (
              <Permission privilege={Privileges.CAN_CREATE_SUBJECTS}>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      history.push(`/dashboard/modules/${id}/add-subject`);
                    }}>
                    Add new subject
                  </Button>
                </div>
              </Permission>
            )}
            {/* {route == 'SYLLABUS' && (
              <Permission privilege={Privileges.CAN_CREATE_SYLLABUS}>
              <div className="flex gap-3">
                   <Button onClick={() => history.push(`${url}/syllabus/add-syllabus`)}>
                     Add new Syllabus
                   </Button>
                 </div>
              </Permission>
            )} */}
            {route == 'PREREQS' && (
              <Permission privilege={Privileges.CAN_CREATE_MODULE_PREREQUISITES}>
                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      history.push(
                        `${url}/${id}/add-prereq?showMenus=${showMenu}&intkPrg=${intakeProg}`,
                      )
                    }>
                    Add prerequisites
                  </Button>
                </div>
              </Permission>
            )}

          {/* {route == 'MATERIALS' && Mod !=null && (
              <Permission privilege={Privileges.CAN_CREATE_MODULE_MATERIALS}>
                <div className="flex gap-3">
                
                </div>
              </Permission>
            )} */}

            


            {route == 'MATERIALS'  && (
              <Permission privilege={Privileges.CAN_CREATE_MODULE_MATERIALS}>
                <div className="flex gap-3">
                  {Mod ==null? <>
                  <Button onClick={() => history.push(`${url}/materials/add-material`)}>
                    Add new Material
                  </Button>
                  </>:<>
                  <Button onClick={() => history.push(`${url}/intakematerials/add-module-material?Mod=${Mod}`)}>
                    Add intake module Material
                  </Button>                  
                  </>
                  
                  }
                </div>
              </Permission>
            )}  
          </div>
        </div>
        <TabNavigation tabs={tabs}>
          <Switch>
            <Route exact path={`${path}/subjects`} render={() => <Subjects />} />

         <Route
              exact
              path={`${path}/evaluations/manage`}
              render={() => <ModuleEvaluations />}
            />  
           <Route
              exact
              path={`${path}/evaluations/attempt`}
              render={() => <ModuleEvaluationAttempt />}
            />    
            {/* add subject popup */}
            <Route
              exact
              path={`${path}/add-subject`}
              render={() => {
                return (
                  <PopupMolecule title="New Subject" open onClose={handleClose}>
                    <NewSubjectForm />
                  </PopupMolecule>
                );
              }}
            />
            {/* edit subject popup */}
            <Route
              exact
              path={`${path}/edit-subject/:subjectId`}
              render={() => {
                return (
                  <PopupMolecule title="Edit Subject" open onClose={handleClose}>
                    <EditSubjectForm />
                  </PopupMolecule>
                );
              }}
            />
   
            
            {/* update module popup */}
            <Route
              exact
              path={`${path}/edit`}
              render={() => {
                return (
                  <PopupMolecule title="Edit Module" open onClose={handleClose}>
                    <UpdateModuleForm />
                  </PopupMolecule>
                );
              }}
            />
            <Route
              path={`${path}/materials`}
              render={() => {
                return <ModuleMaterials />;
              }}
            />  
             <Route
              path={`${path}/intakematerials`}
              render={() => {
                return <IntakeModuleMaterials />;
              }}
            />
                       <Route
              exact
              
              path={`${path}/pdf-file`}
              render={() => {
                return ( 
                    <AttachmentView /> 
                );
              }}
            />
            <Route
              path={`${path}/prereqs`}
              render={() => {
                return <Prerequisites />;
              }}
            />
            {/* add prerequesite popup */}
            <Route
              exact
              path={`${path}/:moduleId/add-prereq`}
              render={() => {
                return (
                  <PopupMolecule
                    closeOnClickOutSide={false}
                    title="Add Prerequesite"
                    open
                    onClose={handleClose}>
                    <AddPrerequesitesForm />
                  </PopupMolecule>
                );
              }}
            />
            <Route
              path={`${path}/instructors`}
              render={() => {
                return <InstructorsOnModule />;
              }}
            />
          </Switch>
        </TabNavigation>
      </main>
    </>
  );
}
