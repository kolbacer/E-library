import React, {useContext, useState} from 'react';
import {Card, Container, Form, Button, Row} from "react-bootstrap";
import {NavLink, useLocation, useHistory} from "react-router-dom";
import {LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import {fetchReaderBooks, login, registration} from "../http/userAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import DatePicker from "react-datepicker";

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const history = useHistory()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [_login, setLogin] = useState()
    const [password, setPassword] = useState()
    const [name, setName] = useState()
    const [birthDate, setBirthDate] = useState(new Date())
    const [about, setAbout] = useState()

    const [image, setImage] = useState(null)

    const selectImage = e => {
        setImage(e.target.files[0])
    }

    const addUser = () => {
        const formData = new FormData()
        formData.append('login', _login)
        formData.append('password', password)
        formData.append('name', name)
        formData.append('birth_date', birthDate)
        formData.append('about', about)
        formData.append('is_author', false)
        formData.append('is_moder', false)
        formData.append('img', image)

        return formData
    }

    const click = async (e) => {
        e.preventDefault()

        try {
            let data;
            if (isLogin) {
                data = await login(_login, password)
            } else {
                data = await registration(addUser())
            }
            user.setUser({
                name: data.name,
                user_id: data.user_id,
                is_author: data.is_author,
                is_moder: data.is_moder
            })
            user.setIsAuth(true)
            data = await fetchReaderBooks(user._user.user_id)
            user.setBorrowedBooks(data.length)
            history.push(MAIN_ROUTE)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? '??????????????????????' : '??????????????????????'}</h2>
                <Form className="d-flex flex-column" onSubmit={click}>
                    <Form.Control
                        className="mt-3"
                        placeholder="?????????????? ?????? login..."
                        value={_login}
                        onChange={e => setLogin(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="?????????????? ?????? ????????????..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    {!isLogin &&
                        <div>
                            <Form.Control
                                className="mt-3"
                                placeholder="???????? ??????"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <div className="mt-3 d-flex flex-row">
                                <span>???????? ????????????????:</span>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={birthDate}
                                    onChange={(date) => setBirthDate(date)}
                                    className="ms-lg-5"
                                    locale="ru"
                                />
                            </div>
                            <Form.Control
                                as="textarea"
                                value={about}
                                onChange={e => setAbout(e.target.value)}
                                className="mt-3"
                                placeholder="?? ????????"
                            />
                            <div className="mt-3 ms-2 d-flex flex-row">
                                <span>???????? ??????????????:</span>
                                <Form.Control
                                    className="ms-3"
                                    style={{"width": "50%"}}
                                    type="file"
                                    onChange={selectImage}
                                />
                            </div>
                        </div>
                    }
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                ?????? ????????????????? <NavLink to={REGISTRATION_ROUTE}>??????????????????????????????!</NavLink>
                            </div>
                            :
                            <div>
                                ???????? ??????????????? <NavLink to={LOGIN_ROUTE}>??????????????!</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            type="submit"
                        >
                            {isLogin ? '??????????' : '??????????????????????'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;