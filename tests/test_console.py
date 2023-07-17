#!/usr/bin/python3
""" Console Test. """
import unittest
from unittest.mock import patch
from io import StringIO
from console import QUIZZERCommand
import models


class TestConsole(unittest.TestCase):
    """ Test the console. """

    def setUp(self):
        """ Set up for the tests. """
        self.console = QUIZZERCommand()

    def tearDown(self):
        """ Clean up tests. """
        models.storage.close()

    def test_create(self):
        """ Test the create command. """
        with patch("sys.stdout", new=StringIO()) as f:
            question = "What is the vim command to quit?"
            correct_answer = ":q"
            incorrect_answers = ["q", "quit", "exit"]
            user_input = f"{question}\n{correct_answer}\n"
            user_input += "\n".join(incorrect_answers) + "\ndone\n"
            with patch("builtins.input", side_effect=user_input):
                self.console.onecmd("create Question")
            self.assertTrue(len(f.getvalue()) > 0)
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("create")
            self.assertEqual("** class name missing **\n", f.getvalue())
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("create State")
            self.assertEqual("** class doesn't exist **\n", f.getvalue())
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("create IncorrectAnswer")
            self.assertEqual("** IncorrectAnswer cannot be created **\n",
                             f.getvalue())

    def test_show(self):
        """ Test the show command. """
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("show Question")
            self.assertEqual("** instance id missing **\n", f.getvalue())
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("show Question 1234-1234-1234")
            self.assertEqual("** no instance found **\n", f.getvalue())

    def test_destroy(self):
        """ Test the destroy command. """
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("destroy Question")
            self.assertEqual("** instance id missing **\n", f.getvalue())
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("destroy Question 1234-1234-1234")
            self.assertEqual("** no instance found **\n", f.getvalue())
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("destroy IncorrectAnswer")
            self.assertEqual("** IncorrectAnswer cannot be deleted **\n",
                             f.getvalue())

    def test_all(self):
        """ Test the all command. """
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("all Question")
            self.assertTrue(len(f.getvalue()) > 0)
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("all IncorrectAnswer")
            self.assertTrue(len(f.getvalue()) > 0)

    def test_update(self):
        """ Test the update command. """
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("update Question")
            self.assertEqual("** instance id missing **\n", f.getvalue())
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("update Question 1234-1234-1234")
            self.assertEqual("** no instance found **\n", f.getvalue())

    def test_count(self):
        """ Test the count command. """
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("count Question")
            self.assertTrue(len(f.getvalue()) > 0)
        with patch("sys.stdout", new=StringIO()) as f:
            self.console.onecmd("count IncorrectAnswer")
            self.assertTrue(len(f.getvalue()) > 0)


if __name__ == "__main__":
    unittest.main()
