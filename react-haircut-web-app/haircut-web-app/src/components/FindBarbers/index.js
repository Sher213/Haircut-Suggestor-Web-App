import React, { useEffect, useState } from "react";

const FindBarbers = () => {
    const [userLocation, setUserLocation] = useState(null);
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    function attachInfoWindow(marker, place) {
        const infowindow = new window.google.maps.InfoWindow({
            content: `<div><strong>${place.name}</strong><br>${place.types.join(', ')}<br>${place.business_status}</div>`,
        });
        marker.addListener('click', () => {
            infowindow.open(marker.get('map'), marker);
        });
    }

    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    },
                    (error) => {
                        console.error("Error getting user location:", error.message);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        };
        try{
            getUserLocation();
        }
        catch (error) {
            console.log('error', error)
        }
    }, []);

    useEffect(() => {
        try {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`;
            script.async = true;
            script.crossOrigin = "anonymous";
            document.body.appendChild(script);

            function initMap() {
                const map = new window.google.maps.Map(document.getElementById("map"), {
                    center: userLocation || { lat: 0, lng: 0 },
                    zoom: 12,
                });

                const request1 = {
                    location: userLocation,
                    radius: '5000',
                    query: 'Barber Shop',
                    fields: ['name']
                }

                const request2 = {
                    location: userLocation,
                    radius: '5000',
                    query: 'Salon',
                    fields: ['name']
                }

                const service = new window.google.maps.places.PlacesService(map);
                
                service.nearbySearch(request1, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        console.log('Nearby Barbers: ', results);

                        results.forEach((place) => {
                            const marker = new window.google.maps.Marker({
                                map: map,
                                position: place.geometry.location,
                                title: place.name,
                            });
                            attachInfoWindow(marker, place);
                        });
                    }
                    else {
                        console.error('Error fetching nearby Barbers:', status);
                    }
                });

                service.nearbySearch(request2, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        console.log('Nearby Salons: ', results);

                        results.forEach((place) => {
                            const marker = new window.google.maps.Marker({
                                map: map,
                                position: place.geometry.location,
                                title: place.name,
                            });
                            attachInfoWindow(marker, place);
                        });
                        
                    }
                    else {
                        console.error('Error fetching nearby Salons:', status);
                    }
                });

                if (userLocation) {
                    new window.google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Your Location",
                    });
                }
            };

            if (googleMapsApiKey && userLocation) { window.initMap = initMap; }
            
            return () => {
                document.body.removeChild(script);
            };
        }
        catch (error) {
            console.log('error', error);
        }
    }, [googleMapsApiKey, userLocation]);

    return (
        <div>
            <h3>Find Barbers Near You</h3>
            <div id="map" style={{ height: "600px", width: "100%" }}></div>
        </div>
    );
}

export default FindBarbers