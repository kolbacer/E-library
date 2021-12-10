import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Dropdown, Form, Image as IMG, Row} from 'react-bootstrap';
import {useParams} from "react-router-dom";
import {BOOK_ROUTE} from "../utils/consts";
import {
    changeRole,
    fetchAuthorBooks,
    fetchOneUser,
    fetchReaderBooks,
    makeAuthorRequest
} from "../http/userAPI";
import {Context} from "../index";
import { useHistory } from "react-router-dom";
import FindUser from "../components/FindUser";
import {observer} from "mobx-react-lite";
import ChangePassword from "../components/modals/ChangePassword";
import CreateBook from "../components/modals/CreateBook";

import default_user_pic from '../static/default_user.png';

const UserPage = observer( () => {
    const {user} = useContext(Context)

    const [showedUser, setShowedUser] = useState({})
    const [infoChanged, setInfoChanged] = useState(false)

    const [authorCheckbox, setAuthorCheckbox] = useState(false)
    const [moderCheckbox, setModerCheckbox] = useState(false)

    let {id} = useParams()
    useEffect(() => {
        fetchOneUser(id).then(data => {
            setShowedUser(data)
            setAuthorCheckbox(data.is_author)
            setModerCheckbox(data.is_moder)
        })
    }, [id, infoChanged])

    const history = useHistory();
    useEffect(() => {
        id = history.location.pathname.split('/')[2]
    }, [history.location.pathname]);

    let userInfo1 = {
        'font-family': 'Arial, sans-serif',
        'font-size': '18pt',
        'font-weight': 'bold'
    }

    let userInfo2 = {
        'font-family': 'Arial, sans-serif',
        'font-size': '18pt',
    }

    const [readerBooks, setReaderBooks] = useState([])
    const [authorBooks, setAuthorBooks] = useState([])

    const getReaderBooks = () => {
        fetchReaderBooks(user._user.user_id).then(
            data => {
                setReaderBooks(data)
            })
            .catch(e => {
                alert(console.log(e))
            })
    }

    const getAuthorBooks = () => {
        fetchAuthorBooks(showedUser.user_id).then(
            data => {
                setAuthorBooks(data)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const giveRole = (e) => {
        e.preventDefault()

        changeRole(showedUser.user_id, authorCheckbox, moderCheckbox).then(data => {
                alert("Роли применены!")
                setInfoChanged(!infoChanged)
            }).catch(e => {
                console.log(e)
        })
    }

    const sendAuthorRequest = () => {
        makeAuthorRequest(user._user.user_id).then(data => {
            setInfoChanged(!infoChanged)
        }).catch(e => {
            console.log(e)
        })
    }

    const [passwordVisible, setPasswordVisible] = useState(false)
    const [bookVisible, setBookVisible] = useState(false)

    return (
        <div>
            <FindUser/>
            <h2 className="d-flex justify-content-center mt-3">{showedUser.name}</h2>
            <Row className="d-flex flex-row">
                <Col md={4} className="d-flex justify-content-center">
                    {(!showedUser.imgdata) ?
                        <IMG width={300} height={300} src={default_user_pic}/>
                        :
                        <IMG width={300} height={300} src={'data:image;base64,' + showedUser.imgdata} alt="Can't download picture" /> // data:image/jpeg;base64,
                    }
                </Col>
                <Col md={4} className="d-flex flex-column">
                    <div className="d-flex flex-row">
                        <span style={userInfo1}>Имя: </span>
                        <span style={userInfo2}>{showedUser.name}</span>
                    </div>
                    <div className="d-flex flex-row">
                        <span style={userInfo1}>Дата рождения: </span>
                        <span style={userInfo2}>{showedUser.birth_date}</span>
                    </div>
                    <div className="d-flex flex-column">
                        <span style={userInfo1}>О себе: </span>
                        <span style={userInfo2}>{showedUser.about}</span>
                    </div>
                    {
                        showedUser.is_author &&
                        <Dropdown className="mt-2 mb-2 d-flex flex-column" onClick={getAuthorBooks}>
                            <Dropdown.Toggle>Книги автора</Dropdown.Toggle>
                            <Dropdown.Menu style={{"width": "100%"}}>
                                {
                                    (authorBooks.length === 0)
                                        ? <div style={{"text-align": "center"}}> Нет книг </div>
                                        : <div>
                                            {authorBooks.map((book, index) =>
                                                <Dropdown.Item
                                                    key={book.book_id}
                                                    onClick={() => history.push(BOOK_ROUTE + '/' + book.book_id)}
                                                >
                                                    <div className="d-flex flex-row justify-content-between">
                                                        <span>{book.title}</span>
                                                        {
                                                            (book.authors)
                                                                ? <span style={{color: "gray"}}>{book.authors}</span>
                                                                : <span style={{color: "gray"}}>Неизвестен</span>
                                                        }

                                                    </div>
                                                </Dropdown.Item>
                                            )}
                                        </div>
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Col>
                <Col md={4} className="d-flex flex-column align-items-center">
                    {
                        (user._user.user_id === showedUser.user_id) &&
                        <div className="border border-3 border-primary rounded p-3 bg-light">
                            <div className="d-flex flex-row">
                                <span style={userInfo1}>Логин: </span>
                                <span style={userInfo2}>{showedUser.login}</span>
                            </div>
                            <span
                                style={{color: "red", 'font-family': 'Arial, sans-serif', 'font-size': '18pt', 'text-decoration': 'underline', 'cursor': 'pointer'}}
                                onClick={() => {setPasswordVisible(true)}}
                            >
                                Сменить пароль
                            </span>
                        </div>
                    }
                    {
                        showedUser.is_author &&
                        <span style={{color: "blue", 'font-family': 'Arial, sans-serif', 'font-size': '20pt'}} className="mt-3">Автор</span>
                    }
                    {
                        showedUser.is_moder &&
                        <span style={{color: "red", 'font-family': 'Arial, sans-serif', 'font-size': '20pt'}}>Модератор</span>
                    }
                    {
                        (user._user.is_moder) &&
                        (!showedUser.is_moder || (user._user.user_id === showedUser.user_id)) &&
                        <Dropdown className="d-inline mx-2 mt-2 mb-2 d-flex flex-column" autoClose="outside">
                            <Dropdown.Toggle id="dropdown-autoclose-outside" variant="warning">
                                Назначить роль
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Form className="d-flex flex-column" onSubmit={giveRole}>
                                    <Form.Check
                                        checked={authorCheckbox}
                                        className="ms-3"
                                        disabled={false}
                                        type="checkbox"
                                        label="Автор"
                                        onChange={(e) => {setAuthorCheckbox(e.target.checked)}}
                                    />
                                    <Form.Check
                                        checked={moderCheckbox}
                                        className="ms-3"
                                        disabled={user._user.user_id === showedUser.user_id}
                                        type="checkbox"
                                        label="Модератор"
                                        onChange={(e) => {setModerCheckbox(e.target.checked)}}
                                    />
                                    <Button variant="success" type="submit" className="ms-2 me-2 mt-1">
                                        Принять
                                    </Button>
                                </Form>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Col>
            </Row>
            <hr className="ms-5 me-5" />
            {
                (user._user.user_id === showedUser.user_id) &&
                <Row className="d-flex flex-row mt-3">
                    <Col className="d-flex flex-column ms-5">
                        <div>
                            <div className="d-flex flex-row">
                                <span style={userInfo1}>Книг в аренде: </span>
                                <span style={userInfo2} className="ms-1">{user.borrowedBooks}</span>
                                <span style={userInfo2} className="ms-2">(доступно еще: {user.maxBooks - user.borrowedBooks})</span>
                            </div>
                            <Dropdown className="mt-2 mb-2 d-flex flex-column" onClick={getReaderBooks}>
                                <Dropdown.Toggle variant="success">Мои книги</Dropdown.Toggle>
                                <Dropdown.Menu style={{"width": "100%"}}>
                                    {
                                        (readerBooks.length === 0)
                                            ? <div style={{"text-align": "center"}}> Нет книг </div>
                                            : <div>
                                                {readerBooks.map((book, index) =>
                                                    <Dropdown.Item
                                                        key={book.book_id}
                                                        onClick={() => history.push(BOOK_ROUTE + '/' + book.book_id)}
                                                    >
                                                        <div className="d-flex flex-row justify-content-between">
                                                            <span>{book.title}</span>
                                                            {
                                                                (book.authors)
                                                                    ? <span style={{color: "gray"}}>{book.authors}</span>
                                                                    : <span style={{color: "gray"}}>Неизвестен</span>
                                                            }

                                                        </div>
                                                    </Dropdown.Item>
                                                )}
                                            </div>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Col>
                    <Col className="d-flex flex-column align-items-center">
                        <div>
                            {(!showedUser.is_author && !showedUser.author_request) ? (
                                    <span
                                        style={{color: "blue", 'font-family': 'Arial, sans-serif', 'font-size': '20pt', 'text-decoration': 'underline', 'cursor': 'pointer'}}
                                        onClick={sendAuthorRequest}
                                    >
                                    Оставить заявку на роль автора
                                    </span>
                                ) :
                                (showedUser.author_request) ? (
                                    <span style={userInfo2} className="mt-1">//Заявка оставлена//</span>
                                ) : (
                                    <Button
                                        variant="primary"
                                        onClick={() => {setBookVisible(true)}}
                                        className="ms-2"
                                    >
                                        Загрузить книгу
                                    </Button>
                                )
                            }
                        </div>
                    </Col>
                </Row>
            }
            <ChangePassword show={passwordVisible} onHide={() => setPasswordVisible(false)}/>
            <CreateBook show={bookVisible} onHide={() => setBookVisible(false)} username={showedUser.name}/>
        </div>
    );
});

export default UserPage;