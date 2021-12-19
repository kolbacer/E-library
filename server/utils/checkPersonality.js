const {User} = require("../models/models");
const getUserInfo = require("../utils/getUserInfo");

module.exports = async function checkPersonality(user_id, token) {
    let userInfo = await getUserInfo(token)
    if (!userInfo || !userInfo.email) {
        throw {status: 401, message: "Пользователь не найден"}
    }

    let user = await User.findOne({where: {login: userInfo.email}})
    if (!user) {
        throw {status: 401, message: "Пользователь не найден"}
    }

    if (user_id !== user.user_id) {
        throw {status: 403, message: "Нет доступа!"}
    }
}