import os
from io import BytesIO
import cv2
import dlib
import pandas as pd
import base64
import math
import numpy as np
from PIL import Image, ImageOps, ImageFilter

import vals

IMAGES_PATH = vals.PATH_1
CASCADE_PATH = vals.PATH_3
PREDICTOR_PATH = vals.PATH_7

data = pd.DataFrame(columns=['image_name', 'image_original', 'face_height_to_width', 'face_height_to_chin_height', 'face_width_to_jaw_width',
                             'face_width_to_eyes_width', 'eyes_width_to_jaw_width', 'face_height_to_forehead_height', 'chin_height_to_forehead_height',
                              'face_width_to_forehead_width', 'forehead_width_to_jaw_width', 'eyes_width_to_forehead_width', 'face_height_to_nose_height', 
                               'chin_height_to_nose_height', 'forehead_height_to_nose_height', 'features_original', 'feature_square',
                                      'features_edge_enhance', 'features_gray', 'features_rotate1', 'features_rotate2', 'features_flip_LR',
                                        'features_equalize', 'features_autoContrast', 'features_posterize', 'face_type'])

CROP_EXPAND_FLOAT = 0.1
COLOR = 1
BIT = 2

faceCascade = cv2.CascadeClassifier(CASCADE_PATH)
predictor = dlib.shape_predictor(PREDICTOR_PATH)

def get_lum(image,x,y,w,h,k,gray):
    ''' Get luminosity difference in an image
    Parameters:
        image: 2D array image
        x: pixel point
        y: pixel point
        w: width to cross
        h: height to cross
        gray: 0 or 1 if image is gray

    Returns:
        Minimum value in a list
    '''
    if gray == 1: image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    i1 = range(int(-w/2), int(w/2))
    j1 = range(0,h)

    lumar = np.zeros((len(i1), len(j1)))
    for i in i1:
        for j in j1:
            lum = np.min(image[y+k*h, x+1])
            lumar[i][j] = lum
    
    return np.min(lumar)

'''Get distance between two landmarks
Parameters:
    landmarks: list of landmarks
    index1: first landmark index
    index2: second landmark index
Returns:
    dist: distance between landmarks'''
def d(landmarks,index1,index2):
#get distance between i1 and i2

	x1 = landmarks[int(index1)][0]
	y1 = landmarks[int(index1)][1]
	x2 = landmarks[int(index2)][0]
	y2 = landmarks[int(index2)][1]
	
	x_diff = (x1 - x2)**2
	y_diff = (y1 - y2)**2
	
	dist = math.sqrt(x_diff + y_diff)
	
	return dist

'''Get angle between two landmarks
Parameters:
    landmarks: list of landmarks
    index1: first landmark index
    index2: second landmark index
Returns:
    angle between landmarks'''
def q(landmarks,index1,index2):
#get angle between a i1 and i2

	x1 = landmarks[int(index1)][0]
	y1 = landmarks[int(index1)][1]
	x2 = landmarks[int(index2)][0]
	y2 = landmarks[int(index2)][1]
	
	x_diff = float(x1 - x2)
	
	if (y1 == y2): y_diff = 0.1
	if (y1 < y2): y_diff = float(np.absolute(y1 - y2))
	if (y1 > y2): y_diff = float(np.absolute(y1 - y2))
	
	return np.absolute(math.atan(x_diff/y_diff))

def imgSquare(im):
    ''' turn PIL Image into Image w/ width == height
    Args:
        im (Image)
    Returns:
        a4im (Image)'''
    
    width, height = im.size
    if (width != height):
        size = max(width, height)
        a4im = Image.new('RGB',(size, size), (255, 255, 255)) #second argument is size, 3rd is color padded
        try: a4im.paste(im, (0, 0, width, height))
        except Exception as e: print(repr(e))
        return a4im
    else:
        return im

#loop thru directories
for dir in os.listdir(IMAGES_PATH):
    #loop thru images
    for j in range(len(os.listdir(os.path.join(IMAGES_PATH, dir)))):
        
        file = os.listdir(os.path.join(IMAGES_PATH, dir))[j]
        row = []
        row.append(file)

        im = Image.open(os.path.join(IMAGES_PATH, dir, file))
        im = im.convert('RGB')
        a = []
        #append processed data to list
        a.append(im)
        a.append(imgSquare(im))
        a.append(im.filter(ImageFilter.EDGE_ENHANCE))
        a.append(im.convert('L'))
        a.append(im.rotate(10))
        a.append(im.rotate(-10))
        a.append(im.transpose(Image.FLIP_LEFT_RIGHT))
        a.append(ImageOps.equalize(im))
        a.append(ImageOps.autocontrast(im))
        a.append(ImageOps.posterize(im, BIT))

        buffer = BytesIO()
        im.save(buffer, format='JPEG')
        row.append(base64.b64encode(buffer.getvalue()))

        #bool for only getting the ratios from the original image
        hasRatios = False
        for imageProcessed in a:
            #load images for feature extraction
            image = np.array(imageProcessed) #cv2.imread(os.path.join(IMAGES_PATH, dir, file))
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image_gray = cv2.cvtColor(image_rgb, cv2.COLOR_BGR2GRAY)

            # Detect faces in the image;
            faces = faceCascade.detectMultiScale(  
                    image_gray,  
                    scaleFactor = 1.1, #1.1  
                    minNeighbors = 9,  
                    minSize = (30, 30),  
                    flags = cv2.CASCADE_SCALE_IMAGE  
                )
            
            if (len(faces) > 0):
                #only look at first face
                (xTrue, yTrue, wTrue, hTrue) = faces[0]

                # Converting the OpenCV rectangle coordinates to Dlib rectangle  
                dlib_rect = dlib.rectangle(int(xTrue), int(0.95*yTrue), int(xTrue + wTrue), int(yTrue + 1.05*hTrue))  
                
                #get landmarks
                detected_landmarks = predictor(image, dlib_rect).parts()  
                lMarks = np.matrix([[p.x, p.y] for p in detected_landmarks])  
                landmarks = lMarks.tolist()
                
                #list of features
                f = []

                #important facial ratios
                face_height = d(landmarks, 8, 71)
                face_width = d(landmarks, 1, 15)
                eyes_width = d(landmarks, 39, 42)
                chin_height = d(landmarks, 8, 57)
                jaw_width = d(landmarks, 3, 13)
                forehead_width = d(landmarks, 77, 78)
                forehead_height = d(landmarks, 27, 71)
                nose_height = d(landmarks, 33, 27)


                if hasRatios == False:
                    row.append(face_height/face_width)
                    row.append(face_height/chin_height)
                    row.append(face_width/jaw_width)
                    row.append(face_width/eyes_width)
                    row.append(eyes_width/jaw_width)
                    row.append(face_height/forehead_height)
                    row.append(chin_height/forehead_height)
                    row.append(face_width/forehead_width)
                    row.append(forehead_width/jaw_width)
                    row.append(eyes_width/forehead_width)
                    row.append(face_height/nose_height)
                    row.append(chin_height/nose_height)
                    row.append(forehead_height/nose_height)

                    #set to true
                    hasRatios = True

                #append features individually and as a list
                f.append(face_height/face_width)
                f.append(face_height/chin_height)
                f.append(face_width/jaw_width)
                f.append(face_width/eyes_width)
                f.append(eyes_width/jaw_width)
                f.append(face_height/forehead_height)
                f.append(chin_height/forehead_height)
                f.append(face_width/forehead_width)
                f.append(forehead_width/jaw_width)
                f.append(eyes_width/forehead_width)
                f.append(face_height/nose_height)
                f.append(chin_height/nose_height)
                f.append(forehead_height/nose_height)

                #overall face outline
                face_shape_list = landmarks[:17] + landmarks[68:]

                #extract features including distance and angle ratios
                for i in range(len(face_shape_list) - 1):
                    for j in range(1, len(face_shape_list)):
                        f.append(d(face_shape_list, i, j)/face_height)
                        f.append(d(face_shape_list, i, j)/face_width)
                        f.append(q(face_shape_list, i, j)/q(landmarks, 6, 79))
                        f.append(q(face_shape_list, i, j)/q(landmarks, 10, 75))     
            else:
                print(str(imageProcessed) + ' has no faces.')
                print(len(f))

            #if no features, append None
            if len(f) == 0:
                row.append(None)
            else:
                row.append(f)
                f = []
            
        #face type is equal to dir name
        row.append(dir)
        data.loc[len(data.index)] = row
        print('Done: ' + file)
        
data.to_csv('face_shape_classification.csv', index=False)
        


        