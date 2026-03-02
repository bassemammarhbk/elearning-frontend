"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchFinalTestForCourse, submitFinalQuiz } from "../../../services/quizservice"
import { getCertification } from "../../../services/certificatservice"
import { Button, Card } from "react-bootstrap"
import { toast } from "react-toastify"
import {
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  IconButton,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material"
import {
  ArrowBack,
  ArrowForward,
  CheckCircleOutline,
  ErrorOutline,
  AccessTime,
  EmojiEvents,
  GetApp,
  CheckCircle,
  Cancel,
  LightbulbOutlined,
} from "@mui/icons-material"
import "./etudiant.css"


const FinalTestPage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [finalTest, setFinalTest] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [passed, setPassed] = useState(false)
  const [alreadyPassed, setAlreadyPassed] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confetti, setConfetti] = useState([])
  const [scoreAnimated, setScoreAnimated] = useState(false)

  // Référence pour l'animation du cercle de score
  const scoreCircleRef = useRef(null)

  useEffect(() => {
    const fetchFinalTest = async () => {
      try {
        const data = await fetchFinalTestForCourse(courseId)
        setFinalTest(data)
        setAlreadyPassed(data.alreadyPassed)
        setTimeRemaining(data.timeLimit * 60)
      } catch (err) {
        setError("Aucun test final disponible pour ce cours pour le moment.")
      } finally {
        setLoading(false)
      }
    }
    fetchFinalTest()
  }, [courseId])

  useEffect(() => {
    if (finalTest && timeRemaining > 0 && !quizSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    } else if (finalTest && timeRemaining === 0 && !quizSubmitted) {
      handleSubmitQuiz()
    }
  }, [timeRemaining, quizSubmitted, finalTest])

  // Effet pour générer les confettis
  useEffect(() => {
    if (passed || alreadyPassed) {
      setShowConfetti(true)
      const newConfetti = []
      for (let i = 0; i < 50; i++) {
        newConfetti.push({
          id: i,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
        })
      }
      setConfetti(newConfetti)
    }
  }, [passed, alreadyPassed])

  // Animation du cercle de score
  useEffect(() => {
    if (quizSubmitted && !scoreAnimated && scoreCircleRef.current) {
      const score = calculateScore()
      const circumference = 2 * Math.PI * 95 // 2πr où r est le rayon (100 - stroke-width/2)
      const dashOffset = circumference - (score.percentage / 100) * circumference

      // Définir la variable CSS pour l'animation
      document.documentElement.style.setProperty("--dash-offset", `${dashOffset}px`)

      // Animer le cercle
      const progressCircle = scoreCircleRef.current
      progressCircle.style.strokeDasharray = `${circumference}px`
      progressCircle.style.strokeDashoffset = `${circumference}px`

      // Forcer un reflow pour que l'animation se déclenche
      progressCircle.getBoundingClientRect()

      // Appliquer l'animation
      progressCircle.style.animation = "progressCircle 1.5s ease-out forwards"

      setScoreAnimated(true)
    }
  }, [quizSubmitted, scoreAnimated])

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerId })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < finalTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true)
    try {
      const reponses = finalTest.questions.map((q) =>
        selectedAnswers[q._id] !== undefined ? Number(selectedAnswers[q._id]) : null,
      )
      const res = await submitFinalQuiz(finalTest._id, { reponses })
      const { score, passed: apiPassed, alreadyPassed: apiAlreadyPassed } = res.data
      setPassed(apiPassed)
      setAlreadyPassed(apiAlreadyPassed)

      if (apiAlreadyPassed) {
        toast.info("Vous avez déjà réussi ce test final.")
      } else if (apiPassed) {
        toast.success(`🎉 Test final réussi ! Score : ${Math.round(score)}%`)
      } else {
        toast.error(`❌ Test final échoué. Score : ${Math.round(score)}%`)
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.info("Vous avez déjà réussi ce test final.")
        setAlreadyPassed(true)
      } else {
        toast.error("Erreur lors de la soumission du test.")
      }
    }
  }

  const handleDownloadCertification = async () => {
    try {
      const pdfBlob = await getCertification(courseId)
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "certification.pdf")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("Téléchargement de votre certification réussi !")
    } catch (err) {
      if (err.response && err.response.status === 500) {
        toast.error("Erreur : Données de certification incomplètes. Veuillez vérifier vos informations personnelles.")
      } else {
        toast.error("Erreur lors de la récupération de la certification.")
      }
    }
  }

  const calculateScore = () => {
    let correctCount = 0
    finalTest.questions.forEach((question) => {
      const correctIdx = question.options.findIndex((opt) => opt.isCorrect)
      if (selectedAnswers[question._id] !== undefined && Number(selectedAnswers[question._id]) === correctIdx) {
        correctCount++
      }
    })
    return {
      score: correctCount,
      total: finalTest.questions.length,
      percentage: Math.round((correctCount / finalTest.questions.length) * 100),
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return "var(--success)"
    if (percentage >= 40) return "var(--warning)"
    return "var(--error)"
  }

  const getScoreMessage = (percentage) => {
    if (percentage >= 70) return "Félicitations !"
    if (percentage >= 40) return "Bon effort !"
    return "À réviser !"
  }

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement du test final...
        </Typography>
      </div>
    )

  if (error) {
    return (
      <div className="text-center mt-5 text-danger">
        <p>{error}</p>
        <Button variant="primary" onClick={() => navigate(`/cours/${courseId}`)}>
          Retour au cours
        </Button>
      </div>
    )
  }

  if (!finalTest) return <div className="text-center mt-5">Aucun test final disponible.</div>

  const currentQuestionData = finalTest.questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestionData._id] !== undefined
  const score = quizSubmitted ? calculateScore() : null

  return (
    <Box className="final-test-page">
      <Box className="container">
        <header className="final-test-header">
          <Typography variant="h4" fontWeight="bold">
            {finalTest.title}
          </Typography>
          {!quizSubmitted && !alreadyPassed && (
            <Chip
              icon={<AccessTime />}
              label={formatTime(timeRemaining)}
              color="primary"
              sx={{ fontWeight: 500, mt: 2 }}
            />
          )}
        </header>

        {alreadyPassed ? (
          <div className="certification-container">
            {showConfetti && (
              <div className="confetti-container">
                {confetti.map((item) => (
                  <div
                    key={item.id}
                    className="confetti"
                    style={{ left: item.left, animationDelay: item.animationDelay }}
                  ></div>
                ))}
              </div>
            )}

            <div className="certification-badge">
              <div className="certification-badge-inner">
                <EmojiEvents className="certification-badge-icon" />
              </div>
            </div>

            <h2 className="certification-title">Félicitations !</h2>
            <p className="certification-message">
              Vous avez réussi le test final avec succès. Vous pouvez maintenant télécharger votre certification pour
              valider vos compétences acquises.
            </p>

            <button className="certification-button" onClick={handleDownloadCertification}>
              <GetApp className="certification-button-icon" />
              Télécharger ma certification
            </button>
          </div>
        ) : !quizSubmitted ? (
          <Card className="final-test-card">
            <Card.Header>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" color="primary">
                    {finalTest.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {finalTest.description}
                  </Typography>
                </Box>
                <Chip label={`Question ${currentQuestion + 1} / ${finalTest.questions.length}`} color="secondary" />
              </Box>
            </Card.Header>
            <LinearProgress
              variant="determinate"
              value={((currentQuestion + 1) / finalTest.questions.length) * 100}
              sx={{ height: "6px", mx: 2, mt: 2 }}
            />
            <Card.Body sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {currentQuestionData.question}
              </Typography>
              <RadioGroup
                value={selectedAnswers[currentQuestionData._id] || ""}
                onChange={(e) => handleAnswerSelect(currentQuestionData._id, e.target.value)}
              >
                {currentQuestionData.options.map((option, oIndex) => (
                  <FormControlLabel
                    key={oIndex}
                    value={String(oIndex)}
                    control={<Radio color="primary" />}
                    label={option.text}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
              {showExplanation && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body1">{currentQuestionData.explanation}</Typography>
                </Alert>
              )}
            </Card.Body>
            <Card.Footer sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
              <IconButton onClick={handlePreviousQuestion} disabled={currentQuestion === 0} color="primary">
                <ArrowBack />
              </IconButton>
              {currentQuestion < finalTest.questions.length - 1 ? (
                <IconButton onClick={handleNextQuestion} disabled={!isAnswered} color="primary">
                  <ArrowForward />
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < finalTest.questions.length}
                  sx={{ px: 3 }}
                >
                  Soumettre
                </Button>
              )}
            </Card.Footer>
          </Card>
        ) : (
          <Card className="final-test-card">
            <Card.Header>
              <Typography variant="h5" align="center" color="primary">
                Résultats du test final
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                {finalTest.title}
              </Typography>
            </Card.Header>
            <Card.Body>
              {/* Nouvelle section de résultats */}
              <div className="results-container">
                <div className="score-circle-container">
                  <svg className="score-circle" viewBox="0 0 200 200">
                    <circle className="score-circle-bg" cx="100" cy="100" r="95" />
                    <circle
                      ref={scoreCircleRef}
                      className="score-circle-progress"
                      cx="100"
                      cy="100"
                      r="95"
                      style={{ stroke: getScoreColor(score.percentage) }}
                    />
                  </svg>
                  <div className="score-circle-text">
                    <p className="score-percentage">{score.percentage}%</p>
                    <p className="score-label">Score</p>
                  </div>
                </div>

                <h3 className="score-message">{getScoreMessage(score.percentage)}</h3>
                <p className="score-details">
                  Vous avez obtenu {score.score} sur {score.total} questions
                </p>

                {passed && (
                  <button className="certification-button" onClick={handleDownloadCertification}>
                    <GetApp className="certification-button-icon" />
                    Télécharger ma certification
                  </button>
                )}
              </div>

              <h3 className="questions-review-title">Revue des questions</h3>

              {/* Nouvelle section de revue des questions */}
              {finalTest.questions.map((question, index) => {
                const correctIdx = question.options.findIndex((opt) => opt.isCorrect)
                const selectedIndex = selectedAnswers[question._id]
                const isAnswered = selectedIndex !== undefined
                const isCorrect = isAnswered && Number(selectedIndex) === correctIdx

                return (
                  <div key={question._id} className="question-review-item">
                    <div className={`question-review-header ${isCorrect ? "correct" : "incorrect"}`}>
                      <div className={`question-review-icon ${isCorrect ? "correct" : "incorrect"}`}>
                        {isCorrect ? <CheckCircle /> : <Cancel />}
                      </div>
                      <div>
                        <div className="question-review-number">Question {index + 1}</div>
                        <h4 className="question-review-text">{question.question}</h4>
                      </div>
                    </div>

                    <div className="question-review-body">
                      <div className="answer-comparison">
                        {isAnswered && (
                          <div className={`answer-item your-answer ${isCorrect ? "correct" : "incorrect"}`}>
                            <div>
                              <div className={`answer-label ${isCorrect ? "correct" : "incorrect"}`}>
                                <span className="answer-label-icon">
                                  {isCorrect ? (
                                    <CheckCircleOutline fontSize="small" />
                                  ) : (
                                    <ErrorOutline fontSize="small" />
                                  )}
                                </span>
                                Votre réponse
                              </div>
                              <p className="answer-text">{question.options[Number(selectedIndex)]?.text}</p>
                            </div>
                          </div>
                        )}

                        {!isCorrect && (
                          <div className="answer-item correct-answer">
                            <div>
                              <div className="answer-label correct">
                                <span className="answer-label-icon">
                                  <CheckCircleOutline fontSize="small" />
                                </span>
                                Réponse correcte
                              </div>
                              <p className="answer-text">{question.options[correctIdx]?.text}</p>
                            </div>
                          </div>
                        )}
                      </div>


                    </div>
                  </div>
                )
              })}
            </Card.Body>
            <Card.Footer sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
              <Button variant="outlined" color="primary" onClick={() => navigate(`/cours/${courseId}`)} sx={{ px: 3 }}>
                Retour au cours
              </Button>

              {/* Affiche "Reprendre le test" uniquement si l'étudiant n'a pas réussi */}
              {!passed && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedAnswers({})
                    setCurrentQuestion(0)
                    setTimeRemaining(finalTest.timeLimit * 60)
                    setQuizSubmitted(false)
                    setShowExplanation(false)
                    setScoreAnimated(false)
                  }}
                  sx={{ px: 3 }}
                >
                  Reprendre le test
                </Button>
              )}
            </Card.Footer>
          </Card>
        )}
      </Box>
    </Box>
  )
}

export default FinalTestPage
