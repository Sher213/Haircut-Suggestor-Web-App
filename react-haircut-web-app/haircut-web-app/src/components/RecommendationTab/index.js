import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

const RecommendationTab = ({ hashtag, images, hairstyleDesc }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (images) {setLoading(false);}
        
    }, [images])

    return (
        <div className="recommendation-tab">
            <h2>The {`#${hashtag}`}</h2>
            <h3>See more on &nbsp;
                <a target="_blank" href={`https://www.instagram.com/explore/tags/${hashtag}/top/`}>
                    <FontAwesomeIcon icon={faInstagram} color='blue'/></a>
            </h3>
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