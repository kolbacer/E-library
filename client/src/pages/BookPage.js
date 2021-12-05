import React, {useContext, useEffect, useState} from 'react';
import {Image, Col, Row, Button} from "react-bootstrap";
import {Link, useHistory, useParams} from 'react-router-dom'
import {
    approveBook,
    checkRent,
    deleteBook,
    deleteRate,
    deleteRent,
    fetchOneBook,
    getRate,
    getRating,
    makeRate,
    rentBook
} from "../http/bookAPI";
import Ratings from 'react-ratings-declarative';
import {MAIN_ROUTE, READING_ROUTE} from "../utils/consts";
import {Context} from "../index";
import Comments from "../components/book_comments/Comments";

const BookPage = () => {
    const {user} = useContext(Context)
    const history = useHistory();

    const [book, setBook] = useState({})
    const [approved, setApproved] = useState(false)
    const [hasBook, setHasBook] = useState(false)

    const {id} = useParams()

    const [rating, setRating] = useState(0)
    const [rate, setRate] = useState(0)

    useEffect(() => {
        fetchOneBook(id).then(data => {
            setBook(data)
            setApproved(data.approved)
        })

        getRating(id).then(
            data => {
                if (!data) {
                    setRating(0)
                } else {
                    setRating(data)
                }
            }
        ).catch(() => {alert("Не удалось загрузить рейтинг")})

        getRate(user._user.user_id, id).then(
            data => {
                if (!data) {
                    setRate(0)
                } else {
                    setRate(data.rate)
                }
            }
        ).catch(() => {alert("Не удалось загрузить оценку")})

        checkBook()
    }, [])

    const sendRate = (newRate) => {
        if (newRate === rate) {
            deleteRate(user._user.user_id, id).then(() => {
                setRate(0)
            })
        } else if (rate !== 0) {
            deleteRate(user._user.user_id, id)
                .then(() => {
                    makeRate({
                        book_id: id,
                        user_id: user._user.user_id,
                        rate: newRate
                    }).then(() => {
                        setRate(newRate)
                    })
                })
        } else {
            makeRate({
                book_id: id,
                user_id: user._user.user_id,
                rate: newRate
            }).then(() => {
                setRate(newRate)
            })
        }
    }

    const checkBook = () => {
        checkRent(user._user.user_id, id).then(data => {
            if (data) {
                setHasBook(true)
            } else {
                setHasBook(false)
            }
        }).catch(e => {
            console.log(e.message)
        })
    }

    const bringBook = () => {
        if (user.borrowedBooks < user.maxBooks) {
            rentBook(user._user.user_id, id).then(data => {
                setHasBook(true)
                user.setBorrowedBooks(user.borrowedBooks + 1)
            }).catch(e => {
                console.log(e.message)
            })
        } else {
            alert("Вы не можете брать больше книг!\nВерните старые, чтобы взять новые")
        }
    }

    const returnBook = () => {
        deleteRent(user._user.user_id, id).then(data => {
            setHasBook(false)
            user.setBorrowedBooks(user.borrowedBooks - 1)
        }).catch(e => {
            console.log(e.message)
        })
    }

    const approve = () => {
        approveBook(id).then(data => {
            setApproved(true)
        }).catch(e => {
            console.log(e.message)
        })
    }

    const delBook = () => {
        deleteBook(id).then(data => {
            alert("Книга удалена!")
            history.push(MAIN_ROUTE)
        }).catch(e => {
            console.log(e.message)
        })
    }

    let bookInfo1 = {
        'font-family': 'Arial, sans-serif',
        'font-size': '18pt',
        'font-weight': 'bold'
    }

    let bookInfo2 = {
        'font-family': 'Arial, sans-serif',
        'font-size': '18pt',
        'margin-left': '5px'
    }

    return (
        <div className="mt-3">
            <Row className="ms-5 me-5">
                <Col className="col d-flex justify-content-center mt-3">
                    {
                        (book.img)
                            ? <Image width={300} height={300} src={process.env.REACT_APP_API_URL + 'images/' + book.img}/>
                            : <Image width={300} height={300} src={process.env.REACT_APP_API_URL + 'default_book.png'}/>
                    }
                </Col>
                <Col className="col-6">
                    <Row className="d-flex flex-column align-items-center">
                        <h2 className="d-flex justify-content-center">{book.title}</h2>
                        <h2 className="text-secondary d-flex justify-content-center">{book.authors}</h2>
                        <div className="d-flex flex-row">
                            <span style={bookInfo1}>Жанр: </span>
                            <span style={bookInfo2}>{book.genre}</span>
                        </div>
                        <div className="d-flex flex-row">
                            <span style={bookInfo1}>Возрастной рейтинг: </span>
                            <span style={bookInfo2}>{book.age_rating}</span>
                        </div>
                        <div className="d-flex flex-row">
                            <span style={bookInfo1}>Издатель: </span>
                            <span style={bookInfo2}>{book.publisher}</span>
                        </div>
                        <div className="d-flex flex-row">
                            <span style={bookInfo1}>Язык: </span>
                            <span style={bookInfo2}>{book.language}</span>
                        </div>
                        <div className="d-flex flex-row">
                            <span style={bookInfo1}>Дата публикации: </span>
                            <span style={bookInfo2}>{book.publication_date}</span>
                        </div>
                        <div className="d-flex flex-row">
                            <span style={bookInfo1} className="me-3">Рейтинг: </span>
                            <Ratings
                                rating={rating}
                                widgetDimensions="40px"
                                widgetSpacings="15px"
                            >
                                <Ratings.Widget widgetRatedColor="orange" />
                                <Ratings.Widget widgetRatedColor="orange" />
                                <Ratings.Widget widgetRatedColor="orange" />
                                <Ratings.Widget widgetRatedColor="orange" />
                                <Ratings.Widget widgetRatedColor="orange" />
                            </Ratings>
                        </div>
                        {
                            approved &&
                            <div className="d-flex justify-content-center">
                                <div className="border border-2 border-info rounded p-1 mt-1 d-flex">
                                    <span style={bookInfo1} className="me-3 align-self-center">Оценить: </span>
                                    <Ratings
                                        rating={rate}
                                        widgetRatedColors="blue"
                                        changeRating={(value) => {sendRate(value)}}
                                    >
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                        <Ratings.Widget />
                                    </Ratings>
                                </div>
                            </div>
                        }
                    </Row>
                </Col>
                <Col className="d-flex flex-column align-items-center">
                    {
                        (approved || user._user.is_moder) &&
                        <div>
                            {hasBook ? (
                                <div className="d-flex flex-column">
                                    <h1>В аренде</h1>
                                    <div className="d-flex flex-row">
                                        <Link
                                            style={{color: "blue", 'font-family': 'Arial, sans-serif', 'font-size': '18pt'}}
                                            to={ `${READING_ROUTE}/${book.book_id}`}
                                        >
                                            Читать
                                        </Link>
                                        <span style={bookInfo2} className="ms-1">(страниц: {book.pages_amount})</span>
                                    </div>
                                    <Button variant={"outline-danger"} className="mt-3 btn-lg" onClick={returnBook}>Вернуть</Button>
                                </div>
                            ) : (
                                <Button variant={"outline-info"} className="mt-3 btn-lg" onClick={bringBook}>Взять в аренду</Button>
                            )}
                        </div>
                    }
                    {
                        (approved || user._user.is_moder) &&
                        <div className="d-flex flex-row">
                        <span
                            style={{color: "blue", 'font-family': 'Arial, sans-serif', 'font-size': '18pt', 'text-decoration': 'underline', 'cursor': 'pointer'}}
                            onClick={() => {
                                if (book.download_link) {
                                    window.open(process.env.REACT_APP_API_URL + 'books/' + book.file, '_blank').focus();
                                } else {
                                    alert('Нет ссылки для скачивания')
                                }
                            }}
                        >
                            Скачать:
                        </span>
                            <span style={bookInfo2} className="ms-1">(формат: {book.file_format})</span>
                        </div>

                    }
                    {
                        !approved && !user._user.is_moder &&
                        <h1 style={{color: "orange"}}>Ожидает проверки</h1>
                    }
                    {
                        user._user.is_moder &&
                        <div className="border border-3 border-warning rounded p-3 mt-3 bg-black">
                            {approved ? (
                                <div>
                                    <h1 style={{color: "green"}}>Одобрено</h1>
                                    <div className="d-flex flex-row justify-content-center">
                                        <Button variant={"outline-danger"} className="mt-3 ms-3" onClick={delBook}>
                                            Удалить
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h1 style={{color: "orange"}}>Ожидает проверки</h1>
                                    <div className="d-flex flex-row justify-content-center">
                                        <Button variant={"outline-success"} className="mt-3" onClick={approve}>
                                            Одобрить
                                        </Button>
                                        <Button variant={"outline-danger"} className="mt-3 ms-3" onClick={delBook}>
                                            Удалить
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </Col>
            </Row>
            <div className="d-flex flex-column mt-3 ms-5">
                <h1 className="ms-5">Описание: </h1>
                <h3>{book.description}</h3>
            </div>

            {approved &&
            <Comments book_id={id}/>
            }
        </div>
    );
};

export default BookPage;