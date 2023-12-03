import React, { useRef, useEffect, useState } from "react";
import './index.scss';
import InstaWSAPI from '../InstaWSAPI'

const HairCutRecommendations = () => {

    const [images, setImages] = useState();

    const getImagesFromAPI = (hashtag) => {
        InstaWSAPI.getImages(hashtag)
        .then(response => {
            setImages(response.imgs);
        })
        .catch(error => console.log('error', error));
    }

    useEffect(() => {
        getImagesFromAPI('fadehaircut');
    }, [])

    useEffect(() => {
        if (!images) {
            console.log('Images is undefined');
        } else {
            console.log(images);
        }
    }, [images])

    return (
        <div>
            <h2>Image Grid</h2>
            {images !== undefined && (
                <div className="image-grid">
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Image ${index + 1}`} />
                    ))}
                </div>
            )}
        </div>

    )
}

export default HairCutRecommendations;