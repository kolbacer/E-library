const {default: axios} = require("axios");

module.exports = async function getUserInfo(token) {

    let options = {
        method: 'GET',
        url: 'https://dev-knefiv0x.us.auth0.com/userinfo',
        headers: {authorization: `Bearer ${token}`}
    }

    async function goAxios() {
        return axios.request(options)
            .then(response => response.data)
            .catch(err => console.error(err))
    }

    return await goAxios()
}