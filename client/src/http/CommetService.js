import {$authHost, $host} from "./index";

export const createComment = async (comment) => {
    const {data} = await $authHost.post('api/comment', comment)
    return data
}

export const fetchComments = async (book_id, page = 1, limit = 2) => {
    const {data} = await $host.get('api/comment', {params: {
            page,limit,
            book_id
        }})
    return data
}

export const deleteComment = async (comment_id) => {
    const {data} = await $authHost.delete('api/comment', {params: {
            comment_id
        }})
    return data
}