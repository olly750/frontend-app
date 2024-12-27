import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { CreateRankReq, RankRes } from '../../types/services/rank.types';

class RankService {
  public async addRank(rank: CreateRankReq): Promise<AxiosResponse<Response<RankRes>>> {
    return await adminstrationAxios.post('/ranks/addRank', rank);
  }

  public async getRanks(): Promise<AxiosResponse<Response<RankRes[]>>> {
    return await adminstrationAxios.get('/ranks/getRanks');
  }

  public async getRank(id: string): Promise<AxiosResponse<Response<RankRes>>> {
    return await adminstrationAxios.get(`/ranks/getRankById/${id}`);
  }

  public async getRankByInstitution(
    id: string,
  ): Promise<AxiosResponse<Response<RankRes[]>>> {
    return await adminstrationAxios.get(`/ranks/getRanksByInstitution/${id}`);
  }

  public async modifyRank(
    rank: CreateRankReq,
  ): Promise<AxiosResponse<Response<RankRes>>> {
    return await adminstrationAxios.put('/ranks/modifyRank', { ...rank });
  }
}

export const rankService = new RankService();
