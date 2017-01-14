from flask import render_template, jsonify
from . import routes

from src import utils

@routes.route('/andyiscool', methods = ['GET'])
def funct2():
    data = {
            "status": "UNCOMMON",
            "name": "HAXXXXXX"
        }

    resp = jsonify(data)
    resp.status_code = 200
    return resp
