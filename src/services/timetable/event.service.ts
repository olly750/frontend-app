import { AxiosResponse } from 'axios';

import { timetableAxios } from '../../plugins/axios';
import { Response } from '../../types';
import { CreateEvent, EventInfo } from '../../types/services/event.types';

class EventService {
  public async getAllEvents(
    academyId: string,
  ): Promise<AxiosResponse<Response<EventInfo[]>>> {
    return await timetableAxios.get(`/events/academy/${academyId}`);
  }

  public async searchEvents(query: string) {
    return await timetableAxios.get(`/events/search?q=${query}`);
  }
  public async getEvent(id: string): Promise<AxiosResponse<Response<EventInfo>>> {
    return await timetableAxios.get(`/events/${id}`);
  }

  public async createEvent(
    event: CreateEvent,
  ): Promise<AxiosResponse<Response<EventInfo>>> {
    return await timetableAxios.post('/events', event);
  }
  public async modifyEvent(
    event: EventInfo,
  ): Promise<AxiosResponse<Response<EventInfo>>> {
    return await timetableAxios.put('/events', event);
  }
}

export const eventService = new EventService();
