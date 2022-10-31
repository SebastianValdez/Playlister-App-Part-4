import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "./auth-request-api";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  REGISTER_USER: "REGISTER_USER",
  LOGIN_ERROR: "LOGIN_ERROR",
  REGISTER_ERROR: "REGISTER_ERROR",
  HIDE_MODALS: "HIDE_MODALS",
};

const CurrentModal = {
  NONE: "NONE",
  LOGIN_ISSUE: "LOGIN_ISSUE",
  REGISTER_ISSUE: "REGISTER_ISSUE",
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
    currentModal: CurrentModal.NONE,
    errorType: null,
  });

  const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
          currentModal: CurrentModal.NONE,
          errorType: null,
        });
      }
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          currentModal: CurrentModal.NONE,
          errorType: null,
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
          currentModal: CurrentModal.NONE,
          errorType: null,
        });
      }
      case AuthActionType.REGISTER_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
          currentModal: CurrentModal.NONE,
          errorType: null,
        });
      }
      case AuthActionType.LOGIN_ERROR: {
        return setAuth({
          user: null,
          loggedIn: false,
          currentModal: CurrentModal.LOGIN_ISSUE,
          errorType: payload.errorType,
        });
      }
      case AuthActionType.REGISTER_ERROR: {
        return setAuth({
          user: null,
          loggedIn: false,
          currentModal: CurrentModal.REGISTER_ISSUE,
          errorType: payload.errorType,
        });
      }
      case AuthActionType.HIDE_MODALS: {
        return setAuth({
          user: null,
          loggedIn: false,
          currentModal: CurrentModal.NONE,
          errorType: null,
        });
      }
      default:
        return auth;
    }
  };

  auth.getLoggedIn = async function () {
    const response = await api.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.SET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
    }
  };

  auth.registerUser = async function (
    firstName,
    lastName,
    email,
    password,
    passwordVerify
  ) {
    try {
      const response = await api.registerUser(
        firstName,
        lastName,
        email,
        password,
        passwordVerify
      );
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.REGISTER_USER,
          payload: {
            user: response.data.user,
          },
        });
        // history.push("/login");
        auth.loginUser(email, password); // ! Automatically logins a new user
      }
    } catch (error) {
      let errorMessage = error.response.data.errorMessage;

      if (errorMessage === "Please enter all required fields.") {
        auth.showRegisterErrorModal("Please enter all required fields.");
      } else if (
        errorMessage === "Please enter a password of at least 8 characters."
      ) {
        auth.showRegisterErrorModal(
          "Please enter a password of at least 8 characters."
        );
      } else if (errorMessage === "Please enter the same password twice.") {
        auth.showRegisterErrorModal("Please enter the same password twice.");
      } else if (
        errorMessage === "An account with this email address already exists."
      ) {
        auth.showRegisterErrorModal(
          "An account with this email address already exists."
        );
      }
    }
    console.log(this.loggedIn, this.errorType);
  };

  auth.loginUser = async function (email, password) {
    try {
      const response = await api.loginUser(email, password);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.LOGIN_USER,
          payload: {
            user: response.data.user,
          },
        });
        history.push("/");
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.response.status === 400) {
        auth.showLoginErrorModal("Please enter all required fields.");
      } else if (error.response.status === 401) {
        auth.showLoginErrorModal("Wrong email or password provided.");
      }
      console.log(this.loggedIn, this.errorType);
    }
  };

  auth.logoutUser = async function () {
    const response = await api.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null,
      });
      history.push("/");
    }
  };

  auth.getUserInitials = function () {
    let initials = "";
    if (auth.user) {
      initials += auth.user.firstName.charAt(0);
      initials += auth.user.lastName.charAt(0);
    }
    console.log("user initials: " + initials);
    return initials;
  };

  auth.showLoginErrorModal = (errorMessage) => {
    authReducer({
      type: AuthActionType.LOGIN_ERROR,
      payload: {
        errorType: errorMessage,
      },
    });
  };

  auth.showRegisterErrorModal = (errorMessage) => {
    authReducer({
      type: AuthActionType.REGISTER_ERROR,
      payload: {
        errorType: errorMessage,
      },
    });
  };

  auth.isLoginAlertModalOpen = () => {
    return auth.currentModal === CurrentModal.LOGIN_ISSUE;
  };

  auth.isRegisterAlertModalOpen = () => {
    return auth.currentModal === CurrentModal.REGISTER_ISSUE;
  };

  auth.closeModals = () => {
    authReducer({ type: AuthActionType.HIDE_MODALS, payload: {} });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
