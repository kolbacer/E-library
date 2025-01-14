const {User} = require("../models/models");
const getUserInfo = require("./getUserInfo");

module.exports = async function checkPersonality(user_id, token) {
    let userInfo = await getUserInfo(token)
    if (!userInfo || !userInfo.sub) {
        throw {status: 401, message: "Пользователь не найден"}
    }

    let login
    if (userInfo.email) {
        login = userInfo.email
    } else {
        login = userInfo.sub
    }

    let user = await User.findOne({where: {login}})
    if (!user) {
        throw {status: 401, message: "Пользователь не найден"}
    }

    if (user_id !== user.user_id) {
        throw {status: 403, message: "Нет доступа!"}
    }
}