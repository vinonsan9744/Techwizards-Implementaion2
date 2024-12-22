/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./../style/LoginPage.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for making HTTP requests
import { GiElephant } from "react-icons/gi";
import { MdLandslide } from "react-icons/md";
import { FaTrainSubway } from "react-icons/fa6";
import { FaCarSide } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaCloudSunRain } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";

function LoginPage() {
  const [selectedOption, setSelectedOption] = useState("");
  const [details, setDetails] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, password } = details;

    if (!selectedOption) {
      setError("Please select an option (Locomotive pilot or Admin).");
      setShowErrorModal(true);
      return;
    }

    // Check for empty fields
    if (id.trim() === "") {
      setError("ID field cannot be empty.");
      setShowErrorModal(true);
      return;
    }

    if (password.trim() === "") {
      setError("Password field cannot be empty.");
      setShowErrorModal(true);
      return;
    }

    try {
      let loginEndpoint = "";
      let payload = { id, password }; // Default payload structure

      if (selectedOption === "option1") {
        // Locomotive pilot login endpoint
        loginEndpoint = "http://localhost:8000/locomotivePilot/login";
        payload = { locomotivePilotID: id, password }; // Adjust payload for locomotive pilot
      } else if (selectedOption === "option2") {
        // Admin login endpoint
        loginEndpoint = "http://localhost:4000/api/AdministrativeOfficer/login";
        payload = { AD_ID: id, Password: password }; // Adjust payload for admin
      }

      const response = await axios.post(loginEndpoint, payload);
      const { data } = response;

      // Login successful
      setError(""); // Clear any previous errors

      // Clear the form inputs
      setDetails({ id: "", password: "" });

      if (selectedOption === "option1") {
        // Navigate to home page for Locomotive pilot
        navigate("/selectroute");
      } else if (selectedOption === "option2") {
        // Navigate to admin home page
        navigate("/adminhomepage");
      }
    } catch (error) {
      // Handle error responses from backend
      const errorMessage = error.response ? error.response.data.error : "Something went wrong. Please try again.";
      setError(errorMessage);
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <>
      <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* Left side bar start */}
          <div className="LoginPage-main-left col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
            <div className="hazard-LoginPage-header-box container-flex">
              <div className="hazard-LoginPage-header-title">
                SriLankan Railway Safety System
              </div>
            </div>

            <div className="hazard-LoginPage-description-box container-flex">
              <div className="hazard-LoginPage-header-description">
                <p>
                  The login process for our Railway Safety System is
                  straightforward and secure. Locomotive pilots or admins simply
                  input their email and password on the login page. The system
                  then verifies these details, ensuring only authorized
                  personnel gain access. Upon successful verification, users are
                  redirected to the main home page, where they can access
                  tailored options and settings designed to facilitate a
                  seamless navigation experience within the system.
                </p>
              </div>
            </div>

            <div className="hazard-LoginPage-circle-box container-flex">
              <div className="hazard-LoginPage-circle1 container-flex">
                <GiElephant className="icon" />
              </div>
              <div className="hazard-LoginPage-circle container-flex">
                <MdLandslide className="icon" />
              </div>
              <div className="hazard-LoginPage-circle container-flex">
                <FaTrainSubway className="icon" />
              </div>
              <div className="hazard-LoginPage-circle container-flex">
                <FaCarSide className="icon" />
              </div>
              <div className="hazard-LoginPage-circle container-flex">
                <FaUserTie className="icon" />
              </div>
              <div className="hazard-LoginPage-circle container-flex">
                <FaCloudSunRain className="icon" />
              </div>
              <div className="hazard-LoginPage-circle container-flex">
                <FaMapLocationDot className="icon" />
              </div>
            </div>
          </div>
          {/* Left side bar end */}

          <div className="LoginPage-main-right col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
            <div className="hazard-LoginPage-heading-box container-flex">
              <div className="hazard-LoginPage-heading-title">Login Form</div>
            </div>

            {error && (
              <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleCloseErrorModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            )}

            <Form onSubmit={handleSubmit}>
              <div className="hazard-LoginPage-radio-box container-flex">
                <div className="hazard-LoginPage-radio-container">
                  <label className="hazard-LoginPage-radio-label">
                    <input
                      type="radio"
                      value="option1"
                      checked={selectedOption === "option1"}
                      onChange={handleOptionChange}
                    />
                    <span className="hazard-LoginPage-custom-radio"></span>
                    Locomotive pilot
                  </label>
                  <label className="hazard-LoginPage-radio-label">
                    <input
                      type="radio"
                      value="option2"
                      checked={selectedOption === "option2"}
                      onChange={handleOptionChange}
                    />
                    <span className="hazard-LoginPage-custom-radio"></span>
                    Admin
                  </label>
                </div>
              </div>

              <div className="row hazard-LoginPage-text-box container-flex">
                <input
                  id="id"
                  type="text"
                  name="id"
                  placeholder={
                    selectedOption === "option1"
                      ? "Locomotive Pilot ID"
                      : "Admin ID"
                  }
                  value={details.id}
                  onChange={handleChange}
                  className="hazard-LoginPage-input-text-box"
                />
              </div>

              <div className="row hazard-LoginPage-text-box container-flex">
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={details.password}
                  onChange={handleChange}
                  className="hazard-LoginPage-input-text-box"
                />
              </div>

              <div className="hazard-LoginPage-login-button-box container-flex">
                <Button type="submit" className="hazard-LoginPage-login-button">
                  Sign in
                </Button>
              </div>

              <div className="hazard-LoginPage-register-button-box container-flex">
                <Button
                  className="hazard-LoginPage-signup-button"
                  onClick={() => navigate("register")}
                >
                  Sign up
                </Button>
              </div>
            </Form>

            <div className="hazard-LoginPage-forgot-label-box container-flex">
              <div
                className="hazard-LoginPage-forgot-label"
                onClick={() => navigate("resetpassword")}
              >
                Forgot password?
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
