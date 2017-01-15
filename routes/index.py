import os
import urllib

from flask import render_template, jsonify, request, send_file
from . import routes

from src import utils
from src import face

count = 0

index_val = 0

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

@routes.route('/dogifyurl', methods = ['POST'])
def dogify_url():
    link = request.form['link']
    filename = os.path.join("data", "saved", str(hash(link)) + ".jpg")
    urllib.urlretrieve(link, filename)
    key = str(hash(link))
    filename = face.overlay_face(filename, imageOverlay = os.path.join("data",
         "overlays", "dog_face_tongue.png"), test = False, ret = key)
    print filename
    return "http://127.0.0.1:5000/files/" + key

@routes.route("/files/<string:index>", methods = ['GET'])
def dogify_return(index):
    filename = os.path.join("data", "created",index + ".jpg")
    return send_file(filename);
