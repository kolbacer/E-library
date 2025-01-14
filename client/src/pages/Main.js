import React, {useContext, useEffect, useState} from 'react';
import BookList from "../components/BookList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchBooks, fetchByAttribute} from "../http/bookAPI";
import Pages from "../components/Pages";
import FindBook from "../components/FindBook";
import '../styles/style.css';
import {useAuth0} from "@auth0/auth0-react";
import {fetchReaderBooks, login_or_registration} from "../http/userAPI";
import {Spinner} from "react-bootstrap";

const Main = observer(() => {
    const {user, library} = useContext(Context)
    const book_limit = 12
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(true)

    useEffect(async () => {

        if (isAuthenticated && !user.isAuth) {
            getAccessTokenSilently().then(data => {
                localStorage.setItem('token', data)

                login_or_registration().then(data => {
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
                })

            }).catch(err => {
                console.log('cannot get token')
            })
        }

        fetchBooks(1, book_limit)
            .then(data => {
                library.setBooks(data.rows)
                library.setTotalCount(data.count)
                library.setLimit(book_limit)
            })
            .catch(err => {
                console.log("can't download books")
                console.log(err)
            }).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        setLoading(true)

        if (library.filterAttribute === '') {
            fetchBooks(library.page, book_limit)
                .then(data => {
                    library.setBooks(data.rows)
                    library.setTotalCount(data.count)
                    library.setLimit(book_limit)
                })
                .catch(err => {
                    console.log("can't download books")
                    console.log(err)
                }).finally(() => setLoading(false))
        }
        else {
            fetchByAttribute(library.filterAttribute, library.filterText, library.page, book_limit)
                .then(data => {
                    library.setBooks(data.rows)
                    library.setTotalCount(data.count)
                    library.setLimit(book_limit)
                })
                .catch(e => {
                    alert(e.message)
                }).finally(() => setLoading(false))
        }
    }, [library.page, library._filterText])

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="d-flex flex-column">
                    <div
                        style={{color: "blue", 'font-family': 'Arial, sans-serif', 'font-size': '18pt'}}
                    >
                        Книги грузятся!
                    </div>
                    <Spinner className="ms-5 mt-2" animation={"grow"}/>
                </div>
            </div>
        )
    }

    return (
        <div>
            <FindBook/>
            <div style={{"height": "770px", "max-width": "50%", "margin": "auto"}}>
                <BookList/>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <Pages/>
            </div>
        </div>
    );
});

export default Main;