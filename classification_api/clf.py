import tensorflow as tf
import cv2
import dlib
import math
import numpy as np
import pickle
import vals
from PIL import Image, ImageOps, ImageFilter

#max padding for hair image list
MAX_PAD_FOR_FACE_LIST = 33770
MAX_PAD_FOR_HAIR_LIST = 67500
CROP_EXPAND_FLOAT = 0.1
COLOR = 1
BIT = 2

vid = cv2.VideoCapture(0)

#load classifiers and predictors
faceCascade = cv2.CascadeClassifier(vals.PATH_3)
predictor = dlib.shape_predictor(vals.PATH_7)

#load classifiers
face_clf = pickle.load(open(vals.PATH_5, 'rb'))
face_clf2 = tf.keras.models.load_model(vals.PATH_8)
hair_clf = pickle.load(open(vals.PATH_6, 'rb'))
hair_clf2 = tf.keras.models.load_model(vals.PATH_9)

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

def d(landmarks,index1,index2):
    '''Get distance between two landmarks
    Parameters:
        landmarks: list of landmarks
        index1: first landmark index
        index2: second landmark index
    Returns:
        dist: distance between landmarks'''

    x1 = landmarks[int(index1)][0]
    y1 = landmarks[int(index1)][1]
    x2 = landmarks[int(index2)][0]
    y2 = landmarks[int(index2)][1]
    
    x_diff = (x1 - x2)**2
    y_diff = (y1 - y2)**2
    
    dist = math.sqrt(x_diff + y_diff)
    
    return dist

def q(landmarks,index1,index2):

    '''Get angle between two landmarks
    Parameters:
        landmarks: list of landmarks
        index1: first landmark index
        index2: second landmark index
    Returns:
        angle between landmarks'''

    x1 = landmarks[int(index1)][0]
    y1 = landmarks[int(index1)][1]
    x2 = landmarks[int(index2)][0]
    y2 = landmarks[int(index2)][1]
    
    x_diff = float(x1 - x2)
    
    if (y1 == y2): y_diff = 0.1
    if (y1 < y2): y_diff = float(np.absolute(y1 - y2))
    if (y1 > y2): 
        y_diff = 0.1

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

def detect_bounding_box(frame):
    '''Takes frame and puts bounding box on face
    Parameters:
        frame: frame of video capture
    Returns:
        faces: faces data in the frame'''

    gray_image = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(gray_image, 1.1, 5, minSize=(40, 40))
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 4)
    return faces

def face_classification(image):
    '''Takes image as input and returns a prediction of the face type
    Parameters:
        image: frame from the video capture
    Returns:
        prediction: The predicted face type'''
    
    faces = detect_bounding_box(image)
    face = faces[0]

    features = []
    im = Image.fromarray(image).convert('RGB')
    a = []
    #append processed data to list
    a.append(im)
    a.append(imgSquare(im))
    a.append(im.filter(ImageFilter.EDGE_ENHANCE))
    a.append(im.convert('L'))
    a.append(im.rotate(10))
    a.append(ImageOps.equalize(im))
    a.append(ImageOps.autocontrast(im))
    a.append(ImageOps.crop(im, int(im.width * CROP_EXPAND_FLOAT)))
    a.append(ImageOps.expand(im, int(im.width * CROP_EXPAND_FLOAT), int(COLOR)))
    a.append(ImageOps.posterize(im, BIT))

    for imageProcessed in a:
        image = np.array(imageProcessed) #cv2.imread(os.path.join(IMAGES_PATH, dir, file))
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_gray = cv2.cvtColor(image_rgb, cv2.COLOR_BGR2GRAY)

        (xTrue, yTrue, wTrue, hTrue) = face

        dlib_rect = dlib.rectangle(int(xTrue), int(0.95*yTrue), int(xTrue + wTrue), int(yTrue + 1.05*hTrue))  
                        
        detected_landmarks = predictor(image, dlib_rect).parts()  
        lmark = np.matrix([[p.x, p.y] for p in detected_landmarks])
        landmarks = lmark.tolist()

        f = []

        face_height = d(landmarks, 8, 71)
        face_width = d(landmarks, 1, 15)
        eyes_width = d(landmarks, 39, 42)
        chin_height = d(landmarks, 8, 57)
        jaw_width = d(landmarks, 3, 13)
        forehead_width = d(landmarks, 77, 78)
        forhead_height = d(landmarks, 27, 71)
        nose_height = d(landmarks, 33, 27)

        f.append(face_height/face_width)
        f.append(face_height/chin_height)
        f.append(face_width/jaw_width)
        f.append(face_width/eyes_width)
        f.append(eyes_width/jaw_width)
        f.append(face_height/forhead_height)
        f.append(chin_height/forhead_height)
        f.append(face_width/forehead_width)
        f.append(forehead_width/jaw_width)
        f.append(eyes_width/forehead_width)
        f.append(face_height/nose_height)
        f.append(chin_height/nose_height)
        f.append(forhead_height/nose_height)


        face_shape_list = landmarks[:17] + landmarks[68:]

        for i in range(len(face_shape_list) - 1):
            for j in range(1, len(face_shape_list)):
                f.append(d(face_shape_list, i, j)/face_height)
                f.append(d(face_shape_list, i, j)/face_width)
                f.append(q(face_shape_list, i, j)/q(landmarks, 6, 79))
                f.append(q(face_shape_list, i, j)/q(landmarks, 10, 75))
        
        #append collected features
        features.append(f)
    features = [j for innerList in features for j in innerList]
    features = np.pad(features, (0, MAX_PAD_FOR_FACE_LIST - len(features)), mode='constant')
    prediction = face_clf.predict([features])
    return prediction

def face_classification_only_photo(image):
    
    img = cv2.resize(cv2.cvtColor(image, cv2.COLOR_BGR2RGB), (200, 200))
    arr = np.array(img)
    input_data = np.expand_dims(arr, axis=0)

    return(face_clf2.predict(input_data))

def hair_classification_only_photo(image):
    
    img = cv2.resize(cv2.cvtColor(image, cv2.COLOR_BGR2RGB), (200, 200))
    arr = np.array(img)
    input_data = np.expand_dims(arr, axis=0)

    return(hair_clf2.predict(input_data))

def process_data_for_hair_clf(img):
    '''Helper function to process the image into a usable list
    Parameters:
        img: Image to be made into a list and padded
    Returns: 
        data_list: List that has Image data and has been processed for the classifier'''
    
    data_list = np.array(img).reshape(-1).tolist()
    data_list = np.pad(data_list, (0, MAX_PAD_FOR_HAIR_LIST - len(data_list)), mode='constant').tolist()[:-1]
    return(data_list)

def hair_classification(image):
    '''Processes an image to classify hair type
    Parameters:
        image: image to be processed for classifier
    Returns:
        prediction: prediction of hair type in image
    '''
    image = cv2.resize(image, (300,300))
    faces = detect_bounding_box(image)

    face = faces[0]

    #get face data
    (face_x, face_y, face_width, face_height) = face

    #start and end point of what we will keep for data
    start_point = [int(face_x - (image.shape[0] * 0.15)), int(face_y - (image.shape[1] * 0.15))]
    end_point = [int((face_x + face_width) + (image.shape[0] * 0.15)), int((face_y + face_height))]

    #make sure image stays in bounds
    if start_point[0] < 0 and start_point[1] < 0:
        image = image[0:end_point[1], 0:end_point[0]]
    elif start_point[1] < 0:
        image = image[0:end_point[1], start_point[0]:end_point[0]]
    elif start_point[0] < 0:
        image = image[start_point[1]:end_point[1], 0:end_point[0]]
    else:
        image = image[start_point[1]:end_point[1], start_point[0]:end_point[0]]
            
    #do not let final image exceed 150x150 
    final_img = None
    max_shape = 150

    if image.shape[0] > max_shape and image.shape[1] > max_shape:
        final_img = cv2.resize(image, dsize=(max_shape, max_shape))
    elif image.shape[0] > max_shape:
        final_img = cv2.resize(image, dsize=(max_shape, image.shape[1]))
    elif image.shape[1] > max_shape:
        final_img = cv2.resize(image, dsize=(image.shape[0], max_shape))
    else:
        final_img = image

    #process final image
    processed = process_data_for_hair_clf(final_img)
    prediction = hair_clf.predict(np.array([processed]))
    return prediction