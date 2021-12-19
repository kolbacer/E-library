import React, {useContext} from 'react';
import {Button} from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import {Context} from "../index";

const LogoutButton = () => {
    const { logout } = useAuth0();
    const {user} = useContext(Context)

    return (
        <Button
            variant={"outline-light"}
            onClick={() => {
                logout()
                user.setUser({})
                user.setIsAuth(false)
                localStorage.setItem('token', null)
            }}
            className="ms-2"
        >
            Выйти
        </Button>
    );
};

export default LogoutButton;