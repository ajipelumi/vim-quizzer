#!/usr/bin/python3
""" BaseModel class. """
import uuid
from datetime import datetime
import models
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

# Set time format for datetime
time = "%Y-%b-%d %H:%M"

# Create a new declarative base
Base = declarative_base()


class BaseModel():
    """ BaseModel class. """
    # Define class attributes
    id = Column(String(60), primary_key=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow(),
                        nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow(),
                        nullable=False)

    def __init__(self, **kwargs):
        """ Initialize a new BaseModel. """
        # Check if kwargs is not empty
        if kwargs:
            # Loop through kwargs
            for key, value in kwargs.items():
                # Check if key is not __class__
                if key != "__class__":
                    # Set the key/value pair as an attribute
                    setattr(self, key, value)

            # Check if created_at exists and is a string
            if kwargs.get("created_at", None) and type(self.created_at) is str:
                # Convert string to datetime object
                self.created_at = datetime.strptime(kwargs["created_at"], time)
            else:
                # Set created_at to current datetime if it doesn't exist
                self.created_at = datetime.utcnow()

            # Check if updated_at exists and is a string
            if kwargs.get("updated_at", None) and type(self.updated_at) is str:
                # Convert string to datetime object
                self.updated_at = datetime.strptime(kwargs["updated_at"], time)
            else:
                # Set updated_at to current datetime if it doesn't exist
                self.updated_at = datetime.utcnow()

            # Check if id exists
            if kwargs.get("id", None) is None:
                # Set id to a unique string
                self.id = str(uuid.uuid4())
        else:
            # Set id
            self.id = str(uuid.uuid4())
            # Set created_at
            self.created_at = datetime.now()
            # Set updated_at
            self.updated_at = datetime.now()

    def __str__(self) -> str:
        """ Return string representation of BaseModel. """
        # Return string representation
        return "[{}] ({}) {}".format(
            self.__class__.__name__, self.id, self.__dict__)

    def save(self):
        """ Update updated_at with current datetime. """
        # Update updated_at
        self.updated_at = datetime.now()
        # Add object to session
        models.storage.new(self)
        # Commit changes
        models.storage.save()

    def to_dict(self):
        """ Return dictionary representation of BaseModel. """
        # Copy __dict__
        new_dict = self.__dict__.copy()
        # Add class key
        new_dict["__class__"] = self.__class__.__name__
        # Convert datetime object to string
        new_dict["created_at"] = self.created_at.strftime(time)
        new_dict["updated_at"] = self.updated_at.strftime(time)
        # Remove _sa_instance_state key
        if "_sa_instance_state" in new_dict:
            new_dict.pop("_sa_instance_state")
        # Return new dictionary
        return new_dict

    def delete(self):
        """ Delete the current instance from the storage. """
        models.storage.delete(self)
