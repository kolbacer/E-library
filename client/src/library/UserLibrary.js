import {makeAutoObservable} from "mobx";

export default class UserLibrary {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._borrowedBooks = 0
        this._maxBooks = 10
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    setBorrowedBooks(borrowedBooks) {
        this._borrowedBooks = borrowedBooks
    }
    setMaxBooks(maxBooks) {
        this._maxBooks = maxBooks
    }

    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
    get borrowedBooks() {
        return this._borrowedBooks
    }
    get maxBooks() {
        return this._maxBooks
    }
}