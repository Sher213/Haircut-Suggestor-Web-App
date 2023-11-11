import os
import cv2
import pandas as pd
import numpy as np
import base64
import vals

#define cascade path and images path
CASCADE_PATH = vals.PATH_3
faceCascade = cv2.CascadeClassifier(CASCADE_PATH)
path = './images'

#create dataframe
df = pd.DataFrame(columns=['image_name', 'img_b64', 'hair_type'])

#loop thru path and subdirs
for dir in os.listdir(path):
    dir_path = os.path.join(path, dir)
    for img_name in os.listdir(dir_path):
        #init row list and append img file name
        row = []
        row.append(img_name)

        img = cv2.imread(os.path.join(dir_path, img_name))

        faces = faceCascade.detectMultiScale(  
                            img,  
                            scaleFactor = 1.1, #1.1  
                            minNeighbors = 9,  
                            minSize = (30, 30),  
                            flags = cv2.CASCADE_SCALE_IMAGE  
                        )
        #only try to collect data if face detected
        if len(faces) > 0:
            #get face data
            (face_x, face_y, face_width, face_height) = faces[0]

            #start and end point of what we will keep for data
            start_point = [int(face_x - (img.shape[0] * 0.15)), int(face_y - (img.shape[1] * 0.15))]
            end_point = [int((face_x + face_width) + (img.shape[0] * 0.15)), int((face_y + face_height))]

            #make sure image stays in bounds
            if start_point[0] < 0 and start_point[1] < 0:
                img = img[0:end_point[1], 0:end_point[0]]
            elif start_point[1] < 0:
                img = img[0:end_point[1], start_point[0]:end_point[0]]
            elif start_point[0] < 0:
                img = img[start_point[1]:end_point[1], 0:end_point[0]]
            else:
                img = img[start_point[1]:end_point[1], start_point[0]:end_point[0]]
            
            #finally set dimensions of image
            final_img = None
            max_shape = 150

            if img.shape[0] > max_shape and img.shape[1] > max_shape:
                final_img = cv2.resize(img, dsize=(max_shape, max_shape))
            elif img.shape[0] > max_shape:
                final_img = cv2.resize(img, dsize=(max_shape, img.shape[1]))
            elif img.shape[1] > max_shape:
                final_img = cv2.resize(img, dsize=(img.shape[0], max_shape))
            else:
                final_img = img

            data = None

            try:
                #cv2.imshow('window', final_img)
                #cv2.waitKey(0)

                #write as base64
                _, buffer = cv2.imencode('.jpg', final_img)
                im_bytes = buffer.tobytes()
                data = base64.b64encode(im_bytes)
            except Exception as e:
                print(repr(e))
                print(start_point[1], end_point[1])
            
            #append data and dir
            row.append(data)
            row.append(dir)
            #save row to dataframe
            df.loc[len(df.index)] = row
            print("Done: " + img_name)

df.to_csv('hair_type_data.csv', index=False)