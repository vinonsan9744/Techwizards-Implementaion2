/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState,useEffect  } from "react";
import "./../style/HomePage .css";
import { FaCloudRain } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import { IoIosCloudyNight } from "react-icons/io";
import { BsFillCloudFog2Fill } from "react-icons/bs";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { FaRoute } from "react-icons/fa";
import { useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios';


const HomePage = (props)=> {
  const navigate = useNavigate();
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isGreen, setIsGreen] = useState(false);
  const [time, setTime] = useState(new Date()); // State to hold current time
  const [location, setLocation] = useState("loading");
  const valuelocation = useLocation();
  const [hazards, setHazards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextLocation, setNextLocation] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  console.log(valuelocation);
  const [weatherLocation1, setWeatherLocation1] = useState({});
  const [weatherLocation2, setWeatherLocation2] = useState({});

  // Helper function for visibility status
  const getVisibilityStatus = (visibilityKm) => {
    if (visibilityKm >= 10) {
      return "Good visibility";
    } else if (visibilityKm >= 5) {
      return "Average visibility";
    } else {
      return "Low visibility";
    }
  };

  // Weather state for both locations
  const [weather, setWeather] = useState({
    current: {
      temperature: 0,
      chance_of_rain: 0,
      rain_prob: 'loading',
      wind_speed: 0,
      rain_level: 'loading',
      visibility_status: 'N/A',
    },
    next: {
      temperature: 0,
      chance_of_rain: 0,
      rain_prob: 'loading',
      wind_speed: 0,
      rain_level: 'loading',
      visibility_status: 'N/A',
    }
  });

  const handleButtonClick = () => {
    setIsContentVisible(!isContentVisible);
    setIsGreen(!isGreen);
  };

  const weatherApiKey = "422e1d8e08dad104d47a623408c8f5a1";

  // Fetch weather data for both locations
  const fetchWeatherData = async (location, nextLocation) => {
    try {
      console.log("Fetching weather data...");
      const [response1, response2] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nextLocation}&appid=${weatherApiKey}&units=metric`)
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error(`Error: ${response1.status}, ${response2.status}`);
      }

      const data1 = await response1.json();
      const data2 = await response2.json();

      const visibilityInKm1 = (data1.visibility / 1000).toFixed(0);
      const visibilityInKm2 = (data2.visibility / 1000).toFixed(0);

      const weatherLocation1 = {
        temperature: Math.round(data1.main.temp),
        chance_of_rain: data1.clouds.all,
        rain_prob: data1.weather[0].main,
        wind_speed: Math.round(data1.wind.speed * 3.6).toFixed(0),
        rainlevel: data1.weather[0].description,
        weathervisibility: visibilityInKm1 || 'N/A',
        visibilityStatus: getVisibilityStatus(visibilityInKm1),
      };

      const weatherLocation2 = {
        temperature: Math.round(data2.main.temp),
        chance_of_rain: data2.clouds.all,
        rain_prob: data2.weather[0].main,
        wind_speed: Math.round(data2.wind.speed * 3.6).toFixed(0),
        rainlevel: data2.weather[0].description,
        weathervisibility: visibilityInKm2 || 'N/A',
        visibilityStatus: getVisibilityStatus(visibilityInKm2),
      };

      setWeatherLocation1(weatherLocation1);
      setWeatherLocation2(weatherLocation2);
      console.log("Weather data fetched:", weatherLocation1, weatherLocation2);

    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    const startLocation = valuelocation.state?.startLocation || "unknown location";
    setLocation(startLocation);
    console.log("Starting location set:", startLocation);

    fetchWeatherData(startLocation, nextLocation);
  }, [valuelocation.state, nextLocation]);

  
  // Format the time and date
  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const fetchHazards = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/hazard/locationName/${location}`);
        if (Array.isArray(response.data)) {
          setHazards(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setHazards([]);
        }
      } catch (error) {
        console.error("Error fetching hazards:", error);
        setError("Failed to load hazard data.");
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchHazards();
    }
  }, [location]);

  const fetchNextLocation = async (currentLocation) => {
    try {
      const response = await axios.get(`http://localhost:8000/location/nextLocation/${currentLocation}`);
      if (response.data && response.data.locationName) {
        setNextLocation(response.data.locationName);
        console.log("Next location fetched:", response.data.locationName);
      }
    } catch (error) {
      console.error("Error fetching next location:", error);
    }
  };

  useEffect(() => {
    if (location && location !== "loading") {
      fetchNextLocation(location);
    }
  }, [location]);
  
  return (
    <>
      <div className="container-flex vh-100">
        <div className="row vh-100">

          {/* left side container box start */}
            <div className="HomePage-left-main-box col-sm-12 col-md-4 col-lg-4 col-xl-4 container-flex">
                <div className="HomePage-left-box">
                  <div className="HomePage-left-top-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-top-side-button-box container-flex">
                        <button onClick={handleButtonClick}><h3><TbLayoutSidebarLeftExpandFilled /></h3></button>
                      </div>
                      <div
                        className={`HomePage-left-top-side-content-box container-flex ${isGreen ? "green-background" : ""}`}
                      >
                        {isGreen ? (
                          <div className="navigation-buttons container-flex">
                            
                            <button className="nav-button" onClick={() => navigate('/updatehazard')}>Report Hazard</button>
                            <button className="nav-button" onClick={() => navigate('/hazardlocation')}>view hazard location</button>
                            <button className="nav-button" onClick={() => navigate('/')}>Logout</button>
                          </div>
                        ) : (
                          isContentVisible && (
                            <div className="row">
                              <div className="HomePage-left-top-side-content-date-box container-flex">
                                <h6>{formattedDate}</h6>
                              </div>
                              <div className="HomePage-left-top-side-content-time-box container-flex">
                                <h6>{formattedTime}</h6>
                              </div>
                              <div className="HomePage-left-top-side-content-location-box container-flex">
                                <h6>{location}</h6>
                               
                              </div>
                              <div className="HomePage-left-top-side-content-weather-box container-flex">
                                <h6>chance of rain {weatherLocation1.chance_of_rain}%</h6>
                              </div>
                              <div className="HomePage-left-top-side-content-weather2-box container-flex">
                                <div className="row">
                                  <div className="HomePage-left-top-side-content-temperature-box container-flex">
                                  <h6>{weatherLocation1.temperature}°C</h6>
                                  </div>
                                  <div className="HomePage-left-top-side-content-rain-box container-flex">
                                    <div className="row">
                                      <div className="HomePage-left-top-side-content-rain-icon-box container-flex">
                                        <h1><FaCloudRain /></h1>
                                      </div>
                                      <div className="HomePage-left-top-side-content-rain-icon-label-box container-flex">
                                        <h6>{weatherLocation1.rain_prob}</h6>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="HomePage-left-middle-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-wind-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-wind-icon-box container-flex">
                            <h1><FaWind /></h1>
                          </div>
                          <div className="HomePage-left-middle-wind-icon-label-box container-flex">
                            <h4>{weatherLocation1.wind_speed} km/h</h4>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-rainfall-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-rainfall-icon-box container-flex">
                            <h1><IoIosCloudyNight /></h1>
                          </div>
                          <div className="HomePage-left-middle-rainfall-icon-label-box container-flex">
                            <h1>{weatherLocation1.rain_prob}</h1>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-fog-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-fog-icon-box container-flex">
                            <h1><BsFillCloudFog2Fill /></h1>
                          </div>
                          <div className="HomePage-left-middle-fog-icon-label-box container-flex">
                            <h1>{weatherLocation1.visibilityStatus}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="HomePage-left-bottom-box container-flex">
                    <div className="row">
                    <div className="HomePage-left-bottom-output1-box container-flex">
  <div className={hazards.length > 0 ? 'text-red' : ''}>
    {loading ? (
      <h2>Loading...</h2>  // Display while loading
    ) : error ? (
      <h2>{error}</h2>  // Display error if any
    ) : hazards.length > 0 ? (
      hazards.map((hazard, index) => (
        <div key={index} className="hazard">
          <h2>Caution: {hazard.HazardType} might be nearby. Stay alert.</h2>
        </div>
      ))
    ) : (
      <h2>No hazards available</h2>  // Show if hazards array is empty
    )}
  </div>
</div>

                      <div className="HomePage-left-bottom-output1-box container-flex"></div>
                    </div>
                  </div>
                </div>
            </div>
          {/* left side container box end */}

          {/* middle side container box start */}
          <div className="HomePage-middle-main-box col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="HomePage-middle-main-content-box container-flex">
                  <div className="row">
                    <div className="HomePage-middle-main-top-content-box container-flex">
                    <p> {valuelocation.state?.startLocation || 'not selected'} </p>
                    <FaRoute />
                    <p> {valuelocation.state?.endLocation || 'not selected'} </p>
                    </div>
                    <div className="HomePage-middle-main-middle-content-box container-flex"></div>
                    <div className="HomePage-middle-main-bottom-content-box container-flex"></div>
                  </div>
                </div>
          </div>
          {/* middle side container box end */}

          {/* right side container box start */}
          <div className="HomePage-bottom-main-box col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <div className="HomePage-bottom-box">
                  <div className="HomePage-bottom-top-box container-flex">
                  <div className="row">
                            
                            <div className="HomePage-bottom-top-side-content-next-location-box container-flex"><h6>Next Location</h6></div>
                            <div className="HomePage-bottom-top-side-content-location-box container-flex">
                              <h6>{nextLocation || "Loading next location..."}</h6>
                            </div>
                            <div className="HomePage-bottom-top-side-content-weather-box container-flex"><h6>chance of rain {weatherLocation2.chance_of_rain}%</h6></div>
                            <div className="HomePage-bottom-top-side-content-weather2-box container-flex">
                              <div className="row">
                                <div className="HomePage-bottom-top-side-content-temperature-box container-flex"><h6>{weatherLocation2.temperature}°C</h6></div>
                                <div className="HomePage-bottom-top-side-content-rain-box container-flex">
                                  <div className="row">
                                    <div className="HomePage-bottom-top-side-content-rain-icon-box container-flex">
                                      <h1><FaCloudRain /></h1></div>
                                    <div className="HomePage-bottom-top-side-content-rain-icon-label-box container-flex">
                                      <h6>{weatherLocation2.rain_prob}</h6></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                  </div>
                  <div className="HomePage-left-middle-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-middle-wind-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-wind-icon-box container-flex">
                            <h1><FaWind /></h1>
                          </div>
                          <div className="HomePage-left-middle-wind-icon-label-box container-flex">
                            <h4>{weatherLocation2.wind_speed} km/h</h4>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-rainfall-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-rainfall-icon-box container-flex">
                            <h1><IoIosCloudyNight /></h1>
                          </div>
                          <div className="HomePage-left-middle-rainfall-icon-label-box container-flex">
                            <h1>{weatherLocation2.rain_prob}</h1>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-fog-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-fog-icon-box container-flex">
                            <h1><BsFillCloudFog2Fill /></h1>
                          </div>
                          <div className="HomePage-left-middle-fog-icon-label-box container-flex">
                            <h1>{weatherLocation2.visibilityStatus}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="HomePage-left-bottom-box container-flex">
                    <div className="row">
                      <div className="HomePage-left-bottom-output1-box container-flex"></div>
                      <div className="HomePage-left-bottom-output1-box container-flex"></div>
                    </div>
                  </div>
                </div>
          </div>
          {/* right side container box end */}

        </div>
      </div>
    </>
  );
}

export default HomePage;
