from flask import Flask, request, json, flash, redirect, url_for
from flask_mysqldb import MySQL
import requests
import base64
from PIL import Image
import numpy as np
from io import BytesIO
from clf import face_classification, hair_classification, detect_bounding_box
from insta_web_scrape import get_insta_images
import vals
import pandas as pd

app = Flask(__name__)

app.config['MYSQL_HOST'] = vals.MYSQL_HOST
app.config['MYSQL_USER'] = vals.MYSQL_USER
app.config['MYSQL_PASSWORD'] = vals.MYSQL_PW
app.config['MYSQL_DB'] = vals.MYSQL_DB_API

mysql = MySQL(app)

r_table = pd.DataFrame(columns=['heart', 'oblong', 'oval', 'round', 'square'], index=['straight', 'wavy', 'curly'])
r_table['heart']['straight'] = ['slickback', 'classicquiff', 'classicsidepart', 'longhairwithbangs', 'lob']
r_table['oblong']['straight'] = ['sidesweptcrewcut', 'sidepart', 'brushup', 'chinlengthbob', 'layeredbangs']
r_table['oval']['straight'] = ['brushback', 'pompadour', 'taperfadequiff', 'layeredlob', 'straightcut']
r_table['round']['straight'] = ['sidesweptbrushup', 'baldfadeslickback', 'beachwaves', 'loosewaves']
r_table['square']['straight'] = ['combover', 'buzzcut', 'highfade', 'sidesweptbangs', 'fringe']
r_table['heart']['wavy'] = ['undercut', 'longquiff', 'deepsidepart', 'loosewaves']
r_table['oblong']['wavy'] = ['longsidepart', 'classicquiff', 'undercut', 'tighthighponytail', 'centerpartedlowbun']
r_table['oval']['wavy'] = ['lowfade', 'slickback', 'fringe', 'mediumlength', 'shortmessybob']
r_table['round']['wavy'] = ['highskinfade', 'pompadour', 'quiff', 'beachwaves', 'loosewaves']
r_table['square']['wavy'] = ['texturedcombover', 'buzzcut', 'crewcut', 'sidesweptbangs', 'fringe']
r_table['heart']['curly'] = ['texturedcrew', 'bobwithsidebangs', 'curlylayeredmediumlength']
r_table['oblong']['curly'] = ['shortafro', 'layeredlonghair', 'mediumcurlycombover', 'messyshag']
r_table['oval']['curly'] = ['wavydropfade', 'curlyslickedback', 'bobwithbangs', 'balayagebob']
r_table['round']['curly'] = ['pompadour', 'sidesweptcurls', 'curlyfringe', 'longvcut', 'mediumucut']
r_table['square']['curly'] = ['pompadour', 'sleektemplefade', 'highboblowfade', 'collarbonewavy', 'shoulderlengthshag']

def create_response(res, status):
    '''Creates response for tighter code
    Parameters: 
        res: data for response
        status: status for response
    Returns:
        response: Flask response_class'''
    response = app.response_class(
        response=json.dumps(res),
        status=status,
        mimetype='application/json'
    )
    return (response)

def get_recommendations(face, hair):
    return 0

@app.route('/api/create_db', methods=["POST"])
def index():
    # Create the database cursor within a route function
    cursor = mysql.connection.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS user_classifications (
                   user_id INT PRIMARY KEY,
                   face_classification VARCHAR(10),
                   hair_classification VARCHAR(10)
                   );''')

    # Commit the changes and close the cursor
    mysql.connection.commit()
    cursor.close()
    return "Database table created"

@app.route("/api/add_to_db", methods=["POST"])
def add_clfn():
    clfn = (request.form['faceType'], request.form['hairType'])
    flash('Record was successfully added')
    return redirect(url_for('classify'))

@app.route('/api/get_hairstyle_desc', methods=["POST"])
def get_hairstyle_descs():
    hairstyles = request.get_json()

    if not(len(hairstyles) == 0 or hairstyles == {}):
        descriptions = []
        for hairstyle in hairstyles:
            temp = ''
            with open('hairstyles.txt', 'r') as file:
                temp = file.readlines()

            for line in temp:
                first, second = line.split(':')
                if first.replace(' ', '').lower() == hairstyle:
                    descriptions.append(second)

        return (create_response({'recommendations' : descriptions}, 200))
    else:
        return (create_response({'JSONError': 'Invalid JSON request format.'}, 400))

@app.route("/api/recommendations", methods=["POST"])
def return_recommendations():
    predictions = request.get_json()

    if not (len(predictions) == 0 or predictions == {}):
        face = predictions['face_prediction'][0]
        hair = predictions['hair_prediction'][0]
        recs = r_table[face][hair]
        
        return (create_response({'recommendations' : recs}, 200))
    else:
        return (create_response({'JSONError': 'Invalid JSON request format.'}, 400))

@app.route("/api/haircuts-from-insta", methods=["POST"])
def return_image_srcs():
    hashtags = request.get_json()

    if not (hashtags == '' or hashtags is None):
        b64_imgs = []

        for tag in hashtags:
            srcs = get_insta_images(tag)
            for src in srcs:
                res = requests.get(src)
                if res.status_code == 200:
                    b64_imgs.append("data:image/jpeg;base64," + str(base64.b64encode(res.content))[2:-1])

        return (create_response({'imgs' : b64_imgs}, 200))
    else:
        return (create_response({'JSONError': 'Invalid JSON request format.'}, 400))

@app.route("/api/face-detec", methods=["POST"])
def face_detect():
    data = request.get_json()

    if 'data' in data:
        img_b64 = data.split(',')[1]
        img = Image.open(BytesIO(base64.b64decode(img_b64)))
        img = img.convert('RGB')
        arr = np.array(img)
        faces = detect_bounding_box(arr)
        
        if len(faces) >= 1:
                res = {"box" : str(faces[0])}
                return (create_response(res, 200))
        else:
            return (create_response({}, 200))
    else:
        return (create_response({'JSONError': 'Invalid JSON request format.'}, 400))

@app.route("/api/classify", methods=["POST"])
def classify():
    data = request.get_json()

    if 'data' in data:
        img_b64 = data.split(',')[1]
        image = Image.open(BytesIO(base64.b64decode(img_b64)))
        image = image.convert('RGB')
        arr = np.array(image)
        #make face and hair predictions
        try:
            face_prediction = face_classification(arr)
            hair_prediction = hair_classification(arr)
            res = {'hair_prediction' : hair_prediction.tolist(), 'face_prediction' : face_prediction.tolist()}
        
            return (create_response(res, 200))
        except Exception as e:
            return (create_response({'NoFaceError' : 'No face detected.'}, 400))
    else:
        return (create_response({'JSONError': 'Invalid JSON request format.'}, 400))

@app.route('/data')
def do():
    return {'message' : 'yarn'}

if __name__ == '__main__':
    app.run(debug=True)