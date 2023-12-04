import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import './index.scss';
import RecommendationTab from '../RecommendationTab';
import ClassifierAPI from "../ClassifierAPI";

const HairCutRecommendations = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const predictions = location.state.prediction;
    
    useEffect(() => {
        if (predictions.face_prediction == '' || predictions.hair_prediction == '') {
            navigate("/");
        }
    }, [predictions, navigate]);

    const [recommendations, setRecommendations] = useState(null);


    useEffect(() => {
        const getRecommendationsFromAPI = async () => {
            try {
                const response = await ClassifierAPI.GetRecommendations(predictions);
                setRecommendations(response.recommendations);
            } catch (error) {
                console.log('error', error);
            }
        };
    
        if (!(predictions.face_prediction === '' || predictions.hair_prediction === '')) {
          getRecommendationsFromAPI();
        }
    }, [predictions]);

    return (
        <div className="cont suggestions">
            <h2>Image Grid</h2>
            {recommendations && (
                <div className="recommendation-tabs">
                    {recommendations.map((recHashtag, index) => (
                    <RecommendationTab key={index} hashtag={recHashtag} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default HairCutRecommendations;