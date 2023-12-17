import React, { useRef, useEffect, useState } from "react";
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faMinimize, faMailForward } from '@fortawesome/free-solid-svg-icons';
import ClassifierAPI from "../ClassifierAPI";

const Camera = ({ onFacePosUpdate, onVideoRef, modPos, modW, modH, defCamWidth, defCamHeight, isClassified, prediction, faceShape, onButtonClick }) => {

    const videoRef = useRef();
    const shapeVideoRef = useRef();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isCentered, setIsCentered] = useState(false);
    const [facePos, setFacePos] = useState('');

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

        let x = values[0] * (canv.width/defCamWidth);
        let y = values[1] * (canv.height/defCamHeight);
        let w = values[2] * (canv.width/defCamWidth);
        let h = values[3] * (canv.height/defCamHeight);

        if (facePos && !(facePos === '')) {
            if (isClassified) {
                let shapePath = faceShape();
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

        const sendFrameToServer = () => {
            
            frame.width = defCamWidth;
            frame.height = defCamHeight;
            ctx.drawImage(video, 0, 0, frame.width, frame.height);

            const imageData = frame;
            const frameData = imageData.toDataURL();
            ClassifierAPI.FaceDetec(frameData)
            .then(response => {
                if (Object.keys(response).length > 0) {
                    setFacePos(response['box']);
                    if (video.srcObject != null){
                        requestAnimationFrame(sendFrameToServer);
                    }
                }
                else {
                    console.log('No faces detected.')
                    setFacePos('')
                    if (video.srcObject != null){
                        requestAnimationFrame(sendFrameToServer);
                    }
                }
            })
            .catch(error => {
                console.error('Error sending frame to server:', error);
                if (video.srcObject != null){
                    requestAnimationFrame(sendFrameToServer);
                }
            });
        };
        sendFrameToServer();
    }

    const toggleCam = () => {
        const camera = document.querySelector('.camera');
        const main = document.querySelector('.main');
        const p = document.querySelector('.photoRes');
        const f = document.querySelector('.faceShapeRes');
        const h = document.querySelector('.hairTypeRes');

        if (camera && main && isExpanded == false) {
            camera.style.width = '90vw';
            camera.style.height = '90vh';
            camera.style.position = 'absolute';
            camera.style.top = '0';
            camera.style.left = '5vw';

            p.style.opacity = 0;
            f.style.opacity = 0;
            h.style.opacity = 0;

            setIsExpanded(true);       
        }
        else if (isExpanded == true) {
            minCam();
        }
    }

    const minCam = () => {
        const camera = document.querySelector('.camera');
        const p = document.querySelector('.photoRes');
        const f = document.querySelector('.faceShapeRes');
        const h = document.querySelector('.hairTypeRes');

        p.style.opacity = 1;
        f.style.opacity = 1;
        h.style.opacity = 1;

        if (camera) {
            camera.style.width = `${defCamWidth}px`;
            camera.style.height = `${defCamHeight}px`;
            camera.style.position = 'relative';
            setIsExpanded(false);
        }
    };

    useEffect(() => {
        getVideo();
        onVideoRef(videoRef.current);

        const video = videoRef.current;

        return () => {
            const stream = video.srcObject;
            const tracks = stream?.getTracks();
            if (tracks) {
                tracks.forEach((track) => {
                    track.stop();
                });
            }
            video.srcObject = null;
        }
        
    }, [videoRef])

    useEffect(() => {
        renderFaceShape();

        onFacePosUpdate(facePos);
    }, [facePos, prediction, isClassified]);

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
        <div className="camera">
            <video className="mainView"ref={videoRef}></video>
            <canvas ref={shapeVideoRef}></canvas>
            <div className="take-photo-container">
                <button className="expandView" onClick={toggleCam}>
                    <FontAwesomeIcon icon={isExpanded ? faMinimize : faExpand } color='lime'></FontAwesomeIcon>
                </button>
                <button onClick={onButtonClick} className="take-photo-button">
                    <FontAwesomeIcon icon={faMailForward} color='lime'></FontAwesomeIcon>
                </button>
            </div>
        </div>
    )
}

export default Camera;