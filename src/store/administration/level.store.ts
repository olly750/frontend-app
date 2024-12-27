import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';

import { levelService } from '../../services/administration/levels.service';
import { Response } from '../../types';
import { ILevel } from '../../types/services/levels.types';

class Levelstore {
  addLevel() {
    return useMutation(levelService.addLevel);
  }
  getLevels() {
    return useQuery('levels', levelService.getLevels);
  }

  getLevelById(id: string) {
    return useQuery<AxiosResponse<Response<ILevel>>, Response>(['levels/id', id], () =>
      levelService.getLevelById(id),
    );
  }

  getLevelsByAcademy(id: string) {
    return useQuery<AxiosResponse<Response<ILevel[]>>, Response>(
      ['levels/academy', id],
      () => levelService.getLevelsByAcademy(id),
    );
  }

  modifyLevel() {
    return useMutation(levelService.modifylevel);
  }
  
  getLevelsByProgram(programId: string) {
    return useQuery(['levels/program', programId], () =>
      levelService.getLevelsByProgram(programId),
    );
  }
}

export const levelStore = new Levelstore();
