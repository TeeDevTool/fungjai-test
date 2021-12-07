import { useState } from "react";

import Button from "../../components/Button";
import { primary } from "../../colors/color";

import { register } from "../../services/Web3Clients";

const Register = ({ setRoute }) => {
  const [myName, setName] = useState("");

  const handleRegister = async () => {
    await register(myName);
    setRoute("feed");
  };

  return (
    <div className="box">
      <h1
        className="fullwidth"
        style={{
          fontStyle: "italic",
          fontWeight: "bold",
          textAlign: "center",
          color: primary,
        }}
      >
        MY SOCIAL
      </h1>
      <h4
        className="fullwidth"
        style={{
          textAlign: "center",
        }}
      >
        Welcome to your social!!
      </h4>
      <h4
        className="fullwidth"
        style={{
          textAlign: "center",
        }}
      >
        We're so glad you've joined us, Pls tell me your name
      </h4>
      <div className="fullwidth" style={{ marginBottom: 20 }}>
        <input
          onChange={({ target }) => setName(target.value)}
          style={{ marginRight: 8 }}
          className="input"
        />
        <Button onClick={() => handleRegister()}>Enter</Button>
      </div>
    </div>
  );
};

export default Register;
