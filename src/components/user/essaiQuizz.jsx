"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getQuizByCoursId } from "../../services/quizservice"

const CourseQuizzesPage = () => {
  const { courseId } = useParams()

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizByCoursId(courseId)
        setQuizzes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [courseId])

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Aucun quiz disponible</h2>
          <p className="text-gray-600 mb-4">Ce cours ne contient pas encore de quiz.</p>
          <Link
            to={`/student/courses/${courseId}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Retour au cours
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz du cours</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="text-gray-600 mb-4">{quiz.description}</p>

              <div className="flex flex-col space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span>{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span>{quiz.timeLimit} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Score minimum:</span>
                  <span>{quiz.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{quiz.isFinalTest ? "Test final" : "Quiz"}</span>
                </div>
              </div>

              <Link
                to={`/student/quiz/${quiz._id}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition"
              >
                Commencer le quiz
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to={`/student/courses/${courseId}`}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Retour au cours
        </Link>
      </div>
    </div>
  )
}

export default CourseQuizzesPage
