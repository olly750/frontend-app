import toast from 'react-hot-toast';

import { academyService } from '../services/administration/academy.service';
import { institutionService } from '../services/administration/institution.service';
import { i18n } from '../translations/i18n';
import { RoleResWithPrevilages, RoleType } from '../types';
import cookie from './cookie';

export function chooseRole(role: RoleResWithPrevilages) {
  cookie.setCookie('user_role', role.id.toString() || '');

  if (role.type === RoleType.ACADEMY) {
    academyService
      .getAcademyById(role.academy_id)
      .then((resp) => {
        i18n.changeLanguage(resp.data.data.translation_preset);
        role.academy = { ...resp.data.data };
        localStorage.setItem('currentAcademy', JSON.stringify(resp.data.data));
        window.location.href = '/dashboard/main';
      })
      .catch((_e) => toast.error('Failed to load academy information'));
  } else {
    institutionService
      .getInstitutionById(role.institution_id)
      .then((resp) => {
        i18n.changeLanguage('default');
        console.log('insitution loaded', resp.data.data);
        role.institution = { ...resp.data.data };

        localStorage.setItem('currentInsitution', JSON.stringify(resp.data.data));
        window.location.href = '/dashboard/main';
      })
      .catch((_e) => toast.error('Failed to load institution information'));
  }
}
