import os

from flask import render_template, jsonify, request, send_file
from . import routes

from src import utils
from src import face

count = 0

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

@routes.route('/dogify', methods = ['POST'])
def dogify_func():
    fs = request.files['image_file']
    filename = os.path.join("data", "saved", str(count) + ".jpg")
    fs.save(filename)
    filename = face.overlay_face(filename, imageOverlay = os.path.join("data",
        "overlays", "dog_face_tongue.png"), test = False)
    return send_file(filename)
