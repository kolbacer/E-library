import React, {useContext, useEffect, useState} from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import {useParams} from "react-router-dom";
import {fetchOneBook, getBookmark, setBookmark} from "../http/bookAPI";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Context} from "../index";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Reading = () => {
    const {user} = useContext(Context)

    const [book, setBook] = useState({})
    const {id} = useParams()
    useEffect(() => {
        fetchOneBook(id).then(data => {
            setBook(data)
        })
        getBookmark(user._user.user_id, id).then(data => {
            if (data && data.bookmark) {
                setPageNumber(data.bookmark)
            }
        })
    }, [])


    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const makeBookmark = () => {
        setBookmark(user._user.user_id, book.book_id, pageNumber).then(data => {
            alert("Закладка оставлена!")
        }).catch(e => {
            alert(e.response.data.message)
        })
    }

    return (
        <div>
            <div className="d-flex flex-row justify-content-center mt-3">
                <div className="ms-3">
                    <Document
                        //file={process.env.REACT_APP_API_URL + 'books/' + book.file}
                        file={'data:file;base64,' + book.filedata}  // data:file/pdf;base64,
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <div className="d-flex flex-row">
                            <Page
                                pageNumber={pageNumber}
                                className="border border-2 border-primary rounded p-3 bg-light"
                            />
                            <Page
                                pageNumber={pageNumber+1}
                                className="border border-2 border-primary rounded p-3 bg-light"
                            />
                        </div>
                    </Document>
                    <div className="d-flex flex-row justify-content-center mt-3">
                        <Button onClick={() => {setPageNumber(pageNumber-1)}} className="me-3">Назад</Button>
                        <p>Страница {pageNumber} из {numPages}</p>
                        <Button onClick={() => {setPageNumber(pageNumber+1)}} className="ms-3">Вперед</Button>
                    </div>
                </div>
                <div className="ms-3 mt-3">
                    <OverlayTrigger
                        style={{"width": "30px", "height": "30px", "position": "absolute", "top": "0px", "left": "10px"}}
                        placement={'left'}
                        overlay={
                            <Tooltip id={`tooltip-left`}>
                                Оставить закладку
                            </Tooltip>
                        }
                    >
                        <Button variant="info" onClick={makeBookmark}>#</Button>
                    </OverlayTrigger>
                </div>
            </div>
        </div>
    );
};

export default Reading;