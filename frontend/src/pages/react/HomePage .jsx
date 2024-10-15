/* eslint-disable no-unused-vars */
import React, { useState,useEffect  } from "react";
import "./../style/HomePage .css";
import { FaCloudRain } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import { IoIosCloudyNight } from "react-icons/io";
import { BsFillCloudFog2Fill } from "react-icons/bs";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isGreen, setIsGreen] = useState(false);
  const [time, setTime] = useState(new Date()); // State to hold current time
  const [location, setLocation] = useState("loading");
  const [weather, setWeather] = useState({
    temperature: 0,
    chance_of_rain: 0,
    Rain_prob:'loading',
  });

  const handleButtonClick = () => {
    setIsContentVisible(!isContentVisible);
    setIsGreen(!isGreen);
  };
 
  const apiKey = "4ac19be725954e2ca4bebbd099e34f09"; 
  const weatherApiKey = "422e1d8e08dad104d47a623408c8f5a1";
  

  // Function to get the village name from OpenCage API
  const getLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Reverse Geocoding API Response: ", data);

      if (data.results.length > 0) {
        const components = data.results[0].components;
        const village = components.village || components.suburb || components.locality || "Village not found";
        setLocation(village);
      } else {
        setLocation("Village not found");
      }
    } catch (error) {
      console.error("Error fetching location name: ", error);
      setLocation("Unable to retrieve village name");
    }
  };

  // Fallback to IP-based location if geolocation fails
  const getIpLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log("IP-based location: ", data);
      if (data.city && data.country_name) {
        setLocation(`${data.city}, ${data.country_name}`);
      } else {
        setLocation("Unable to determine location based on IP.");
      }
    } catch (error) {
      console.error("Error fetching IP-based location: ", error);
      setLocation("Unable to retrieve location");
    }
  };

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Weather API Response: ", data);
      
      // Set weather data
      setWeather({
        temperature: Math.round(data.main.temp),
        chance_of_rain: data.clouds.all, // Update this logic as needed
        Rain_prob : data.visibility,
        
      });
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Lat: ${latitude}, Lon: ${longitude}`);
          getLocationName(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error: ", error);
          getIpLocation();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      getIpLocation();
    }
  }, []);

  // Fetch weather data based on location or default city
  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    } 
  }, [location]);

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
                                <h6>chance of rain {weather.chance_of_rain}%</h6>
                              </div>
                              <div className="HomePage-left-top-side-content-weather2-box container-flex">
                                <div className="row">
                                  <div className="HomePage-left-top-side-content-temperature-box container-flex">
                                  <h6>{weather.temperature}°C</h6>
                                  </div>
                                  <div className="HomePage-left-top-side-content-rain-box container-flex">
                                    <div className="row">
                                      <div className="HomePage-left-top-side-content-rain-icon-box container-flex">
                                        <h1><FaCloudRain /></h1>
                                      </div>
                                      <div className="HomePage-left-top-side-content-rain-icon-label-box container-flex">
                                        <h6>{weather.Rain_prob}</h6>
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
                            <h4>8 km/h</h4>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-rainfall-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-rainfall-icon-box container-flex">
                            <h1><IoIosCloudyNight /></h1>
                          </div>
                          <div className="HomePage-left-middle-rainfall-icon-label-box container-flex">
                            <h1>Cloudy</h1>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-fog-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-fog-icon-box container-flex">
                            <h1><BsFillCloudFog2Fill /></h1>
                          </div>
                          <div className="HomePage-left-middle-fog-icon-label-box container-flex">
                            <h1>Low Fog</h1>
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
          {/* left side container box end */}

          {/* middle side container box start */}
          <div className="HomePage-middle-main-box col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div className="HomePage-middle-main-content-box container-flex">
                  <div className="row">
                    <div className="HomePage-middle-main-top-content-box container-flex"></div>
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
                            <div className="HomePage-bottom-top-side-content-location-box container-flex"><h6>Jaffna</h6></div>
                            <div className="HomePage-bottom-top-side-content-weather-box container-flex"><h6>chance of rain 88%</h6></div>
                            <div className="HomePage-bottom-top-side-content-weather2-box container-flex">
                              <div className="row">
                                <div className="HomePage-bottom-top-side-content-temperature-box container-flex"><h6>30 C</h6></div>
                                <div className="HomePage-bottom-top-side-content-rain-box container-flex">
                                  <div className="row">
                                    <div className="HomePage-bottom-top-side-content-rain-icon-box container-flex">
                                      <h1><FaCloudRain /></h1></div>
                                    <div className="HomePage-bottom-top-side-content-rain-icon-label-box container-flex">
                                      <h6>Heavy rain</h6></div>
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
                            <h4>8 km/h</h4>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-rainfall-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-rainfall-icon-box container-flex">
                            <h1><IoIosCloudyNight /></h1>
                          </div>
                          <div className="HomePage-left-middle-rainfall-icon-label-box container-flex">
                            <h1>Cloudy</h1>
                          </div>
                        </div>
                      </div>
                      <div className="HomePage-left-middle-fog-box container-flex">
                        <div className="row">
                          <div className="HomePage-left-middle-fog-icon-box container-flex">
                            <h1><BsFillCloudFog2Fill /></h1>
                          </div>
                          <div className="HomePage-left-middle-fog-icon-label-box container-flex">
                            <h1>Low Fog</h1>
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
