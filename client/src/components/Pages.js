import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Pagination} from "react-bootstrap";

const Pages = observer(() => {
    const {library} = useContext(Context)
    const pageCount = Math.ceil(library.totalCount / library.limit)
    const [pages, setPages] = useState([])
    const [showedPages, setShowedPages] = useState([])

    useEffect(() => {
        const _pages = []
        for (let i = 0; i < pageCount; i++) {
            _pages.push(i+1)
        }
        setPages(_pages)
    },[library.limit, library._totalCount])

    useEffect(() =>{
        setShowedPages(pages.slice(library.page-1, library.page+9))
    },[pages])

    const moveLeft = () => {
        let first = showedPages[0]
        if (first > 1) {
            setShowedPages(pages.slice(Math.max(0, first-11), first-1))
        }
    }

    const moveRight = () => {
        let last = showedPages[showedPages.length-1]
        if (last < pages.length-1) {
            setShowedPages(pages.slice(last, last+10))
        }
    }

    return (
        <Pagination>
            <Pagination.First onClick={() => library.setPage(1)}/>
            <Pagination.Prev onClick={() => library.setPage(Math.max(1,library._page-1))}/>
            <Pagination.Item active={library.page === pages[0]} onClick={() => library.setPage(pages[0])}>{pages[0]}</Pagination.Item>
            <Pagination.Ellipsis onClick={moveLeft}/>

            {showedPages.map(page => <Pagination.Item
                    key={page}
                    active={library.page === page}
                    onClick={() => library.setPage(page)}
                >
                    {page}
            </Pagination.Item>
            )}

            <Pagination.Ellipsis onClick={moveRight}/>
            <Pagination.Item active={library.page === pages[pages.length-1]} onClick={() => library.setPage(pages[pages.length-1])}>{pages[pages.length-1]}</Pagination.Item>
            <Pagination.Next onClick={() => library.setPage(Math.min(pages.length,library._page+1))}/>
            <Pagination.Last onClick={() => library.setPage(pages.length)}/>
        </Pagination>
    );
});

export default Pages;