import React, {useEffect, useState} from 'react';
import {Image as IMG, Card, Col} from "react-bootstrap";
import {useHistory} from "react-router-dom"
import {BOOK_ROUTE} from "../utils/consts";

import default_book_pic from '../static/default_book.png';

const BookItem = ({book}) => {
    const history = useHistory()

    const [imageLoaded, setImageLoaded] = useState(false)

    const testImage = (URL) => {
        let tester=new Image();
        tester.onload = () => {setImageLoaded(true)}
        tester.onerror = () => {setImageLoaded(false)}
        tester.src=URL
    }

    useEffect(() => {
        testImage(process.env.REACT_APP_API_URL + 'images/' + book.img)
    },[])

    return (
        <Col md={3} className={"mt-3"} onClick={() => history.push(BOOK_ROUTE + '/' + book.book_id)}>
            <Card style={{width: 150, cursor: 'pointer'}} border={"light"}>
                {(!book.img) ?
                    (<IMG width={150} height={150} src={default_book_pic}/>)
                    :
                    (imageLoaded) ?
                        (<IMG width={150} height={150} src={process.env.REACT_APP_API_URL + 'images/' + book.img}/>)
                        :
                        (<div style={{"height": "150px", "width": "150px", "background": "gray", "text-align": "justify"}}>Can't download picture</div>)
                }
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div>{book.authors}</div>
                </div>
                <div>{book.title}</div>
            </Card>
        </Col>
    );
};

export default BookItem;