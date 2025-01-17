const {Book, User, Comment} = require('../models/models')
const ApiError = require('../error/ApiError')

const checkPersonality = require('../utils/checkPersonality')
const checkPersonalityOrModer = require('../utils/checkPersonalityOrModer')

class commentController {

    async create(req, res, next) {
        try{
            const obj = req.body
            obj.time = Date.now()
            await checkPersonality(obj.user_id, req.headers.authorization.split(' ')[1])

            const comment = await Comment.create(obj)
            return res.json(comment)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try{
            const {id} = req.query

            let comment = await Comment.findOne({where: {id}})
            await checkPersonalityOrModer(comment.user_id, req.headers.authorization.split(' ')[1])

            const response = await Comment.destroy({where: {id}})
            return res.json(response)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const {book_id, limit, page} = req.query

        let book_comments
        if (!limit && !page) {
            book_comments = await Comment.findAndCountAll({
                where: {book_id},
                order: [
                    ['time', 'DESC'],
                ]
            })
        } else {
            book_comments = await Comment.findAndCountAll({
                where: {book_id},
                order: [
                    ['time', 'DESC'],
                ],
                limit,
                offset: limit*(page-1)
            })
        }

        let comments = []
        for (let i=0; i < book_comments.rows.length; ++i) {
            let book_comment = book_comments.rows[i]
            let user = await User.findOne({where: {user_id: book_comment.user_id}})
            let comment = {
                id: book_comment.id,
                user_id: book_comment.user_id,
                username: user.name,
                text: book_comment.comment,
                timestamp: (new Date(Date.parse(book_comment.time))).toLocaleString("ru-RU")
            }
            comments.push(comment)
        }

        let commentsAndCount = {
            count: book_comments.count,
            rows: comments
        }


        return res.json(commentsAndCount)
    }


    async getOne(req, res) {
        const book_id = req.params.id
        const book = await Book.findOne(
            {
                where: {book_id},
            },
        )
        return res.json(book)
    }
}

module.exports = new commentController()