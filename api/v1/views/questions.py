#!/usr/bin/python3
""" Questions API endpoints. """
from flask import jsonify
from api.v1.views import app_views
from models import storage
from models.question import Question
import random


@app_views.route('/questions', methods=['GET'], strict_slashes=False)
def get_questions():
    """ Retrieves 10 random questions from storage. """
    questions = []
    # Get all questions from storage
    all_questions = storage.all(Question).values()
    # Convert to list as random.sample() only accepts lists
    questions_list = list(all_questions)
    # Get 10 random questions from list
    random_questions = random.sample(questions_list, 10)
    # Format questions to match API requirements
    for question in random_questions:
        question_dict = question.to_dict()
        del question_dict['__class__']
        del question_dict['id']
        del question_dict['created_at']
        del question_dict['updated_at']

        all_incorrect_answers = question.incorrect_answers
        incorrect_answers = []
        for incorrect_answer in all_incorrect_answers:
            incorrect_answers.append(incorrect_answer.incorrect_answer)

        question_dict['incorrect_answers'] = incorrect_answers
        questions.append(question_dict)

    return jsonify({"response_code": 200, "results": questions})
