import React, {useContext, useEffect, useState} from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import {useParams} from "react-router-dom";
import {fetchOneBook, getBookmark, setBookmark} from "../http/bookAPI";
import {Button, OverlayTrigger, Spinner, Tooltip} from "react-bootstrap";
import {Context} from "../index";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Reading = () => {
    const {user} = useContext(Context)

    const [book, setBook] = useState({})
    const [loading, setLoading] = useState(true)
    const {id} = useParams()
    useEffect(() => {
        fetchOneBook(id).then(data => {
            setBook(data)
        }).catch(e => {
            alert(e.message)
        }).finally(() => setLoading(false))

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

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="d-flex flex-column">
                    <div
                        style={{color: "blue", 'font-family': 'Arial, sans-serif', 'font-size': '18pt'}}
                    >
                        Книга грузится!
                    </div>
                    <Spinner className="ms-5 mt-2" animation={"grow"}/>
                </div>
            </div>
        )
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
                            {pageNumber < numPages &&
                                <Page
                                    pageNumber={pageNumber+1}
                                    className="border border-2 border-primary rounded p-3 bg-light"
                                />
                            }
                        </div>
                    </Document>
                    <div className="d-flex flex-row justify-content-center align-items-center mt-3">
                        <Button disabled={pageNumber <= 1} onClick={() => {setPageNumber(pageNumber-2)}} className="me-3">Назад</Button>
                        {pageNumber === numPages ?
                            <p className="m-0 text-center">Страница {pageNumber} из {numPages}</p> :
                            <p className="m-0 text-center">Страницы {pageNumber}-{pageNumber+1} из {numPages}</p>
                        }
                        <Button disabled={pageNumber >= numPages-1} onClick={() => {setPageNumber(pageNumber+2)}} className="ms-3">Вперед</Button>
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