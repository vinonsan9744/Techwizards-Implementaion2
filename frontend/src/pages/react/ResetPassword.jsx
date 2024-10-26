/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import "./../style/ResetPassword.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { MdLockReset } from "react-icons/md";
import axios from 'axios';

function ResetPassword() 
{
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
  

  // Function to handle username verification
  const handleUsernameVerification = async () => {
    try {
      const response = await axios.post("http://localhost:8000/locomotivePilot/verifyUsername", { locomotiveName: username });
      if (response.status === 200) {
        setEmailVisible(true);
        setMessage("Username found. Please enter your email.");
      }
    } catch (error) {
      setMessage("Username not found.");
      setEmailVisible(false);
    }
  };

  // Function to verify email and send OTP
  const handleEmailVerification = async () => {
    try {
      const response = await axios.post("http://localhost:8000/locomotivePilot/verifyEmail", {
        locomotiveName: username,
        locomotiveEmail: email
      });
      if (response.status === 200) {
        await handleSendOtp();
      }
    } catch (error) {
      setMessage("Email not associated with this username.");
      setOtpVisible(false);
    }
  };

  // Function to send OTP
  const handleSendOtp = async () => {
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
    }
  };

  const handleOtpVerification = async () => {
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
    }
};

// Function to handle password reset
const handleResetPassword = async () => {
    try {
        const response = await axios.post("http://localhost:8000/locomotivePilot/resetPassword", {
            locomotiveEmail: email,
            newPassword: newPassword
        });
        if (response.status === 200) {
            setMessage("Password reset successfully!");
        }
    } catch (error) {
        const errorMsg = error.response ? error.response.data.message : "Failed to reset password.";
        setMessage(errorMsg);
    }
};

  return <>
  
    {/* ..........this is the main division of screen.......... */}
    <div className="container-flex vh-100">
        <div className="row vh-100">
          {/* ..........this is the left side box start.......... */}

          <div className="ResetPassword-main col-12">

            <div className="ResetPassword-header-box-img container-flex "><h1><MdLockReset /></h1></div>
            <div className="ResetPassword-header-box-title  "><h1>Reset Password</h1></div>
            <div className="ResetPassword-header-box-description  ">
            <p>The reset password feature is essential for maintaining account security and providing users with a way to regain access to their accounts in case they forget their passwords. It often incorporates security measures such as email verification and secure password reset forms to ensure the process is secure and reliable.</p></div>
            
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
                className="ResetPassword-password-textbox"
            />
            <label htmlFor="floatingNewPassword" className="ResetPassword-password-label">New Password</label>
        </Form.Floating>
        <Button 
            variant="primary" 
            className="ResetPassword-submit-button" 
            onClick={handleResetPassword}>
            Reset Password
        </Button>
    </>
)}
                    {/* Display message */}
                    <div className="ResetPassword-message">
                        <p>{message}</p>
                    </div>
      
        <Button variant="#387373"
         className="ResetPassword-sumbit-button"
         onClick={handleUsernameVerification}>
          Reset 
        </Button>{' '}
        <div className="ResetPassword-back"><p  onClick={() => navigate('/')}>Back to login?</p> </div>
     

          </div>

          
         
        
          {/* ..........left side box ended.......... */}

       
        </div>
      </div>
  </>;
}

export default ResetPassword;
