import { AxiosResponse } from 'axios';

import { adminstrationAxios } from '../../plugins/axios';
import { Response } from '../../types';
import {
  Lesson,
  LessonInfo,
  LessonPlan,
  LessonPlanInfo,
} from '../../types/services/lesson.types';

class LessonService {
  public async addLesson(lesson: Lesson): Promise<AxiosResponse<Response<LessonInfo>>> {
    return await adminstrationAxios.post('/lessons/addLesson', lesson);
  }

  public async getLessons(): Promise<AxiosResponse<Response<LessonInfo[]>>> {
    return await adminstrationAxios.get('/lessons/getAllLessons');
  }

  public async getLesson(id: string): Promise<AxiosResponse<Response<LessonInfo>>> {
    return await adminstrationAxios.get(`/lessons/getLessonById/${id}`);
  }

  public async getLessonsBySubject(
    subjectId: string,
  ): Promise<AxiosResponse<Response<LessonInfo[]>>> {
    return await adminstrationAxios.get(`/lessons/getLessonsBySubject/${subjectId}`);
  }

  public async modifyLesson(lesson: Lesson): Promise<AxiosResponse<Response<Lesson>>> {
    return await adminstrationAxios.put('/lessons/modifyLesson', lesson);
  }
  public async addLessonPlan(
    lessonPlan: LessonPlan,
  ): Promise<AxiosResponse<Response<LessonPlan>>> {
    return await adminstrationAxios.post('/lessonPlans/addLessonPlan', lessonPlan);
  }

  public async modifyLessonPlan(
    lessonPlan: LessonPlan,
  ): Promise<AxiosResponse<Response<LessonInfo>>> {
    return await adminstrationAxios.put('/lessonPlans/modifyLessonPlan', lessonPlan);
  }

  public async getLessonPlanById(
    planId: string,
  ): Promise<AxiosResponse<Response<LessonPlanInfo>>> {
    return await adminstrationAxios.get(`/lessonPlans/getLessonPlanById/${planId}`);
  }

  public async getLessonPlanByLesson(
    lessonId: string,
  ): Promise<AxiosResponse<Response<LessonPlanInfo[]>>> {
    return await adminstrationAxios.get(
      `/lessonPlans/getLessonPlansByLesson/${lessonId}`,
    );
  }
}

export const lessonService = new LessonService();
