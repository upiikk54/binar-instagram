import { useRef, useState } from "react";
import { Form, Container, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function CreatePosts() {
  const navigate = useNavigate();

  const titleField = useRef("");
  const descriptionField = useRef("");
  const [picturePost, setPicturePostField] = useState();

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const onCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const userToCreatePayload = new FormData();
      userToCreatePayload.append("title", titleField.current.value);
      userToCreatePayload.append("description", descriptionField.current.value);
      userToCreatePayload.append("picture", picturePost);

      const createRequest = await axios.post(
        "https://binar-instagram-clone.herokuapp.com/posts", userToCreatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
      );

      const createResponse = createRequest.data;

      if (createResponse.status) navigate("/");
    } catch (err) {
      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  return (
    <div className="bg-allform">
      <Card style={{ width: '50rem' }} className="position-absolute top-50 start-50 translate-middle border-light radius">
        <Card.Body className="bg-form radius shadow-lg">
          <div className="row">
            <div className="col">
              <img src="./images/create.png" className="img-login mt-5 ms-4" alt="" />
            </div>
            <div className="col">
              <h1 className="mb-3 text-light">Create Postingan</h1>
              <Form onSubmit={onCreate}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">title</Form.Label>
                  <Form.Control
                    type="text"
                    ref={titleField}
                    placeholder="Masukkan nama"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">description</Form.Label>
                  <Form.Control
                    type="text"
                    ref={descriptionField}
                    placeholder="Masukkan Email"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Picture</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setPicturePostField(e.target.files[0])}
                  />
                </Form.Group>
                {errorResponse.isError && (
                  <Alert variant="danger">{errorResponse.message}</Alert>
                )}
                <Button className="w-100" type="submit">
                  Kirim
                </Button>
                <Link to="/">
                  <Button className="w-100 mt-3" variant='danger'>
                    kembali
                  </Button>
                </Link>
              </Form>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
