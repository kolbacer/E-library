import React, {useContext, useState} from 'react';
import {Modal, Button, Form} from "react-bootstrap";
import {changePassword} from "../../http/userAPI";
import {Context} from "../../index";

const ChangePassword = ({show, onHide}) => {
    const {user} = useContext(Context)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const confirmPassword = (e) => {
        e.preventDefault()

        changePassword(user._user.user_id, oldPassword, newPassword).then(data => {
            alert("Пароль изменен")
            onHide()
        }).catch(e => {
            alert(e.response.data.message)
        }).finally(() => {
            setOldPassword('')
            setNewPassword('')
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="sm"
            centered
            onSubmit={confirmPassword}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Сменить пароль
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        type="password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        placeholder={"Введите старый пароль"}
                    />
                    <Form.Control
                        type="password"
                        className="mt-2"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder={"Введите новый пароль"}
                    />
                    <hr/>
                    <div className="d-flex flex-row justify-content-end">
                        <Button variant="outline-danger" className="me-2" onClick={onHide}>Закрыть</Button>
                        <Button variant="outline-success" type="submit">Сменить</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePassword;