import React, { useState } from "react";
import ProfileSetting from "./ProfileSetting";
import { changePasswordApi } from "../../apis/Api";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  var validate = () => {
    var isValid = true;
    if (oldPassword.trim() === "") {
      setOldPasswordError("Please enter Old Password.");
      isValid = false;
    }
    if (newPassword.trim() === "") {
      setNewPasswordError("Please enter New Password.");
      isValid = false;
    }

    if (confirmNewPassword.trim() === "") {
      setConfirmNewPasswordError("Please enter New Password For Confirmation.");
      isValid = false;
    }

    if (newPassword.trim() !== confirmNewPassword.trim()) {
      toast.error("New Password and Confirmed Password does not match.");
      isValid = false;
    }
    return isValid;
  };

  const handleSave = (e) => {
    e.preventDefault();
    var isValid = validate();
    if (!isValid) {
      return;
    }

    const data = {
      oldPassword,
      newPassword,
    };

    changePasswordApi(data)
      .then((res) => {
        if (res.data?.success === false) {
          toast.error(res.data.data.message);
        } else {
          toast.success(res.data.data.message);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          toast.error(err?.response?.data);
        } else {
          toast.error("Internal Server Error!");
        }
      });
    console.log("Data saved:", data);
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-3 p-4">
            <ProfileSetting />
          </div>
          <div className="col-md-9 p-1">
            <form className="mt-3">
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="">
                  Old Password
                </label>
                <input
                  type="password"
                  name=""
                  id=""
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="form-control"
                  placeholder={"Enter Old Password"}
                />
                {oldPasswordError && (
                  <small className="text text-danger">{oldPasswordError}</small>
                )}
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="">
                  New Password
                </label>
                <input
                  type="password"
                  name=""
                  id=""
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  placeholder={"Enter New Password"}
                />
                {newPasswordError && (
                  <small className="text text-danger">{newPasswordError}</small>
                )}
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name=""
                  id=""
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="form-control"
                  placeholder={"Enter Confirm New Password"}
                />
                {confirmNewPasswordError && (
                  <small className="text text-danger">
                    {confirmNewPasswordError}
                  </small>
                )}
              </div>
              <br />
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn btn-secondary w-50"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
