import React from 'react';
import { Sparkles, X, BookOpenCheck } from 'lucide-react';

const AIQuiz = ({
  quizTopic,
  setQuizTopic,
  quizDifficulty,
  setQuizDifficulty,
  quizGenerating,
  startAiQuizGeneration,
  aiQuizActive,
  setAiQuizActive,
  activeQuizQuestions,
  selectedAnswers,
  quizSubmitted,
  quizScore,
  selectAnswer,
  handleSubmitQuiz,
  practiceQuizzes
}) => {
  return (
    <div className="view-fade-in">
      {/* Highlight AI Generator Button */}
      <div className="gradient-banner" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #C084FC 100%)', padding: '28px 32px' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--heading-font)' }}>
            Generate Quiz with AI ✦
          </h2>
          <p style={{ color: '#F3E8FF', fontSize: '14px', maxWidth: '520px', marginBottom: '16px' }}>
            Generate standard 3-question assessment test sets customized to your syllabus target and track your performance points.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#D8B4FE', textTransform: 'uppercase' }}>Select Syllabus Topic</label>
              <select 
                value={quizTopic} 
                onChange={(e) => setQuizTopic(e.target.value)}
                style={{ height: '36px', borderRadius: '6px', border: 'none', padding: '0 8px', fontSize: '12px', outline: 'none', minWidth: '150px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: '600' }}
              >
                <option value="DSA" style={{ color: '#000' }}>Data Structures (DSA)</option>
                <option value="DBMS" style={{ color: '#000' }}>Database Systems (DBMS)</option>
                <option value="OS" style={{ color: '#000' }}>Operating Systems (OS)</option>
                <option value="CN" style={{ color: '#000' }}>Computer Networks (CN)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#D8B4FE', textTransform: 'uppercase' }}>Select Difficulty</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setQuizDifficulty(diff)}
                    style={{
                      height: '36px',
                      padding: '0 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: quizDifficulty === diff ? 'white' : 'rgba(255,255,255,0.15)',
                      color: quizDifficulty === diff ? 'var(--primary)' : 'white',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={startAiQuizGeneration}
              disabled={quizGenerating}
              className="btn-ai-spark"
              style={{ alignSelf: 'flex-end', height: '36px', boxShadow: 'none', background: '#FFFFFF', color: '#7C3AED' }}
            >
              {quizGenerating ? 'Generating Quiz...' : 'Generate Quiz ✦'}
            </button>
          </div>
        </div>
        <Sparkles className="gradient-banner-bg-sparks" style={{ color: '#C084FC', opacity: 0.25 }} />
      </div>

      {/* Interactive AI Quiz Session Container */}
      {aiQuizActive && (
        <div className="gorgeous-card" style={{ marginBottom: '24px', border: '2px solid #C084FC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>Live AI Generated Practice: {quizTopic} ({quizDifficulty})</h3>
            </div>
            <button 
              onClick={() => setAiQuizActive(false)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeQuizQuestions.map((q, qIdx) => (
              <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: 0, fontWeight: '600', fontSize: '14px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--primary)' }}>Q{qIdx + 1}.</span> {q.question}
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {q.options.map((option, oIdx) => {
                    const isSelected = selectedAnswers[qIdx] === oIdx;
                    const isCorrect = q.correct === oIdx;
                    let btnStyle = {
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.15s'
                    };

                    if (isSelected && !quizSubmitted) {
                      btnStyle.backgroundColor = '#EEF2FF';
                      btnStyle.borderColor = 'var(--primary)';
                      btnStyle.color = 'var(--primary)';
                    }

                    if (quizSubmitted) {
                      btnStyle.cursor = 'default';
                      if (isCorrect) {
                        btnStyle.backgroundColor = '#D1FAE5';
                        btnStyle.borderColor = '#10B981';
                        btnStyle.color = '#065F46';
                      } else if (isSelected) {
                        btnStyle.backgroundColor = '#FEE2E2';
                        btnStyle.borderColor = '#EF4444';
                        btnStyle.color = '#991B1B';
                      }
                    }

                    return (
                      <button 
                        key={oIdx} 
                        style={btnStyle}
                        onClick={() => selectAnswer(qIdx, oIdx)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #6B7280', fontSize: '12px', marginTop: '4px', lineHeight: 1.5 }}>
                    <strong>AI Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '16px', gap: '12px' }}>
              {quizSubmitted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>
                    Final Score: {quizScore} / {activeQuizQuestions.length} Correct
                  </span>
                  <button 
                    className="btn-join-class"
                    onClick={() => {
                      setAiQuizActive(false);
                    }}
                  >
                    Finish
                  </button>
                </div>
              ) : (
                <button 
                  className="btn-join-class" 
                  onClick={handleSubmitQuiz}
                  style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' }}
                >
                  Submit Quiz Answers
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standard practice quizzes listing */}
      <div className="gorgeous-card">
        <h3 className="section-header-title">
          <BookOpenCheck className="h-4 w-4 text-indigo-500" /> Syllabus Practice Tests
        </h3>
        <div className="fancy-table-container">
          <table className="fancy-table">
            <thead>
              <tr>
                <th>Quiz Name</th>
                <th>Subject</th>
                <th>Questions</th>
                <th>Difficulty</th>
                <th>Action / Record</th>
              </tr>
            </thead>
            <tbody>
              {practiceQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>
                    <span style={{ fontWeight: '700', color: '#1E293B' }}>{quiz.title}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: 'var(--primary)' }}>
                      {quiz.subject}
                    </span>
                  </td>
                  <td>{quiz.questions} Qs</td>
                  <td>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: quiz.difficulty === 'Easy' ? '#10B981' : quiz.difficulty === 'Medium' ? '#F59E0B' : '#EF4444'
                    }}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td>
                    {quiz.taken ? (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Score: {quiz.prevScore} (Taken)
                      </span>
                    ) : (
                      <button 
                        className="btn-join-class"
                        onClick={() => {
                          setQuizTopic(quiz.subject);
                          startAiQuizGeneration();
                        }}
                      >
                        Start Quiz
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIQuiz;
