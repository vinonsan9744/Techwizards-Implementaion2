/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import "./../style/ResetPassword.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { MdLockReset } from "react-icons/md";
import axios from 'axios';
import { Modal } from 'react-bootstrap'; // Import Modal

function ResetPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailVisible, setEmailVisible] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [pilotId, setPilotId] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal state
  

  // Function to handle username verification
  const handleUsernameVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/locomotivePilot/verifyUsername", { locomotiveName: username });
      if (response.status === 200) {
        setEmailVisible(true);
        setMessage("Username found. Please enter your email.");
      }
    } catch (error) {
      setMessage("Username not found.");
      setEmailVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to verify email and send OTP
  const handleEmailVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/locomotivePilot/verifyEmail", {
        locomotiveName: username,
        locomotiveEmail: email
      });
      if (response.status === 200) {
        setPilotId(response.data.locomotivePilotID); // Set the pilot ID here
        await handleSendOtp();
      }
    } catch (error) {
      setMessage("Email not associated with this username.");
      setOtpVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/locomotivePilot/sendOtp", {
        locomotiveName: username,
        locomotiveEmail: email
      });
      if (response.status === 200) {
        setOtpVisible(true);
        setMessage("OTP sent to your email. Please enter it below.");
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
      setOtpVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/locomotivePilot/verifyOTP", {
        locomotiveEmail: email,
        otp: otp
      });
      if (response.status === 200) {
        setResetPasswordVisible(true); // Show reset password fields
        setMessage("OTP verified successfully. Please enter your new password.");
      }
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : "Invalid OTP. Please try again.";
      setMessage(errorMsg);
      setResetPasswordVisible(false); // Hide reset password fields if OTP is invalid
    } finally {
      setLoading(false);
    }
  };

 

  const handleResetPassword = async () => {
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!pilotId) {
      setMessage("Pilot ID is required to reset password.");
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:8000/locomotivePilot/updatePassword/${pilotId}`, {
        password: newPassword
      });
  
      if (response.status === 200) {
        setShowModal(true); // Show the modal on success
        setTimeout(() => {
          navigate('/'); // Redirect to login page after a delay
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : "Failed to reset password.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="container-flex vh-100">
      <div className="row vh-100">
        <div className="ResetPassword-main col-12">
          <div className="ResetPassword-header-box-img container-flex">
            <h1><MdLockReset /></h1>
          </div>
          <div className="ResetPassword-header-box-title">
            <h1>Reset Password</h1>
          </div>
          <div className="ResetPassword-header-box-description">
            <p>The reset password feature is essential for maintaining account security and providing users with a way to regain access to their accounts in case they forget their passwords. It often incorporates security measures such as email verification and secure password reset forms to ensure the process is secure and reliable.</p>
          </div>

          <Form.Floating className="mb-3">
  <Form.Control
    id="floatingUsername"
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="ResetPassword-username-textbox"
  />
  <label htmlFor="floatingUsername" className="ResetPassword-username-label">Username</label>
</Form.Floating>

{/* Show the message immediately after the username input */}
{message && emailVisible && !otpVisible && (
  <div className="ResetPassword-message mt-2">
    <p>{message}</p>
  </div>
)}

{emailVisible && !otpVisible && (
  <>
    <Form.Floating className="mt-4 mb-3">
      <Form.Control
        id="floatingEmail"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="ResetPassword-username-textbox"
      />
      <label htmlFor="floatingEmail" className="ResetPassword-username-label">Email</label>
    </Form.Floating>

    <Button
      variant="primary"
      className="ResetPassword-submit-button"
      onClick={handleEmailVerification}>
      Verify Email
    </Button>
  </>
)}

          {otpVisible && (
            <>
              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingOtp"
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="ResetPassword-otp-textbox"
                />
                <label htmlFor="floatingOtp" className="ResetPassword-otp-label">OTP</label>
              </Form.Floating>

              <Button
                variant="primary"
                className="ResetPassword-submit-button"
                onClick={handleOtpVerification}>
                Verify OTP
              </Button>
            </>
          )}

          {resetPasswordVisible && (
            <>
              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingNewPassword"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label htmlFor="floatingNewPassword">New Password</label>
              </Form.Floating>

              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingConfirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor="floatingConfirmPassword">Confirm Password</label>
              </Form.Floating>

              <Form.Floating className="mt-4 mb-3">
                <Form.Control
                  id="floatingPilotId"
                  type="text"
                  placeholder="Pilot ID"
                  value={pilotId}
                  readOnly
                  className="ResetPassword-pilot-id-textbox"
                />
                <label htmlFor="floatingPilotId" className="ResetPassword-pilot-id-label">Pilot ID</label>
              </Form.Floating>

              <Button variant="primary" onClick={handleResetPassword}>
                Reset Password
              </Button>
            </>
          )}

          {/* Display message */}
          <div className="ResetPassword-message">
            <p>{message}</p>
          </div>

          {loading ? ( // Show loading state
            <p>Loading...</p>
          ) : (
            <Button
              variant="#387373"
              className="ResetPassword-sumbit-button"
              onClick={handleUsernameVerification}>
              Verify Username
            </Button>
          )}
          
          <div className="ResetPassword-back">
            <p onClick={() => navigate('/')}>Back to login?</p>
          </div>

          {/* Modal for password reset confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Password Reset Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your password has been updated successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
