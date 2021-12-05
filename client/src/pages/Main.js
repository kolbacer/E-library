import React, {useContext, useEffect} from 'react';
import BookList from "../components/BookList";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {fetchBooks, fetchByAttribute} from "../http/bookAPI";
import Pages from "../components/Pages";
import FindBook from "../components/FindBook";
import '../styles/style.css';

const Main = observer(() => {
    const {library} = useContext(Context)
    const book_limit = 12

    useEffect(() => {
        fetchBooks(1, book_limit)
            .then(data => {
                library.setBooks(data.rows)
                library.setTotalCount(data.count)
                library.setLimit(book_limit)
            })
            .catch(err => {
                console.log("can't download books")
                console.log(err)
            })
    }, [])

    useEffect(() => {
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
                })
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
                })
        }
    }, [library.page, library._filterText])

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