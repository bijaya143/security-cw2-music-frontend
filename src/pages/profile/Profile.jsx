import React, { useEffect, useState } from "react";
import ProfileSetting from "./ProfileSetting";
import { toast } from "react-toastify";
import { meApi, updateUserApi } from "../../apis/Api";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const {
          data: {
            data: { userObject },
          },
        } = await meApi();
        localStorage.setItem("user", JSON.stringify(userObject));
        setImage(
          userObject.imageUrl ||
            "https://bootdey.com/img/Content/avatar/avatar1.png"
        );
        setFirstName(userObject.firstName || "");
        setLastName(userObject.lastName || "");
        setEmail(userObject.email || "");
        setDob(userObject.dob || "");
        setGender(userObject.gender || "");
      } catch (err) {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const setUser = async () => {
    try {
      const {
        data: {
          data: { userObject },
        },
      } = await meApi();
      localStorage.setItem("user", JSON.stringify(userObject));
      setImage(userObject.imageUrl);
    } catch (err) {
      toast.error("Failed to fetch user details");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        setLoading(true);
        await updateUserApi(formData);
        toast.success("Profile Image uploaded successfully.");
        await setUser();
      } catch (error) {
        toast.error("Profile Image was not uploaded.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleSave = async () => {
    const data = {
      ...(firstName ? { firstName: firstName } : {}),
      ...(lastName ? { lastName: lastName } : {}),
      ...(dob ? { dob: dob } : {}),
      ...(gender ? { gender: gender } : {}),
    };
    try {
      setLoading(true);
      await updateUserApi(data);
      toast.success("Profile saved successfully!");
      await setUser();
    } catch (error) {
      toast.error("Error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-3 p-4">
          <ProfileSetting />
        </div>
        <div className="col-md-9 p-4">
          <div className="text-center">
            <img
              key={image}
              height={100}
              width={100}
              src={
                image
                  ? `${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${image}`
                  : "/assets/images/default_image.png"
              }
              alt="Profile"
              className="d-block ui-w-80 mx-auto rounded-circle" // Added rounded-circle for style
            />
            <div className="media-body mt-2">
              <label className="btn btn-outline-primary">
                Upload
                <input
                  type="file"
                  className="account-settings-fileinput"
                  onChange={handleImageUpload}
                  hidden // Hide the default file input
                />
              </label>
              {loading && (
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
          </div>
          <form className="mt-3">
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <label className="form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-control"
                    value={firstName}
                    placeholder="Enter First Name"
                  />
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <label className="form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-control"
                    value={lastName}
                    placeholder="Enter Last Name"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    value={email}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <label className="form-label" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    onChange={(e) => setDob(e.target.value)}
                    className="form-control"
                    value={dob}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="form-outline">
                  <label className="form-label" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    onChange={(e) => setGender(e.target.value)}
                    className="form-control"
                    value={gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-secondary w-50"
                disabled={loading}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
