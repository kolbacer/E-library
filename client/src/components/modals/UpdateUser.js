import React, {useContext, useEffect, useState} from 'react';
import {Modal, Button, Form} from "react-bootstrap";
import {updateUser} from "../../http/userAPI";
import {Context} from "../../index";
import DatePicker from "react-datepicker";

const UpdateUser = ({show, onHide, confirmed, user_birth_date}) => {
    const {user} = useContext(Context)

    useEffect(() => {
        if (user_birth_date) {
            setBirthDate(new Date(user_birth_date))
        }
    }, [user_birth_date]);

    const [name, setName] = useState()
    const [birthDate, setBirthDate] = useState(new Date())
    const [about, setAbout] = useState()

    const [image, setImage] = useState(null)

    const selectImage = e => {
        setImage(e.target.files[0])
    }

    const confirmUpdate = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('user_id', user._user.user_id)
        if (name) formData.append('name', name)
        if (birthDate) formData.append('birth_date', birthDate)
        if (about) formData.append('about', about)
        if (image) formData.append('img', image)

        try {
            await updateUser(formData)
            onHide()
            confirmed()
            alert("Данные обновлены!")
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            //size="lg"
            dialogClassName="modal-30w"
            centered
            onSubmit={confirmUpdate}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Редактировать профиль
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        className="mt-3"
                        placeholder="Ваше имя"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <div className="mt-3 d-flex flex-row">
                        <span>Дата рождения:</span>
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
                        placeholder="О себе"
                    />
                    <div className="mt-3 ms-2 d-flex flex-row">
                        <span>Фото профиля:</span>
                        <Form.Control
                            className="ms-3"
                            style={{"width": "50%"}}
                            type="file"
                            onChange={selectImage}
                        />
                    </div>
                    <hr/>
                    <div className="mt-3 d-flex flex-row justify-content-end">
                        <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                        <Button variant="outline-success" className="ms-3" type="submit">Принять</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateUser;