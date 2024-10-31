/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./../style/SelectRoute .css";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { MdAddLocationAlt } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from 'axios';

function SelectRoute() {
  const [locationTypes, setLocationTypes] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const [locationNames, setLocationNames] = useState([]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [routeImageUrl, setRouteImageUrl] = useState(''); // State for the route image URL

  // Fetch location types on component mount
  useEffect(() => {
    const fetchLocationTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/location/getAll');
        const uniqueTypes = [...new Set(response.data.map(location => location.locationType))];
        setLocationTypes(uniqueTypes);
      } catch (error) {
        console.error('Error fetching location types:', error);
      }
    };
    fetchLocationTypes();
  }, []);

  // Fetch location names based on selected location type
  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        if (selectedLocationType) {
          const response = await axios.get(`http://localhost:8000/location/getAll?locationType=${selectedLocationType}`);
          const filteredNames = response.data
            .filter(location => location.locationType === selectedLocationType)
            .map(location => location.locationName);
          setLocationNames(filteredNames);
        }
      } catch (error) {
        console.error('Error fetching location names:', error);
      }
    };
    fetchLocationNames();
  }, [selectedLocationType]);

  // Handle selection of location type
  const handleLocationTypeSelect = (type) => {
    setSelectedLocationType(type);
    setLocationNames([]);
    setStartLocation('');
    setEndLocation('');
    setRouteImageUrl(''); // Clear route image when location type changes
  };

  // Handle selection of start location
  const handleStartLocationSelect = (name) => {
    setStartLocation(name);
  };

  // Handle selection of end location
  const handleEndLocationSelect = (name) => {
    setEndLocation(name);
  };

 // Handle click on Start button to display a specific route map based on route type
const handleStart = () => {
  if (startLocation && endLocation) {
    let generatedImageUrl = "";

    // Check for specific route types to determine the correct image URL
    if (selectedLocationType === "Northern") {
      generatedImageUrl = "/map.png"; // Ensure this image is in the public folder
    } else if (selectedLocationType === "Mannar") {
      generatedImageUrl = "/mannar_route_map.png"; // Ensure this image is in the public folder
    } else {
      generatedImageUrl = "/default_route_map.png"; // A fallback image, if desired
    }
    setRouteImageUrl(generatedImageUrl);

    // Redirect to the homepage after 10 seconds
    setTimeout(() => {
      window.location.href = "/homepage"; // Redirect to homepage
    }, 5000); // 10000 milliseconds = 10 seconds
  } else {
    console.log('Please select both start and end locations.');
  }
};


  // Handle click on Back button
  const handleBack = () => {
    console.log('Back button clicked.');
  };

  // Function to get the first and last updated locations
  const getFirstAndLastLocations = (locations) => {
    if (locations.length > 1) {
      return [locations[0], locations[locations.length - 1]];
    } else {
      return locations;
    }
  };

  return (
    <>
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* Left side box */}
          <div className="select-route-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="select-route-header-box container-flex">
              <div className="select-route-title">Select Route</div>
            </div>

            {/* Dropdown for location types */}
            <InputGroup className="select-route-input-dropdown-box">
              <FloatingLabel controlId="floatingInputLocationName" label="Location Route" className="select-route-floating-label">
                <Form.Control
                  aria-label="Text input with dropdown button"
                  id="select-route-input"
                  value={selectedLocationType}
                  readOnly
                />
              </FloatingLabel>
              <DropdownButton
                variant="outline-secondary"
                title={<FaRoute />}
                id="select-route-input-group-dropdown-2"
                align="end"
                className="select-route-dropdown-box-button"
              >
                <div className="select-route-scrollable-dropdown-menu">
                  {locationTypes.map((type, index) => (
                    <Dropdown.Item key={index} onClick={() => handleLocationTypeSelect(type)}>{type}</Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
            </InputGroup>

            {/* Dropdown for start location */}
            <InputGroup className="select-route-input-dropdown-box">
              <FloatingLabel controlId="floatingInputLocationName" label="Start Location " className="select-route-floating-label">
                <Form.Control
                  aria-label="Text input with dropdown button"
                  id="select-route-input"
                  value={startLocation ? startLocation : (selectedLocationType ? "Select Start Location" : "Select Location Route First")}
                  readOnly
                />
              </FloatingLabel>
              <DropdownButton
                variant="outline-secondary"
                title={<MdAddLocationAlt />}
                id="select-route-input-group-dropdown-2"
                align="end"
                className="select-route-dropdown-box-button"
              >
                <div className="select-route-scrollable-dropdown-menu">
                  {getFirstAndLastLocations(locationNames).map((name, index) => (
                    <Dropdown.Item key={index} onClick={() => handleStartLocationSelect(name)}>{name}</Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
            </InputGroup>

            {/* Dropdown for end location */}
            <InputGroup className="select-route-input-dropdown-box">
              <FloatingLabel controlId="floatingInputLocationName" label="End Location " className="select-route-floating-label">
                <Form.Control
                  aria-label="Text input with dropdown button"
                  id="select-route-input"
                  value={endLocation ? endLocation : (selectedLocationType ? "Select End Location" : "Select Location Route First")}
                  readOnly
                />
              </FloatingLabel>
              <DropdownButton
                variant="outline-secondary"
                title={<MdAddLocationAlt />}
                id="select-route-input-group-dropdown-2"
                align="end"
                className="select-route-dropdown-box-button"
              >
                <div className="select-route-scrollable-dropdown-menu">
                  {getFirstAndLastLocations(locationNames).map((name, index) => (
                    <Dropdown.Item key={index} onClick={() => handleEndLocationSelect(name)}>{name}</Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
            </InputGroup>

            <div className="select-route-start-button-box button-box container-flex">
              <Button className="select-route-start-button" variant="dark" onClick={handleStart}>Start</Button>{' '}
            </div>

            <div className="select-route-back-button-box button-box container-flex">
              <Button className="select-route-back-button" variant="dark" onClick={handleBack}>Back</Button>{' '}
            </div>
          </div>

          {/* Right side box */}
          <div className="main-right col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="right-map-box container-flex">
              {routeImageUrl ? (
                <img src={routeImageUrl} alt="Selected Route Map" className="route-image" />
              ) : (
                <p>Select a start and end location to view the route.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SelectRoute;
