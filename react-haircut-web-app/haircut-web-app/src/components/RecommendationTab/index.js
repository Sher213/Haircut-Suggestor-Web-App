import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import './index.scss'

const RecommendationTab = ({ predictions, hashtag, images, hairStyleDesc }) => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleFindBarbersClick = event => {
        event.preventDefault();
        navigate("/local-haircuts", {state: { predictions: predictions, hashtag: hashtag } });
    };

    useEffect(() => {
        if (images) {setLoading(false);}
    }, [images])

    return (
        <div className='recommendation-container'>
            <div className="recommendation-tab">
                <h1>The {`#${hashtag}`}</h1>
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
            <div className='lead-container'>
                <h2 className='description'>{hairStyleDesc}</h2>
                <h3 className='lead'>Liked something you saw? Let's book an appointment!</h3>
                <button className='lead-button' onClick={handleFindBarbersClick}>
                    Find a Local Salon or Barber:&nbsp;
                    <FontAwesomeIcon icon={faMap} color='teal'/>
                </button>
                
            </div>
        </div>
    );
};

export default RecommendationTab;