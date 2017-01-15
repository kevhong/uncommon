from flask import render_template, jsonify
from . import routes

from src import utils

@routes.route('/')
def index():
    utils.test()
    return render_template('index.html')

@routes.route('/test', methods = ['GET'])
def funct():
    
    data = {
            "status": "ok",
            "name": "kevin"
        }

    resp = jsonify(data)
    resp.status_code = 200
    return resp
