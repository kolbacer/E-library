import React, {useContext} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import {Nav, Container} from "react-bootstrap";
import {NavLink, useHistory} from "react-router-dom";
import {ADMIN_ROUTE, MAIN_ROUTE, USER_ROUTE} from "../utils/consts";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import {useAuth0} from "@auth0/auth0-react";

const NavBar = observer(() => {
    const {user} = useContext(Context)
    const history = useHistory()
    const { isAuthenticated } = useAuth0();

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <NavLink style={{color: "white"}} to={MAIN_ROUTE}>E-library</NavLink>
                {isAuthenticated ?
                    <Nav className="ms-auto" style={{color: 'white'}}>
                        {user._user.is_moder &&
                        <Button
                            variant={"outline-light"}
                            onClick={() => history.push(ADMIN_ROUTE)}
                        >
                            Панель модератора
                        </Button>
                        }
                        <Button
                            variant={"outline-light"}
                            onClick={() => {
                                history.push(USER_ROUTE + '/' + user._user.user_id )
                            }}
                            className="ms-2"
                        >
                            Личный кабинет
                        </Button>
                        <LogoutButton />
                    </Nav>
                    :
                    <Nav className="ms-auto" style={{color: 'white'}}>
                        <LoginButton />
                    </Nav>
                }
            </Container>
        </Navbar>
    );
});

export default NavBar;