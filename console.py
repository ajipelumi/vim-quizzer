#!/usr/bin/python3
""" The Console. """
import cmd
import models
from models.question import Question
from models.question import IncorrectAnswer
import shlex


classes = {"Question": Question, "IncorrectAnswer": IncorrectAnswer}


class QUIZZERCommand(cmd.Cmd):
    """ The console class. """
    prompt = '(quizzer) '

    def do_quit(self, arg):
        """
        Quit command to exit the program.
        syntax: quit
        """
        return True

    def do_EOF(self, arg):
        """
        EOF command to exit the program.
        syntax: EOF
        """
        print()
        return True

    def emptyline(self):
        """ Do nothing when the user inputs an empty line. """
        pass

    def postcmd(self, stop, line):
        """ Prints a dotting line after every command. """
        print("." * 80)
        return stop

    def do_create(self, arg):
        """
        Creates a new Question instance, saves it to the database
        and prints the id.
        syntax: create Question
        """
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class name missing **")
            return
        if args[0] not in classes:
            print("** class doesn't exist **")
            return
        if args[0] == "IncorrectAnswer":
            print("** IncorrectAnswer cannot be created **")
            return
        if args[0] == "Question":
            # Prompt for question
            question = input("Enter the question: ")
            # Prompt for correct answer
            correct_answer = input("Enter the correct answer: ")
            # Prompt for incorrect answers
            incorrect_answers = []
            for i in range(3):
                incorrect_answer = input(
                    "Enter an incorrect answer ({}): ".format(i + 1))
                incorrect_answers.append(incorrect_answer)
            # Create the question
            question = Question(question=question,
                                correct_answer=correct_answer)
            question.save()
            # Create the incorrect answers
            for incorrect_answer in incorrect_answers:
                incorrect_answer = IncorrectAnswer(
                    incorrect_answer=incorrect_answer, question_id=question.id)
                incorrect_answer.save()
            print("New question created with id: {}".format(question.id))

    def do_show(self, arg):
        """
        Prints the string representation of an instance
        based on the class name and id.
        syntax: show <class name> <id>
        """
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class name missing **")
            return
        if args[0] not in classes:
            print("** class doesn't exist **")
            return
        if len(args) == 1:
            print("** instance id missing **")
            return
        all_objs = models.storage.all()
        key = args[0] + "." + args[1]
        if key in all_objs:
            print(all_objs[key])
        else:
            print("** no instance found **")

    def do_destroy(self, arg):
        """
        Deletes an instance based on the class name and id
        (save the change into the database).
        syntax: destroy <class name> <id>
        """
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class name missing **")
            return
        if args[0] not in classes:
            print("** class doesn't exist **")
            return
        if args[0] == "IncorrectAnswer":
            print("** IncorrectAnswer cannot be deleted **")
            return
        if len(args) == 1:
            print("** instance id missing **")
            return
        all_objs = models.storage.all()
        key = args[0] + "." + args[1]
        if key in all_objs:
            models.storage.delete(all_objs[key])
            models.storage.save()
            print("Instance deleted")
        else:
            print("** no instance found **")

    def do_all(self, arg):
        """
        Prints all string representation of all instances
        based or not on the class name.
        syntax: all <class name>
        """
        args = shlex.split(arg)
        all_objs = models.storage.all()
        if len(args) == 0:
            print([str(all_objs[key]) for key in all_objs])
            return
        if args[0] not in classes:
            print("** class doesn't exist **")
            return
        print([str(all_objs[key]) for key in all_objs
               if key.split(".")[0] == args[0]])

    def do_update(self, arg):
        """
        Updates an instance based on the class name and id
        by adding or updating attribute (save the change into
        the database).
        syntax: update <class name> <id> <attribute name> "<attribute value>"
        """
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class name missing **")
            return
        if args[0] not in classes:
            print("** class doesn't exist **")
            return
        if len(args) == 1:
            print("** instance id missing **")
            return
        all_objs = models.storage.all()
        key = args[0] + "." + args[1]
        if key not in all_objs:
            print("** no instance found **")
            return
        if len(args) == 2:
            print("** attribute name missing **")
            return
        if len(args) == 3:
            print("** value missing **")
            return
        try:
            value = eval(args[3])
        except (Exception):
            value = args[3]
        setattr(all_objs[key], args[2], value)
        all_objs[key].save()
        print("Updated instance with id: {}".format(args[1]))

    def do_count(self, arg):
        """
        Retrieve the number of instances of a class.
        syntax: count <class name>
        """
        args = shlex.split(arg)
        if len(args) == 0:
            print("** class name missing **")
            return
        if args[0] not in classes:
            print("** class doesn't exist **")
            return
        all_objs = models.storage.all()
        print(len([key for key in all_objs
                   if key.split(".")[0] == args[0]]))


if __name__ == '__main__':
    QUIZZERCommand().cmdloop()
