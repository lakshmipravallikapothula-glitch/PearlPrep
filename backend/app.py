import json
import os
import random

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_FILE = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_FILE)


# --------------------------------------------------
# OpenAI configuration
# --------------------------------------------------

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.6-luna")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


# --------------------------------------------------
# FastAPI
# --------------------------------------------------

app = FastAPI(
    title="PearlPrep API",
    description="AI-powered quiz generation API for PearlPrep",
    version="2.0.0",
)

handler = app


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
# AI Prompt
# --------------------------------------------------

def build_quiz_prompt(topic: str, difficulty: str, purpose: str) -> str:
    return f"""
You are an expert technical interviewer and quiz designer.

Create exactly 50 high-quality questions for a quiz.

Topic:
{topic}

Difficulty:
{difficulty}

Purpose:
{purpose}

The quiz MUST contain exactly these four question types:

1. Multiple Choice
2. True / False
3. Output Prediction
4. Interview / Scenario

Create a balanced mixture of all four types.

Requirements:

- Questions must be specifically about the requested topic.
- Match the requested difficulty.
- Match the requested purpose.
- Avoid generic questions that could apply to any technology.
- Do not duplicate questions.
- Make questions technically accurate.
- For Multiple Choice questions, provide exactly 4 options.
- For True / False questions, provide exactly 2 options: True and False.
- For Output Prediction questions, provide exactly 4 options.
- For Interview / Scenario questions, provide exactly 4 options.
- Every question must have exactly one correct answer.
- The "answer" field must contain the exact text of the correct option.
- Do not put explanations inside the answer field.
- Do not use Markdown.
- Return ONLY valid JSON.
- Do not wrap the JSON in ``` or any Markdown code fence.

Return this exact structure:

{{
  "questions": [
    {{
      "id": 1,
      "type": "Multiple Choice",
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Option A"
    }}
  ]
}}

The IDs must be integers from 1 through 50.
"""


# --------------------------------------------------
# Validate AI questions
# --------------------------------------------------

VALID_TYPES = {
    "Multiple Choice",
    "True / False",
    "Output Prediction",
    "Interview / Scenario",
}


def validate_questions(data):
    if not isinstance(data, dict):
        raise ValueError("AI response is not a JSON object.")

    questions = data.get("questions")

    if not isinstance(questions, list):
        raise ValueError("AI response does not contain a questions list.")

    if len(questions) != 50:
        raise ValueError(
            f"Expected 50 questions, received {len(questions)}."
        )

    validated = []

    for index, question in enumerate(questions, start=1):

        if not isinstance(question, dict):
            raise ValueError(f"Question {index} is not an object.")

        question_type = question.get("type")
        question_text = question.get("question")
        options = question.get("options")
        answer = question.get("answer")

        if question_type not in VALID_TYPES:
            raise ValueError(
                f"Question {index} has invalid type: {question_type}"
            )

        if not isinstance(question_text, str) or not question_text.strip():
            raise ValueError(f"Question {index} has no valid question text.")

        if not isinstance(options, list):
            raise ValueError(f"Question {index} options are invalid.")

        if question_type == "True / False":
            if len(options) != 2:
                raise ValueError(
                    f"Question {index} must have exactly 2 options."
                )

        else:
            if len(options) != 4:
                raise ValueError(
                    f"Question {index} must have exactly 4 options."
                )

        if not isinstance(answer, str) or answer not in options:
            raise ValueError(
                f"Question {index} answer does not match an option."
            )

        validated.append(
            {
                "id": index,
                "type": question_type,
                "question": question_text.strip(),
                "options": [str(option).strip() for option in options],
                "answer": answer.strip(),
            }
        )

    return validated


# --------------------------------------------------
# Shuffle answer choices
# --------------------------------------------------

def shuffle_options(question):
    options = question["options"].copy()
    random.shuffle(options)

    question["options"] = options

    return question


# --------------------------------------------------
# Generate AI Quiz
# --------------------------------------------------

def generate_ai_quiz(topic: str, difficulty: str, purpose: str):

    if client is None:
        raise RuntimeError(
            "OPENAI_API_KEY was not found. "
            "Check backend/.env."
        )

    prompt = build_quiz_prompt(
        topic=topic,
        difficulty=difficulty,
        purpose=purpose,
    )

    response = client.responses.create(
        model=OPENAI_MODEL,
        input=prompt,
    )

    raw_output = response.output_text.strip()

    if not raw_output:
        raise ValueError("OpenAI returned an empty response.")

    # Remove accidental Markdown fences if the model adds them.
    if raw_output.startswith("```"):
        raw_output = raw_output.replace("```json", "", 1)
        raw_output = raw_output.replace("```", "", 1)
        raw_output = raw_output.strip()

    try:
        data = json.loads(raw_output)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"OpenAI returned invalid JSON: {exc}"
        ) from exc

    questions = validate_questions(data)

    # Randomize answer positions.
    for question in questions:
        shuffle_options(question)

    # Randomize question order.
    random.shuffle(questions)

    # Reassign IDs after shuffling.
    for index, question in enumerate(questions, start=1):
        question["id"] = index

    return questions


# --------------------------------------------------
# Generate Quiz Endpoint
# --------------------------------------------------

@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest):

    topic = request.topic.strip()
    difficulty = request.difficulty.strip()
    purpose = request.purpose.strip()

    if not topic:
        raise HTTPException(
            status_code=400,
            detail="Topic is required.",
        )

    if not difficulty:
        raise HTTPException(
            status_code=400,
            detail="Difficulty is required.",
        )

    if not purpose:
        raise HTTPException(
            status_code=400,
            detail="Purpose is required.",
        )

    try:
        questions = generate_ai_quiz(
            topic=topic,
            difficulty=difficulty,
            purpose=purpose,
        )

        return {
            "topic": topic,
            "difficulty": difficulty,
            "purpose": purpose,
            "total_questions": len(questions),
            "questions": questions,
        }

    except Exception as exc:

    print(f"Quiz generation error: {exc}")

    raise HTTPException(
        status_code=500,
        detail=f"Quiz generation error: {exc}",
    )

# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "PearlPrep API is running 🦪",
        "status": "healthy",
        "ai_model": OPENAI_MODEL,
    }