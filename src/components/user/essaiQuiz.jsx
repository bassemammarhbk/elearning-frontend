"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getQuizByCoursId, submitQuizAnswers } from "../../services/quizservice"


const QuizPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)

  // Charger le quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizByCoursId(id)
        setQuiz(quizData)
        setAnswers(new Array(quizData.questions.length).fill(null))
        setTimeLeft(quizData.timeLimit * 60) // Convertir en secondes
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  // Gérer le compte à rebours
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Vérifier si le temps est écoulé
  useEffect(() => {
    if (timeLeft === 0 && !result) {
      handleSubmit()
    }
  }, [timeLeft, result])

  // Vérifier si toutes les questions ont une réponse
  useEffect(() => {
    if (answers.length > 0) {
      const allAnswered = answers.every((answer) => answer !== null)
      setAllQuestionsAnswered(allAnswered)
    }
  }, [answers])

  // Gérer la sélection d'une réponse
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = optionIndex
    setAnswers(newAnswers)
  }

  // Soumettre le quiz
  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const quizResult = await submitQuizAnswers(id, answers)
      setResult(quizResult)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formater le temps restant
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Retour
        </button>
      </div>
    )
  }

  if (result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <QuizResult result={result} quizId={id} courseId={quiz.course} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Temps restant: {formatTime(timeLeft)}</div>
        </div>
        <p className="text-gray-600 mb-2">{quiz.description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Score minimum pour réussir: {quiz.passingScore}%</span>
          <span>Questions: {quiz.questions.length}</span>
        </div>
      </div>

      {quiz.questions.map((question, index) => (
        <QuizQuestion
          key={index}
          question={question}
          index={index}
          selectedAnswer={answers[index]}
          onAnswerSelect={handleAnswerSelect}
        />
      ))}

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          {allQuestionsAnswered ? (
            <span className="text-green-600">Toutes les questions ont été répondues</span>
          ) : (
            <span className="text-yellow-600">Certaines questions n'ont pas encore de réponse</span>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Soumission en cours..." : "Soumettre le quiz"}
        </button>
      </div>
    </div>
  )
}

export default QuizPage
