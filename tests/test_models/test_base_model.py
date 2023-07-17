#!/usr/bin/python3
""" Test for BaseModel class. """
import unittest
from unittest import mock
from models.base_model import BaseModel
from datetime import datetime


class TestBaseModel(unittest.TestCase):
    """ Test BaseModel class. """
    def test_instantiation(self):
        """ Test instantiation of BaseModel class. """
        # Create new instance
        instance = BaseModel()
        # Check if instance is an instance of BaseModel
        self.assertIsInstance(instance, BaseModel)

    def test_attributes(self):
        """ Test BaseModel attributes. """
        # Create new instance
        instance = BaseModel()
        # Check if id is string
        self.assertIsInstance(instance.id, str)
        # Check if created_at is datetime
        self.assertIsInstance(instance.created_at, datetime)
        # Check if updated_at is datetime
        self.assertIsInstance(instance.updated_at, datetime)

    def test_unique_id(self):
        """ Test unique id. """
        # Create two new instances
        instance1 = BaseModel()
        instance2 = BaseModel()
        # Check if ids are unique
        self.assertNotEqual(instance1.id, instance2.id)

    def test_str(self):
        """ Test __str__ method. """
        # Create new instance
        instance = BaseModel()
        # Check if print(instance) is string
        self.assertIsInstance(instance.__str__(), str)

    @mock.patch("models.storage")
    def test_save(self, mock_storage):
        """ Test save method. """
        # Create new instance
        instance = BaseModel()
        # Update updated_at
        instance.save()
        # Check if storage.save is called
        self.assertTrue(mock_storage.save.called)

    def test_to_dict(self):
        """ Test to_dict method. """
        # Create new instance
        instance = BaseModel()
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
        self.assertEqual(instance_dict["__class__"], "BaseModel")

    def test_kwargs(self):
        """ Test kwargs. """
        # Create new instance
        instance = BaseModel()
        # Convert instance to dict
        instance_dict = instance.to_dict()
        # Create new instance using instance_dict
        new_instance = BaseModel(**instance_dict)
        # Check if new_instance is instance of BaseModel
        self.assertIsInstance(new_instance, BaseModel)
        # Check if instance is not new_instance
        self.assertIsNot(instance, new_instance)


if __name__ == "__main__":
    unittest.main()
