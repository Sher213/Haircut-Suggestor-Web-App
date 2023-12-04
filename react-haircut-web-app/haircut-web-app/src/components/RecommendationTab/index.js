import React, { useEffect, useState } from 'react';
import InstaWSAPI from '../InstaWSAPI';

const RecommendationTab = ({ hashtag }) => {
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getImagesFromAPI = async (tag) => {
            try {
                const response = await InstaWSAPI.GetImages(tag);
                setImages(response.imgs);
                setLoading(false);
                console.log("CLEAR");
            } catch (error) {
                console.log('error', error);
                setLoading(false);
            }
        };
        getImagesFromAPI(hashtag);
    }, []);

    useEffect(() => {
        console.log(images);
    }, [images])

    return (
        <div className="recommendation-tab">
            <h2>{`#${hashtag}`}</h2>
            {loading && <div className="loading-spinner"></div>}
            {images && (
                <div className="image-grid">
                {images.map((src, index) => (
                    <a key={index} target="_blank" href={`https://www.instagram.com/explore/tags/${hashtag}/top/`}>
                        <img className='insta-img' key={index} src={src} alt={`Image ${index + 1}`} />
                    </a>
                ))}
                </div>
            )}
        </div>
    );
};

export default RecommendationTab;