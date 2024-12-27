import { AxiosResponse } from 'axios';

import { timetableAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { CreateVenue, VenueInfo } from '../../types/services/event.types';

class VenueService {
  public async getAllVenues(
    academyId: string,
  ): Promise<AxiosResponse<Response<VenueInfo[]>>> {
    return await timetableAxios.get(`/venues/academy/${academyId}`);
  }
  public async searcg(query: string): Promise<AxiosResponse<Response<VenueInfo[]>>> {
    return await timetableAxios.get(`/venues/search?=q${query}`);
  }

  public async getVenue(id: string): Promise<AxiosResponse<Response<VenueInfo>>> {
    return await timetableAxios.get(`/venues/${id}`);
  }

  public async createVenue(
    venue: CreateVenue,
  ): Promise<AxiosResponse<Response<VenueInfo>>> {
    return await timetableAxios.post('/venues', venue);
  }
  public async modifyVenue(
    venue: VenueInfo,
  ): Promise<AxiosResponse<Response<VenueInfo>>> {
    return await timetableAxios.put('/venues', venue);
  }
}

export const venueService = new VenueService();
