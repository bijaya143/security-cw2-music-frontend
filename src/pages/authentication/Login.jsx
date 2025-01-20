import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loginUserApi, meApi, oauthApi } from "../../apis/Api";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const authUser = JSON.parse(localStorage.getItem("user"));

  // Navigate
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Social
  const [user, setUser] = useState(null);

  // Error States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handle Error States
  const validate = () => {
    let isValid = true;
    if (!email.trim()) {
      setEmailError("Please enter email.");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("Please enter password.");
      isValid = false;
    }
    return isValid;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = { email, password };
      const res = await loginUserApi(data);

      if (res.data?.success === false) {
        toast.error(res.data?.message);
      } else {
        toast.success("Login Successful");
        localStorage.setItem("token", res.data?.data?.accessToken);

        try {
          const userRes = await meApi();
          localStorage.setItem(
            "user",
            JSON.stringify(userRes.data.data.userObject)
          );
          navigate("/");
        } catch (err) {
          toast.error("Failed to fetch user details");
        }
      }
    } catch (err) {
      toast.error(
        err?.response?.status === 401 ? "Unauthorized" : "An error occurred"
      );
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setUser(codeResponse);
    },
    onError: (error) => {
      toast.error("Social Login with Google was not successful");
    },
  });

  useEffect(() => {
    if (user && user.access_token) {
      axios
        .get(
          `${process.env.REACT_APP_GOOGLE_OAUTH_URL}?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          const data = { email: res.data.email, password: "password" };
          try {
            const oauthRes = await oauthApi(data);
            if (oauthRes.data?.success === false) {
              toast.error(oauthRes.data?.message);
            } else {
              toast.success("Login Successful");
              localStorage.setItem("token", oauthRes.data?.data?.accessToken);
              try {
                const userRes = await meApi();
                localStorage.setItem(
                  "user",
                  JSON.stringify(userRes.data.data.userObject)
                );
              } catch (err) {
                toast.error("Failed to fetch user details");
              }
              navigate("/");
            }
          } catch (err) {
            toast.error(err?.response?.data?.data || "An error occurred");
          }
        })
        .catch(() => toast.error("Please try again"));
    }
  }, [user, navigate]);

  return (
    <>
      {authUser ? (
        <Navigate to="/" />
      ) : (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-6 image-container p-4">
              <img
                src="assets/images/main_image.jpg"
                className="rounded img-fluid"
                alt="Main"
              />
            </div>
            <div className="col-md-6 p-4">
              <h1 className="mt-2">Welcome to Harmonica</h1>
              <h2 className="mt-2 mb-4">Sign In To Continue.</h2>
              <form className="mt-3" onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter Email"
                  />
                  {emailError && (
                    <small className="text text-danger">{emailError}</small>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter Password"
                  />
                  {passwordError && (
                    <small className="text text-danger">{passwordError}</small>
                  )}
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-secondary w-50">
                    Login
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <h3 className="text-center mt-3">OR</h3>
                <a onClick={loginWithGoogle} style={{ cursor: "pointer" }}>
                  <img
                    height={60}
                    width={80}
                    src="assets/images/google_login.png"
                    alt="Google Login"
                    className="mt-3"
                  />
                </a>
                <h4 className="mt-3">
                  Don't have an account yet?{" "}
                  <Link to="/register">Register</Link>
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
