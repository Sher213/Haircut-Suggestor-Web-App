import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './index.scss';
import ClassifierAPI from "../ClassifierAPI";
import heartS from '../../assets/images/heart.png';
import oblongS from '../../assets/images/oblong.png';
import ovalS from '../../assets/images/oval.png';
import roundS from '../../assets/images/round.png';
import squareS from '../../assets/images/square.png';
import wavyHair from '../../assets/images/wavy.png';
import straightHair from '../../assets/images/straight.png';
import curlyHair from '../../assets/images/curly.png';
import resultsBackground from '../../assets/images/result-bg.jpg'
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Camera from '../Camera';

const Classification = () => {
    const modPos = -30;
    const modW = 50;
    const modH = 75;

    const navigate = useNavigate();

    const defCamWidth = 500;
    const defCamHeight = 500;
    const hairImgSize = 500;

    const photoRef = useRef();
    const shapePhotoRef = useRef();
    const hairTypeRef = useRef();

    const [videoRefCurr, setVideoRefCurr] = useState(null);
    const [facePos, setFacePos] = useState('');
    const [photoTaken, setPhotoTaken] = useState(null);
    const [photoClassified, setPhotoClassified] = useState(false);
    const [isClassified, setClassified] = useState(false);
    const [needFaceMessage, setNeedFaceMessage] = useState(false);
    const [currentTip, setCurrentTip] = useState(0)

    const [resultVisible, setResultVisible] = useState(false);
    const [isArrowHovered, setArrowHovered] = useState(false);
    const [loading, setLoading] = useState(true);

    const [prediction, setPrediction] = useState({
        face_prediction: '',
        hair_prediction: '',
    });

    const handleArrowHover = () => {
        setArrowHovered(true);
    };
    
      const handleArrowLeave = () => {
        setArrowHovered(false);
    };

    const slideInStyles = {
        transform: `translateX(${isArrowHovered ? '50px' : '-530px'})`,
      };

    const handleFacePosUpdate = (updatedFacePos) => {
        setFacePos(updatedFacePos);
    };

    const handleVideoRef = (ref) => {
        setVideoRefCurr(ref);
      };

    const getFaceBox = () => {
        let box = facePos;
        const temp = box.replace(/\[|\]/g, '');
        const values = temp.split(' ').map(Number);
        return (values);
    }

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

    const getHairPic = () => {
        let hair_pred = prediction.hair_prediction[0];
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

    const handleButtonClick = () => {
        classify();
    }

    const classify = () => {
        setClassified(false);
        setLoading(true);
        
        const width = defCamWidth;
        const height = defCamHeight;

        let video = videoRefCurr;
        let photoSend = document.createElement('canvas');

        photoSend.width = width;
        photoSend.height = height;

        let ctx = photoSend.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        
        const dataURL = photoSend.toDataURL();
        setPhotoTaken(dataURL);

        ClassifierAPI.ClassifyImage(dataURL)
        .then(response => {
            if ('NoFaceError' in response) {
                alert("No faces were detected. Please try again.")
            }
            else {
                setPrediction(response);
                setClassified(true);
                setPhotoClassified(true);
            }
        })
        .catch(error => {
            console.log('error', error)
        });
    }

    useEffect(() => {
        
    }, [photoTaken])

    useEffect(() => {
        if (isClassified && loading && !resultVisible) {
            setResultVisible(true);
        }
    }, [isClassified, loading, resultVisible]);

    const drawResult = () => {
        const width = defCamWidth;
        const height = defCamHeight;

        let currPhoto = photoRef.current;
        let shapeChosen = shapePhotoRef.current;
        let hairChosen = hairTypeRef.current;
                    
        shapeChosen.width = width;
        shapeChosen.height = height;
        currPhoto.width = width;
        currPhoto.height = height;
        hairChosen.width = hairImgSize;
        hairChosen.height = hairImgSize;
        let ctx = currPhoto.getContext('2d');
        ctx.clearRect(0, 0, currPhoto.width, currPhoto.height);
        let ctx2 = shapeChosen.getContext('2d');
        ctx2.clearRect(0, 0, shapeChosen.width, shapeChosen.height);
        let ctx3 = hairChosen.getContext('2d');
        ctx3.clearRect(0, 0, hairChosen.width, hairChosen.height);

        if (isClassified && !(facePos === '')) {
            let photoDraw = photoRef.current;

            photoDraw.width = width;
            photoDraw.height = height;
    
            let ctxPhoto = photoDraw.getContext('2d');
            let img = new Image();
            img.src = photoTaken;
            img.onload = () => {
                ctxPhoto.drawImage(img, 0, 0, width, height);
            }

            const canv = shapePhotoRef.current;
            const photo = document.querySelector('.photoRes')
            canv.width = photo.clientWidth;
            canv.height = photo.clientHeight;
            
            const ctx = canv.getContext('2d');
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            
            const values = getFaceBox();

            let x = values[0];
            let y = values[1];
            let w = values[2];
            let h = values[3];

            let shapePath = getFaceShape();
            let shapeImage = new Image();
            shapeImage.src = shapePath;
            shapeImage.onload = () => {
                ctx.drawImage(shapeImage, x+modPos, y+modPos, w+modW, h+modH);
            };
            drawHairType();
            setPhotoClassified(false);
            setLoading(false);

            const timer = setTimeout(() => {
                setResultVisible(true);
                setLoading(false);
            }, 2000);

            return () => clearTimeout(timer);
        };
    }

    const makeDB = () => {
        const test = {'result' : 'done'}
        ClassifierAPI.CreateDB(test)
        .then(response => console.log(response))
        .catch(error => console.log(error))
    }

    const handleRecommendationsClick = event => {
        event.preventDefault();
        navigate("/recommendations", {state: { prediction: prediction } });
    };

    useEffect(() => {
        //console.log('facePos: ', facePos);
    }, [facePos])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTip((prevTip) => (prevTip +1) % 5);   
        }, 5000);

        return () => clearInterval(timer);
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            drawResult();
        }, 2000)
        return () => clearTimeout(timer);
    }, [isClassified, photoClassified, prediction, photoTaken])

    useEffect(() => {
        if (facePos === "") {
            setNeedFaceMessage(true);
        } else {
            setNeedFaceMessage(false);
        }       
    }, [facePos])

    return (
        <div className= "main">
            {isClassified && loading && <div className="loading-spinner"></div>}
            {!resultVisible && (
            <div className="left">
                <Camera
                    onFacePosUpdate={handleFacePosUpdate}
                    onVideoRef={handleVideoRef}
                    modPos={modPos} 
                    modW={modW} 
                    modH={modH} 
                    defCamWidth={defCamWidth} 
                    defCamHeight={defCamHeight}
                    isClassified={isClassified} 
                    prediction={prediction} 
                    faceShape={getFaceShape}
                    onButtonClick={handleButtonClick}/>
                <div className="alert-message-container">
                    {needFaceMessage ? (
                    <div style={{ paddingLeft: '30px', background: 'red', color: "yellow"}}>
                        Need face before classifying.
                    </div>
                    ) : (
                    <div style={{ paddingLeft: '30px', background: 'green', color: "yellow"}}>
                        Face found.
                    </div>
                    )}
                </div>
            </div>
            )}
            {!resultVisible && (
                <div className="how-container">
                    <h1>What to do:</h1>
                    <p>It's pretty simple! Just look into the camera and watch AI do it's magic. Don't worry, we don't store your photo in any format, it is just used
                    by us to get you your results. Please read our <a href="/privacy">Privacy Policy</a> for more details.
                    </p>
                    {[
                    "Tip: Make sure to take off any glasses or hats before you take a picture!", 
                    "Tip: Make sure lighting is soft, no hard shadows on your face!", 
                    "Tip: Make sure to look up, and position your face in the center of the camera!", 
                    "Tip: Wait for the Face Found Notifer to turn green before you click on the camera button!", 
                    "Tip: Don't smile! It will make it harder for the AI to give you your results!",
                    "Tip: If it says 'no faces were detected.' Don't worry! Give it another shot!"
                    ].map((text, index) => (
                    <p className="tips" key={index} style={{opacity: index == currentTip ? 1 : 0}}>{text}</p>
                    ))}
                </div>
            )}
            <div className={`result ${resultVisible ? 'active' : ''}`}>
                <div className="background-container">
                    <img className='background' src={resultsBackground} alt=""/>
                </div>
                <div className="arrow-container" onMouseEnter={handleArrowHover} onMouseLeave={handleArrowLeave}>
                    <FontAwesomeIcon icon={isArrowHovered ? faArrowLeft : faArrowRight} color='black'/>
                </div>
                <div className="pred">
                    <h3>Results:</h3>
                    <p style={{fontSize: '25px'}}>Face Shape: {prediction.face_prediction}</p>
                    <p style={{fontSize: '25px'}}>Hair Type: {prediction.hair_prediction}</p>
                </div>
                <form className="recommendationsForm" onSubmit={handleRecommendationsClick}>
                    <p style={{fontSize: '25px'}}>We're almost there! Click to go to your handpicked haircut recommendations.</p>
                    <button className="submitForRecommendations" type="submit" style={{cursor: 'pointer'}}>Recommendations</button>
                </form>
                <div className="photoContainer" style={slideInStyles}>
                    <canvas className="photoRes" ref={photoRef}></canvas>
                    <canvas className="faceShapeRes" ref={shapePhotoRef}></canvas>
                    <canvas className="hairTypeRes" ref={hairTypeRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default Classification;