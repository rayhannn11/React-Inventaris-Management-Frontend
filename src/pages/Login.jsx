// src/pages/Login.js
import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Username and Password are required.");
    } else {
      setError(null);
      setLoading(true);
      $.ajax({
        url: `http://localhost:8080/user/login`,
        type: "POST",
        data: {
          nama_user: username,
          password_user: password,
        },
        success: (res) => {
          if (res.status === "Login successful") {
            setLoading(false);
            localStorage.setItem("user", res.user);
            localStorage.setItem("token", res.token);
            console.log("Login successful. User:", res.user);
            navigate("/dashboard");
          } else {
            setLoading(false);
            setError("Login failed. Please check your credentials.");
          }
        },
        error: () => {
          setError("An error occurred. Please try again.");
        },
      });
    }
  };

  return (
    <Container className="container-center">
      <div className="w-50">
        <h3 className="text-center my-4">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-4"
            disabled={loading}
          >
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
