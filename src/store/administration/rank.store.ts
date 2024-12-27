import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';

import { rankService } from '../../services/administration/rank.service';
import { Response } from '../../types';
import { RankRes } from '../../types/services/rank.types';

class RankStore {
  addRank() {
    return useMutation(rankService.addRank);
  }
  getRanks() {
    return useQuery('ranks', rankService.getRanks);
  }
  getRank(id: string) {
    return useQuery<AxiosResponse<Response<RankRes>>, Response>(['ranks/id'], () =>
      rankService.getRank(id),
    );
  }
  getRankByInstitution(id: string) {
    return useQuery<AxiosResponse<Response<RankRes[]>>, Response>(
      ['ranks/institution', id],
      () => rankService.getRankByInstitution(id),
    );
  }
  modifyRank() {
    return useMutation(rankService.modifyRank);
  }
}

export const rankStore = new RankStore();
