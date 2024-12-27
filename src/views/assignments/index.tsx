import { mainModule } from 'process';
import React, { useEffect, useState } from 'react'; 
import Loader from '../../components/Atoms/custom/Loader'; 
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable'; 
import { Color, GenericStatus } from '../../types';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import StudentViewEvaluations from '../evaluation/StudentViewEvaluations'; 
import Accordion from "../../components/Molecules/Accordion" 
import Panel from '../../components/Atoms/custom/Panel'; 
 





export default function Assignments({ selectedPeriod, studentInfoId }: { selectedPeriod: string, studentInfoId: string }) {
 

  const { data: subjectEvaluations, isLoading: loading,isSuccess } = evaluationStore.getEvaluationsCollectionByLevelStudent(selectedPeriod, studentInfoId);

  const evaluation: any = subjectEvaluations?.data.data;

  return (

            <main className="px-4 ">  
                    {loading ? (<Loader />):(
          <>
                     <div className='mt-8'>           
                                        <Accordion> 
                                          <Panel
                                            width="w-full"
                                            bgColor="main"
                                            key="firstPanelKey"
                                            title="Undone evaluations"
                                            badge={{
                                              text: evaluation.undone_evaluations.length as string,
                                              type: evaluation.undone_evaluations.length === 0 ? GenericStatus.INACTIVE : GenericStatus.ACTIVE, 
                                            }}
                                          >
                                            <div className="md:w-10/12 lg:w-2/3">
                                         <>
                                         {evaluation.undone_evaluations &&
                                          evaluation.undone_evaluations.length > 0 ? (
                                              <div className="flex flex-col gap-6 mt-8">


                                                <StudentViewEvaluations
                                                  isUndone
                                                  subjecEvaluations={evaluation.undone_evaluations || []}
                                                />
                                              </div>
                                            ) :     <NoDataAvailable
                                            showButton={false}
                                            title={'No assignment found'}
                                            description="There is no planned assignment to take. Please wait for the lecture to add some"
                                          />}
                                      
                                          </>
                                            </div>
                                          </Panel>
                                          {/* Second Panel */}
                                          <Panel
                                            width="w-full"
                                            bgColor="main"
                                            key="secondPanelKey"
                                            title="Retake evaluations"
                                            badge={{
                                              text: evaluation.ongoing_evaluations.length as string,
                                              type: evaluation.ongoing_evaluations.length === 0 ? GenericStatus.INACTIVE : GenericStatus.ACTIVE,
                                            }}

                                          >
                                            <div className="md:w-10/12 lg:w-4/3">
                                
                                            {evaluation.ongoing_evaluations &&
                                              evaluation.ongoing_evaluations.length > 0 ? (
                                              <div className="flex flex-col gap-6 mt-8">


                                                <StudentViewEvaluations
                                                  isOngoing
                                                  subjecEvaluations={evaluation.ongoing_evaluations || []}
                                                />
                                              </div>
                                                     ) : <NoDataAvailable
                                                           showButton={false}
                                                           title={'No assignment found'}
                                                           description="Congratulations! There is no planned retake for you."
                                                          />
                                                }
                                   
                                            </div>
                                          </Panel>
                                                  {/* third Panel */}
                                                  <Panel
                                            width="w-full"
                                            bgColor="main"
                                            key="thirdPanelKey"
                                            title="Finished evaluations"
                                            badge={{
                                              text: evaluation.finished_evaluations.length as string,
                                              type: evaluation.finished_evaluations.length === 0 ? GenericStatus.INACTIVE : GenericStatus.ACTIVE,
                                            }}
                                          >
                                            <div className="md:w-10/12 lg:w-4/3">
                                            <>
                                            {evaluation.finished_evaluations &&
                                          evaluation.finished_evaluations.length > 0 ? (
                                              <div className="flex flex-col gap-6 mt-8">


                                                <StudentViewEvaluations
                                                  isCompleted
                                                  subjecEvaluations={evaluation.finished_evaluations || []}
                                                />
                                              </div>
                                            ) : <NoDataAvailable
                                            showButton={false}
                                            title={'No assignment found'}
                                            description="Congratulations! There is no submitted evaluation found."
                                          />}
                                          </>
                                            </div>
                                          </Panel>
                                          
                                          {/* Add more panels as needed */}
                                            </Accordion>
                                            </div> 
          </>)}
          </main>
  );
}
