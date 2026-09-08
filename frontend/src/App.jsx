import { useState } from "react";
import "./App.css";

/* =========================================
   UNDERWATER DECORATIONS
   ========================================= */

function OceanDecorations() {
  return (
    <>
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <div className="bubble bubble-5"></div>
      <div className="bubble bubble-6"></div>
      <div className="bubble bubble-7"></div>

      <div className="fish fish-1">🐠</div>
      <div className="fish fish-2">🐟</div>
      <div className="fish fish-3">🐡</div>
      <div className="fish fish-4">🐠</div>
      <div className="fish fish-5">🐟</div>
      <div className="fish fish-6">🐠</div>

      <div className="coral coral-1">🪸</div>
      <div className="coral coral-2">🪸</div>
      <div className="coral coral-3">🪸</div>

      <div className="scuba-diver">🤿</div>
    </>
  );
}

/* =========================================
   CALENDAR
   ========================================= */

function Calendar({ onBack }) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("pearlprep-calendar-tasks") || "{}"
      );
    } catch {
      return {};
    }
  });

  const [taskText, setTaskText] = useState("");

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(
      "pearlprep-calendar-tasks",
      JSON.stringify(updatedTasks)
    );
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentMonth(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );
    setSelectedDate(
      today.toISOString().split("T")[0]
    );
  };

  const makeDateKey = (day) => {
    return `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  };

  const addTask = () => {
    if (!taskText.trim()) return;

    const updatedTasks = {
      ...tasks,
      [selectedDate]: [
        ...(tasks[selectedDate] || []),
        {
          id: Date.now(),
          text: taskText.trim(),
          completed: false,
        },
      ],
    };

    saveTasks(updatedTasks);
    setTaskText("");
  };

  const toggleTask = (taskId) => {
    const updatedTasks = {
      ...tasks,
      [selectedDate]: (tasks[selectedDate] || []).map(
        (task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
              }
            : task
      ),
    };

    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = {
      ...tasks,
      [selectedDate]: (tasks[selectedDate] || []).filter(
        (task) => task.id !== taskId
      ),
    };

    saveTasks(updatedTasks);
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const selectedTasks = tasks[selectedDate] || [];

  return (
    <div className="app">
      <div className="ocean-background quiz-page">
        <OceanDecorations />

        <header className="calendar-header">
          <button
            className="back-button"
            onClick={onBack}
          >
            ←
          </button>

          <div className="calendar-title">
            <div className="quiz-title-pearl">
              🦪
            </div>

            <div>
              <h2>Study Calendar</h2>
              <p>Plan. Practice. Shine.</p>
            </div>
          </div>

          <button
            className="today-button"
            onClick={goToToday}
          >
            Today
          </button>
        </header>

        <main className="calendar-container">
          <div className="calendar-card">

            <div className="calendar-top">
              <button
                className="calendar-nav"
                onClick={previousMonth}
              >
                ←
              </button>

              <div>
                <h1>
                  {monthName} {year}
                </h1>
                <p>
                  Organize your learning journey 🐚
                </p>
              </div>

              <button
                className="calendar-nav"
                onClick={nextMonth}
              >
                →
              </button>
            </div>

            <div className="calendar-weekdays">
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="calendar-day empty"
                    />
                  );
                }

                const dateKey = makeDateKey(day);

                const isToday =
                  dateKey ===
                  today.toISOString().split("T")[0];

                const isSelected =
                  dateKey === selectedDate;

                const hasTasks =
                  (tasks[dateKey] || []).length > 0;

                const completedTasks =
                  (tasks[dateKey] || []).filter(
                    (task) => task.completed
                  ).length;

                return (
                  <button
                    key={dateKey}
                    className={`calendar-day ${
                      isToday ? "today" : ""
                    } ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      setSelectedDate(dateKey)
                    }
                  >
                    <span className="day-number">
                      {day}
                    </span>

                    {hasTasks && (
                      <span className="task-indicator">
                        {completedTasks ===
                        (tasks[dateKey] || []).length
                          ? "✓"
                          : "•"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="calendar-task-panel">
              <div className="selected-date-title">
                <span>📅</span>
                <div>
                  <strong>
                    {new Date(
                      `${selectedDate}T00:00:00`
                    ).toLocaleDateString(
                      "default",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </strong>
                  <small>
                    Your study tasks
                  </small>
                </div>
              </div>

              <div className="task-input-row">
                <input
                  type="text"
                  value={taskText}
                  onChange={(e) =>
                    setTaskText(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask();
                    }
                  }}
                  placeholder="Add a study task..."
                />

                <button
                  className="add-task-button"
                  onClick={addTask}
                >
                  + Add
                </button>
              </div>

              <div className="task-list">
                {selectedTasks.length === 0 ? (
                  <div className="no-tasks">
                    🐚 No tasks for this day yet.
                    <br />
                    Add something you want to study!
                  </div>
                ) : (
                  selectedTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`study-task ${
                        task.completed
                          ? "completed"
                          : ""
                      }`}
                    >
                      <button
                        className="task-check"
                        onClick={() =>
                          toggleTask(task.id)
                        }
                      >
                        {task.completed
                          ? "✓"
                          : ""}
                      </button>

                      <span>{task.text}</span>

                      <button
                        className="task-delete"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                        aria-label="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================
   MAIN APP
   ========================================= */

function App() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] =
    useState("Medium");
  const [purpose, setPurpose] = useState(
    "Technical Interview"
  );

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] =
    useState("ready");

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  const [quizStarted, setQuizStarted] =
    useState(false);
  const [currentQuestion, setCurrentQuestion] =
    useState(0);
  const [selectedAnswer, setSelectedAnswer] =
    useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] =
    useState(false);

  const [userAnswers, setUserAnswers] =
    useState({});
  const [showReview, setShowReview] =
    useState(false);

  const [skippedQuestions, setSkippedQuestions] =
    useState({});

  const [showCalendar, setShowCalendar] =
    useState(false);

  /* =========================================
     GENERATE QUIZ
     ========================================= */

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setModalType("error");
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/generate-quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic.trim(),
            difficulty,
            purpose,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate quiz"
        );
      }

      const data = await response.json();

      setQuiz(data);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setFinished(false);

      setUserAnswers({});
      setSkippedQuestions({});
      setShowReview(false);

      setModalType("ready");
      setShowModal(true);
    } catch (error) {
      console.error(error);

      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     GET QUESTIONS
     ========================================= */

  const getQuestions = () => {
    if (!quiz) {
      return [];
    }

    if (Array.isArray(quiz.questions)) {
      return quiz.questions;
    }

    if (Array.isArray(quiz.quiz)) {
      return quiz.quiz;
    }

    return [];
  };

  const questions = getQuestions();
  const question = questions[currentQuestion];

  /* =========================================
     QUESTION HELPERS
     ========================================= */

  const getQuestionText = (q) => {
    return (
      q?.question ||
      q?.text ||
      q?.prompt ||
      "Question unavailable"
    );
  };

  const getOptions = (q) => {
    if (!q) {
      return [];
    }

    if (Array.isArray(q.options)) {
      return q.options;
    }

    if (Array.isArray(q.choices)) {
      return q.choices;
    }

    return [];
  };

  const getCorrectAnswer = (q) => {
    return (
      q?.answer ??
      q?.correct_answer ??
      q?.correctAnswer ??
      q?.correct_option ??
      null
    );
  };

  const normalize = (value) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  };

  /* =========================================
     START QUIZ
     ========================================= */

  const startQuiz = () => {
    setShowModal(false);
    setQuizStarted(true);
    setFinished(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);

    setUserAnswers({});
    setSkippedQuestions({});
    setShowReview(false);
  };

  /* =========================================
     ANSWER QUESTION
     ========================================= */

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    setUserAnswers(
      (previousAnswers) => ({
        ...previousAnswers,
        [currentQuestion]: answer,
      })
    );

    setSkippedQuestions(
      (previousSkipped) => {
        const updated = {
          ...previousSkipped,
        };

        delete updated[currentQuestion];

        return updated;
      }
    );

    const correct =
      getCorrectAnswer(question);

    if (
      correct !== null &&
      normalize(answer) ===
        normalize(correct)
    ) {
      setScore((prev) => prev + 1);
    }
  };

  /* =========================================
     SKIP QUESTION
     ========================================= */

  const skipQuestion = () => {
    setSkippedQuestions(
      (previousSkipped) => ({
        ...previousSkipped,
        [currentQuestion]: true,
      })
    );

    setUserAnswers(
      (previousAnswers) => {
        const updated = {
          ...previousAnswers,
        };

        delete updated[currentQuestion];

        return updated;
      }
    );

    setSelectedAnswer(null);

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );

      setSelectedAnswer(null);
    } else {
      setFinished(true);
    }
  };

  /* =========================================
     NEXT QUESTION
     ========================================= */

  const nextQuestion = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );

      setSelectedAnswer(null);
    } else {
      setFinished(true);
    }
  };

  /* =========================================
     RESTART
     ========================================= */

  const restartQuiz = () => {
    setQuizStarted(false);
    setFinished(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);

    setUserAnswers({});
    setSkippedQuestions({});
    setShowReview(false);
  };

  /* =========================================
     CLOSE MODAL
     ========================================= */

  const closeModal = () => {
    setShowModal(false);
  };

  /* =========================================
     GET WRONG QUESTIONS
     ========================================= */

  const getWrongQuestions = () => {
    return questions
      .map((q, index) => {
        const userAnswer =
          userAnswers[index];

        const correctAnswer =
          getCorrectAnswer(q);

        const isCorrect =
          userAnswer !== undefined &&
          normalize(userAnswer) ===
            normalize(correctAnswer);

        return {
          question: q,
          index,
          userAnswer,
          correctAnswer,
          isCorrect,
        };
      })
      .filter(
        (item) =>
          item.userAnswer !== undefined &&
          !item.isCorrect
      );
  };

  /* =========================================
     CALENDAR PAGE
     ========================================= */

  if (showCalendar && !quizStarted) {
    return (
      <Calendar
        onBack={() => setShowCalendar(false)}
      />
    );
  }

  /* =========================================
     HOME PAGE
     ========================================= */

  if (!quizStarted) {
    return (
      <div className="app">
        <div className="ocean-background home-page">

          <OceanDecorations />

          {/* HEADER */}

          <header className="top-header">

            <div className="brand">
              <div className="brand-icon">
                🦪
              </div>

              <div>
                <h1>PearlPrep</h1>
                <p>
                  Prepare. Practice. Shine.
                </p>
              </div>
            </div>

            <div className="home-header-actions">

              <button
                className="calendar-open-button"
                onClick={() =>
                  setShowCalendar(true)
                }
              >
                📅 Calendar
              </button>

              <div className="header-pearl">
                ✨
              </div>

            </div>

          </header>

          {/* MAIN */}

          <main className="home-content">

            {/* HERO */}

            <section className="hero-section">

              <div className="hero-pearl">
                🦪
              </div>

              <h2>
                Turn Knowledge
                <br />
                Into <span>Pearls</span>
              </h2>

              <p className="hero-description">
                Create personalized quizzes and
                practice your skills with PearlPrep.
              </p>

            </section>

            {/* QUIZ CARD */}

            <section className="quiz-card">

              <div className="card-header">

                <div>
                  <h3>Create Your Quiz</h3>

                  <p>
                    Tell us what you want to practice.
                  </p>
                </div>

                <div className="small-pearl">
                  🫧
                </div>

              </div>

              {/* TOPIC */}

              <div className="form-group">
                <label>Topic</label>

                <input
                  type="text"
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  placeholder="e.g. Python, Java, SQL..."
                />
              </div>

              {/* DIFFICULTY */}

              <div className="form-group">
                <label>Difficulty</label>

                <div className="select-wrapper">

                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value)
                    }
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                    <option>Mixed</option>
                  </select>

                </div>
              </div>

              {/* PURPOSE */}

              <div className="form-group">
                <label>Purpose</label>

                <div className="select-wrapper">

                  <select
                    value={purpose}
                    onChange={(e) =>
                      setPurpose(e.target.value)
                    }
                  >
                    <option>
                      Technical Interview
                    </option>

                    <option>
                      Exam Preparation
                    </option>

                    <option>
                      Practice
                    </option>

                    <option>
                      Placement Preparation
                    </option>
                  </select>

                </div>
              </div>

              {/* CREATE BUTTON */}

              <button
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading
                  ? "Creating your quiz..."
                  : "Create My Quiz ✨"}
              </button>

            </section>

            {/* FEATURES */}

            <section className="feature-row">

              <div className="feature">
                <div className="feature-icon">
                  🎯
                </div>

                <h4>Personalized</h4>

                <p>
                  Built for your goal
                </p>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  🧠
                </div>

                <h4>Practice</h4>

                <p>
                  Test your knowledge
                </p>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  ⭐
                </div>

                <h4>Improve</h4>

                <p>
                  Track your progress
                </p>
              </div>

            </section>

          </main>

          {/* FOOTER */}

          <footer className="footer">
            <p>
              Made with 🦪 for curious minds
            </p>
          </footer>

        </div>

        {/* READY MODAL */}

        {showModal &&
          modalType === "ready" && (
            <div
              className="modal-overlay"
              onClick={closeModal}
            >

              <div
                className="ocean-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div className="modal-pearl">
                  🦪
                </div>

                <h2>
                  Your quiz is ready!
                </h2>

                <p>
                  We created{" "}
                  <strong>
                    {questions.length} questions
                  </strong>{" "}
                  for you.
                </p>

                <div className="quiz-info">

                  <div>
                    <span>Topic</span>
                    <strong>{topic}</strong>
                  </div>

                  <div>
                    <span>Difficulty</span>
                    <strong>
                      {difficulty}
                    </strong>
                  </div>

                  <div>
                    <span>Purpose</span>
                    <strong>
                      {purpose}
                    </strong>
                  </div>

                </div>

                <button
                  className="generate-button"
                  onClick={startQuiz}
                >
                  Start Quiz 🌊
                </button>

                <button
                  className="close-button"
                  onClick={closeModal}
                >
                  Maybe Later
                </button>

              </div>
            </div>
          )}

        {/* ERROR MODAL */}

        {showModal &&
          modalType === "error" && (
            <div
              className="modal-overlay"
              onClick={closeModal}
            >

              <div
                className="ocean-modal error-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div className="modal-pearl">
                  🌊
                </div>

                <h2>
                  {topic.trim()
                    ? "Oops!"
                    : "Choose a topic"}
                </h2>

                <p>
                  {topic.trim()
                    ? "We couldn't create the quiz right now. Please make sure the backend is running."
                    : "Enter a topic before creating your quiz."}
                </p>

                <button
                  className="generate-button"
                  onClick={closeModal}
                >
                  Okay
                </button>

              </div>

            </div>
          )}

      </div>
    );
  }

  /* =========================================
     REVIEW WRONG ANSWERS PAGE
     ========================================= */

  if (finished && showReview) {

    const wrongQuestions =
      getWrongQuestions();

    return (
      <div className="app">

        <div className="ocean-background quiz-page">

          <OceanDecorations />

          <main className="review-container">

            <div className="review-header">

              <div className="result-pearl">
                🦪
              </div>

              <p className="result-label">
                QUIZ REVIEW
              </p>

              <h1>
                Let's Polish Your Mistakes
              </h1>

              <p className="review-subtitle">
                Review the questions you answered
                incorrectly.
              </p>

            </div>

            {wrongQuestions.length === 0 ? (

              <div className="review-card perfect-review">

                <div className="review-success-icon">
                  🏆
                </div>

                <h2>
                  Perfect Score!
                </h2>

                <p>
                  Amazing! You answered every
                  attempted question correctly.
                  Nothing to review. 🦪✨
                </p>

              </div>

            ) : (

              <div className="review-list">

                {wrongQuestions.map(
                  (item, index) => (

                    <div
                      className="review-card"
                      key={item.index}
                    >

                      <div className="review-question-number">
                        Question {index + 1}
                      </div>

                      <h2>
                        {getQuestionText(
                          item.question
                        )}
                      </h2>

                      <div className="review-answer wrong-review">

                        <span className="review-answer-label">
                          ❌ Your Answer
                        </span>

                        <strong>
                          {item.userAnswer}
                        </strong>

                      </div>

                      <div className="review-answer correct-review">

                        <span className="review-answer-label">
                          ✅ Correct Answer
                        </span>

                        <strong>
                          {item.correctAnswer}
                        </strong>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            <button
              className="generate-button review-back-button"
              onClick={() =>
                setShowReview(false)
              }
            >
              ← Back to Score
            </button>

          </main>

        </div>

      </div>
    );
  }

  /* =========================================
     RESULT PAGE
     ========================================= */

  if (finished) {

    const percentage =
      questions.length > 0
        ? Math.round(
            (score / questions.length) *
              100
          )
        : 0;

    const wrongCount =
      getWrongQuestions().length;

    const skippedCount =
      Object.keys(
        skippedQuestions
      ).length;

    let message =
      "Keep practicing! 🌱";

    if (percentage >= 80) {
      message =
        "Amazing work! You really shined! 🦪✨";
    } else if (percentage >= 60) {
      message =
        "Great job! Keep polishing your skills! 🌊";
    }

    return (
      <div className="app">

        <div className="ocean-background quiz-page">

          <OceanDecorations />

          <div className="result-card">

            <div className="result-pearl">
              🦪
            </div>

            <p className="result-label">
              QUIZ COMPLETE
            </p>

            <h1>
              Your Pearl Score
            </h1>

            <div className="score-circle">

              <span>
                {score}
              </span>

              <small>
                /{questions.length}
              </small>

            </div>

            <div className="percentage">
              {percentage}%
            </div>

            <p className="result-message">
              {message}
            </p>

            <div className="result-stats">

              <div>
                <strong>
                  {score}
                </strong>

                <span>
                  Correct
                </span>
              </div>

              <div>
                <strong>
                  {wrongCount}
                </strong>

                <span>
                  Incorrect
                </span>
              </div>

              <div>
                <strong>
                  {skippedCount}
                </strong>

                <span>
                  Skipped
                </span>
              </div>

            </div>

            {wrongCount > 0 && (
              <button
                className="review-button"
                onClick={() =>
                  setShowReview(true)
                }
              >
                📖 Review Wrong Answers
              </button>
            )}

            <button
              className="generate-button"
              onClick={restartQuiz}
            >
              Create Another Quiz ✨
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================
     QUIZ PAGE
     ========================================= */

  return (
    <div className="app">

      <div className="ocean-background quiz-page">

        <OceanDecorations />

        {/* QUIZ HEADER */}

        <header className="quiz-header">

          <button
            className="back-button"
            onClick={restartQuiz}
          >
            ←
          </button>

          <div className="quiz-title">

            <div className="quiz-title-pearl">
              🦪
            </div>

            <div>

              <h2>
                {topic}
              </h2>

              <p>
                {purpose}
              </p>

            </div>

          </div>

          <div className="score-badge">
            ⭐ {score}
          </div>

        </header>

        {/* QUIZ CONTENT */}

        <main className="quiz-container">

          {/* PROGRESS */}

          <div className="question-progress">

            <div className="progress-text">

              <span>
                Question{" "}
                {currentQuestion + 1} of{" "}
                {questions.length}
              </span>

              <span>
                {Math.round(
                  ((currentQuestion + 1) /
                    questions.length) *
                    100
                )}
                %
              </span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      questions.length) *
                      100
                  }%`,
                }}
              ></div>

            </div>

          </div>

          {/* QUESTION CARD */}

          <div className="question-card">

            <div className="question-type">
              {question?.type ||
                question?.question_type ||
                "Question"}
            </div>

            <h1>
              {getQuestionText(question)}
            </h1>

            {/* ANSWERS */}

            <div className="answer-list">

              {getOptions(question).map(
                (option, index) => {

                  const correct =
                    getCorrectAnswer(
                      question
                    );

                  const isSelected =
                    selectedAnswer ===
                    option;

                  const isCorrect =
                    normalize(option) ===
                    normalize(correct);

                  let answerClass =
                    "answer-option";

                  if (
                    selectedAnswer !==
                    null
                  ) {

                    if (isCorrect) {
                      answerClass +=
                        " correct";
                    }

                    if (
                      isSelected &&
                      !isCorrect
                    ) {
                      answerClass +=
                        " wrong";
                    }

                  }

                  return (
                    <button
                      key={index}
                      className={answerClass}
                      onClick={() =>
                        handleAnswer(option)
                      }
                      disabled={
                        selectedAnswer !==
                        null
                      }
                    >

                      <span className="option-letter">

                        {question?.type ===
                        "True / False"
                          ? index === 0
                            ? "T"
                            : "F"
                          : String.fromCharCode(
                              65 + index
                            )}

                      </span>

                      <span className="option-text">
                        {option}
                      </span>

                    </button>
                  );
                }
              )}

            </div>

            {/* FEEDBACK */}

            {selectedAnswer !== null && (

              <div
                className={
                  normalize(
                    selectedAnswer
                  ) ===
                  normalize(
                    getCorrectAnswer(
                      question
                    )
                  )
                    ? "answer-feedback correct-feedback"
                    : "answer-feedback wrong-feedback"
                }
              >

                {normalize(
                  selectedAnswer
                ) ===
                normalize(
                  getCorrectAnswer(
                    question
                  )
                ) ? (

                  <>
                    <strong>
                      Correct! 🎉
                    </strong>

                    <span>
                      Great job. Keep going!
                    </span>
                  </>

                ) : (

                  <>
                    <strong>
                      Not quite! 💡
                    </strong>

                    <span>
                      Correct answer:{" "}
                      <strong>
                        {getCorrectAnswer(
                          question
                        )}
                      </strong>
                    </span>
                  </>

                )}

              </div>

            )}

            {/* ACTION BUTTONS */}

            <div className="quiz-actions">

              <button
                className="skip-button"
                onClick={skipQuestion}
                disabled={
                  selectedAnswer !==
                  null
                }
              >
                Skip Question ⏭️
              </button>

              <button
                className="next-button"
                onClick={nextQuestion}
                disabled={
                  selectedAnswer === null
                }
              >
                {currentQuestion ===
                questions.length - 1
                  ? "Finish Quiz 🦪"
                  : "Next Question →"}
              </button>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default App;