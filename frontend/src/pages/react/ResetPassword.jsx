/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import Form from 'react-bootstrap/Form';
import "./../style/ResetPassword.css";
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { MdLockReset } from "react-icons/md";


function ResetPassword() 
{
  const navigate = useNavigate();
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
                id="floatingEmail"
                type="User name"
                name="locomotiveEmail"
                placeholder="User name"
                className="ResetPassword-email-textbox"
            />
            <label htmlFor="floatingEmail" className="ResetPassword-email-label">User name</label>
        </Form.Floating>
      
        <Button variant="#387373" className="ResetPassword-sumbit-button">Reset </Button>{' '}
        <div className="ResetPassword-back"><p  onClick={() => navigate('/')}>Back to login?</p> </div>
     

          </div>

          
         
        
          {/* ..........left side box ended.......... */}

       
        </div>
      </div>
  </>;
}

export default ResetPassword;
