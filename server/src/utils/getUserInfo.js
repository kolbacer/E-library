const {default: axios} = require("axios");

module.exports = async function getUserInfo(token) {

    async function goAxios() {
        try {
            const response = await axios.get(`https://${process.env.ISSUER_BASE_URL}/userinfo`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }

    return await goAxios()
}