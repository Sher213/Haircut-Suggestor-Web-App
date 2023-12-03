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

app = Flask(__name__)

app.config['MYSQL_HOST'] = vals.MYSQL_HOST
app.config['MYSQL_USER'] = vals.MYSQL_USER
app.config['MYSQL_PASSWORD'] = vals.MYSQL_PW
app.config['MYSQL_DB'] = vals.MYSQL_DB_API

mysql = MySQL(app)

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

@app.route("/api/haircuts-from-insta", methods=["POST"])
def return_image_srcs():
    hashtag = request.get_json()
    if not (hashtag == ''):
        b64_imgs = []
        srcs = get_insta_images(hashtag)

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