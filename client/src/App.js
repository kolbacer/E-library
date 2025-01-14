import React from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {observer} from "mobx-react-lite";
import {Spinner} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";

const App = observer(() => {
    const { isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation={"grow"}/>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    );
})

export default App;
