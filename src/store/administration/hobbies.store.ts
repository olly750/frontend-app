import { useMutation, useQuery } from 'react-query';

import { hobbyService } from '../../services/administration/hobbies.service';

class HobbyStore {
  addHobby() {
    return useMutation(hobbyService.addHobby);
  }

  getHobbies() {
    return useQuery('hobbies', hobbyService.getHobbies);
  }

  getHobby(id: string) {
    return useQuery(['hobby/id', id], () => hobbyService.getHobby(id));
  }

  UpdateHobby() {
    return useMutation(hobbyService.UpdateHobby);
  }

  getUserHobby(id: string) {
    return useQuery(['person/hobby/id', id], () => hobbyService.getUserHobbies(id));
  }
}

export default new HobbyStore();
