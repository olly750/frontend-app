import { useMutation, useQuery } from 'react-query';

import { languageService } from '../../services/administration/languages.service';

class LanguageStore {
  addLanguage() {
    return useMutation(languageService.addLanguage);
  }

  getAllLanguages() {
    return useQuery('languages', languageService.getAllLanguages);
  }

  getLanguage(id: string) {
    return useQuery(['language/id', id], () => languageService.getLanguage(id));
  }

  getLanguageByPerson(id: string) {
    return useQuery(['language/personId', id], () =>
      languageService.getLanguageByPerson(id),
    );
  }

  modifyLanguage() {
    return useMutation(languageService.modifyLanguage);
  }
}

export default new LanguageStore();
