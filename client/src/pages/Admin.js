import React, {useState} from 'react';
import {Container, Button, Accordion} from "react-bootstrap";
import CreateBook from "../components/modals/CreateBook";
import FindUser from "../components/FindUser";
import {BOOK_ROUTE, USER_ROUTE} from "../utils/consts";
import {getBooksToApprove} from "../http/bookAPI";
import {useHistory} from "react-router-dom";
import {changeRole, getUsersWithRequests, rejectAuthorRequest} from "../http/userAPI";

const Admin = () => {
    const [bookVisible, setBookVisible] = useState(false)

    const [books, setBooks] = useState([])
    const [users, setUsers] = useState([])

    const history = useHistory();

    const fetchBooks = () => {
        getBooksToApprove().then(data => {
            setBooks(data)
        }).catch(e => {
            console.log(e)
        })
    }

    const fetchUsers = () => {
        getUsersWithRequests().then(data => {
            setUsers(data)
        }).catch(e => {
            console.log(e)
        })
    }

    const accept = (user_id) => {
        changeRole(user_id, true).then(data => {
            fetchUsers()
        }).catch(e => {
            console.log(e)
        })
    }

    const reject = (user_id) => {
        rejectAuthorRequest(user_id).then(data => {
            fetchUsers()
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <Container className="d-flex flex-column">
            <h2 className="d-flex justify-content-center mt-3">Панель модератора</h2>
            <FindUser/>
            <Button
                variant={"outline-dark"}
                className="mt-4 p-2"
                onClick={() => setBookVisible(true)}
            >
                Загрузить книгу
            </Button>
            <Accordion className="mt-3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header onClick={fetchBooks}>Книги, ожидающие модерации</Accordion.Header>
                    <Accordion.Body>
                        {books.map((book, index) =>
                            <div className="border border-2 border-info rounded p-1 mt-1 d-flex flex-row justify-content-between"
                                 style={{"cursor": "pointer"}}
                                 onClick={() => history.push(BOOK_ROUTE + '/' + book.book_id)}
                            >
                                <span style={{"text-decoration": "underline"}}>{book.title}</span>
                                <span style={{"color": "gray"}} className="ms-2">{book.authors}</span>
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion className="mt-3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header onClick={fetchUsers}>Заявки от пользователей</Accordion.Header>
                    <Accordion.Body>
                        {users.map((user, index) =>
                            <div className="border border-2 border-info rounded p-1 mt-1 d-flex justify-content-between">
                                <div className="mt-3">
                                    <span
                                        style={{"text-decoration": "underline", "cursor": "pointer"}}
                                        onClick={() => history.push(USER_ROUTE + '/' + user.user_id)}
                                    >
                                        {user.name}
                                    </span>
                                    <span className="ms-2">хочет стать автором</span>
                                </div>
                                <div className="d-flex flex-row me-3">
                                    <Button variant={"outline-success"} className="mt-2 mb-2" onClick={() => accept(user.user_id)}>
                                        Принять
                                    </Button>
                                    <Button variant={"outline-danger"} className="mt-2 ms-3 mb-2" onClick={() => reject(user.user_id)}>
                                        Отклонить
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <CreateBook show={bookVisible} onHide={() => setBookVisible(false)}/>
        </Container>
    );
};

export default Admin;