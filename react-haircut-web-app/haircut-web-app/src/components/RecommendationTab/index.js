import React, { useEffect } from 'react';

const RecommendationTab = ({ hashtag, images }) => {

    useEffect(() => {
        console.log(images);
    }, [images])

    return (
        <div className="recommendation-tab">
            <h2>{`#${hashtag}`}</h2>
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