import React from "react";
import Place from "./Place";
import { useState, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import Select from "react-select"

export default function Match() {
  const { token, id, connectionId } = useAuth();
  const [locationCheck, setLocationCheck] = useState(false);
  const [searchCheck, setSearchCheck] = useState(false);
  const [latitude, setLatitude] = useState(37.773972);
  const [longitude, setLongitude] = useState(-122.431297);
  const [places, setPlaces] = useState([]);
  const [urls, setUrls] = useState([]);
  const [increment, setIncrement] = useState(0);
  const [option, setOption] = useState('restaurant')
  const apiKey = process.env.REACT_APP_API_KEY;
  let locationInput = useRef();
  let radiusInput = useRef();

  const [libraries] = useState(["places"]);

  const mapRef = useRef();

  const mapContainerStyle = {
    height: "0vh",
    width: "0vw"
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries
  });

  const onMapLoad = React.useCallback(map => {
    mapRef.current = map;
  }, []);

  const options = [
    {
      value: 'restaurant',
      label: "Restaurants"
    },
    {
      value: 'tourist_attraction',
      label: "Attractions"
    },
    {
      value: 'night_club',
      label: "Night Clubs"
    },
    {
      value: 'museum',
      label: 'Museums'
    }
  ];

  async function fetchPlaces(){
     
    let temp = [];
    let photos = [];
    let radius = radiusInput.current.value;
    let r = radius * 1000;
    let lat = parseFloat(latitude);
    let lng = parseFloat(longitude)

    let request = {
      location: { lat, lng },
      radius: r,
      type: [option]
    }
   
    let service = new window.google.maps.places.PlacesService(mapRef.current);
    service.nearbySearch(request, callback);
    function callback(results, status){
      if (status === window.google.maps.places.PlacesServiceStatus.OK){
        for (let i = 0; i < results.length; i++){
          temp.push(results[i]);
          if(results[i].hasOwnProperty("photos")){
            let u = results[i].photos[0].getUrl({maxWidth:200});
            photos.push(u);
          }
        }
        setPlaces(temp);
        setUrls(photos);
      }
    }

    setLocationCheck(false);
    setSearchCheck(true);
  }

  function currentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        setLocationCheck(true);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  async function like(){
    let user = id;
    let connection = connectionId;
    let name = places[increment].name;
    let url = urls[increment];
    let rating = places[increment].rating;
    let price = places[increment].price_level;
    let reference = places[increment].reference;

    const res = await fetch('http://localhost:5000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ user, connection, name, url, rating, price,reference }),
    });
    if (res.ok){
      console.log('Like registered successfully');
    }

    let n = increment;
    n = n +1;
    setIncrement(n);
  }

  function dislike(){
    let n = increment;
    n = n +1;
    setIncrement(n);
  }

  if(locationCheck){
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
      />
      <p>Radius: <input type="text" ref={radiusInput} /></p>
      <Select options={options} onChange={(values) => setOption(values.value)} />
      <button onClick={fetchPlaces}><p>Search</p></button>
      </main>
    );
  }
  else if(searchCheck){
    return(
      <div className="container">
        <div className="center">
          <Place loc = {places[increment]} url = {urls[increment]}/>
          <button onClick={like}><p>Like</p></button>
          <button onClick={dislike}><p>Dislike</p></button>
        </div>
      </div>
    );
  }
  else{
    return (
      <div>
        <button onClick={currentLocation}><p>Use Current Location</p></button>
      </div>
    );

  }

}