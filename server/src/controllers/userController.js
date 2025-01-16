const ApiError = require('../error/ApiError');
const {Book, User} = require("../models/models");

const checkPersonality = require('../utils/checkPersonality')
const getUserInfo = require('../utils/getUserInfo')

class UserController {

    async loginOrRegistration(req, res, next) {

        let accessToken = req.headers.authorization.split(' ')[1]
        let userInfo = await getUserInfo(accessToken)
        if (!userInfo || !userInfo.sub) {
            return res.status(401).json({message: "Пользователь не найден"})
        }

        let login
        if (userInfo.email) {
            login = userInfo.email
        } else {
            login = userInfo.sub
        }

        let user = await User.findOne({where: {login}})
        if (!user) {
            let obj = {
                login: login,
                name: userInfo.nickname,
                birth_date: new Date(),
                is_author: false,
                is_moder: false,
                img: userInfo.picture
            }
            user = await User.create(obj)
        }

        return res.json({user_id: user.user_id, name: user.name, is_author: user.is_author, is_moder: user.is_moder})
    }

    async check(req, res, next) {
        let accessToken = req.headers.authorization.split(' ')[1]
        let userInfo = await getUserInfo(accessToken)
        if (!userInfo || !userInfo.sub) {
            return res.status(401).json({message: "Пользователь не найден"})
        }

        let login
        if (userInfo.email) {
            login = userInfo.email
        } else {
            login = userInfo.sub
        }

        let user = await User.findOne({where: {login}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        return res.json({user_id: user.user_id, is_author: user.is_author, is_moder: user.is_moder})
    }

    async update(req, res, next) {
        try{
            const obj = req.body
            const user_id = obj.user_id
            delete obj.user_id

            await checkPersonality(user_id, req.headers.authorization.split(' ')[1])

            if (req.files && req.files.img) {
                obj.img = null
                obj.imgdata = req.files.img.data
            }

            const response = await User.update(
                obj,
                {where: {user_id}})

            return res.json(response)
        } catch (e) {
            console.log(e)
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {title, limit, page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page * limit - limit
        let users;
        if (!title) {
            users = await User.findAndCountAll({limit, offset})
        } else {
            users = await User.findAndCountAll({where:{title}, limit, offset})
        }

        users.rows.map(user => {
            if (user.imgdata) {
                const stringified_image = user.imgdata.toString('base64')
                user['imgdata'] = stringified_image
            }
        })

        return res.json(users)
    }

    async getOne(req, res) {
        const user_id = req.params.id
        const user = await User.findOne(
            {
                where: {user_id},
            },
        )

        if (user && user.imgdata) {
            const stringified_image = user.imgdata.toString('base64')
            user['imgdata'] = stringified_image
        }

        return res.json(user)
    }
/*
    async findByLogin(req, res, next) {
        const login = req.body.login
        const users = await User.findAll(
            {
                where: {login},
                attributes: ["user_id", "name", "is_author", "is_moder"]
            },
        )
        if ((typeof users == 'undefined') || (users.length === 0)) {
            //return next(ApiError.badRequest('Пользователь не найден!'))
            //throw {status: 500, message: "Пользователь не найден!"}
            return res.status(404).json('Пользователь не найден!')
        }

        return res.json(users)
    }
*/
    async findById(req, res, next) {
        const user_id = req.body.user_id
        try {
            const users = await User.findAll(
                {
                    where: {user_id},
                    attributes: ["user_id", "name", "is_author", "is_moder"]
                },
            )
            if ((typeof users == 'undefined') || (users.length === 0)) {
                //return next(ApiError.badRequest('Пользователь не найден!'))
                return res.status(404).json('Пользователь не найден!')
            }

            users.map(user => {
                if (user.imgdata) {
                    const stringified_image = user.imgdata.toString('base64')
                    user['imgdata'] = stringified_image
                }
            })

            return res.json(users)
        } catch (e) {
            return res.status(520).json(e.message)
        }
    }

    async findByName(req, res, next) {
        const name = req.body.name
        try {
            const users = await User.findAll(
                {
                    where: {name},
                    attributes: ["user_id", "name", "is_author", "is_moder"]
                },
            )
            if ((typeof users == 'undefined') || (users.length === 0)) {
                //return next(ApiError.badRequest('Пользователь не найден!'))
                return res.status(404).json('Пользователь не найден!')
            }

            users.map(user => {
                if (user.imgdata) {
                    const stringified_image = user.imgdata.toString('base64')
                    user['imgdata'] = stringified_image
                }
            })

            return res.json(users)
        } catch (e) {
            return res.status(520).json(e.message)
        }
    }

    async getReaderBooks(req, res, next) {
        try {
            const {user_id} = req.query

            const books = await User.findAll(
                {
                    attributes: [],
                    where: {
                      user_id
                    },
                    include: {
                        attributes: ["book_id", "title", "authors"],
                        model: Book,
                        as: 'BookReader',
                        through: {attributes: ["bookmark"]},
                    },
                    //raw: true
                }
            )

            return res.json(books[0].BookReader)
        } catch (e) {
            return res.status(520).json(e.message)
        }
    }

    async getAuthorBooks(req, res, next) {
        try {
            const {user_id} = req.query

            const books = await User.findAll(
                {
                    attributes: [],
                    where: {
                        user_id
                    },
                    include: {
                        attributes: ["book_id", "title", "authors"],
                        model: Book,
                        as: 'BookAuthor',
                        through: {attributes: []},
                    },
                    //raw: true
                }
            )

            return res.json(books[0].BookAuthor)
        } catch (e) {
            return res.status(520).json(e.message)
        }
    }

    async changeRole(req, res) {
        const {user_id, is_author, is_moder} = req.body
        let toUpdate = {}
        if (!(is_author === undefined)) {
            toUpdate = {...toUpdate,
                is_author
            }
        }
        if (!(is_moder === undefined)) {
            toUpdate = {...toUpdate,
                is_moder
            }
        }
        if (is_author) {
            toUpdate = {...toUpdate,
                author_request: false
            }
        }

        try {
            const response = await User.update(
                toUpdate,
                {where: {user_id}})
            return res.json(response)
        } catch (e) {
            return res.status(520).json(e.message)
        }
    }

    async setAuthorRequest(req, res) {
        const {user_id} = req.body
        await checkPersonality(user_id, req.headers.authorization.split(' ')[1])
        try {
            const response = await User.update(
                {author_request: true},
                {where: {user_id}})
            return res.json(response)
        } catch (e) {
            return res.status(520).json(e.message)
        }
    }

    async rejectAuthor(req, res) {
        const {user_id} = req.body
        try {
            const response = await User.update(
                {author_request: false},
                {where: {user_id}})
            return res.json(response)
        } catch (e) {
            return res.status(520).json(e.message)
        }
    }

    async getAuthorRequests(req, res) {
        const users = await User.findAll({
            where:{author_request: true},
            attributes: ["user_id", "name"]
        })

        return res.json(users)
    }

}
module.exports = new UserController()