import axios from '../api/axios'
const quizApi = 'quizzes'

export const getQuiz = async ()=>{
    return await axios.get(quizApi)
}
export const getQuizById = async (quizId)=>{
    return await axios.get(quizApi + '/' + quizId)
}
export const deleteQuiz = async (quizId)=>{
    return await axios.delete (quizApi + '/' + quizId)
}
export const addQuiz = async (quiz) => {
  return await axios.post(quizApi, quiz);
};
export const editQuiz = async (user) =>{
    return await axios.put(quizApi +'/'+user._id,user)
}
export const getQuizByCoursId = async (coursId) => {
    return await axios.get(`${quizApi}/cours/${coursId}`);
  };

  export const submitQuiz = async (quizId, reponses) => {
    return await axios.post(`${quizApi}/${quizId}/submit`, reponses);
  };
  export const getQuizByChapterId = async (chapterId) => {
    return await axios.get(`${quizApi}/chapter/${chapterId}`);
  };
export const getQuizzesReussis = async (userId) => {
  return await axios.get(`quizzes/${userId}/quizzes-reussis`);
};
export const fetchFinalTestForCourse = async (courseId) => {
  const res = await axios.get(`/quizzes/cours/${courseId}/final-test`);
  return {
    ...res.data.test,
    alreadyPassed: res.data.alreadyPassed
  };
};
export const submitFinalQuiz = (quizId, payload) =>
  axios.post(`/quizzes/${quizId}/submit-final`, payload);

export const createFinalQuiz = async (courseId, quizData) => {
  // on part de baseURL = http://localhost:4000/api
  // on appelle donc simplement /quizzes/final/:courseId
  const response =await axios.post(`/quizzes/final/${courseId}`, quizData);
  return response.data
}
export const fetchTeacherFinalTestForCourse = async (courseId) => {
  const res = await axios.get(`/quizzes/cours/${courseId}/teacher-final-test`);
  return res.data;
};
// Delete a specific question
export const deleteQuestion = async (quizId, questionIndex) => {
  const response = await axios.delete(`/quizzes/${quizId}/questions/${questionIndex}`);
  return response.data;
};

// Edit a specific question
export const editQuestion = async (quizId, questionIndex, questionData) => {
  const response = await axios.patch(`/quizzes/${quizId}/questions/${questionIndex}`, questionData);
  return response.data;
};
export const updateQuizInfo = async (quizId, data) => {
  // on retire le "/api" devant, pour ne pas dupliquer
  const response = await axios.put(`/quizzes/${quizId}`, data);
  return response.data;
};
export const updateQuiz = async (quizId, updateData) => {
  return await axios.patch(`/api/quizzes/${quizId}`, updateData);
};
export const deleteQuestionFromQuiz = async (quizId, questionIndex) => {
  try {
    const response = await axios.delete(`/quizzes/${quizId}/questions/${questionIndex}`);
    return response;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Erreur lors de la suppression de la question');
  }
};
export const addQuestion = async (quizId, questionData) => {
  const response = await axios.post(`/quizzes/${quizId}/questions`, questionData);
  return response.data;
};
