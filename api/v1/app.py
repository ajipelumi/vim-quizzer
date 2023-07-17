#!/usr/bin/python3
""" Flask app to handle the API. """
from flask import Flask, jsonify, make_response
from models import storage
from api.v1.views import app_views
from flask_cors import CORS
import os


# Create Flask app
app = Flask(__name__)

# Create CORS object
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprint
app.register_blueprint(app_views)


@app.teardown_appcontext
def teardown_appcontext(exception):
    """ Close storage session. """
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """ Handle 404 error. """
    return make_response(jsonify({'error': 'No questions found'}), 404)


if __name__ == "__main__":
    """ Main Function. """
    host = os.getenv('QUIZZER_API_HOST', '0.0.0.0')
    port = os.getenv('QUIZZER_API_PORT', '5000')

    # Run Flask app
    app.run(host=host, port=port, threaded=True)
