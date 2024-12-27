import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useHistory, useLocation } from 'react-router-dom';

import useAuthenticator from '../../../hooks/useAuthenticator';
import useNonPickedRole from '../../../hooks/useNonPickedRole';
import usePickedRole from '../../../hooks/usePickedRole';
import { queryClient } from '../../../plugins/react-query';
import { authenticatorStore } from '../../../store/administration';
import academyStore from '../../../store/administration/academy.store';
import { institutionStore } from '../../../store/administration/institution.store';
import { getAllNotifications } from '../../../store/administration/notification.store';
import { Privileges, RoleType } from '../../../types';
import { NotificationStatus } from '../../../types/services/notification.types';
import { ProfileStatus } from '../../../types/services/user.types';
import cookie from '../../../utils/cookie';
import { usePicture } from '../../../utils/file-util';
import Permission from '../../Atoms/auth/Permission';
import Avatar from '../../Atoms/custom/Avatar';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';
import { ClickOutSide } from '../../Organisms/containers/ClickOutside';
import Notification from '../Notification';
import Tooltip from '../Tooltip';
// import SearchMolecule from '../input/SearchMolecule';

interface Iprops {
  hasProfile: boolean;
  hasSetting?: boolean;
  hasChangePassword: boolean;
}

export default function Navigation({
  hasProfile = true,
  hasChangePassword = true,
  hasSetting = false,
}: Iprops) {
  const history = useHistory();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setNotificationMenu] = useState(false);
  const [showSwitchMenu, setSwitchMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const logoutFn = authenticatorStore.logout();
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();

  const location = useLocation();
  const notifications =
    getAllNotifications(user?.id.toString() || '').data?.data.data || [];

  const institution = institutionStore.getAll().data?.data.data;
  const academy_info = academyStore.fetchAcademies().data?.data.data;

  const hasSomeUnreadNotifications = notifications.some(
    (notification) =>
      notification.notifaction_status === NotificationStatus.UNREAD.toString(),
  );
  const links = [
    { text: 'Home', to: '/' },
    { text: 'About', to: '/about' },
  ];

  const activeClass = 'text-white bg-gray-900';
  const inactiveClass = 'text-gray-300 hover:text-white hover:bg-gray-700';

  function handleSwitch(role_id: string) {
    cookie.setCookie('user_role', role_id);
    history.push('/dashboard/main');
  }

  function logout() {
    let toastId = toast.loading('Signing you out ...');
    logoutFn
      .refetch()
      .then(() => {
        queryClient.clear();
        cookie.eraseCookie('jwt_info');
        cookie.eraseCookie('user_role');
        history.push('/login');
        toast.success('You are now logged out.', { id: toastId });
      })
      .catch(() => toast.error('Signout failed. try again latter.', { id: toastId }));
  }

  const other_user_roles = useNonPickedRole();

  return (
    <div>
      <nav className="text-main bg-[url('/images/logo.png')] bg-[#B8B351] bg-no-repeat bg-left-2 bg-contain">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-14">
            {/* Disabled Global search just for the while its not functioning css will be justify-center 
          will replace justify-endwhen the search is added in this div */}
            {/* <div className="flex items-center">
            <div className="shrink-0 ">
              <SearchMolecule handleChange={handleSearch} />
            </div>
          </div> */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Permission privilege={Privileges.CAN_MODIFY_INSTITUTION}>
                  <div className="px-12">
                    <Link to={`/dashboard/institution/${user?.institution_id}/edit`}>
                      <Button styleType="outline">Edit institution</Button>
                    </Link>
                  </div>
                </Permission>
                <div className="p-1 rounded-full flex text-main text-current">
                  {other_user_roles.length > 0 &&
                    user?.profile_status === ProfileStatus.COMPLETD && (
                      <Tooltip
                        on="click"
                        position="bottom center"
                        open={showSwitchMenu}
                        trigger={
                          <button
                            className="rounded-full flex text-main"
                            onClick={() => setSwitchMenu(!showSwitchMenu)}>
                            <div className="relative">
                              <Icon fill="main" name="switch" />
                            </div>
                          </button>
                        }>
                        {other_user_roles.map((role) => (
                          <button
                            onClick={() => handleSwitch(role.id.toString())}
                            className="flex flex-col items-start justify-center gap-2 px-4 box-border text-left py-2 text-sm hover:bg-gray-100 w-full"
                            key={role.id}
                            role="menuitem">
                            <span className="font-semibold">{role.name}</span>
                            <span>
                              -{' '}
                              {role.type === RoleType.ACADEMY
                                ? academy_info?.find((ac) => ac.id === role.academy_id)
                                    ?.name
                                : role.type
                                ? institution?.find(
                                    (inst) => inst.id === role.institution_id,
                                  )?.name
                                : null}
                            </span>
                          </button>
                        ))}
                      </Tooltip>
                    )}
                  {hasSetting && <Icon fill="main" name="settings" />}

                  <Tooltip
                    on="click"
                    position="bottom center"
                    open={showNotificationMenu}
                    trigger={
                      <button
                        className="rounded-full flex text-gray-400"
                        onClick={() => setNotificationMenu(!showNotificationMenu)}>
                        <div className="relative">
                          <Icon fill="main" name="notification" />
                          {hasSomeUnreadNotifications && (
                            <div className="rounded-full h-3 w-3 absolute top-3 right-3 flex items-center justify-center">
                              <span className="absolute  w-2 h-2  bg-red-600 self-center rounded-full"></span>
                            </div>
                          )}
                        </div>
                      </button>
                    }>
                    <Notification notifications={notifications} />
                  </Tooltip>
                </div>

                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div className="flex">
                    <button
                      className="max-w-xs outline-none rounded-full flex items-center text-sm focus:outline-none"
                      id="user-menu"
                      aria-label="User menu"
                      aria-haspopup="true"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}>
                      <span className="sr-only">Open user menu</span>
                      <Avatar
                        className="border-2 object-cover border-main"
                        src={usePicture(user?.profile_attachment_id, user?.id)}
                        alt=""
                        size="34"
                      />
                    </button>
                    <div className="pl-2">
                      <p className="capitalize">{user?.username}</p>
                      {picked_role?.name ? (
                        <p className="text-xs pt-1 text-main">{picked_role.name}</p>
                      ) : null}
                    </div>
                  </div>
                  {/*  
                Profile dropdown panel, show/hide based on dropdown state.
              */}
                  {showProfileMenu && (
                    <ClickOutSide handleClickOutside={() => setShowProfileMenu(false)}>
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1 rounded-md bg-white shadow-xs"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="user-menu">
                          {hasChangePassword && (
                            <Link
                              to={`/dashboard/account/update-password`}
                              className="block px-4 py-2 text-sm text-txt-primary hover:bg-gray-100">
                              Change password
                            </Link>
                          )}
                          {hasProfile && user?.profile_status === ProfileStatus.COMPLETD && (
                            <Link
                              to={`/dashboard/user/${user?.id}/profile?me=true`}
                              className="block px-4 py-2 text-sm text-txt-primary hover:bg-gray-100">
                              Your Profile
                            </Link>
                          )}
                          {hasSetting && (
                            <a
                              href={`/dashboard/user/${user?.id}/profile`}
                              className="block px-4 py-2 text-sm text-txt-primary hover:bg-gray-100"
                              role="menuitem">
                              Settings
                            </a>
                          )}
                          <button
                            disabled={logoutFn.isLoading}
                            onClick={() => logout()}
                            className="block px-4 box-border text-left py-2 text-sm text-txt-primary hover:bg-gray-100 w-full"
                            role="menuitem">
                            {logoutFn.isLoading ? 'Signing out ....' : 'Sign out'}
                          </button>
                        </div>
                      </div>
                    </ClickOutSide>
                  )}
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-main hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
                {/* Menu open: "hidden", Menu closed: "block" */}
                <svg
                  className="block h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Menu open: "block", Menu closed: "hidden" */}
                <svg
                  className="hidden h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu open: "block", Menu closed: "hidden" */}
        <div className={`md:hidden ${showMenu ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 sm:px-3">
            {links.map((link, i) => (
              <Link
                key={link.text}
                to={link.to}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.to ? activeClass : inactiveClass
                } ${i > 0 && 'mt-1'}`}>
                {link.text}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="/images/default-pic.png"
                  alt="profile"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {user?.username}
                </div>
                <div className="text-sm font-medium leading-none text-main">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {hasProfile && user?.profile_status === ProfileStatus.COMPLETD && (
                <Link
                  to={`/dashboard/user/${user?.id}/profile`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-main hover:text-white hover:bg-gray-700">
                  Your Profile
                </Link>
              )}
              {hasSetting && (
                <a
                  href={`/dashboard/user/${user?.id}/profile`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-main hover:text-white hover:bg-gray-700">
                  Settings
                </a>
              )}
              <button
                disabled={logoutFn.isLoading}
                onClick={() => logout()}
                className="block px-3 py-2 rounded-md text-base font-medium text-main hover:text-white hover:bg-gray-700"
                role="menuitem">
                {logoutFn.isLoading ? 'Signing out ....' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="bg-primary-600 min-h-10 text-gray-200">
        <p className="uppercase text-sm py-3 w-60 text-center">
          {picked_role?.type === RoleType.ACADEMY
            ? picked_role?.academy?.name
            : picked_role?.institution?.name || user?.institution_name}
        </p>
      </div>
    </div>
  );
}
