import React, { useContext, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import StudentsSvg from '../../components/Atoms/custom/StudentsSvg';
import AcademyProfileCard from '../../components/Molecules/cards/AcademyProfileCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import ConfirmResetPassword from '../../components/Organisms/ConfirmResetPassword';
import SignInForm from '../../components/Organisms/forms/auth/signin/SignInForm';
import SignInWithSearch from '../../components/Organisms/forms/auth/signin/SignInWithSearch';
import UserContext from '../../context/UserContext';
import { institutionStore } from '../../store/administration/institution.store';
import { usePicture } from '../../utils/file-util';

function SignIn() {
  const { path } = useRouteMatch();

  const institutions = institutionStore.getAll();
  const institution = institutions.data?.data.data[0];

  const { setTheme } = useContext(UserContext);

  useEffect(() => {
    if (institutions.data?.data.data) {
      setTheme(institution?.theme || 'DEFAULT');
      localStorage.setItem('theme', institution?.theme || 'DEFAULT');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutions.data?.data.data]);

  return (
    <>
      {/* {institution.isLoading ? (
        <Loader />
      ) :  */}
      {institutions.data?.data.data.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <NoDataAvailable
            icon="academy"
            title={'No institution available'}
            showButton={false}
            fill={false}
            description={
              'Sorry, looks like the institution has not setup the platform yet! Try again later'
            }
          />
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 h-screen grid-cols-1 bg-main">
          <div className="items-center justify-center hidden lg:flex bg-secondary">
            <StudentsSvg className="block w-5/6" />
          </div>
          <div className="px-5 py-8 md:rounded-md mx-auto lg:py-20 h-screen">
            <AcademyProfileCard
              src={usePicture(
                institution?.logo_attachment_id || undefined,
                institution?.id,
                '/images/rdf-logo.png',
                'logos',
              )}
              alt="institution logo"
              size="80"
              bgColor="none"
              txtSize="lg"
              fontWeight="semibold"
              color="primary"
              subtitle={institution?.moto}>
              {institution?.name}
            </AcademyProfileCard>
            <Switch>
              <Route exact path={`${path}`} render={() => <SignInForm />} />
              <Route exact path={`${path}/search`} render={() => <SignInWithSearch />} />
              <Route
                exact
                path={`${path}/forgot-pass`}
                render={() => <ConfirmResetPassword />}
              />
            </Switch>
          </div>
        </div>
      )}
    </>
  );
}

export default SignIn;
