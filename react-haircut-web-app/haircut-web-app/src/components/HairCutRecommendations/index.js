import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './index.scss';
import RecommendationTab from '../RecommendationTab';
import ClassifierAPI from "../ClassifierAPI";
import InstaWSAPI from "../InstaWSAPI";

const HairCutRecommendations = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const predictions = location.state.prediction;

    const [allImages, setAllImages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recommendationsHashtag, setRecommendationsHashtag] = useState(null);
    
    useEffect(() => {
        if (predictions.face_prediction == '' || predictions.hair_prediction == '') {
            navigate("/");
        }
    }, [predictions, navigate]);

    useEffect(() => {
        const getRecommendationsFromAPI = async () => {
            try {
                const response = await ClassifierAPI.GetRecommendations(predictions);
                setRecommendationsHashtag(response.recommendations);
            } catch (error) {
                console.log('error', error);
            }
        };
    
        if (!(predictions.face_prediction === '' || predictions.hair_prediction === '')) {
          getRecommendationsFromAPI();
        }
    }, [predictions]);

    useEffect(() => {
        const getImagesFromAPI = async (tags) => {
            try {
                const response = await InstaWSAPI.GetImages(tags);
                setAllImages(response.imgs);
                console.log("CLEAR");
            } catch (error) {
                console.log('error', error);
            }
        };

        getImagesFromAPI(recommendationsHashtag);
    }, [recommendationsHashtag]);

    useEffect(() => {
        if (allImages) {setLoading(false);}
        
    }, [allImages])

    return (
        <div className="cont suggestions">
            <h2>Image Grid</h2>
            {loading && <div className="loading-spinner"></div>}
            {recommendationsHashtag && allImages && (
                <div className="recommendation-tabs">
                {recommendationsHashtag.map((recHashtag, index) => {
                    const startIndex = index * 9;
                    const endIndex = startIndex + 9;
                    const imagesSubset = allImages.slice(startIndex, endIndex);

                    return (
                        <RecommendationTab key={index} hashtag={recHashtag} images={imagesSubset} />
                    );
                })}
                </div>
            )}
        </div>
    )
}

export default HairCutRecommendations;