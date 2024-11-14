import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container className="container-center text-center">
      <div className="flex-column ">
        <div>
          <h1>404</h1>
          <p>Page Not Found</p>
        </div>

        <Button variant="primary" onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
