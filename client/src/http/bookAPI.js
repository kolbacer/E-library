import {$authHost, $host} from "./index";

export const createBook = async (book) => {
    const {data} = await $authHost.post('book', book)
    return data
}

export const fetchBooks = async (page, limit = 5) => {
    const {data} = await $host.get('book', {params: {
        page,limit
        }})
    return data
}

export const fetchByAttribute = async (attribute, text, page, limit) => {
    try {
        const res = await $authHost.post('book/getbyattribute', {text, attribute, page, limit})
        return res.data
    } catch (e) {
        throw {status: e.response.status, message: e.response.data}
    }
}

export const fetchOneBook = async (id) => {
    const {data} = await $authHost.get('book/' + id)
    return data
}

export const fetchBookInfo = async (id) => {
    const {data} = await $authHost.get('book/info',{params: {id}})
    return data
}

export const makeRate = async (rate) => {
    const {data} = await $authHost.post('book/rate', rate)
    return data
}

export const deleteRate = async (user_id, book_id) => {
    const {data} = await $authHost.delete('book/deleterate', {params: {user_id, book_id}})
    return data
}

export const getRate = async (user_id, book_id) => {
    const {data} = await $authHost.get('book/getrate', {params: {user_id, book_id}})
    return data
}

export const getRating = async (book_id) => {
    const {data} = await $authHost.get('book/getrating', {params: {book_id}})
    return data
}

export const checkRent = async (user_id, book_id) => {
    const {data} = await $authHost.get('book/checkrent', {params: {user_id, book_id}})
    return data
}

export const rentBook = async (user_id, book_id) => {
    const {data} = await $authHost.post('book/rentbook', {user_id, book_id})
    return data
}

export const deleteRent = async (user_id, book_id) => {
    const {data} = await $authHost.delete('book/deleterent', {params: {user_id, book_id}})
    return data
}

export const approveBook = async (book_id) => {
    const {data} = await $authHost.put('book/approvebook', {book_id})
    return data
}

export const deleteBook = async (book_id) => {
    const {data} = await $authHost.delete('book/deletebook', {params: {book_id}})
    return data
}

export const getBooksToApprove = async () => {
    const {data} = await $authHost.get('book/bookstoapprove', )
    return data
}

export const makeAuthorship = async (user_id, book_id) => {
    const {data} = await $authHost.post('book/authorship', {user_id, book_id})
    return data
}
export const setBookmark = async (user_id, book_id, bookmark) => {
    const {data} = await $authHost.put('book/makebookmark', {user_id, book_id, bookmark})
    return data
}

export const getBookmark = async (user_id, book_id) => {
    const {data} = await $authHost.get('book/getbookmark', {params: {user_id, book_id}})
    return data
}
