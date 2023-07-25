# Vim Quizzer

A simple quizzer for Vim commands.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [API Reference](#api-reference)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [Blog Posts](#blog-posts)
- [Author](#author)
- [Acknowledgements](#acknowledgements)

## Introduction
**Vim Quizzer** is a simple quizzer for Vim commands. It is a web application built to help you learn Vim commands.

The mission of this project is to help people learn Vim commands in a fun way.
The quizzer asks you multiple choice questions about Vim commands and also provides answers to the questions.

Vim Quizzer is accessible to everyone and can be used on any device.

## Features
Vim Quizzer has the following features:
- Multiple choice questions
- Answers to questions
- Simple user interface
- Accessible on any device

## Installation
As a web application, Vim Quizzer does not require any installation.
You can access it on any device with a web browser.

Visit **[quiz.pelumi.tech](https://quiz.pelumi.tech/)** to start using it.

## Usage
Vim Quizzer is very easy to use. It is a simple web application with a simple user interface.

To use Vim Quizzer, visit **[quiz.pelumi.tech](https://quiz.pelumi.tech/)** and start answering questions.

## Technologies
Vim Quizzer is built with the following technologies:
- **Libraries**
    - Flask: Web framework for Python
    - Bootstrap: CSS framework for building responsive websites
    - jQuery: JavaScript library for DOM manipulation
    - Flask-Cors: Flask extension for handling Cross Origin Resource Sharing (CORS)
    - SQLAlchemy: Python SQL toolkit and Object Relational Mapper (ORM) for database management
    - MySQLdb: Python MySQL client for database connection

- **Languages**
    - Python: Programming language for the backend
    - HTML: Markup language for the frontend
    - CSS: Stylesheet language for the frontend
    - JavaScript: Programming language for the frontend

- **Tools**
    - Git: Version control system for tracking changes in source code
    - GitHub: Web-based hosting service for version control using Git

- **Platforms**
    - AWS EC2: Cloud computing platform for hosting the web application

- **Server Software**
    - Nginx: Web server for serving the web application
    - Gunicorn: Python WSGI HTTP Server for running the web application

- **Database**
    - MySQL: Relational database management system for storing data

- **Operating System**
    - Ubuntu: Linux distribution for the server

- **Resources**
    - Flask Documentation: [flask.palletsprojects.com](https://flask.palletsprojects.com/en/1.1.x/)
    - Bootstrap Documentation: [getbootstrap.com](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
    - jQuery Documentation: [api.jquery.com](https://api.jquery.com/)
    - Flask-Cors Documentation: [flask-cors.readthedocs.io](https://flask-cors.readthedocs.io/en/latest/)
    - SQLAlchemy Documentation: [docs.sqlalchemy.org](https://docs.sqlalchemy.org/en/13/)
    - MySQLdb Documentation: [mysqlclient.readthedocs.io](https://mysqlclient.readthedocs.io/user_guide.html)
    - AWS EC2 Documentation: [docs.aws.amazon.com](https://docs.aws.amazon.com/ec2/index.html)
    - Nginx Documentation: [nginx.org](https://nginx.org/en/docs/)
    - Gunicorn Documentation: [docs.gunicorn.org](https://docs.gunicorn.org/en/stable/)
    - MySQL Documentation: [dev.mysql.com](https://dev.mysql.com/doc/)

## API Reference
Vim Quizzer has one API endpoint for getting questions. This endpoint is used by the frontend to get questions from the database.
The endpoint returns a JSON object containing 10 questions. Each question has a correct answer and 3 incorrect answers. 
The API endpoint is documented below.

### Get Questions
Returns a JSON object containing 10 questions.

- URL: `https://quiz.pelumi.tech/api/v1/questions`
- Method: `GET`
- URL Params: None
- Data Params: None
- Success:
    - Content: 
        ```json
        {
            "response_code": 200,
            "results": [
                {
                    "question": "What is the command to save a file in Vim?",
                    "correct_answer": ":w",
                    "incorrect_answers": [
                        ":s",
                        ":save",
                        ":savefile"
                    ]
                }
                ...
            ]   
        }
        ```
- Error:
    - Content:
        ```json
        { "error": "No questions found" }
        ```

You can click [here](https://quiz.pelumi.tech/api/v1/questions) on your browser to see the response from the API endpoint.

## Future Features
Vim Quizzer is still in development and more features will be added in the future.
Some of the features that will be added are:

- **API Endpoint for Submitting Questions**
    - This endpoint will be used by the frontend to submit questions to the database.
    - The endpoint will be secured with a token-based authentication system.
    - Only authorized users will be able to submit questions.

- **Answer Explanations**
    - This feature will provide explanations for the answers to questions.
    - It will help users understand why an answer is correct or incorrect.

## Contributing
If you would like to contribute to this project, you can do so by sending the author a message on [LinkedIn](https://www.linkedin.com/in/ajisafeoluwapelumi/) or [Twitter](https://twitter.com/the_pelumi)

## Blog Posts
I have written some blog posts about this project and some of the technologies used in building it. You can read them on [DevTo](https://dev.to/ajipelumi)

## Author
**Ajisafe Oluwapelumi** - Software Engineer  
    - [Github](https://github.com/ajipelumi)  
    - [LinkedIn](https://www.linkedin.com/in/ajisafeoluwapelumi/)  
    - [Twitter](https://twitter.com/the_pelumi)  
    - [DevTo](https://dev.to/ajipelumi)

## Acknowledgements
- You
