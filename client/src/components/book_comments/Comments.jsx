import React, {useContext, useEffect, useRef, useState} from 'react';
import {useFetching} from "./hooks/useFetching";
import {getPageCount} from "../../utils/pages";
import CommentList from "./CommentList";
import {useObserver} from "./hooks/useObserver";
import {Button, Container, Form} from "react-bootstrap";
import {createComment, fetchComments} from "../../http/CommetService";
import {Context} from "../../index";

function Comments({book_id}) {
    const {user} = useContext(Context)
    const [posts, setPosts] = useState([])

    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(2);
    const [page, setPage] = useState(1);
    const lastElement = useRef()

    const [created, setCreated] = useState(0)
    const [comment, setComment] = useState('')

    const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
        const response = await fetchComments(book_id, page, limit);
        console.log(response)
        setPosts([...posts, ...response.rows])
        const totalCount = response.count
        console.log(totalCount)
        setTotalPages(getPageCount(totalCount, limit));
    })

    useObserver(lastElement, page < totalPages, isPostsLoading, () => {
        setPage(page + 1);
    })

    useEffect(() => {
        setPosts([])
        setLimit(2)
        setPage(1)
        fetchPosts(limit, page)
    },[created])

    useEffect(() => {
        fetchPosts(limit, page)
    }, [page, limit])

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const addComment = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('book_id', book_id)
        formData.append('user_id', user._user.user_id)
        formData.append('comment', comment)
        createComment(formData).then(data => {
            setCreated(created+1)
            setComment('')
        })
    }

    return (
        <Container className="App" style={{maxWidth: "50%"}}>
            <h1 style={{"text-align": "center"}}>Комментарии</h1>
            <Form onSubmit={addComment}>
                <div className="d-flex flex-row mb-3">
                    <Form.Control
                        as="textarea"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Комментарий"
                    />
                    <Button variant="outline-success" className="ms-2" type="submit">Добавить</Button>
                </div>
            </Form>
            {postError &&
            <h1>Произошла ошибка ${postError}</h1>
            }
            <CommentList remove={removePost} posts={posts} />
            <div ref={lastElement} style={{height: 20}}/>
            {isPostsLoading &&
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}>Loading...</div>
            }
        </Container>
    );
}

export default Comments;