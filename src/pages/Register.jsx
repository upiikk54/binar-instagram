import { useRef, useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const nameField = useRef("");
    const emailField = useRef("");
    const roleField = useRef("");
    const passwordField = useRef("");
    const [pictureField, setPictureField] = useState();

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const onRegister = async (e) => {
        e.preventDefault();

        try {
            const userToRegisterPayload = new FormData();
            userToRegisterPayload.append("name", nameField.current.value);
            userToRegisterPayload.append("email", emailField.current.value);
            userToRegisterPayload.append("role", roleField.current.value);
            userToRegisterPayload.append("password", passwordField.current.value);
            userToRegisterPayload.append("picture", pictureField);

            const registerRequest = await axios.post(
                "https://binar-instagram-clone.herokuapp.com/auth/register",
                userToRegisterPayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
            );

            const registerResponse = registerRequest.data;

            if (registerResponse.status) navigate("/login");
        } catch (err) {
            console.log(err);
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    return (
        <div className="bg-allform">
            <Card style={{ width: '60rem' }} className="position-absolute top-50 start-50 translate-middle border-light radius">
                <Card.Body className="bg-form radius shadow-lg">
                    <div className="row">
                        <div className="col">
                            <img src="./images/register.png" className="img-register" alt="" />
                        </div>
                        <div className="col">
                            <h1 className="mb-3 text-light">Registrasi Account</h1>
                            <Form onSubmit={onRegister} className="loginForm">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Role</Form.Label>
                                    <Form.Select ref={roleField}>
                                        <option>Pilih Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3 loginGroup">
                                    <input type="text"
                                        ref={nameField}
                                        required />
                                    <label>Nama</label>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={emailField}
                                        placeholder="Masukkan Email"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        ref={passwordField}
                                        placeholder="Masukkan Password"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Picture</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setPictureField(e.target.files[0])}
                                    />
                                </Form.Group>
                                <p className="text-light">
                                    Sudah punya akun? Silakan <Link to="/login">Login</Link>
                                </p>
                                {errorResponse.isError && (
                                    <Alert variant="danger">{errorResponse.message}</Alert>
                                )}
                                <Button className="w-100" type="submit">
                                    Daftar
                                </Button>
                            </Form>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}