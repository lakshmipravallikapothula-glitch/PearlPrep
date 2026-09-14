from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random


app = FastAPI(
    title="PearlPrep API",
    description="Quiz generation API for PearlPrep",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request Model
# --------------------------------------------------

class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    purpose: str


# --------------------------------------------------
# Helper
# --------------------------------------------------

def shuffle_options(options, correct_answer):
    """
    Shuffle options while keeping the correct answer
    value unchanged.
    """

    shuffled = options.copy()
    random.shuffle(shuffled)

    return shuffled, correct_answer


# --------------------------------------------------
# MCQ Questions
# --------------------------------------------------

def create_mcq_questions(topic):
    questions = [
        {
            "type": "Multiple Choice",
            "question": f"What is the primary purpose of learning {topic}?",
            "options": [
                "To solve problems using the concepts of the subject",
                "To avoid writing any programs",
                "To replace all software",
                "To remove the need for testing",
            ],
            "answer": "To solve problems using the concepts of the subject",
        },
        {
            "type": "Multiple Choice",
            "question": f"Which approach is generally useful when studying {topic}?",
            "options": [
                "Understanding concepts and practicing examples",
                "Memorizing every character",
                "Avoiding practical exercises",
                "Never reviewing mistakes",
            ],
            "answer": "Understanding concepts and practicing examples",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is an important skill when working with {topic}?",
            "options": [
                "Problem solving",
                "Ignoring errors",
                "Avoiding documentation",
                "Never testing results",
            ],
            "answer": "Problem solving",
        },
        {
            "type": "Multiple Choice",
            "question": f"Why is debugging useful when working with {topic}?",
            "options": [
                "It helps identify and fix problems",
                "It deletes the entire project",
                "It prevents learning",
                "It removes all requirements",
            ],
            "answer": "It helps identify and fix problems",
        },
        {
            "type": "Multiple Choice",
            "question": f"What should you do when you do not understand a {topic} concept?",
            "options": [
                "Break it into smaller concepts and practice",
                "Ignore it permanently",
                "Skip every related topic",
                "Stop testing completely",
            ],
            "answer": "Break it into smaller concepts and practice",
        },
        {
            "type": "Multiple Choice",
            "question": f"Which activity improves practical knowledge of {topic}?",
            "options": [
                "Building small projects",
                "Only reading titles",
                "Avoiding examples",
                "Deleting practice code",
            ],
            "answer": "Building small projects",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is documentation useful for in {topic}?",
            "options": [
                "Understanding how features and tools work",
                "Making programs impossible to understand",
                "Removing all functionality",
                "Preventing collaboration",
            ],
            "answer": "Understanding how features and tools work",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is a good first step when solving a {topic} problem?",
            "options": [
                "Understand the requirements",
                "Immediately delete the code",
                "Ignore the expected result",
                "Avoid identifying inputs",
            ],
            "answer": "Understand the requirements",
        },
        {
            "type": "Multiple Choice",
            "question": f"Why are examples important when learning {topic}?",
            "options": [
                "They connect concepts with practical usage",
                "They eliminate the need for understanding",
                "They make testing unnecessary",
                "They prevent experimentation",
            ],
            "answer": "They connect concepts with practical usage",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is a useful habit while preparing for a {topic} interview?",
            "options": [
                "Practice explaining your reasoning",
                "Avoid solving problems",
                "Memorize only question numbers",
                "Never review incorrect answers",
            ],
            "answer": "Practice explaining your reasoning",
        },
        {
            "type": "Multiple Choice",
            "question": f"What does testing help verify in a {topic} project?",
            "options": [
                "Whether the implementation behaves as expected",
                "Whether the project has a logo",
                "Whether the keyboard works",
                "Whether documentation has images",
            ],
            "answer": "Whether the implementation behaves as expected",
        },
        {
            "type": "Multiple Choice",
            "question": f"Which method is useful for mastering difficult {topic} concepts?",
            "options": [
                "Practice progressively harder problems",
                "Avoid all difficult problems",
                "Only read definitions",
                "Never revisit mistakes",
            ],
            "answer": "Practice progressively harder problems",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is an algorithm in the context of {topic}?",
            "options": [
                "A defined sequence of steps for solving a problem",
                "A computer monitor",
                "A file extension",
                "A user password",
            ],
            "answer": "A defined sequence of steps for solving a problem",
        },
        {
            "type": "Multiple Choice",
            "question": f"Why should code related to {topic} be readable?",
            "options": [
                "Readable code is easier to understand and maintain",
                "Readable code always runs faster",
                "Readable code needs no testing",
                "Readable code removes all bugs",
            ],
            "answer": "Readable code is easier to understand and maintain",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is version control useful for a {topic} project?",
            "options": [
                "Tracking changes to the project",
                "Increasing monitor brightness",
                "Replacing testing",
                "Deleting project history",
            ],
            "answer": "Tracking changes to the project",
        },
        {
            "type": "Multiple Choice",
            "question": f"What should a developer do after finding an error in {topic} code?",
            "options": [
                "Investigate the cause and fix it",
                "Ignore the error",
                "Delete unrelated files",
                "Stop documenting the project",
            ],
            "answer": "Investigate the cause and fix it",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is abstraction useful for in {topic}?",
            "options": [
                "Hiding unnecessary implementation details",
                "Making every detail visible at once",
                "Removing all functionality",
                "Preventing reuse",
            ],
            "answer": "Hiding unnecessary implementation details",
        },
        {
            "type": "Multiple Choice",
            "question": f"What does scalability mean for a {topic} system?",
            "options": [
                "The ability to handle increasing workload effectively",
                "The ability to change screen colors",
                "The ability to remove all users",
                "The ability to avoid deployment",
            ],
            "answer": "The ability to handle increasing workload effectively",
        },
        {
            "type": "Multiple Choice",
            "question": f"Why are edge cases important when testing {topic}?",
            "options": [
                "They reveal behavior under unusual inputs",
                "They make testing unnecessary",
                "They always produce errors",
                "They remove the need for requirements",
            ],
            "answer": "They reveal behavior under unusual inputs",
        },
        {
            "type": "Multiple Choice",
            "question": f"What is the best way to improve after a mistake while learning {topic}?",
            "options": [
                "Understand the mistake and practice the concept again",
                "Ignore the mistake",
                "Avoid the topic forever",
                "Delete all practice work",
            ],
            "answer": "Understand the mistake and practice the concept again",
        },
    ]

    return questions


# --------------------------------------------------
# True / False
# --------------------------------------------------

def create_true_false_questions(topic):
    return [
        {
            "type": "True / False",
            "question": f"Practice is important when learning {topic}.",
            "options": ["True", "False"],
            "answer": "True",
        },
        {
            "type": "True / False",
            "question": f"Debugging can help identify problems in {topic} projects.",
            "options": ["True", "False"],
            "answer": "True",
        },
        {
            "type": "True / False",
            "question": f"Testing is unnecessary when developing with {topic}.",
            "options": ["True", "False"],
            "answer": "False",
        },
        {
            "type": "True / False",
            "question": f"Readable code is generally easier to maintain.",
            "options": ["True", "False"],
            "answer": "True",
        },
        {
            "type": "True / False",
            "question": f"Understanding requirements is useful before solving a problem.",
            "options": ["True", "False"],
            "answer": "True",
        },
        {
            "type": "True / False",
            "question": f"Making mistakes while practicing means learning should stop.",
            "options": ["True", "False"],
            "answer": "False",
        },
        {
            "type": "True / False",
            "question": f"Documentation can help developers understand a technology.",
            "options": ["True", "False"],
            "answer": "True",
        },
        {
            "type": "True / False",
            "question": f"Version control can track changes in a software project.",
            "options": ["True", "False"],
            "answer": "True",
        },
        {
            "type": "True / False",
            "question": f"Edge cases are never useful during testing.",
            "options": ["True", "False"],
            "answer": "False",
        },
        {
            "type": "True / False",
            "question": f"Reviewing incorrect answers can improve learning.",
            "options": ["True", "False"],
            "answer": "True",
        },
    ]


# --------------------------------------------------
# Output Prediction
# --------------------------------------------------

def create_output_questions(topic):
    return [
        {
            "type": "Output Prediction",
            "question": f"If a program prints a value after successfully processing {topic}, what should you normally inspect first if the output is unexpected?",
            "options": [
                "The input and processing logic",
                "The monitor size",
                "The keyboard layout",
                "The project logo",
            ],
            "answer": "The input and processing logic",
        },
        {
            "type": "Output Prediction",
            "question": f"When debugging {topic}, what is the most useful result of adding a temporary print statement?",
            "options": [
                "Observing the value at a specific point",
                "Increasing CPU speed",
                "Removing the program",
                "Changing the operating system",
            ],
            "answer": "Observing the value at a specific point",
        },
        {
            "type": "Output Prediction",
            "question": f"If a calculation in {topic} produces an unexpected result, which should be checked first?",
            "options": [
                "The values and operations used in the calculation",
                "The screen resolution",
                "The file icon",
                "The computer wallpaper",
            ],
            "answer": "The values and operations used in the calculation",
        },
        {
            "type": "Output Prediction",
            "question": f"When predicting program output, what should you trace?",
            "options": [
                "The execution flow and changing values",
                "Only the comments",
                "Only the file name",
                "The desktop background",
            ],
            "answer": "The execution flow and changing values",
        },
        {
            "type": "Output Prediction",
            "question": f"If a condition evaluates to false in a program, which branch normally executes?",
            "options": [
                "The false or alternative branch",
                "Every branch simultaneously",
                "No line in the entire program",
                "The import section",
            ],
            "answer": "The false or alternative branch",
        },
        {
            "type": "Output Prediction",
            "question": f"What helps you predict the output of a loop?",
            "options": [
                "Tracking each iteration and the loop condition",
                "Ignoring the loop condition",
                "Reading only the variable name",
                "Skipping all iterations",
            ],
            "answer": "Tracking each iteration and the loop condition",
        },
        {
            "type": "Output Prediction",
            "question": f"If a variable is updated repeatedly, what should you track?",
            "options": [
                "Its value after each update",
                "Only its original name",
                "The computer brand",
                "The screen size",
            ],
            "answer": "Its value after each update",
        },
        {
            "type": "Output Prediction",
            "question": f"What is important when predicting output involving functions?",
            "options": [
                "The function arguments, execution, and return value",
                "Only the function name",
                "Only the comments",
                "The operating system theme",
            ],
            "answer": "The function arguments, execution, and return value",
        },
        {
            "type": "Output Prediction",
            "question": f"What should you do when output differs from your prediction?",
            "options": [
                "Trace the execution step by step",
                "Assume the computer is always wrong",
                "Delete the project",
                "Ignore the result",
            ],
            "answer": "Trace the execution step by step",
        },
        {
            "type": "Output Prediction",
            "question": f"Why should you trace variables while predicting {topic} output?",
            "options": [
                "Their values can change during execution",
                "Variables never change",
                "Variables are only comments",
                "Variables control screen brightness",
            ],
            "answer": "Their values can change during execution",
        },
    ]


# --------------------------------------------------
# Interview / Scenario
# --------------------------------------------------

def create_interview_questions(topic):
    return [
        {
            "type": "Interview / Scenario",
            "question": f"An interviewer asks how you would approach a difficult {topic} problem. What is the strongest response?",
            "options": [
                "Clarify requirements, break the problem down, and explain your approach",
                "Say the problem cannot be solved",
                "Start coding without understanding the requirements",
                "Avoid explaining your reasoning",
            ],
            "answer": "Clarify requirements, break the problem down, and explain your approach",
        },
        {
            "type": "Interview / Scenario",
            "question": f"You find a bug in a {topic} application. What should you do?",
            "options": [
                "Reproduce it, identify the cause, fix it, and test the fix",
                "Ignore it",
                "Delete the application",
                "Change unrelated code",
            ],
            "answer": "Reproduce it, identify the cause, fix it, and test the fix",
        },
        {
            "type": "Interview / Scenario",
            "question": f"A teammate does not understand your {topic} code. What is the best response?",
            "options": [
                "Explain the design clearly and improve readability if needed",
                "Tell them not to read the code",
                "Delete the documentation",
                "Avoid collaboration",
            ],
            "answer": "Explain the design clearly and improve readability if needed",
        },
        {
            "type": "Interview / Scenario",
            "question": f"A {topic} system becomes slower as the amount of data grows. What should you investigate?",
            "options": [
                "Performance bottlenecks, algorithms, database access, and resource usage",
                "Only the application logo",
                "Only the font size",
                "Nothing, because performance cannot be improved",
            ],
            "answer": "Performance bottlenecks, algorithms, database access, and resource usage",
        },
        {
            "type": "Interview / Scenario",
            "question": f"You are asked to learn a new {topic} library quickly. What approach is best?",
            "options": [
                "Read the documentation and build a small practical example",
                "Memorize the library name",
                "Avoid using examples",
                "Never test the library",
            ],
            "answer": "Read the documentation and build a small practical example",
        },
        {
            "type": "Interview / Scenario",
            "question": f"A requirement for your {topic} project is unclear. What should you do?",
            "options": [
                "Ask for clarification before implementing the uncertain behavior",
                "Guess and never tell anyone",
                "Ignore the requirement",
                "Delete the feature",
            ],
            "answer": "Ask for clarification before implementing the uncertain behavior",
        },
        {
            "type": "Interview / Scenario",
            "question": f"Your {topic} solution works but is difficult to maintain. What should you consider?",
            "options": [
                "Refactoring for clarity, modularity, and maintainability",
                "Making the code longer without reason",
                "Removing tests",
                "Deleting comments and documentation",
            ],
            "answer": "Refactoring for clarity, modularity, and maintainability",
        },
        {
            "type": "Interview / Scenario",
            "question": f"Two developers modify the same {topic} project. What tool can help manage changes?",
            "options": [
                "Version control",
                "A calculator",
                "A photo editor",
                "A music player",
            ],
            "answer": "Version control",
        },
        {
            "type": "Interview / Scenario",
            "question": f"A user reports an unexpected result from your {topic} application. What should you collect first?",
            "options": [
                "The input, expected result, actual result, and steps to reproduce",
                "Only the user's name",
                "Only the application icon",
                "Nothing",
            ],
            "answer": "The input, expected result, actual result, and steps to reproduce",
        },
        {
            "type": "Interview / Scenario",
            "question": f"During a {topic} interview, you do not know the exact answer. What is a good approach?",
            "options": [
                "Be honest and explain how you would reason or investigate it",
                "Invent a technical answer confidently",
                "Stop communicating",
                "Change the topic",
            ],
            "answer": "Be honest and explain how you would reason or investigate it",
        },
    ]


# --------------------------------------------------
# Generate Quiz
# --------------------------------------------------

@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest):

    topic = request.topic.strip()

    mcqs = create_mcq_questions(topic)
    true_false = create_true_false_questions(topic)
    output_questions = create_output_questions(topic)
    interview_questions = create_interview_questions(topic)

    all_questions = (
        mcqs
        + true_false
        + output_questions
        + interview_questions
    )

    # Shuffle answer choices for MCQ/output/interview.
    for question in all_questions:

        if question["type"] != "True / False":
            options, answer = shuffle_options(
                question["options"],
                question["answer"],
            )

            question["options"] = options
            question["answer"] = answer

    # Shuffle question order.
    random.shuffle(all_questions)

    return {
        "topic": topic,
        "difficulty": request.difficulty,
        "purpose": request.purpose,
        "total_questions": len(all_questions),
        "questions": all_questions,
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "PearlPrep API is running 🦪",
        "status": "healthy",
    }