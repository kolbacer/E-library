import React, {useContext} from 'react';
import {Link} from "react-router-dom"
import {Button} from "react-bootstrap";
import {USER_ROUTE} from "../../utils/consts";
import {Context} from "../../index";
import {deleteComment} from "../../http/CommetService";

const CommentItem = (props) => {
    const {user} = useContext(Context)

    const delComment = () => {

        deleteComment(props.post.id)
            .then(r => {
                props.remove(props.post)
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <div className="post border border-2 border-info rounded p-2 mt-1">
            <div className="post__content">
                <div className="d-flex flex-row justify-content-between">
                    <Link
                        style={{color: "black", 'font-family': 'Arial, sans-serif', 'font-size': '16pt'}}
                        to={`${USER_ROUTE}/${props.post.user_id}`}
                    >
                        {props.post.username}
                    </Link>
                    <span>{props.post.timestamp}</span>
                </div>
                <div>
                    {props.post.text}
                </div>
                {
                    ((user._user.user_id === props.post.user_id) || (user._user.is_moder)) &&
                    <div className="d-flex justify-content-end">
                        <Button variant={"danger"} onClick={delComment}>
                            Удалить
                        </Button>
                    </div>
                }
            </div>
        </div>
    );
};

export default CommentItem;