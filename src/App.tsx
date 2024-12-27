import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ExperienceDetails from './components/Organisms/forms/auth/signup/experience/ExperienceDetails';
import MoreInfo from './components/Organisms/forms/auth/signup/more-details/MoreInfo';
import OtherDetails from './components/Organisms/forms/auth/signup/personal/OtherDetails';
import UserContext from './context/UserContext';
import useOnlineStatus from './hooks/useOnlineStatus';
import { MainLayout } from './layout/MainLayout';
import Redirecting from './Redirecting';
import RouterProtection from './RouterProtection';
import { RoleResWithPrevilages } from './types';
import { AuthUser } from './types/services/user.types';
import CompleteProfile from './views/auth/CompleteProfile';
import Signin from './views/auth/Signin';
import Home from './views/Home';
import NewInstitution from './views/insitution/NewInstitution';
import NotFound from './views/NotFound';
import ChooseRole from './views/roles/ChooseRole';

const TOAST_ID = 'online-status-toast';

const App = () => {
  const [user, setUser] = useState<AuthUser>();
  const [picked_role, setPickedRole] = useState<RoleResWithPrevilages>();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'DEFAULT');
  const { isOnline } = useOnlineStatus();

  useEffect(() => {
    if (isOnline === 'NO') {
      toast.error('You seem to be offline!', {
        id: TOAST_ID,
        position: 'top-center',
        duration: Infinity,
      });
    } else if (isOnline === 'YES') {
      toast.success('You are back online!', {
        id: TOAST_ID,
        position: 'top-center',
        duration: 3000,
      });
    }
  }, [isOnline]);

  return (
    <UserContext.Provider
      value={{ user, setUser, picked_role, setPickedRole, theme, setTheme }}>
      <MainLayout>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/redirecting" component={Redirecting} />
            <Route exact path="/complete-experience" component={ExperienceDetails} />
            <Route path="/complete-profile/:id" component={CompleteProfile} />
            <Route exact path="/complete-more" component={MoreInfo} />
            <Route exact path="/complete-other" component={OtherDetails} />
            <Route exact path="/new-institution" component={NewInstitution} />
            <Route exact path="/choose-role" component={ChooseRole} />
            <Route path="/login" component={Signin} />
            <Route path="/dashboard" component={RouterProtection} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </MainLayout>
    </UserContext.Provider>
  );
};

export default App;
