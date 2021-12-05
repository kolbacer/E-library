import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (user) => {
    const {data} = await $host.post('api/user/registration',user)
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (login, password) => {
    const {data} = await $host.post('api/user/login',{login, password})
    localStorage.setItem('token', data.token)
    console.log(data.token)
    return data
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return data
}

export const fetchUsers = async (page, limit = 5) => {
    const {data} = await $authHost.get('api/user', {params: {
            page,limit
        }})
    return data
}

export const fetchOneUser = async (id) => {
    const {data} = await $authHost.get('api/user/' + id)
    return data
}
/*
export const fetchByLogin = async (login) => {
    try {
        const res = await $authHost.post('api/user/getbylogin', {login})
        return res.data
    } catch (e) {
        //alert(e.response.data)
        throw {status: e.response.status, message: e.response.data}
    }
}
*/
export const fetchById = async (user_id) => {
    try {
        const res = await $authHost.post('api/user/getbyid', {user_id})
        return res.data
    } catch (e) {
        throw {status: e.response.status, message: e.response.data}
    }
}

export const fetchByName = async (name) => {
    try {
        const res = await $authHost.post('api/user/getbyname', {name})
        return res.data
    } catch (e) {
        throw {status: e.response.status, message: e.response.data}
    }
}

export const fetchReaderBooks = async (user_id) => {
    const {data} = await $authHost.get('api/user/getreaderbooks', {params: {user_id}})
    return data
}

export const fetchAuthorBooks = async (user_id) => {
    const {data} = await $authHost.get('api/user/getauthorbooks', {params: {user_id}})
    return data
}

export const changeRole = async (user_id, is_author, is_moder) => {
    const {data} = await $authHost.put('api/user/changerole', {user_id, is_author, is_moder})
    return data
}

export const makeAuthorRequest = async (user_id) => {
    const {data} = await $authHost.put('api/user/authorrequest', {user_id})
    return data
}

export const rejectAuthorRequest = async (user_id) => {
    const {data} = await $authHost.put('api/user/rejectauthor', {user_id})
    return data
}

export const changePassword = async (user_id, old_password, new_password) => {
    const {data} = await $authHost.put('api/user/changepassword', {user_id, old_password, new_password})
    return data
}

export const getUsersWithRequests = async () => {
    const {data} = await $authHost.get('api/user/authorrequests', )
    return data
}