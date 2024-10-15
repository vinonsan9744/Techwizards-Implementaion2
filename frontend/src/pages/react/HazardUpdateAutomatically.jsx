// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../style/HazardUpdate.css';
import { RiMessage2Fill } from 'react-icons/ri';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaRoute } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";

function HazardUpdateAutomatically() {
    const [hazardCount, setHazardCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [inputLocation, setInputLocation] = useState('');
  const [inputHazard, setInputHazard] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [showDeclineConfirmModal, setShowDeclineConfirmModal] = useState(false);
  const [selectedHazardId, setSelectedHazardId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      axios.get('http://localhost:4000/api/locomotivePilotHazard')
      .then(response => {
        setHazardCount(response.data.length);
        setNotifications(response.data);
      })
    } catch (error) {
      console.error('Error fetching hazard data:', error);
    }
  }, []);

  const handleNotificationClick = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const markAsRead = async (hazardId) => {
    try {
      const hazardResponse = await axios.get(`http://localhost:4000/api/locomotivePilotHazard/hazardID/${hazardId}`);
      setSelectedNotification(hazardResponse.data);
      setSelectedHazardId(hazardId);
      setShowModal(false);
    } catch (error) {
      console.error('Error fetching hazard or pilot details:', error);
    }
  };

  const handleAcceptClick = async (type, value) => {
    if (type === 'hazard') {
      setInputHazard(value);
    } else if (type === 'location') {
      setInputLocation(value);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const monthIndex = date.getUTCMonth();
    const year = date.getUTCFullYear();
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
  
    const month = monthNames[monthIndex];
    
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    const time = `${formattedHours}:${formattedMinutes} ${period}`;
  
    return { day, month, year, time };
  };

 

  const handleConfirm = () => {
    setShowConfirmModal(false);
    // Proceed with the form submission
    submitData();
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const submitData = async () => {
    try {
      // Perform the POST request
      const postResponse = await axios.post('http://localhost:4000/api/hazard', {
        locationName: inputLocation,
        hazardType: inputHazard
      });
      console.log('POST response:', postResponse.data); // Log response data
  
      // Check if a hazard ID is selected for deletion
      if (selectedHazardId) {
        // Perform the DELETE request
        await axios.delete(`http://localhost:4000/api/locomotivePilotHazard/hazardID/${selectedHazardId}`);
        console.log('DELETE successful'); // Log success message
      }
  
      // Update state after successful operations
      setSuccessMessage('Hazard data saved successfully and hazard deleted if applicable!');
      setErrorMessage('');
      setInputLocation('');
      setInputHazard('');
  
      // Navigate to a different page if needed
      navigate('/adminhomepage');
  
    } catch (error) {
      console.error('Operation failed:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Set error message from server response
      } else {
        setErrorMessage('Failed to save hazard data or delete hazard. Please try again.'); // Set a generic error message
      }
      setSuccessMessage('');
      setShowErrorModal(true); // Show error modal
    }
  };
  



  const handleDeclineConfirm = async () => {
    setShowDeclineConfirmModal(false);
    try {
      await axios.delete(`http://localhost:4000/api/locomotivePilotHazard/hazardID/${selectedHazardId}`);
      setSuccessMessage('Hazard deleted successfully!');
      setNotifications(notifications.filter(notification => notification.hazardID !== selectedHazardId));
      setSelectedHazardId(null);
      navigate('/adminhomepage');
      
    } catch (error) {
      console.error('Error deleting hazard:', error);
      setErrorMessage('Failed to delete hazard. Please try again.');
    }
  };

  const handleDeclineCancel = () => setShowDeclineConfirmModal(false);
  

  const handleCloseErrorModal = () => setShowErrorModal(false);
  return (
    <>
        <h1>
        <div className="container-flex vh-100">
        <div className="row vh-100">
          <div className="ApproveHazard-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="ApproveHazard-header-box container-flex w-100 vh-30">
              <h1 className="ApproveHazard-title">Hazard Update</h1>
            </div>
            <div className="ApproveHazard-newhazard-box container-flex vh-30">
              <div className="row">
                <div className="ApproveHazard-newhazard-heading-box container-flex">
                  <div className="ApproveHazard-newhazard-heading-title-box container-flex">
                    <h1>New Hazards Update</h1>
                  </div>
                  <div className="ApproveHazard-newhazard-heading-notification-box container-flex">
                    <button
                      type="button"
                      className="ApproveHazard-notification-button-box-icon btn btn-primary position-relative"
                      onClick={handleNotificationClick}
                    >
                      <RiMessage2Fill className='ApproveHazard-message-icon' />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        <Badge bg="danger" className="ApproveHazard-badge-position">{hazardCount}</Badge>
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="ApproveHazard-newhazard-content-box container-flex">
                  <div className="row">
                    <div className="ApproveHazard-detail-box container-flex">
                      <div className="ApproveHazard-detail-name-box container-flex">
                        <p>Location:</p>
                        <p>{selectedNotification && `${selectedNotification.locomotivePilotName}`}</p>
                      </div>
                      <div className="ApproveHazard-detail-loco-phone-box container-flex">
                      <p>Date:</p>
                      <p>{selectedNotification && `${selectedNotification.locomotivePilotPhoneNo}`}</p>
                       
                      </div>
                      <div className="ApproveHazard-detail-station-phone-box container-flex">
                      <p>Time:</p>
                      <p>{selectedNotification && `${selectedNotification.locationContactNumber}`}</p>
                      </div>
                    </div>
                    <div className="HazardUpdate-description-box container-flex">
                      <p>
                        {selectedNotification && (() => {
                          const { day, month, year, time } = formatDate(selectedNotification.time);
                          return `IN ${selectedNotification.locationName}, On ${day} ${month} ${year} at ${time}, ${selectedNotification.hazardType} hazard was reported`;
                        })()}
                      </p>
                    </div>
                    <div className="ApproveHazard-accept-box container-flex">
                      <div className="row">
                        <div className="ApproveHazard-hazard-btn-box container-flex">
                          
                          <div className="HazardUpdate-hazard-right-button-box">
                            <Button
                              className="HazardUpdate-hazard-right-button"
                              variant="outline-dark"
                              onClick={() => handleAcceptClick('hazard', selectedNotification.hazardType)}
                            >
                              Accept
                            </Button>
                          </div>

                          <div className="HazardUpdate-hazard-right-button-box">
                            <Button
                              className="HazardUpdate-hazard-right-button"
                              variant="outline-dark"
                              onClick={() => handleAcceptClick('hazard', selectedNotification.hazardType)}
                            >
                              Decline
                            </Button>
                          </div>

                         

                        </div>

                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ah-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div className="hazardupdate-right-header-box container-flex vh-30">
              <h1>View Hazard</h1>
            </div>
            <div className='hazardupdate-line-box'></div>
            <InputGroup className="update-hazard-input-dropdown-box mt-5">
      <FloatingLabel controlId="floatingTextarea2" label="Select Route">
        <Form.Control
          placeholder="Leave a comment here"
          style={{ height: '5px' }}
          aria-label="Text input with dropdown button"
          id="update-hazard-input"
        
        />
      </FloatingLabel>
      <Dropdown align="end">
        <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-21" className="custom-dropdown-toggle">
          <FaRoute />
        </Dropdown.Toggle>
        <Dropdown.Menu className="LP-hazard-location-scrollable-dropdown-menu">
       
        </Dropdown.Menu>
      </Dropdown>
    </InputGroup>
           
    <InputGroup className="update-hazard-input-dropdown-box mt-5">
      <FloatingLabel controlId="floatingTextarea2" label="Location">
        <Form.Control
          placeholder="Leave a comment here"
          style={{ height: '5px' }}
          aria-label="Text input with dropdown button"
          id="update-hazard-input"
        
        />
      </FloatingLabel>
      <Dropdown align="end">
        <Dropdown.Toggle as={Button} variant="outline-secondary" id="update-hazard-input-group-dropdown-21" className="custom-dropdown-toggle">
          <MdAddLocationAlt />
        </Dropdown.Toggle>
        <Dropdown.Menu className="LP-hazard-location-scrollable-dropdown-menu">
       
        </Dropdown.Menu>
      </Dropdown>
    </InputGroup>

                        <div className='hazardupdate-clear-button'> 
                          <Button
                              className="HazardUpdate-hazard-clear-button"
                              variant="outline-dark"
                              onClick={() => handleAcceptClick('hazard', selectedNotification.hazardType)}
                            >
                              Clear
                            </Button>
                        </div>

                        <div className='hazardupdate-clear-button'> 
                          <Button
                              className="HazardUpdate-hazard-clear-button"
                              variant="outline-dark"
                              onClick={() => navigate('/adminhomepage')}
                            >
                              Back
                            </Button>
                        </div>

                        <div className='hazardupdate-clear-button'> 
                          <Button
                              className="HazardUpdate-hazard-clear-button"
                              variant="outline-dark"
                              onClick={() => handleAcceptClick('hazard', selectedNotification.hazardType)}
                            >
                              Generate Report
                            </Button>
                        </div>

           
          </div>
        </div>
      </div>

      {successMessage && (
        <Modal show={true} onHide={() => setSuccessMessage('')}>
          <Modal.Header closeButton>
            <Modal.Title>Success</Modal.Title>
          </Modal.Header>
          <Modal.Body>{successMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setSuccessMessage('')}>
              Close
            </Button>
            
          </Modal.Footer>
        </Modal>
      )}

      {errorMessage && (
        <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{errorMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseErrorModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hazard Reports</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <p>{`Hazard Reporting ${index + 1}`}</p>
              <Button variant="outline-success" onClick={() => markAsRead(notification.hazardID)}>
                View Report
              </Button>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save the data?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeclineConfirmModal} onHide={handleDeclineCancel}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Decline</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to delete this hazard?</Modal.Body>
  <Modal.Footer>
    <Button variant="danger" onClick={handleDeclineCancel}>
      Cancel
    </Button>
    <Button variant="success" onClick={handleDeclineConfirm}>
      Confirm
    </Button>
  </Modal.Footer>
</Modal>
        </h1>
    </>
  )
}

export default HazardUpdateAutomatically