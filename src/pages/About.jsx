import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../slices/userSlice";

function About() {
    const userRedux = useSelector(selectUser);
    const [user, setUser] = useState(userRedux.creds);
    return (
        <div>
            <p>halo bos {user.name}. welcomeback</p>
            <Link to="/">Go to home page</Link>
        </div>
    );
}

export default About;