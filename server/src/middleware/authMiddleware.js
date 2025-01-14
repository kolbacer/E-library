const { auth } = require("express-oauth2-jwt-bearer");

const domain = process.env.ISSUER_BASE_URL;
const audience = process.env.AUDIENCE;

if (!domain || !audience || audience === "YOUR_API_IDENTIFIER") {
    console.error("ISSUER_BASE_URL and/or AUDIENCE env values are not provided");
    process.exit();
}

const jwtCheck = auth({
    audience: audience,
    issuerBaseURL: `https://${domain}/`,
    tokenSigningAlg: 'RS256'
});

module.exports = jwtCheck;
