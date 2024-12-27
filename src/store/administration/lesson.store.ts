import { useMutation, useQuery } from 'react-query';

import { lessonService } from '../../services/administration/lesson.service';

class LessonStore {
  addLesson() {
    return useMutation(lessonService.addLesson);
  }
  getLessons() {
    return useQuery('lessons', lessonService.getLessons);
  }

  getLesson(id: string) {
    return useQuery(['lessons/id', id], () => lessonService.getLesson(id));
  }

  getLessonsBySubject(subjectId: string) {
    return useQuery(['lessons/subject/id', subjectId], () =>
      lessonService.getLessonsBySubject(subjectId),
    );
  }

  modifyLesson() {
    return useMutation(lessonService.modifyLesson);
  }
  addLessonPlan() {
    return useMutation(lessonService.addLessonPlan);
  }
  modifyLessonPlan() {
    return useMutation(lessonService.modifyLessonPlan);
  }
  getLessonPlanById(planId: string) {
    return useQuery(['lessonplan/id', planId], () =>
      lessonService.getLessonPlanById(planId),
    );
  }
  getLessonPlanByLesson(lessonId: string) {
    return useQuery(['lessonplan/lesson/id', lessonId], () =>
      lessonService.getLessonPlanByLesson(lessonId),
    );
  }
}

export const lessonStore = new LessonStore();
