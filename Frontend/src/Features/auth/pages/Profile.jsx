import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../../../style/Profile.scss";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate()
  const { user , handleUpdateUserDetails , handleUpdateUserPassword , handleDeleteUserAccount} = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [deletePassword, setDeletePassword] = useState("");

  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const username = user?.username || "User";

  const firstLetter = username.charAt(0).toUpperCase();


  /* =====================================================
     PROFILE
  ===================================================== */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleEdit = () => {
    setProfileData({
      username: user?.username || "",
      email: user?.email || "",
    });

    setIsEditing(true);
  };


  const handleCancelEdit = () => {
    setProfileData({
      username: user?.username || "",
      email: user?.email || "",
    });

    setIsEditing(false);
  };


  const handleSaveProfile = async () => {
    try {
      await handleUpdateUserDetails(profileData)
    
      console.log("Updated profile:", profileData);

      setIsEditing(false);

    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };


  /* =====================================================
     PASSWORD
  ===================================================== */

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      alert("Please enter your current password.");
      return;
    }

    if (!passwordData.newPassword) {
      alert("Please enter a new password.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      await handleUpdateUserPassword(passwordData)
      /*
        Example:
        await changePassword(passwordData);
      */

      console.log("Change password:", passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      //alert("Password changed successfully.");
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };


  /* =====================================================
     DELETE ACCOUNT
  ===================================================== */

  const openDeleteModal = () => {
    setDeletePassword("");
    setShowDeletePassword(false);
    setShowDeleteModal(true);
  };


  const closeDeleteModal = () => {
    setDeletePassword("");
    setShowDeletePassword(false);
    setShowDeleteModal(false);
  };


  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      alert("Please enter your password to delete your account.");
      return;
    }

    console.log(deletePassword)

    try {
      await handleDeleteUserAccount(deletePassword)

      // After successful API response:
      // alert("Account deleted")
      navigate("/");

      closeDeleteModal();

    } catch (error) {
      console.error("Account deletion failed:", error);

      
      // alert(
      //   error?.response?.data?.message ||
      //   "Unable to delete account. Please check your password."
      // );

    }
  };


  return (
    <main className="profile-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <header className="profile-header">

        <span className="profile-label">
          ACCOUNT SETTINGS
        </span>

        <h1>
          Your <span>Profile</span>
        </h1>

        <p>
          Manage your account, security and personal information.
        </p>

      </header>


      {/* =================================================
          CENTERED CONTENT
      ================================================= */}

      <div className="profile-container">


        {/* =================================================
            PROFILE OVERVIEW
        ================================================= */}

        <section className="profile-card profile-overview">

          <div className="profile-overview-content">

            <div className="profile-avatar">
              {firstLetter}
            </div>

            <div className="profile-identity">

              <h2>
                {username}
              </h2>

              <p>
                {user?.email || "No email available"}
              </p>

              <span className="account-status">
                <span></span>
                Active Account
              </span>

            </div>

          </div>


          {!isEditing && (
            <button
              type="button"
              className="edit-button"
              onClick={handleEdit}
            >
              <span>✎</span>
              Edit Profile
            </button>
          )}

        </section>


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="profile-card">

          <div className="card-header">

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Update your basic account information.
              </p>
            </div>

          </div>


          <div className="profile-fields">

            {/* USERNAME */}

            <div className="input-group">

              <label htmlFor="username">
                Username
              </label>

              {isEditing ? (
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  placeholder="Enter username"
                />
              ) : (
                <div className="readonly-field">
                  {user?.username || "Not available"}
                </div>
              )}

            </div>


            {/* EMAIL */}

            <div className="input-group">

              <label htmlFor="email">
                Email Address
              </label>

              {isEditing ? (
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Enter email"
                />
              ) : (
                <div className="readonly-field">
                  {user?.email || "Not available"}
                </div>
              )}

            </div>

          </div>


          {isEditing && (
            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>

            </div>
          )}

        </section>


        {/* =================================================
            PASSWORD & SECURITY
        ================================================= */}

        <section className="profile-card">

          <div className="card-header security-header">

            <div className="section-icon">
              🔒
            </div>

            <div>
              <h2>
                Password & Security
              </h2>

              <p>
                Change your password to keep your account secure.
              </p>
            </div>

          </div>


          <form
            className="password-form"
            onSubmit={handleChangePassword}
          >

            {/* CURRENT PASSWORD */}

            <div className="input-group">

              <label htmlFor="currentPassword">
                Current Password
              </label>

              <div className="password-wrapper">

                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* NEW PASSWORD */}

            <div className="input-group">

              <label htmlFor="newPassword">
                New Password
              </label>

              <input
                id="newPassword"
                name="newPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />

              <span className="input-hint">
                Minimum 6 characters.
              </span>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="input-group">

              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />

            </div>


            <div className="password-actions">

              <button
                type="submit"
                className="primary-button"
              >
                Change Password
              </button>

            </div>

          </form>

        </section>


        {/* =================================================
            DANGER ZONE
        ================================================= */}

        <section className="danger-zone">

          <div className="danger-content">

            <div className="danger-icon">
              !
            </div>

            <div>

              <h2>
                Delete Account
              </h2>

              <p>
                Permanently delete your account and all
                associated interview reports and data.
              </p>

            </div>

          </div>


          <button
            type="button"
            className="delete-button"
            onClick={openDeleteModal}
          >
            Delete Account
          </button>

        </section>

      </div>


      {/* =================================================
          DELETE ACCOUNT MODAL
      ================================================= */}

      {showDeleteModal && (
        <div className="delete-modal-overlay">

          <div className="delete-modal">

            <div className="modal-warning-icon">
              !
            </div>

            <h2>
              Delete Account?
            </h2>

            <p>
              This action will permanently delete your
              account, interview reports and associated data.
            </p>

            <p className="modal-warning">
              This action cannot be undone.
            </p>


            {/* PASSWORD */}

            <div className="delete-password-group">

              <label htmlFor="deletePassword">
                Enter your password to continue
              </label>

              <div className="delete-password-wrapper">

                <input
                  id="deletePassword"
                  type={
                    showDeletePassword
                      ? "text"
                      : "password"
                  }
                  value={deletePassword}
                  onChange={(e) =>
                    setDeletePassword(e.target.value)
                  }
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowDeletePassword(
                      (prev) => !prev
                    )
                  }
                >
                  {showDeletePassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* MODAL ACTIONS */}

            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="modal-delete-button"
                onClick={handleDeleteAccount}
                disabled={!deletePassword.trim()}
              >
                Delete My Account
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
};

export default Profile;