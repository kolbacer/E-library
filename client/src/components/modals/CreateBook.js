import React, {useContext, useEffect, useState} from 'react';
import {Modal, Button, Form} from "react-bootstrap";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {createBook, makeAuthorship} from "../../http/bookAPI";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru)


const CreateBook = observer(({show, onHide, username}) => {
    const {user} = useContext(Context)

    const [title, setTitle] = useState('')
    const [authors, setAuthors] = useState('')
    const [genre, setGenre] = useState('')
    const [publisher, setPublisher] = useState('')
    const [publicationDate, setPublicationDate] = useState(new Date())
    const [ageRating, setAgeRating] = useState('')
    const [language, setLanguage] = useState('')
    const [description, setDescription] = useState('')
    const [pagesAmount, setPagesAmount] = useState('')

    const [image, setImage] = useState(null)
    const [file, setFile] = useState(null)

    const [authorCheckbox, setAuthorCheckbox] = useState(user._user.is_author)
    useEffect(() => {
        setAuthorCheckbox(user._user.is_author)
        console.log(username)
        if (username) {setAuthors(username)}
    }, [show]);

    const selectImage = e => {
        setImage(e.target.files[0])
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const addBook = () => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('authors', authors)
        formData.append('genre', genre)
        formData.append('publisher', publisher)
        formData.append('publication_date', publicationDate)
        formData.append('age_rating', ageRating)
        formData.append('language', language)
        formData.append('description', description)
        formData.append('pages_amount', pagesAmount)
        formData.append('approved', false)
        if (image) formData.append('img', image)
        if (file) formData.append('file', file)
        createBook(formData).then(data => {
            if (authorCheckbox) {
                makeAuthorship(user._user.user_id, data.book_id).then().catch(e => {
                    alert(e.message)
                })
            }
            onHide()
            alert("Книга добавлена!")
        }).catch(e => {
            alert(e.response.data.message)
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить книгу
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название книги"
                    />
                    <Form.Control
                        value={authors}
                        onChange={e => setAuthors(e.target.value)}
                        className="mt-3"
                        placeholder="Введите автора (авторов)"
                    />
                    <Form.Control
                        value={genre}
                        onChange={e => setGenre(e.target.value)}
                        className="mt-3"
                        placeholder="Введите жанр"
                    />
                    <Form.Control
                        value={publisher}
                        onChange={e => setPublisher(e.target.value)}
                        className="mt-3"
                        placeholder="Введите издателя"
                    />
                    <div className="mt-3 d-flex flex-row">
                            <span>Дата публикации:</span>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={publicationDate}
                                onChange={(date) => setPublicationDate(date)}
                                className="ms-lg-5"
                                locale="ru"
                            />
                    </div>
                    <Form.Control
                        value={ageRating}
                        onChange={e => setAgeRating(e.target.value)}
                        className="mt-3"
                        placeholder="Введите возрастной рейтинг"
                    />
                    <Form.Control
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="mt-3"
                        placeholder="Введите язык книги"
                    />
                    <Form.Control
                        as="textarea"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="mt-3"
                        placeholder="Описание"
                    />
                    <Form.Control
                        value={pagesAmount}
                        onChange={e => setPagesAmount(e.target.value)}
                        className="mt-3"
                        style={{"width": "30%"}}
                        placeholder="Количество страниц"
                    />

                    <div className="mt-3 ms-2 d-flex flex-row">
                        <span>Загрузите обложку:</span>
                        <Form.Control
                            className="ms-3"
                            style={{"width": "50%"}}
                            type="file"
                            onChange={selectImage}
                        />
                    </div>
                    <div className="mt-3 ms-2 d-flex flex-row">
                        <span>Загрузите книгу:</span>
                        <Form.Control
                            className="ms-3"
                            style={{"width": "50%"}}
                            type="file"
                            onChange={selectFile}
                        />
                    </div>
                    <Form.Check
                        checked={authorCheckbox}
                        className="ms-3"
                        disabled={!user._user.is_moder}
                        type="checkbox"
                        label="Я - автор"
                        onChange={(e) => {setAuthorCheckbox(e.target.checked)}}
                    />
                    <hr/>
                    <div className="mt-3 d-flex flex-row justify-content-end">
                        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                        <Button variant="outline-success" className="ms-3" onClick={addBook}>Добавить</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
});

export default CreateBook;