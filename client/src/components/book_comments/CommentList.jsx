import React from 'react';
import CommentItem from "./CommentItem";
import {TransitionGroup, CSSTransition} from "react-transition-group";

const CommentList = ({posts, remove}) => {

    if (!posts.length) {
        return (
            <h3 style={{textAlign: 'center'}}>
                Нет комментариев
            </h3>
        )
    }

    return (
        <div>
            <TransitionGroup>
                {posts.map((post, index) =>
                    <CSSTransition
                        key={post.id}
                        timeout={500}
                        classNames="post"
                    >
                        <CommentItem remove={remove} number={index+1} post={post}/>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
};

export default CommentList;