#!/usr/bin/python3
""" Module for storing the Question class. """
import models
from models.base_model import Base
from models.question import Question
from models.question import IncorrectAnswer
from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

# Create dictionary of classes
classes = {"Question": Question, "IncorrectAnswer": IncorrectAnswer}


class Storage:
    """ Storage class. """
    # Create class attributes
    __engine = None
    __session = None

    def __init__(self):
        """ Initialize a new Storage instance. """
        # Get environment variables
        user = getenv("QUIZZER_MYSQL_USER")
        pwd = getenv("QUIZZER_MYSQL_PWD")
        host = getenv("QUIZZER_MYSQL_HOST")
        db = getenv("QUIZZER_MYSQL_DB")
        env = getenv("QUIZZER_ENV")

        # Create a new engine instance
        self.__engine = create_engine("mysql+mysqldb://{}:{}@{}/{}".
                                      format(user, pwd, host, db),
                                      pool_pre_ping=True)

        # Drop all tables if env is test
        if env == "test":
            Base.metadata.drop_all(self.__engine)

    def all(self, cls=None):
        """ Query on the current database session. """
        # Create a new dictionary
        new_dict = {}

        # Iterate through all classes in the dictionary of classes
        for clss in classes:

            # If the class is None or the class is the same as the class
            if cls is None or cls is classes[clss] or cls is clss:

                # Query the current database session for all class objects
                objs = self.__session.query(classes[clss]).all()

                # Iterate through the list of objects
                for obj in objs:

                    # Create a key for the object
                    key = obj.__class__.__name__ + '.' + obj.id

                    # Set the value of the key to the object
                    new_dict[key] = obj

        # Return the new dictionary
        return (new_dict)

    def new(self, obj):
        """ Add the object to the current database session. """
        # Add object to session
        self.__session.add(obj)

    def save(self):
        """ Commit all changes of the current database session. """
        # Commit changes
        self.__session.commit()

    def delete(self, obj=None):
        """ Delete from the current database session. """
        # Check if obj is not None
        if obj is not None:
            # Delete object from session
            self.__session.delete(obj)

    def reload(self):
        """ Create all tables in the database and
            create the current database session.
        """
        # Create all tables
        Base.metadata.create_all(self.__engine)

        # Create current database session
        session = sessionmaker(bind=self.__engine, expire_on_commit=False)
        self.__session = scoped_session(session)

    def close(self):
        """" Close the current database session. """
        self.__session.close()

    def get(self, cls, id):
        """ Get object from database. """
        # Return None if the class is not in the dictionary of classes
        if cls not in classes.values():
            return None

        # Get all objects of the class
        all_cls = models.storage.all(cls)

        # Iterate through the objects of the class
        for value in all_cls.values():

            # Return the object if the ID matches
            if (value.id == id):
                return value

        # Return None if the ID does not match
        return None

    def count(self, cls=None):
        """ Count number of objects in storage. """
        # Get all classes in the dictionary of classes
        all_class = classes.values()

        # Check if class is None
        if not cls:
            count = 0
            # Iterate through all classes
            for clas in all_class:
                # Add the number of objects of the class to the count
                count += len(models.storage.all(clas).values())
        else:
            # Add the number of objects of the class to the count
            count = len(models.storage.all(cls).values())

        # Return the count
        return count
