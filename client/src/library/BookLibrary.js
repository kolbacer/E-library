import {makeAutoObservable} from "mobx";

export default class BookLibrary {
    constructor() {
        this._books = []
        this._page = 1
        this._totalCount = 0
        this._limit = 3
        this._filterAttribute = ''
        this._filterText = ''
        makeAutoObservable(this)
    }

    setBooks(books) {
        this._books = books
    }

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
    }

    setLimit(limit) {
        this._limit = limit
    }

    setFilterAttribute(attribute) {
        this._filterAttribute = attribute
    }

    setFilterText(text) {
        this._filterText = text
    }

    get books() {
        return this._books
    }

    get page() {
        return this._page
    }

    get totalCount() {
        return this._totalCount
    }

    get limit() {
        return this._limit
    }

    get filterAttribute() {
        return this._filterAttribute
    }

    get filterText() {
        return this._filterText
    }
}