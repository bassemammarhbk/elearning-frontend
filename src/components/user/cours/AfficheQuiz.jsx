import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizByCoursId } from '../../../services/quizservice';

const AfficheQuiz = () => {
  const { coursId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [globalQuestionCount, setGlobalQuestionCount] = useState(1);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizByCoursId(coursId);
        setQuizzes(response.data);

        // Calculate total number of questions across all quizzes
        let count = 0;
        response.data.forEach(quiz => {
          count += quiz.questions.length;
        });
        setGlobalQuestionCount(count);
      } catch (error) {
        console.error('Erreur lors de la récupération des quizzes :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [coursId]);

  const handleOptionChange = (questionKey, optionText) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: optionText,
    }));
  };

  if (loading) return <div>Chargement...</div>;
  if (quizzes.length === 0) return <div>Aucun quiz trouvé.</div>;

  let globalQuestionNumber = 0;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Quiz du cours</h1>

      <div style={{ marginBottom: '2rem', fontWeight: 'bold' }}>
        Total des questions : {globalQuestionCount}
      </div>

      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <h2 style={{ marginBottom: '0.5rem' }}>
            {quiz.title}
          </h2>

          {quiz.questions.map((q, qIdx) => {
            globalQuestionNumber += 1;
            const questionKey = `${quiz._id}-${qIdx}`;

            return (
              <div key={questionKey} style={{ marginTop: '1rem' }}>
                <strong>{`Q${globalQuestionNumber}: ${q.question}`}</strong>
                <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} style={{ mazrginBottom: '0.25rem' }}>
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="radio"
                          name={questionKey}
                          value={opt.text}
                          checked={answers[questionKey] === opt.text}
                          onChange={() => handleOptionChange(questionKey, opt.text)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {opt.text}
                        {opt.isCorrect && (
                          <span style={{ marginLeft: '0.5rem', color: 'green' }}>
                            (Réponse correcte)
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AfficheQuiz;