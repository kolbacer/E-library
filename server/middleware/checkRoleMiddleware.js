const {User} = require('../models/models')
const getUserInfo = require("../utils/getUserInfo");

module.exports = function(role) {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer [token]
            if (!token) {
                res.status(401).json({message: "Не авторизован"})
            }

            let userInfo = await getUserInfo(token)
            if (!userInfo || !userInfo.email) {
                res.status(401).json({message: "Пользователь не найден"})
            }

            let user = await User.findOne({where: {login: userInfo.email}})
            if (!user) {
                res.status(401).json({message: "Пользователь не найден"})
            }

            if (!(((role === "author") && (user.is_author)) ||
                ((role === "moder") && (user.is_moder))))
            {
                return res.status(403).json({message: "Нет доступа"})
            }
            req.user = userInfo
            next()
        } catch(e) {
            res.status(401).json({message: "Пользователь не авторизован"})
        }
    }
}
