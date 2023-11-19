import React, { useRef, useEffect, useState } from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faExpand} from '@fortawesome/free-solid-svg-icons'
import './index.scss'
import ClassifierAPI from "../ClassifierAPI";
import heartS from '../../assets/images/heart.png'
import oblongS from '../../assets/images/oblong.png'
import ovalS from '../../assets/images/oval.png'
import roundS from '../../assets/images/round.png'
import squareS from '../../assets/images/square.png'
import wavyHair from '../../assets/images/wavy.png'
import straightHair from '../../assets/images/straight.png'
import curlyHair from '../../assets/images/curly.png'

const Camera = () => { 
    const modPos = -50;
    const modW = 100;
    const modH = 150;

    const defCamWidth = 500;
    const defCamHeight = 500;
    const hairImgSize = 500;

    const videoRef = useRef();
    const photoRef = useRef();
    const shapeVideoRef = useRef();
    const shapePhotoRef = useRef();
    const hairTypeRef = useRef();

    const [isExpanded, setExpanded] = useState(false);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [isClassified, setClassified] = useState(false);
    const [facePos, setFacePos] = useState('');
    const [needFaceMessage, setNeedFaceMessage] = useState(false);

    const [prediction, setPrediction] = useState({
        face_prediction: '',
        hair_prediction: '',
    });

    const getFaceShape = () => {
        let face_pred = prediction.face_prediction[0];

        switch(face_pred) {
            case 'heart':
                return (heartS);
            case 'oblong':
                return (oblongS);
            case 'oval':
                return (ovalS);
            case 'round':
                return (roundS);
            case 'square':
                return (squareS);
        }
    }

    const getFaceBox = () => {
        let box = facePos;
        const temp = box.replace(/\[|\]/g, '');
        const values = temp.split(' ').map(Number);
        return (values);
    }

    const renderFaceShape = () => {
        const canv = shapeVideoRef.current;

        const mainView = document.querySelector('.mainView')
        canv.width = mainView.clientWidth;
        canv.height = mainView.clientHeight;

        const ctx = canv.getContext('2d');
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        const values = getFaceBox();
        const x = values[0];
        const y = values[1];
        const w = values[2];
        const h = values[3];

        if (facePos && !(facePos === '')) {
            if (isClassified) {
                let shapePath = getFaceShape();
                let shapeImage = new Image();
                shapeImage.src = shapePath;
                shapeImage.onload = () => {
                    ctx.drawImage(shapeImage, x+modPos, y+modPos, w+modW, h+modH);
                };
            }
            else {
                ctx.strokeRect(x, y, w, h);
            }
        }
        else {
            ctx.clearRect(0, 0, canv.width, canv.height);
        }
    }

    const getHairPic = () => {
        let hair_pred = prediction.hair_prediction[0];
        console.log(prediction);
        switch(hair_pred) {
            case 'curly':
                return (curlyHair);
            case 'straight':
                return (straightHair);
            case 'wavy':
                return (wavyHair);
        }
    }

    const drawHairType = () => {
        const canv = hairTypeRef.current;
        canv.width = 50;
        canv.height = 50;
        const ctx = canv.getContext('2d');
        let hairPath = getHairPic();
        let hairImage = new Image();
        hairImage.src = hairPath;
        hairImage.onload = () => {
            ctx.drawImage(hairImage, 0, 0, hairImgSize, hairImgSize);
        };
    }

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({video: {width: defCamWidth, height: defCamHeight}})
        .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;

                const playPromise = video.play()
                if (playPromise !== undefined) {
                    playPromise
                    .then(() => {
                        console.log("webcam on!")
                        processVideoFrames(video);
                    })
                    .catch(err => {
                        console.error(err)
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    const processVideoFrames = (video) => {
        const frame = document.createElement('canvas');
        const ctx = frame.getContext('2d');
        const mainView = document.querySelector('.mainView')

        const sendFrameToServer = () => {
            
            frame.width = mainView.clientWidth;
            frame.height = mainView.clientHeight;
            ctx.drawImage(video, 0, 0, frame.width, frame.height);

            const imageData = frame;
            const frameData = imageData.toDataURL();
            ClassifierAPI.FaceDetec(frameData)
            .then(response => {
                if (Object.keys(response).length > 0) {
                    setFacePos(response['box']);
                    //console.log('Face position:', response);
                    requestAnimationFrame(sendFrameToServer);
                }
                else {
                    console.log('No faces detected.')
                    setFacePos('')
                    requestAnimationFrame(sendFrameToServer);
                }
            })
            .catch(error => {
                console.error('Error sending frame to server:', error);
                requestAnimationFrame(sendFrameToServer);
            });
        };
        sendFrameToServer();
    }

    const classify = () => {
        const mainView = document.querySelector('.mainView');
        const width = mainView.clientWidth;
        const height = mainView.clientHeight;

        let video = videoRef.current;
        let photoSend = document.createElement('canvas');

        photoSend.width = width;
        photoSend.height = height;

        let ctx = photoSend.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        
        const dataURL = photoSend.toDataURL();
        
        ClassifierAPI.ClassifyImage(dataURL)
        .then(response => {
            let photoTaken = photoRef.current;
            let shapeChosen = shapePhotoRef.current;
            let hairChosen = hairTypeRef.current;
                        
            shapeChosen.width = width;
            shapeChosen.height = height;
            photoTaken.width = width;
            photoTaken.height = height;
            hairChosen.width = hairImgSize;
            hairChosen.height = hairImgSize;

            let ctx = photoTaken.getContext('2d');
            ctx.clearRect(0, 0, photoTaken.width, photoTaken.height);
            let ctx2 = shapeChosen.getContext('2d');
            ctx2.clearRect(0, 0, shapeChosen.width, shapeChosen.height);
            let ctx3 = hairChosen.getContext('2d');
            ctx3.clearRect(0, 0, hairChosen.width, hairChosen.height);

            if ('NoFaceError' in response) {
                alert("No faces were detected. Please try again.")
            }
            else {
                setPrediction(response);
                setClassified(true);
                setPhotoTaken(true);

                ctx.drawImage(video, 0, 0, width, height);
            }
        })
        .catch(error => console.log('error', error));
    }

    const toggleCam = () => {
        const camera = document.querySelector('.camera');
        const main = document.querySelector('.main');
        const p = document.querySelector('.photo');
        const f = document.querySelector('.faceShape');
        const h = document.querySelector('.hairType');

        if (camera && main && isExpanded == false) {
            camera.style.width = `${main.clientWidth}px`;
            camera.style.height = `${main.clientHeight - 55}px`; 

            p.style.opacity = 0;
            f.style.opacity = 0;
            h.style.opacity = 0;

            setExpanded(true);       
        }
        else if (isExpanded == true) {
            minCam();
        }
    }

    const minCam = () => {
        const camera = document.querySelector('.camera');
        const p = document.querySelector('.photo');
        const f = document.querySelector('.faceShape');
        const h = document.querySelector('.hairType');

        p.style.opacity = 1;
        f.style.opacity = 1;
        h.style.opacity = 1;

        if (camera) {
            camera.style.width = `${defCamWidth}px`;
            camera.style.height = `${defCamHeight}px`;
            setExpanded(false);
        }
    };

    const makeDB = () => {
        const test = {'result' : 'done'}
        ClassifierAPI.CreateDB(test)
        .then(response => console.log(response))
        .catch(error => console.log(error))
    }

    useEffect(() => {
        //console.log('facePos: ', facePos);
    }, [facePos])

    useEffect(() => {
        if (isClassified && !(facePos === '')) {
            const canv = shapePhotoRef.current;
            const photo = document.querySelector('.photo')
            canv.width = photo.clientWidth;
            canv.height = photo.clientHeight;
            
            const ctx = canv.getContext('2d');
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            
            const values = getFaceBox();
            const x = values[0];
            const y = values[1];
            const w = values[2];
            const h = values[3];

            let shapePath = getFaceShape();
            let shapeImage = new Image();
            shapeImage.src = shapePath;
            shapeImage.onload = () => {
                ctx.drawImage(shapeImage, x+modPos, y+modPos, w+modW, h+modH);
            };
            drawHairType();
            setPhotoTaken(false);
        }
    }, [isClassified, photoTaken, prediction])

    useEffect(() => {
        getVideo();
    }, [videoRef])

    useEffect(() => {
        if (facePos === "") {
            setNeedFaceMessage(true);
        } else {
            setNeedFaceMessage(false);
        }       
    }, [facePos])

    useEffect(() => {
        renderFaceShape();
    }, [facePos, prediction, isClassified])

    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === 'Escape' && isExpanded) {
            minCam();
          }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isExpanded]);

    return (
        <div className= "main">
            <div className="left">
                <div className="camera">
                    <video className="mainView"ref={videoRef}></video>
                    <canvas ref={shapeVideoRef}></canvas>
                    <button className="expandView" onClick={toggleCam}>
                        <FontAwesomeIcon icon={faExpand} color='lime'></FontAwesomeIcon>
                    </button>
                </div>
                <div className="submit">
                    <button className="takePhoto" onClick={classify} /*disabled={needFaceMessage}*/>Classify</button>
                    {needFaceMessage && (
                    <div style={{ paddingLeft: '30px', background: 'red', color: "yellow", marginTop: "10px" }}>
                        Need face before classifying.
                    </div>
                    )}
                </div>
            </div>
            <div className='result'>
                <p style={{fontSize: '25px'}}>Face Prediction: {prediction.face_prediction}</p>
                <p style={{fontSize: '25px'}}>Hair Prediction: {prediction.hair_prediction}</p>
                <div className="photoContainer">
                    <canvas className="photo" ref={photoRef}></canvas>
                    <canvas className="faceShape" ref={shapePhotoRef}></canvas>
                    <canvas className="hairType" ref={hairTypeRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default Camera;