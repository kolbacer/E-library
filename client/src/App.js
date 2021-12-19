import React, {useContext, useEffect, useState} from "react";
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check, fetchReaderBooks} from "./http/userAPI";
import {Spinner} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)
    const { isLoading } = useAuth0();

    useEffect(() => {
        check().then(data => {
            user.setUser({
                name: data.name,
                user_id: data.user_id,
                is_author: data.is_author,
                is_moder: data.is_moder
            })
            user.setIsAuth(true)
            fetchReaderBooks(data.user_id).then(data => {
                user.setBorrowedBooks(data.length)
            })
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation={"grow"}/>
            </div>
        );
    }

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
