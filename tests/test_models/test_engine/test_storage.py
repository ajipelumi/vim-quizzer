#!/usr/bin/python3
""" Test for Storage class. """
import unittest
from unittest import mock
import models
from models.question import Question
from models.question import IncorrectAnswer


class TestStorage(unittest.TestCase):
    """ Test Storage class. """
    def test_all(self):
        """ Test all method. """
        # Create new instance
        instance = models.storage
        # Check if all returns dict
        self.assertIsInstance(instance.all(), dict)

    @mock.patch("models.storage")
    def test_new(self, mock_storage):
        """ Test new method. """
        # Create new instance
        instance = models.storage
        # Create new Question instance
        question = Question()
        # Add question to storage
        instance.new(question)
        # Check if storage.new is called
        self.assertTrue(mock_storage.new.called)

    @mock.patch("models.storage")
    def test_save(self, mock_storage):
        """ Test save method. """
        # Create new instance
        instance = models.storage
        # Save storage
        instance.save()
        # Check if storage.save is called
        self.assertTrue(mock_storage.save.called)

    @mock.patch("models.storage")
    def test_reload(self, mock_storage):
        """ Test reload method. """
        # Create new instance
        instance = models.storage
        # Reload storage
        instance.reload()
        # Check if storage.reload is called
        self.assertTrue(mock_storage.reload.called)

    def test_get(self):
        """ Test get method. """
        # Create dictionary
        dictionary = {
            "question": "What is the default vim configuration file?",
            "correct_answer": ".vimrc",
            "incorrect_answers": [
                IncorrectAnswer(incorrect_answer=".vimcfg"),
                IncorrectAnswer(incorrect_answer=".config/vim"),
                IncorrectAnswer(incorrect_answer="config/vimrc")
            ]
        }
        # Create new instance
        instance = models.storage
        # Create new Question instance
        question = Question(**dictionary)
        # Add question to storage
        instance.new(question)
        # Save storage
        instance.save()
        # Check if get returns question
        self.assertEqual(instance.get(Question, question.id), question)

    def test_count(self):
        """ Test count method. """
        # Create dictionary
        dictionary = {
            "question": "What is the default vim configuration file?",
            "correct_answer": ".vimrc",
            "incorrect_answers": [
                IncorrectAnswer(incorrect_answer=".vimcfg"),
                IncorrectAnswer(incorrect_answer=".config/vim"),
                IncorrectAnswer(incorrect_answer="config/vimrc")
            ]
        }
        # Create new instance
        instance = models.storage
        # Create new Question instance
        question = Question(**dictionary)
        # Add question to storage
        instance.new(question)
        # Save storage
        instance.save()
        # Check if count returns 1
        self.assertEqual(instance.count("Question"), 1)


if __name__ == "__main__":
    unittest.main()
