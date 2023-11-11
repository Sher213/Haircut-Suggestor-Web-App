from flask import Flask, request, json, flash, redirect, url_for
from flask_mysqldb import MySQL
import base64
from PIL import Image
import numpy as np
from io import BytesIO
from clf import face_classification, hair_classification
import vals

app = Flask(__name__)

app.config['MYSQL_HOST'] = vals.MYSQL_HOST
app.config['MYSQL_USER'] = vals.MYSQL_USER
app.config['MYSQL_PASSWORD'] = vals.MYSQL_PW
app.config['MYSQL_DB'] = vals.MYSQL_DB_API

mysql = MySQL(app)

@app.route('/', methods=["POST"])
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

@app.route("/api/add", methods=["POST"])
def addClfn():
    clfn = (request.form['faceType'], request.form['hairType'])
    flash('Record was successfully added')
    return redirect(url_for('classify'))



@app.route("/api/classify", methods=["POST"])
def classify():
    data = request.json

    if 'data' in data:
        #extract base64 and decode
        img_b64 = data.split(',')[1]
        image = Image.open(BytesIO(base64.b64decode(img_b64)))
        image = image.convert('RGB')
        arr = np.array(image)
        #make face and hair predictions
        face_prediction = face_classification(arr)
        hair_prediction = hair_classification(arr)
        data = {'hair_prediction' : hair_prediction.tolist(), 'face_prediction' : face_prediction.tolist()}
        
        response = app.response_class(
            response=json.dumps(data),
            status=200,
            mimetype='application/json'
        )
        
        #return predictions
        return (response)
    else:
        response = app.response_class(
            response=json.dumps({'error': 'Invalid JSON request format'}),
            status=400,
            mimetype='application/json'
        )
        return (response)

@app.route('/data')
def do():
    return {'message' : 'yarn'}

if __name__ == '__main__':
    app.run(debug=True)