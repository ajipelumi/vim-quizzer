#!/usr/bin/python3
""" Test for Question class. """
import unittest
from unittest import mock
from models.question import Question
from models.question import IncorrectAnswer


class TestQuestion(unittest.TestCase):
    """" Test Question class. """
    def test_instantiation(self):
        """ Test instantiation of Question class. """
        # Create new instance
        instance = Question()
        # Check if instance is an instance of Question
        self.assertIsInstance(instance, Question)

    def test_attributes(self):
        """ Test Question attributes. """
        # Create new instance
        instance = Question()
        # Check if question is None
        self.assertIsNone(instance.question)
        # Check if correct_answer exists
        self.assertTrue(hasattr(instance, "correct_answer"))
        # Check if incorrect_answers exists
        self.assertTrue(hasattr(instance, "incorrect_answers"))

    def test_unique_id(self):
        """ Test unique id. """
        # Create two new instances
        instance1 = Question()
        instance2 = Question()
        # Check if ids are unique
        self.assertNotEqual(instance1.id, instance2.id)

    def test_str(self):
        """ Test __str__ method. """
        # Create new instance
        instance = Question()
        # Check if print(instance) is string
        self.assertIsInstance(instance.__str__(), str)

    @mock.patch("models.storage")
    def test_save(self, mock_storage):
        """ Test save method. """
        # Create new instance
        instance = Question()
        # Update updated_at
        instance.save()
        # Check if storage.save is called
        self.assertTrue(mock_storage.save.called)

    def test_to_dict(self):
        """ Test to_dict method. """
        # Create new instance
        instance = Question()
        # Convert instance to dict
        instance_dict = instance.to_dict()
        # Check if __class__ is in instance_dict
        self.assertIn("__class__", instance_dict)
        # Check if _sa_instance_state is not in instance_dict
        self.assertNotIn("_sa_instance_state", instance_dict)
        # Check if instance_dict is type dict
        self.assertIsInstance(instance_dict, dict)
        # Check if created_at is in instance_dict
        self.assertIn("created_at", instance_dict)
        # Check if updated_at is in instance_dict
        self.assertIn("updated_at", instance_dict)
        # Check if to_dict method creates correct object
        self.assertEqual(instance_dict["__class__"], "Question")

    def test_kwargs(self):
        """ Test instantiation from kwargs. """
        # Create new instance
        instance = Question()
        # Convert instance to dict
        instance_dict = instance.to_dict()
        # Create new instance from instance_dict
        new_instance = Question(**instance_dict)
        # Check if new_instance is instance of Question
        self.assertIsInstance(new_instance, Question)
        # Check if instance is not new_instance
        self.assertIsNot(instance, new_instance)


class TestIncorrectAnswer(unittest.TestCase):
    """" Test IncorrectAnswer class. """
    def test_instantiation(self):
        """ Test instantiation of IncorrectAnswer class. """
        # Create new instance
        instance = IncorrectAnswer()
        # Check if instance is an instance of IncorrectAnswer
        self.assertIsInstance(instance, IncorrectAnswer)

    def test_attributes(self):
        """ Test IncorrectAnswer attributes. """
        # Create new instance
        instance = IncorrectAnswer()
        # Check if question_id exists
        self.assertTrue(hasattr(instance, "question_id"))
        # Check if incorrect_answer exists
        self.assertTrue(hasattr(instance, "incorrect_answer"))

    def test_unique_id(self):
        """ Test unique id. """
        # Create two new instances
        instance1 = IncorrectAnswer()
        instance2 = IncorrectAnswer()
        # Check if ids are unique
        self.assertNotEqual(instance1.id, instance2.id)

    def test_str(self):
        """ Test __str__ method. """
        # Create new instance
        instance = IncorrectAnswer()
        # Check if print(instance) is string
        self.assertIsInstance(instance.__str__(), str)

    @mock.patch("models.storage")
    def test_save(self, mock_storage):
        """ Test save method. """
        # Create new instance
        instance = IncorrectAnswer()
        # Update updated_at
        instance.save()
        # Check if storage.save is called
        self.assertTrue(mock_storage.save.called)

    def test_to_dict(self):
        """ Test to_dict method. """
        # Create new instance
        instance = IncorrectAnswer()
        # Convert instance to dict
        instance_dict = instance.to_dict()
        # Check if __class__ is in instance_dict
        self.assertIn("__class__", instance_dict)
        # Check if _sa_instance_state is not in instance_dict
        self.assertNotIn("_sa_instance_state", instance_dict)
        # Check if instance_dict is type dict
        self.assertIsInstance(instance_dict, dict)
        # Check if created_at is in instance_dict
        self.assertIn("created_at", instance_dict)
        # Check if updated_at is in instance_dict
        self.assertIn("updated_at", instance_dict)
        # Check if to_dict method creates correct object
        self.assertEqual(instance_dict["__class__"], "IncorrectAnswer")

    def test_kwargs(self):
        """ Test instantiation from kwargs. """
        # Create new instance
        instance = IncorrectAnswer()
        # Convert instance to dict
        instance_dict = instance.to_dict()
        # Create new instance from instance_dict
        new_instance = IncorrectAnswer(**instance_dict)
        # Check if new_instance is instance of IncorrectAnswer
        self.assertIsInstance(new_instance, IncorrectAnswer)
        # Check if instance is not new_instance
        self.assertIsNot(instance, new_instance)


if __name__ == "__main__":
    unittest.main()
