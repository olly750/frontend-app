import React from 'react';
import toast from 'react-hot-toast';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import ProfilExperienceDetails from '../../components/Organisms/forms/auth/signup/experience/ProfilExperienceDetails';
import UpdateExperience from '../../components/Organisms/forms/auth/signup/experience/UpdateExperience';
import MoreInfo from '../../components/Organisms/forms/auth/signup/more-details/MoreInfo';
import RemoveNextKin from '../../components/Organisms/forms/auth/signup/more-details/RemoveNextKin';
import UpdateNextKin from '../../components/Organisms/forms/auth/signup/more-details/UpdateNextKin';
import AddChronicDisease from '../../components/Organisms/forms/auth/signup/personal/AddChronicDisease';
import AddHobby from '../../components/Organisms/forms/auth/signup/personal/AddHobby';
import AddLanguage from '../../components/Organisms/forms/auth/signup/personal/AddLanguage';
import NewPersonalDocument from '../../components/Organisms/forms/user/NewPersonalDocument';
import { queryClient } from '../../plugins/react-query';
import enrollmentStore from '../../store/administration/enrollment.store';
import usersStore from '../../store/administration/users.store';
import { ParamType } from '../../types';
import { ApproveStudents, StudentApproval } from '../../types/services/enrollment.types';
import UpdateCompleteProfile from '../auth/UpdateCompleteProfile';
import PersonalDocuments from './profile/PersonalDocuments';
import ProfileOverview from './profile/ProfileOverview';
import Viewfile from './profile/Viewfile';
import UpdatePhotoProfile from './profile/UpdatePhotoProfile';

export default function UserDetails() {
  const { id } = useParams<ParamType>();

  const { data: user, isLoading } = usersStore.getUserById(id);
  const { search } = useLocation();
  const intkStud = new URLSearchParams(search).get('intkStud');
  const stat = new URLSearchParams(search).get('stat');
  const { path } = useRouteMatch();

  const history = useHistory();

  const { mutateAsync, isLoading: isApproving } = enrollmentStore.approveStudent();

  function approveStud(data?: string[]) {
    data?.map((st_id) => {
      let newStudent: ApproveStudents = {
        intake_program_student_id: parseInt(st_id),
        status: StudentApproval.APPROVED,
      };

      mutateAsync(newStudent, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['students/intakeProgramId']);
          history.goBack();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    });
  }

  function rejectStud(data?: string[]) {
    data?.map((st_id) => {
      let newStudent: ApproveStudents = {
        intake_program_student_id: parseInt(st_id),
        status: StudentApproval.REJECTED,
      };

      mutateAsync(newStudent, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          queryClient.invalidateQueries(['students/intakeProgramId']);
          history.goBack();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    });
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : user?.data.data ? (
        <>
          <div className="flex justify-between">
            <Heading className="py-3" fontWeight="bold" fontSize="2xl">
              {user?.data.data.person?.current_rank?.abbreviation || ''}{' '}
              {user?.data.data.first_name + ' ' + user?.data.data.last_name} Profile
            </Heading>
            {intkStud && stat && (
              <div className="flex gap-4">
                {stat === StudentApproval.PENDING ? (
                  <>
                    <Button
                      disabled={isApproving}
                      onClick={() => approveStud([intkStud])}>
                      Approve
                    </Button>
                    <Button
                      disabled={isApproving}
                      styleType="outline"
                      onClick={() => rejectStud([intkStud])}>
                      Reject
                    </Button>
                  </>
                ) : stat === StudentApproval.APPROVED ? (
                  <Button
                    styleType="outline"
                    disabled={isApproving}
                    onClick={() => rejectStud([intkStud])}>
                    Reject
                  </Button>
                ) : (
                  <Button disabled={isApproving} onClick={() => approveStud([intkStud])}>
                    Approve
                  </Button>
                )}
              </div>
            )}
          </div>
          <Switch>
            <Route
              exact
              path={`${path}`}
              render={() => (
                <Tabs>
                  <Tab label="Overview" className="pt-8">
                    <ProfileOverview user={user?.data.data} />
                  </Tab>
                  <Tab label="Performance" className="pt-8">
                    <NoDataAvailable
                      icon="academy"
                      fill={false}
                      showButton={false}
                      title={'User have no performance yet'}
                      description={
                        'This user does not currently have any performance to display'
                      }
                    />
                  </Tab>
                  <Tab label="Log" className="pt-8">
                    <NoDataAvailable
                      icon="academy"
                      fill={false}
                      showButton={false}
                      title={'User have no logs yet'}
                      description={"This user's logs are not currently being recorded"}
                    />
                  </Tab>
                  <Tab label="Personal Documents" className="pt-8">
                    <PersonalDocuments user={user?.data.data} />
                  </Tab>
                </Tabs>
              )}
            />
            <Route
              exact
              path={`${path}/new-personal-doc`}
              render={() => {
                return (
                  <PopupMolecule
                    title="New Personal Document"
                    open
                    onClose={history.goBack}>
                    <NewPersonalDocument personId={user.data.data.person?.id + ''} />
                  </PopupMolecule>
                );
              }}
            />
            <Route
              path={`${path}/edit-compl-prof`}
              render={() => <UpdateCompleteProfile />}
            />
            <Route
              path={`${path}/view-attachement`}
              render={() => <Viewfile />}
            />
            <Route
              exact
              path={`${path}/add-hobby/:personId`}
              render={() => (
                <PopupMolecule title="Add Hobby" open={true} onClose={history.goBack}>
                  <AddHobby />
                </PopupMolecule>
              )}
            />
            <Route
              exact
              path={`${path}/add-language/:personId`}
              render={() => (
                <PopupMolecule title="Add Language" open={true} onClose={history.goBack}>
                  <AddLanguage />
                </PopupMolecule>
              )}
            />
            <Route
              exact
              path={`${path}/add-chronic/:personId`}
              render={() => (
                <PopupMolecule
                  title="Add your chronic diseases"
                  open={true}
                  onClose={history.goBack}>
                  <AddChronicDisease />
                </PopupMolecule>
              )}
            />
            <Route
              exact
              path={`${path}/new-experience`}
              render={() => <ProfilExperienceDetails showHeader={false} />}
            />
            <Route
              exact
              path={`${path}/edit-experience/:expId`}
              render={() => <UpdateExperience />}
            />
            <Route
              exact
              path={`${path}/:userId/add-next-kin`}
              render={() => <MoreInfo showHeader={false} />}
            />
            <Route
              exact
              path={`${path}/edit-next-kin/:userId/:kinid`}
              render={() => <UpdateNextKin />}
            />
            <Route
              exact
              path={`${path}/remove-next-kin/:userId/:kinid`}
              render={() => <RemoveNextKin />}
            />
            <Route
              exact
              path={`${path}/edit-prof`}
              render={() => (
                <PopupMolecule
                  closeOnClickOutSide={false}
                  title="Upload new profile picture"
                  open={true}
                  onClose={history.goBack}>
                  <UpdatePhotoProfile user={user.data.data} />
                </PopupMolecule>
              )}
            />
          </Switch>
        </>
      ) : (
        <NoDataAvailable
          showButton={false}
          icon="user"
          title={'User not available'}
          description={'Sorry this user is currently not available in the system'}
        />
      )}
    </>
  );
}
