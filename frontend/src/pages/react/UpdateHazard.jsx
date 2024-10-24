/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';
import { MdDateRange } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import { GiHazardSign } from "react-icons/gi";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import Modal from 'react-bootstrap/Modal';
import "./../style/UpdateHazard.css";
import axios from 'axios';

function UpdateHazard() {
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const [locationTypes, setLocationTypes] = useState([]);
  const [selectedLocationType, setSelectedLocationType] = useState('');
  const [locationNames, setLocationNames] = useState([]);
  const [selectedLocationName, setSelectedLocationName] = useState('');
  // const [locationHazards, setLocationHazards] = useState([]);
  const [selectedHazard, setSelectedHazard] = useState('');
 
  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        if (selectedLocationType) {
          const response = await axios.get('http://localhost:8000/location/getAll');
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
  
  // Fetch location names based on selected location type
useEffect(() => {
  const fetchLocationNames = async () => {
    try {
      if (selectedLocationType) {
        const response = await axios.get('http://localhost:8000/location/getAll'); // Fetch all locations

        // Filter locations based on the selected location type
        const filteredNames = response.data
          .filter(location => location.locationType === selectedLocationType)
          .map(location => location.locationName);

        // Update the state with filtered location names
        setLocationNames(filteredNames);
      }
    } catch (error) {
      console.error('Error fetching location names:', error);
    }
  };
  
  fetchLocationNames();
}, [selectedLocationType]); // Re-fetch when selectedLocationType changes



  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      hazardType: selectedHazard,
    }));
  }, [selectedHazard]);


  // Handle selection of location type
  const handleLocationTypeSelect = (type) => {
    setSelectedLocationType(type);
    setSelectedLocationName(''); // Reset selected location name when location type changes
    setLocationNames([]); // Clear previous location names
    // setLocationHazards([]); // Clear previous location hazards
  };

  // Handle selection of location name
  const handleLocationNameSelect = (name) => {
    setSelectedLocationName(name);
    setFormData({ ...formData, locationName: name });
  };


  // Fetch hazards for selected location on search button click
  // const handleSearch = async () => {
  //   try {
  //     if (selectedLocationName) {
  //       const response = await axios.get(`http://localhost:4000/api/hazard?locationName=${selectedLocationName}`);
  //       setLocationHazards(response.data); // Assuming the API returns an array of hazards
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location hazards:', error);
  //   }
  // };

  // Function to handle selection of hazard type
  const handleHazardSelect = (hazardType) => {
    setSelectedHazard(hazardType); // Update selectedHazard state
  };

  // reporting hazard function 
  const [formData, setFormData] = useState({
    time: '',
    hazardType: '',
    locationName: '',
    description: '',
    locomotivePilotID: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation Check if all fields are empty
    if (
      formData.locationName.trim() === "" &&
      formData.locomotivePilotID.trim() === "" &&
      formData.hazardType.trim() === "" &&
      formData.description.trim() === "" &&
      formData.time.trim() === "" &&
      selectedLocationType.trim() === ""
    ) {
      setError("All fields are empty. Please fill in the all fields.");
      setShowErrorModal(true);
      return;
    }

    // Individual field validations
    if (selectedLocationType.trim() === "") {
      setError("Location Route Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.locationName.trim() === "") {
      setError("Location Name Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.time.trim() === "") {
      setError("Date & Time Field Is Empty.");
      setShowErrorModal(true);
      return;
    } else if (formData.hazardType.trim() === "") {
      setError("Hazard Type Field Is Empty.");
      setShowErrorModal(true);
      return;
      
    } else if (formData.locomotivePilotID.trim() === "") {
      setError("Locomotive Pilot ID Field Is Empty.");
      setShowErrorModal(true);
      return;
    }


    try {
      const response = await axios.post('http://localhost:4000/api/locomotivePilotHazard', formData);
      console.log(response.data); // Handle success response
      setError(''); // Clear any previous errors
      setSuccess(true); // Show success message
      setFormData({
        time: '',
        hazardType: '',
        locationName: '',
        description: '',
        locomotivePilotID: ''
      }); // Clear the form inputs

    } catch (error) {
      console.error('Hazard Repoting failed:', error); // Log the error
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set error message from server response
      } else {
        setError('Hazard Repoting failed. Please try again.'); // Set a generic error message
      }
      setShowErrorModal(true); // Show error modal

    }
  };


  const handleCloseErrorModal = () => setShowErrorModal(false);
  return (
    <>
      {/* ..........this is the main division of screen.......... */}
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* ..........this is the left side box start.......... */}
          <div className="update-hazard-header-box container-flex ">
            <div className="update-hazard-title">Report Hazard</div>
          </div>
          <div className="update-hazard-main-left col-sm-12 col-md-9 col-lg-9 col-xl-9">



            <div>

              <Form onSubmit={handleSubmit}>
                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel controlId="floatingTextarea2" label="Date & Time ">
                    <Form.Control
                      placeholder="Leave a comment here"
                      style={{ height: '5px' }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"
                      value={selectedDate ? selectedDate.format('YYYY-MM-DD HH:mm') : ''}
                      // readOnly
                    />
                  </FloatingLabel>
                  <Dropdown show={showCalendar} onToggle={toggleCalendar} align="end">
                    <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
                      <MdDateRange />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-0 border-0">
                      <Datetime
                        onChange={(date) => {
                          setSelectedDate(date);
                          setShowCalendar(false);
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            time: date.format('YYYY-MM-DD HH:mm'),
                          }));
                        }}
                        input={false}
                        open={true}
                        value={formData.time}
                      />
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>

                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel controlId="floatingTextarea2" label="Location Route">
                    <Form.Control
                      placeholder="Leave a comment here"
                      style={{ height: '5px' }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"
                      value={selectedLocationType}
                      // readOnly
                    />
                  </FloatingLabel>
                  <Dropdown align="end">
                    <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
                      <FaRoute />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="update-hazard-scrollable-dropdown">
                      {locationTypes.map((type, index) => (
                        <Dropdown.Item key={index} onClick={() => handleLocationTypeSelect(type)}>{type}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>


                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel controlId="floatingTextarea2" label="Location">
                    <Form.Control
                      placeholder="Leave a comment here"
                      style={{ height: '5px' }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"
                      value={selectedLocationName || formData.locationName}

                      onChange={handleChange}
                    />
                  </FloatingLabel>
                  <Dropdown align="end">
                    <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
                      <MdAddLocationAlt />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="update-hazard-scrollable-dropdown">
                      {locationNames.map((name, index) => (
                        <Dropdown.Item key={index} onClick={() => handleLocationNameSelect(name)}>{name}</Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>

                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel controlId="floatingTextarea2" label="Hazard type">
                    <Form.Control
                      placeholder="Select Hazard type"
                      style={{ height: '5px' }}
                      aria-label="Text input with dropdown button"
                      id="update-hazard-input"

                      value={selectedHazard || formData.hazardType}

                      onChange={handleChange}
                    />
                  </FloatingLabel>
                  <Dropdown align="end">
                    <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-2" className="custom-dropdown-toggle">
                      <GiHazardSign />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleHazardSelect('Elephant')}>Elephant</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleHazardSelect('Bull')}>Bull</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleHazardSelect('Landslide')}>Landslide</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </InputGroup>



                <InputGroup className="update-hazard-input-dropdown-box">
                  <FloatingLabel controlId="floatingTextarea2" label="Description">
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      id="update-hazard-input"
                      style={{ height: '100px' }}
                      value={formData.description}
                      onChange={handleChange}
                      name="description"
                    />
                  </FloatingLabel>
                </InputGroup>


              </Form>





            </div>

          </div>
          {/* ..........left side box ended.......... */}

          <div className="update-hazard-main-left col-sm-12 col-md-3 col-lg-3 col-xl-3">

            <div className="update-hazard-button-box">
              <Form onSubmit={handleSubmit}>


                <Form.Floating className="mb-3">
                  <Form.Control
                    id="floatinglocomotivePilotID"
                    type="locomotivePilotID"
                    name="locomotivePilotID"
                    placeholder="locomotivePilotID"
                    value={formData.locomotivePilotID}
                    onChange={handleChange}
                    className="hazard-RegisterPage-input-text-box"
                  />
                  <label htmlFor="lpid">Locomotive Pilot Id</label>
                </Form.Floating>

                <Button type="submit" variant="outline-dark" className='update-hazard-button' >Submit</Button>{' '}
                <Button variant="outline-dark" className='update-hazard-button' onClick={() => navigate('/homepage')}>Back</Button>{' '}

              </Form>


            </div>


          </div>

          {success && (
            <Modal show={success} onHide={() => setSuccess(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>
              <Modal.Body>Hazard Reporting successfully!</Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={() => setSuccess(false)}>Close</Button>
              </Modal.Footer>
            </Modal>
          )}

          {error && (
            <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
              <Modal.Header closeButton className="modal-header">
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-body">{error}</Modal.Body>
              <Modal.Footer className="modal-footer">
                <Button
                  variant="danger"
                  onClick={handleCloseErrorModal}
                  className="modal-close-btn"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}

        </div>
      </div>
    </>
  );
}

export default UpdateHazard;
