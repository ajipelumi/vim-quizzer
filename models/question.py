#!/usr/bin/python3
""" Question class. """
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship


class Question(BaseModel, Base):
    """ Question class. """
    # Create a new table
    __tablename__ = "questions"
    # Create table columns
    question = Column(String(1024), nullable=False)
    correct_answer = Column(String(128), nullable=False)
    # Create list of incorrect answers
    incorrect_answers = relationship("IncorrectAnswer", backref="question",
                                     cascade="all, delete-orphan")

    def __init__(self, **kwargs):
        """ Initialize a new Question. """
        # Call parent method to initialize
        super().__init__(**kwargs)


class IncorrectAnswer(BaseModel, Base):
    """ IncorrectAnswer class. """
    # Create a new table
    __tablename__ = "incorrect_answers"
    # Create table columns
    question_id = Column(String(60), ForeignKey("questions.id"),
                         nullable=False)
    incorrect_answer = Column(String(128), nullable=False)

    def __init__(self, **kwargs):
        """ Initialize a new IncorrectAnswer. """
        # Call parent method to initialize
        super().__init__(**kwargs)
