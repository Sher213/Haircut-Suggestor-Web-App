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

    const [images, setImages] = useState(null);
    const [haircutRecommendations, setHaircutRecommendations] = useState(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [haircutDescs, setHaircutDescs] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (predictions.face_prediction === '' || predictions.hair_prediction === '') {
            navigate("/");
        }
    }, [predictions, navigate]);

    useEffect(() => {
        const getHaircutRecommendationsFromAPI = async () => {
            try {
                const response = await ClassifierAPI.GetHaircutRecommendations(predictions);
                setHaircutRecommendations(response.recommendations);
            } catch (error) {
                console.log('error', error);
            }
        };
        if (!(predictions.face_prediction === '' || predictions.hair_prediction === '')) {
          getHaircutRecommendationsFromAPI();
        }
    }, [predictions]);

    useEffect(() => {
        const getImagesFromAPI = async () => {
            try {
                const response = await InstaWSAPI.GetImages(haircutRecommendations);
                setImages(response.imgs);
            } catch (error) {
                console.log('error', error);
            }
        };
        if (haircutRecommendations) { getImagesFromAPI(); }
    }, [haircutRecommendations]);

    useEffect(() => {
        const getHaircutDesc = async () => {
            try {
                const response = await ClassifierAPI.GetHaircutDescriptions(haircutRecommendations);
                setHaircutDescs(response);
            }
            catch (error){
                console.log('error', error)
            }
        }
        if (haircutRecommendations) { getHaircutDesc(); }
    }, [haircutRecommendations])

    useEffect(() => {
        if (haircutRecommendations) { setLoading(false); }
    }, [haircutRecommendations])

    return (
        <div className="cont recommendations">
            <h2>Your haircut suggestions based on your face: {predictions.face_prediction} and hair: {predictions.hair_prediction}</h2>
            {haircutRecommendations && (
                <div className="recommendation-tabs">
                    {loading && <div className="loading-spinner"></div>}
                    <div className="tab-buttons">
                        {haircutRecommendations.map((recommendedHashtag, index) => (
                            <button
                                key={index}
                                className={index === activeTabIndex ? 'active-tab' : ''}
                                onClick={() => setActiveTabIndex(index)}
                            >
                                {recommendedHashtag}
                            </button>
                        ))}
                    </div>
                    {haircutRecommendations.map((recommendedHashtag, index) => {
                        var imagesSubset = null;

                        if (images) {
                            const matchingDicts = images.filter(dict => dict.hasOwnProperty(recommendedHashtag));
                            if (matchingDicts.length > 0) {
                                imagesSubset = matchingDicts.map(dict => dict[recommendedHashtag]);
                            }
                        } 
                        else {
                            imagesSubset = null;
                        }
                        return (
                            <div
                                key={index}
                                className={`tab-content ${index === activeTabIndex ? 'active-content' : 'inactive-content'}`}
                            >
                                {index === activeTabIndex && haircutDescs && (
                                <RecommendationTab predictions={predictions}hashtag={recommendedHashtag} images={imagesSubset} hairStyleDesc={haircutDescs.descriptions[index]} />
                                )}
                            </div>
                        );
                })}
                </div>
            )}
        </div>
    );
}

export default HairCutRecommendations;