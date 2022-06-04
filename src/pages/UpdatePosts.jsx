import { useEffect, useRef, useState } from "react";
import { Form, Container, Button, Alert, Row } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function UpdatePosts() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState([]);

    const titleField = useRef("");
    const descriptionField = useRef("");
    const [picturePost, setPicturePostField] = useState();

    const [errorResponse, setErrorResponse] = useState({
        isError: false,
        message: "",
    });

    const onupdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const userToUpdatePayload = new FormData();
            userToUpdatePayload.append("title", titleField.current.value);
            userToUpdatePayload.append("description", descriptionField.current.value);
            userToUpdatePayload.append("picture", picturePost);

            const updateRequest = await axios.put(
                `http://localhost:8087/posts/${id}`, userToUpdatePayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
            );

            const updateResponse = updateRequest.data;

            if (updateResponse.status) navigate("/");
        } catch (err) {
            const response = err.response.data;

            setErrorResponse({
                isError: true,
                message: response.message,
            });
        }
    };

    const getPosts = async () => {
        try {

            const responsePosts = await axios.get(`http://localhost:8087/api/posts/${id}`)

            const dataPosts = await responsePosts.data.data.getdata;

            setData(dataPosts)
            console.log(dataPosts);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPosts();
    }, [])

    console.log(data);

    return (
        <Container className="my-5">
            <h1 className="mb-3 text-center">update Postingan</h1>
            <Form onSubmit={onupdate}>
                <Form.Group className="mb-3">
                    <Form.Label>title</Form.Label>
                    <Form.Control
                        type="text"
                        ref={titleField}
                        defaultValue={data.title}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>description</Form.Label>
                    <Form.Control
                        type="text"
                        ref={descriptionField}
                        defaultValue={data.description}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Row>
                        <img src={`http://localhost:8087/public/files/${data.picture}`} alt="" style={{ height: "250px", width:"250px" }} />
                        <Form.Label className="mt-3">Picture</Form.Label>
                    </Row>
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
        </Container>
    )
}
