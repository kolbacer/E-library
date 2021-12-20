import {$authHost} from "./index";

export const login_or_registration = async () => {
    const {data} = await $authHost.get('api/user/login_or_reg')
    return data
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    return data
}

export const updateUser = async (user) => {
    const {data} = await $authHost.put('api/user/update',user)
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

export const getUsersWithRequests = async () => {
    const {data} = await $authHost.get('api/user/authorrequests', )
    return data
}