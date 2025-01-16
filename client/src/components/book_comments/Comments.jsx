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

    const [totalPages, setTotalPages] = useState(0)
    const [pageState, setPageState] = useState({page: 1, limit: 2, created: false})
    const lastElement = useRef()

    const [comment, setComment] = useState('')

    const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page, created) => {
        const response = await fetchComments(book_id, page, limit)
        const resultPosts = created ? response.rows : [...posts, ...response.rows]
        setPosts(resultPosts)
        const totalCount = response.count
        setTotalPages(getPageCount(totalCount, limit));
    })

    useObserver(lastElement, pageState.page < totalPages, isPostsLoading, () => {
        setPageState({
            page: pageState.page + 1,
            limit: pageState.limit,
            created: false
        });
    })

    useEffect(() => {
        fetchPosts(pageState.limit, pageState.page, pageState.created)
    }, [pageState])

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
            setPageState({page: 1, limit: 2, created: true})
            setComment('')
        }).catch(err => {
            console.error(err);
            alert(err.response?.data?.message || err.message || "Не удалось добавить комментарий");
        });
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