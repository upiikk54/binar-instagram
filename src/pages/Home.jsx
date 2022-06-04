import { Link, Navigate } from "react-router-dom";
import { Button, Navbar, Container, Offcanvas, Card, Row, Col, Modal, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { addUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";

function Home() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [isRefresh, setIsRefresh] = useState(false);
  const [post, setPost] = useState([]);
  const [postToDelete, setPostToDelete] = useState();

  const [showSideBar, setShowSideBar] = useState(false);
  const handleCloseSideBar = () => setShowSideBar(false);
  const handleShowSideBar = () => setShowSideBar(true);

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setPostToDelete(null);
    setShowModal(false)
  };
  const handleShowModal = (e, post) => {
    console.log("ini log");
    e.preventDefault();
    setPostToDelete(post);
    setShowModal(true)
  };

  const [successResponse, setSuccessResponse] = useState({
    isSuccess: false,
    message: "",
  });

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  useEffect(() => {
    // Function validasi user
    const validateLogin = async () => {
      try {
        const token = localStorage.getItem("token");

        const currentUserRequest = await axios.get(
          "http://localhost:8087/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentUserResponse = currentUserRequest.data;

        if (currentUserResponse.status) {
          dispatch(
            addUser({
              user: currentUserResponse.data.user,
              token: token,
            })
          )
          setUser(currentUserResponse.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    validateLogin();
    posts();
    setIsRefresh(false);
  }, [isRefresh]);

  // function logout
  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUser({});
  };

  // function getAll postingan
  const posts = async () => {
    try {
      const dataPosts = await axios.get(
        `http://localhost:8087/api/posts`
      )

      const payloadData = await dataPosts.data.data.getDataAll;

      setPost(payloadData)
    } catch (err) {
      console.log(err);
    }
  }

  // function Delete Postingan
  const onDelete = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const createRequest = await axios.delete(
        `http://localhost:8087/posts/${postToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successResponse = createRequest.data.message;

      setSuccessResponse({
        isSuccess: true,
        message: successResponse,
      })


      console.log(createRequest);
      setPostToDelete(null);
      setShowModal(false);

      setIsRefresh(true);
    } catch (err) {
      console.log(err);

      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  }

  return isLoggedIn ? (
    <div className="p-3 bg-all">
      {/* response success or error */}
      {successResponse.isSuccess && (
        <Alert variant="success" onClose={() => setSuccessResponse(true)} dismissible>{successResponse.message}</Alert>
      )}

      {errorResponse.isError && (
        <Alert variant="danger" onClose={() => setErrorResponse(true)} dismissible>{errorResponse.message}</Alert>
      )}
      
      {/* navbar */}
      <Navbar>
        <Container>
          <p className="bg-nav fw-bold">Welcome  {user.name}!</p>
          {/* <Navbar.Brand href="#home" className="fw-bold">Welcome {user.name}!</Navbar.Brand> */}
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Button className="my-3" variant="danger" onClick={(e) => logout(e)}>
              Logout
            </Button>
            <Button className="ms-3" variant="primary" onClick={handleShowSideBar}>
              other
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* sidebar */}
      <Offcanvas show={showSideBar} onHide={handleCloseSideBar}>
        <Offcanvas.Header className="bg-all" closeButton>
          <Offcanvas.Title className="bg-nav fw-bold">Instagram-clone</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-all">
          <div className="row">
            <Link to="/about">
              <Button variant="success">Go to about page</Button>
            </Link>
            <Link className="mt-3" to="/create">
              <Button variant="primary">Go to create postingan</Button>
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* card */}
      <Container className="mt-5">
        <Row>
          {post.map((post) => (
            <Col md={4} key={post.id}>
              <Card className="shadow" style={{ marginTop: "2rem" }} border="secondary">
                <img src={`http://localhost:8087/public/files/${post.picture}`} alt="" style={{ height: "300px" }} />
                <div className="card-body">
                  <p className="card-text fw-bold">{post.title}</p>
                  <p className="card-text">{post.description}</p>
                  <Link className="" to={`/update/${post.id}`}>
                    <Button variant="warning">Edit</Button>
                  </Link>
                  <Button variant="danger" className="ms-3" onClick={(e) => handleShowModal(e, post)}>
                    Delete
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* modals */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>apakah ingin menghapus?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Postingan tidak bisa kembali ketika di delete</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={(e) => onDelete(e)}>
            Delete
          </Button>

        </Modal.Footer>
      </Modal>

      {/* footer */}
      <Container className="mt-5">
        <Row className="text-center">
          <p className="bg-nav fw-bold">Alamat: Jalan menuju hati mu, aishh</p>
          <p className="bg-nav fw-bold">Pradityaluthfi54@gmail.com</p>
          <p className="bg-nav fw-bold">0812-5952-6461</p>
        </Row>
      </Container>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Home;