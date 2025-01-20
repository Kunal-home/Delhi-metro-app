import React from "react";
import Shownearestmetro from "../component/Shownearestmetro";
import { useGeolocated } from "react-geolocated";

const Getlocation = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: true,
            },
            userDecisionTimeout: 10000,
        });

    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        <Shownearestmetro latitude={coords.latitude} longitude={coords.longitude}></Shownearestmetro>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};

export default Getlocation;