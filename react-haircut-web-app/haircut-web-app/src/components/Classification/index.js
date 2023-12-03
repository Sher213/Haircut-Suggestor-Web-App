import React, { useRef, useEffect, useState } from "react";
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
import Camera from '../Camera';

const Classification = () => { 
    const modPos = -50;
    const modW = 100;
    const modH = 150;

    const defCamWidth = 500;
    const defCamHeight = 500;
    const hairImgSize = 500;

    const photoRef = useRef();
    const shapePhotoRef = useRef();
    const hairTypeRef = useRef();

    const [videoRefCurr, setVideoRefCurr] = useState(null);
    const [facePos, setFacePos] = useState('');
    const [photoTaken, setPhotoTaken] = useState(false);
    const [isClassified, setClassified] = useState(false);
    const [needFaceMessage, setNeedFaceMessage] = useState(false);

    const [prediction, setPrediction] = useState({
        face_prediction: '',
        hair_prediction: '',
    });

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

    const classify = () => {
        const width = defCamWidth;
        const height = defCamHeight;

        let video = videoRefCurr;
        let photoSend = document.createElement('canvas');

        photoSend.width = width;
        photoSend.height = height;

        let ctx = photoSend.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        
        const dataURL = photoSend.toDataURL();
        
        ClassifierAPI.ClassifyImage(dataURL)
        .then(response => {
            if ('NoFaceError' in response) {
                alert("No faces were detected. Please try again.")
            }
            else {
                setPrediction(response);
                setClassified(true);
                setPhotoTaken(true);
            }
        })
        .catch(error => console.log('error', error));
    }

    const drawResult = () => {
        const width = defCamWidth;
        const height = defCamHeight;

        let video = videoRefCurr;

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

        if (isClassified && !(facePos === '')) {
            let photoDraw = photoRef.current;

            photoDraw.width = width;
            photoDraw.height = height;
    
            let ctxPhoto = photoDraw.getContext('2d');
            ctxPhoto.drawImage(video, 0, 0, width, height);

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

            console.log(x, y, w, h)

            let shapePath = getFaceShape();
            let shapeImage = new Image();
            shapeImage.src = shapePath;
            shapeImage.onload = () => {
                ctx.drawImage(shapeImage, x+modPos, y+modPos, w+modW, h+modH);
            };
            drawHairType();
            setPhotoTaken(false);
        }
    }

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
        drawResult();
    }, [isClassified, photoTaken, prediction])

    useEffect(() => {
        if (facePos === "") {
            setNeedFaceMessage(true);
        } else {
            setNeedFaceMessage(false);
        }       
    }, [facePos])

    return (
        <div className= "main">
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
                    faceShape={getFaceShape}/>
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
                    <canvas className="photoRes" ref={photoRef}></canvas>
                    <canvas className="faceShapeRes" ref={shapePhotoRef}></canvas>
                    <canvas className="hairTypeRes" ref={hairTypeRef}></canvas>
                </div>
            </div>
            <form className="recommendations" action ="/recommendations">
                <button type="submit">Recommendations</button>
            </form>
        </div>
    );
};

export default Classification;