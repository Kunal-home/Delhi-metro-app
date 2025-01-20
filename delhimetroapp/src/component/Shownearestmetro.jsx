import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import haversine from "../js/haversine";
import Style from "../css/button.module.css";


function ShownearestMetro({ latitude, longitude }) {
  const [stations, setStations] = useState([]);
  const [nearest, setNearest] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/station.txt");
        const data = await response.text();
        const parsedStations = data
          .trim()
          .split("\n")
          .map((line) => {
            const [name, lat, lon] = line.split(",");
            return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
          });
        setStations(parsedStations);
      } catch (error) {
        console.error("Error loading stations:", error);
      }
    };
    fetchStations();
  }, []);

  const findNearest = () => {
    if (!latitude || !longitude) {
      alert("Please provide location access or valid coordinates!");
      return;
    }

    let minDistance = Infinity;
    let nearestStation = null;

    stations.forEach((station) => {
      const distance = haversine(
        latitude,
        longitude,
        station.lat,
        station.lon
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = { ...station, distance };
      }
    });

    setNearest(nearestStation);

    if (nearestStation) {
      calculateRoute(latitude, longitude, nearestStation.lat, nearestStation.lon);
    }
  };

  const calculateRoute = (startLat, startLng, endLat, endLng) => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: endLat, lng: endLng },
        travelMode: google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  const openInGoogleMaps = () => {
    if (nearest) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${nearest.lat},${nearest.lon}&travelmode=walking`;
      window.open(mapsUrl, "_blank");
    }
  };
  const Apikey="AIzaSyAos_Obv5Z5C21Wuw4FX7pM7TNOYD3pVMo";

  const mapStyles = {
    height: "500px",
    width: "100%",
  };

  const defaultCenter = { lat: latitude || 28.6139, lng: longitude || 77.2090 };

  return (
    <div>
      
      <button  className={`${Style.buttons} btn btn-light`}onClick={findNearest} disabled={!stations.length}>
        Find Nearest Metro
      </button>

      {nearest && (
        <div>
          <h2>Nearest Metro Station</h2>
          <p>
            <strong>Name:</strong> {nearest.name}
          </p>
          <p>
            <strong>Distance:</strong> {nearest.distance.toFixed(2)} km
          </p>
          <button  className={`${Style.buttons} btn btn-light`}onClick={openInGoogleMaps}>
            Open in Google Maps
          </button>
        </div>
      )}

      <LoadScript googleMapsApiKey={Apikey}>
        <GoogleMap mapContainerStyle={mapStyles} zoom={14} center={defaultCenter}>
          {latitude && longitude && (
            <Marker position={{ lat: latitude, lng: longitude }} label="You">
              <InfoWindow position={{ lat: latitude, lng: longitude }}>
                <div>You are here!</div>
              </InfoWindow>
            </Marker>
          )}

          {nearest && (
            <Marker position={{ lat: nearest.lat, lng: nearest.lon }}>
              <InfoWindow position={{ lat: nearest.lat, lng: nearest.lon }}>
                <div>Nearest Station: {nearest.name}</div>
              </InfoWindow>
            </Marker>
          )}

          {directions && <DirectionsRenderer directions={directions} />}

          {stations.map((station, index) => (
            <Marker key={index} position={{ lat: station.lat, lng: station.lon }}>
              <InfoWindow position={{ lat: station.lat, lng: station.lon }}>
                <div>{station.name}</div>
              </InfoWindow>
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default ShownearestMetro;
