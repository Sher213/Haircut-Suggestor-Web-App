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
    const [recommendationHashtags, setRecommendationHashtags] = useState(null);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [hairStyleDescs, setHairStyleDescs] = useState('');
    
    useEffect(() => {
        if (predictions.face_prediction == '' || predictions.hair_prediction == '') {
            navigate("/");
        }
    }, [predictions, navigate]);

    useEffect(() => {
        const getRecommendationsFromAPI = async () => {
            try {
                const response = await ClassifierAPI.GetRecommendations(predictions);
                setRecommendationHashtags(response.recommendations);
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
                setImages(response.imgs);
            } catch (error) {
                console.log('error', error);
            }
        };

        getImagesFromAPI(recommendationHashtags);
    }, [recommendationHashtags]);

    useEffect(() => {
        const getHairStyleDesc = async () => {
            try {
                const response = await ClassifierAPI.GetHairStyleDescriptions(recommendationHashtags);
                setHairStyleDescs(response);
            }
            catch (error){
                console.log('error', error)
            }
        }

        getHairStyleDesc()
    }, [recommendationHashtags])

    useEffect(() => {
        console.log(hairStyleDescs);
    }, [hairStyleDescs])

    return (
        <div className="cont suggestions">
            <h2>Your haircut suggestions based on your face: {predictions.face_prediction} and hair: {predictions.hair_prediction}</h2>
            {recommendationHashtags && (
                <div className="recommendation-tabs">
                    <div className="tab-buttons">
                        {recommendationHashtags.map((recHashtag, index) => (
                            <button
                                key={index}
                                className={index === activeTabIndex ? 'active-tab' : ''}
                                onClick={() => setActiveTabIndex(index)}
                            >
                                {recHashtag}
                            </button>
                        ))}
                    </div>
                    {recommendationHashtags.map((recHashtag, index) => {
                        var imagesSubset = null;
                        if (images) {
                        const startIndex = index * 9;
                        const endIndex = startIndex + 9;
                        imagesSubset = images.slice(startIndex, endIndex);
                        } else {
                        imagesSubset = null;
                        }
    
                    return (
                        <div
                            key={index}
                            className={`tab-content ${index === activeTabIndex ? 'active-content' : 'inactive-content'}`}
                        >
                            {index === activeTabIndex && (
                            <RecommendationTab hashtag={recHashtag} images={imagesSubset} hairstyleDesc={hairStyleDescs} />
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