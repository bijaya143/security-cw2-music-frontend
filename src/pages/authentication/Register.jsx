import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { oauthApi, registerUserApi } from "../../apis/Api";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Register = () => {
  const authUser = JSON.parse(localStorage.getItem("user"));

  // Navigate
  const navigate = useNavigate();

  // States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");

  //Social
  const [user, setUser] = useState([]);

  // Error States
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  // Handle Error States
  // Update the validate function
  const validate = () => {
    let isValid = true;

    if (firstName.trim() === "") {
      setFirstNameError("Please enter first name.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (lastName.trim() === "") {
      setLastNameError("Please enter last name.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    if (email.trim() === "") {
      setEmailError("Please enter email.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (phone.trim() === "") {
      setPhoneError("Please enter phone.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (password.trim() === "") {
      setPasswordError("Please enter password.");
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    var isValid = validate();
    if (!isValid) {
      return;
    }

    // Data Params
    const data = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password,
    };
    registerUserApi(data)
      .then((res) => {
        // console.log("--", res.data.data);
        if (res.data?.success === false) {
          toast.error(res.data?.message);
        } else {
          toast.success("Registration Successful");
          setToken(res.data?.data?.accessToken);
          setShowOtpModal(true); // Show OTP Modal
          // window.location.reload(); // Page Reload
          // navigate("/"); // Navigate to homepage
        }
      })
      .catch((err) => {
        // console.log("---", err.response);
        if (err?.response?.status === 401) {
          toast.error("Unauthorized");
        } else if (err?.response?.status === 400) {
          toast.error(err?.response?.data?.data);
        } else if (err?.response?.status === 500) {
          toast.error("Internal Server Error");
        } else {
          toast.error("Please try again");
        }
      });
  };

  const handleOtpSubmit = () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    if (otp === "123456") {
      toast.success("OTP Verified Successfully!");

      localStorage.setItem("token", token); // Set Token
      // Decode Token and Convert JSON
      const user = jwtDecode(token);
      const stringifiedData = JSON.stringify(user);
      localStorage.setItem("user", stringifiedData); // Set User

      setShowOtpModal(false);
    } else {
      toast.error("OTP is invalid.");
      return;
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      // toast.success("Login Successful");
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      toast.error("Social Login with google was not successful");
    },
  });

  useEffect(() => {
    if (user && Object.keys(user).length && Object.keys(user).length >= 1) {
      axios
        .get(
          `${process.env["REACT_APP_GOOGLE_OAUTH_URL"]}?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          // Data Params
          const data = {
            email: res.data.email,
            password: "password",
          };
          oauthApi(data)
            .then((res) => {
              if (res.data?.success === false) {
                toast.error(res.data?.message);
              } else {
                localStorage.setItem("token", res.data?.data?.accessToken); // Set Token

                // Decode Token and Convert JSON
                const user = jwtDecode(res.data.data.accessToken);
                const stringifiedData = JSON.stringify(user);

                localStorage.setItem("user", stringifiedData); // Set User

                window.location.reload(); // Page Reload
                navigate("/"); // Navigate to homepage
              }
            })
            .catch((err) => {
              if (err?.response?.status === 401) {
                toast.error("Unauthorized");
              } else if (err?.response?.status === 400) {
                toast.error(err?.response?.data?.data);
              } else if (err?.response?.status === 500) {
                toast.error("Internal Server Error");
              } else {
                toast.error("Please try again");
              }
            });
        })
        .catch((err) => toast.error("Please try again"));
    }
  }, [user]);

  // const logOut = () => {
  //   googleLogout();
  //   setProfile(null);
  // };

  return (
    <>
      {" "}
      {authUser ? (
        <Navigate to="/"></Navigate>
      ) : (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-6 image-container p-4">
              <img
                src="assets/images/main_image.webp"
                className="rounded img-fluid"
                alt=""
                srcset=""
              />
            </div>
            <div className="col-md-6 p-4">
              <h1 className="mt-2">Create Your Account</h1>
              <form className="mt-3">
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="">
                    First Name
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                    placeholder="Enter First Name"
                  />
                  {firstNameError && (
                    <small className="text text-danger">{firstNameError}</small>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Last Name"
                  />
                  {lastNameError && (
                    <small className="text text-danger">{lastNameError}</small>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="">
                    Email
                  </label>
                  <input
                    type="email"
                    name=""
                    id=""
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter Email"
                  />
                  {emailError && (
                    <small className="text text-danger">{emailError}</small>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="">
                    Phone
                  </label>
                  <input
                    type="phone"
                    name=""
                    id=""
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="Enter Phone"
                  />
                  {phoneError && (
                    <small className="text text-danger">{phoneError}</small>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="">
                    Password
                  </label>
                  <input
                    type="password"
                    name=""
                    id=""
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter Password"
                  />
                  {passwordError && (
                    <small className="text text-danger">{passwordError}</small>
                  )}
                </div>
                <br />
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-secondary w-50"
                    onClick={handleSubmit}
                  >
                    Register
                  </button>
                </div>
              </form>

              {/* OTP Modal */}
              {showOtpModal && (
                <div className="modal" style={modalStyles}>
                  <div className="modal-content p-4" style={modalContentStyles}>
                    <h2>Enter OTP</h2>
                    <div className="form-group">
                      <label>OTP</label>
                      <input
                        type="text"
                        className="form-control"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                      />
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        className="btn btn-secondary me-2"
                        onClick={() => setShowOtpModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleOtpSubmit}
                      >
                        Submit OTP
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <h3 className="text-center mt-3">OR</h3>
                <a onClick={loginWithGoogle}>
                  <img
                    height={60}
                    width={80}
                    src="assets/images/google_login.png"
                    alt=""
                    srcset=""
                    className="mt-3"
                  />
                </a>
                <h4 className="mt-3">
                  Already have an account?{" "}
                  <Link to="/login" href="http://">
                    Login
                  </Link>
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Inline Styles for Modal
const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1050,
};

const modalContentStyles = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  maxWidth: "500px",
  width: "100%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

export default Register;
