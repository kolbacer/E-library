import React from 'react';
import {Button} from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button variant={"outline-light"} onClick={() => loginWithRedirect()}>
            Авторизация
        </Button>
    );
};

export default LoginButton;