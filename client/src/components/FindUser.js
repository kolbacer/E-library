import React, {useState} from 'react';
import {fetchById, fetchByName} from "../http/userAPI";
import {USER_ROUTE} from "../utils/consts";
import {Button, Form, ListGroup} from "react-bootstrap";
import { useHistory } from "react-router-dom";

const FindUser = () => {
    let searchBar = {
        width: '40%',
        "padding-right": '15px',
        "padding-left": '15px',
        "margin-right": 'auto',
        "margin-left": 'auto',
        "margin-top": '15px'
    }

    const [field, setField] = useState('')
    const [option, setOption] = useState('name')
    const history = useHistory();
    const [users, setUsers] = useState([])

    const searchUser = (e) => {
        e.preventDefault();

        if (option === "id") {
            fetchById(field)
                .then(r => {
                    setUsers(r)
                })
                .catch(e => {
                    alert(e.message)
                })
        } else if (option === "name") {
            fetchByName(field)
                .then(r => {
                    setUsers(r)
                })
                .catch(e => {
                    alert(e.message)
                })
        }
    }

    return (
        <div>
            <Form style={searchBar} onSubmit={searchUser}>
                <div className="d-flex flex-row">
                    <Form.Control
                        type="text"
                        value={field}
                        onChange={e => setField(e.target.value)}
                        placeholder="Найти пользователя..."
                    />
                    <Button variant="primary" className="ms-2" type="submit">Поиск</Button>
                </div>
                <Form.Select size="sm" className="mt-1" style={{"width": "30%"}} onChange={e => setOption(e.target.value)}>
                    <option value="name">По имени</option>
                    <option value="id">По id</option>
                </Form.Select>
            </Form>
            <div className="mt-3 d-flex justify-content-center">
                <div style={{"max-width": "75%", "min-width": "700px"}}>
                    <ListGroup>
                        {users.map((user, index) =>
                            <ListGroup.Item
                                key={user.user_id}
                                timeout={500}
                                classNames="user"
                                variant="primary"
                                action
                                onClick={() => history.push(USER_ROUTE + '/' + user.user_id)}
                            >
                                <div className="d-flex flex-row justify-content-between">
                                    <span>{user.name}</span>
                                    <div className="d-flex flex-row">
                                        {
                                            user.is_author &&
                                            <span style={{color: "blue"}} className="ms-1">Автор</span>
                                        }
                                        {
                                            user.is_moder &&
                                            <span style={{color: "red"}} className="ms-1">Модератор</span>
                                        }
                                    </div>
                                    <span className="ms-1">{user.user_id}</span>
                                </div>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </div>
            </div>
        </div>
    );
};

export default FindUser;