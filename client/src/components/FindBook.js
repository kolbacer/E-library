import React, {useContext, useState} from 'react';
import {Button, Form} from "react-bootstrap";
import {Context} from "../index";

const FindUser = () => {
    let searchBar = {
        width: '40%',
        "padding-right": '15px',
        "padding-left": '15px',
        "margin-right": 'auto',
        "margin-left": 'auto',
        "margin-top": '7px'
    }

    const {library} = useContext(Context)

    const [field, setField] = useState('')
    const [option, setOption] = useState('title')

    const searchBook = (e) => {
        e.preventDefault();

        if (field === '') {
            library.setFilterAttribute('')
            library.setFilterText('')
            library.setPage(1)
        } else {
            library.setFilterAttribute(option)
            library.setFilterText(field)
            library.setPage(1)
        }
    }

    return (
        <div>
            <Form style={searchBar} onSubmit={searchBook}>
                <div className="d-flex flex-row">
                    <Form.Control
                        type="text"
                        value={field}
                        onChange={e => setField(e.target.value)}
                        placeholder="Найти книгу..."
                    />
                    <Form.Select size="sm" className="ms-2" style={{"width": "25%"}} onChange={e => setOption(e.target.value)}>
                        <option value="title">По названию</option>
                        <option value="genre">По жанру</option>
                        <option value="authors">По автору</option>
                        <option value="book_id">По id</option>
                    </Form.Select>
                    <Button variant="primary" className="ms-2" type="submit">Поиск</Button>
                </div>
            </Form>
        </div>
    );
};

export default FindUser;