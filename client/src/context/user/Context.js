import React, { useState } from "react";
import SyntaxContext from "./SyntaxContext";
import { isExpired, decodeToken } from "react-jwt";
const Context = ({ children }) => {
  const [mobileNavClass, setMobileNavClass] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [preloader, setPreloader] = useState(false);
  const [register, setRegister] = useState({
    email: "",
    password: "",
    confpass: "",
    firstname: "",
    surname: "",
    country: "",
    dob: new Date(),
    role: "student",
  });
  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
    confpass: "",
    firstname: "",
    surname: "",
    country: "",
  });

  const [user, setUser] = useState({});
  const registerFormHandler = (id, val) => {
    if (id !== "dob" && id !== "country") {
      val = val.replace(/\s/g, "");
    }
    switch (id) {
      case "email":
        setRegister({ ...register, email: val });
        if (
          !val.includes("@yahoo.com") &&
          !val.includes("@gmail.com") &&
          !val.includes("@bugsquashers.com")
        ) {
          setErrorMessage({
            ...errorMessage,
            email: "Please enter only email or gmail!",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            email: "",
          });
        }
        break;
      case "pass":
        setRegister({ ...register, password: val });
        if (val.length < 8 || val.length > 12) {
          setErrorMessage({
            ...errorMessage,
            password: "Please choose a password between 8-12 characters!",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            password: "",
          });
        }
        break;
      case "confpass":
        setRegister({ ...register, confpass: val });
        if (register["password"] !== val) {
          setErrorMessage({
            ...errorMessage,
            confpass: "Please enter the same password!",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            confpass: "",
          });
        }
        break;
      case "country":
        setRegister({ ...register, country: val });
        if (val === "none") {
          setErrorMessage({ ...errorMessage, country: "Choose a country" });
        } else {
          setErrorMessage({ ...errorMessage, country: "" });
        }
        break;
      case "dob":
        setRegister({ ...register, dob: val });
        break;
      case "fname":
        setRegister({ ...register, firstname: val });
        if (val.length === 0 || val.length > 20) {
          setErrorMessage({
            ...errorMessage,
            firstname: "Choose a name less than 20 character",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            firstname: "",
          });
        }
        break;
      case "lname":
        setRegister({ ...register, surname: val });
        if (val.length === 0 || val.length > 20) {
          setErrorMessage({
            ...errorMessage,
            surname: "Choose a surname less than 20 character",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            surname: "",
          });
        }
        break;
      default:
        break;
    }
  };
  const loginFormHandler = (id, val) => {
    switch (id) {
      case "email":
        setLogin({ ...login, email: val });
        if (
          !val.includes("@yahoo.com") &&
          !val.includes("@gmail.com") &&
          !val.includes("@bugsquashers.com")
        ) {
          setErrorMessage({
            ...errorMessage,
            email: "Please enter only email or gmail!",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            email: "",
          });
        }
        break;
      case "pass":
        setLogin({ ...login, password: val });
        if (val.length < 8 || val.length > 12) {
          setErrorMessage({
            ...errorMessage,
            password: "Please choose a password between 8-12 characters!",
          });
        } else {
          setErrorMessage({
            ...errorMessage,
            password: "",
          });
        }
        break;
      default:
        break;
    }
  };
  const registerValidationHandler = () => {
    const { email, password, confpass, firstname, surname, country, dob } =
      register;
    let valid = false;
    if (
      email.length !== 0 &&
      password.length !== 0 &&
      firstname.length !== 0 &&
      surname.length !== 0 &&
      country.length !== 0 &&
      confpass.length !== 0 &&
      dob.length !== 0 &&
      errorMessage["email"].length === 0 &&
      errorMessage["password"].length === 0 &&
      errorMessage["confpass"].length === 0 &&
      errorMessage["firstname"].length === 0 &&
      (errorMessage["surname"].length === 0 &&
        errorMessage["country"].length) === 0 &&
      register["password"] === register["confpass"]
    ) {
      valid = true;
    }
    return valid;
  };
  const loginValidation = () => {
    const { email, password } = login;
    let valid = false;
    if (
      email.length !== 0 &&
      password.length !== 0 &&
      errorMessage.email.length === 0 &&
      errorMessage.password.length === 0
    ) {
      valid = true;
    }
    return valid;
  };
  const registerHandler = async () => {
    const valid = registerValidationHandler();
    const { email, password, firstname, surname, country } = register;
    const dob = register.dob.toLocaleDateString();

    if (valid) {
      setPreloader(true);
      const user = {
        email,
        password,
        firstname,
        surname,
        country,
        role: "student",
        dob,
      };
      const postOption = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };
      const url = "http://localhost:5000/api/user/signup";
      const res = await fetch(url, postOption);
      try {
        if (res.ok) {
          alert("Register was successful! :)");
          setPreloader(false);
        } else {
          setPreloader(false);
          alert("This email is aliredy existed");
        }
      } catch (error) {
        console.log(error);
        alert("User couldn't be created! :(");
      }
    } else {
      alert("Please fill all the fields");
    }
  };
  const loginHandler = async () => {
    const valid = loginValidation();
    const { email, password } = login;
    const url = "http://localhost:5000/api/user/login";
    const user = { email, password };
    const postOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    if (valid) {
      try {
        setPreloader(true);
        const res = await fetch(url, postOption);
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          setUser(decodeToken(data.token));

          setPreloader(false);
        } else {
          setPreloader(false);
          alert(res.status);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SyntaxContext.Provider
      value={{
        mobileNavClass,
        setMobileNavClass,
        login,
        setLogin,
        register,
        setRegister,
        registerHandler,
        loginHandler,
        loginFormHandler,
        registerFormHandler,
        errorMessage,
        setErrorMessage,
        preloader,
        setPreloader,
        user,
        setUser,
      }}
    >
      {children}
    </SyntaxContext.Provider>
  );
};

export default Context;
