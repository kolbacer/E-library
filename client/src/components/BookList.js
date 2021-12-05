import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import BookItem from "./BookItem";

const BookList = observer(() => {
    const {library} = useContext(Context)
    return (
        <Row className="d-flex ms-5">
            {library.books.map(book =>
                <BookItem key={book.book_id} book={book}/>
            )}
        </Row>
    );
});

export default BookList;