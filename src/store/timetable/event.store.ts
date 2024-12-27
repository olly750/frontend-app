import { useMutation, useQuery } from 'react-query';

import { eventService } from '../../services/timetable/event.service';

class EventStore {
  createEvent() {
    return useMutation(eventService.createEvent);
  }

  getEventById(id: string) {
    return useQuery(['events/id', id], () => eventService.getEvent(id));
  }

  updateEvent() {
    return useMutation(eventService.modifyEvent);
  }
}

export function getAllEvents(academyId?: string) {
  return useQuery(['events'], () => eventService.getAllEvents(academyId + ''), {
    enabled: !!academyId,
  });
}

export const eventStore = new EventStore();
