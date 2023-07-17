#!/usr/bin/python3
""" Blueprint for API. """
from flask import Blueprint


# Create blueprint
app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')


# Import views
from api.v1.views.questions import *
