const jwt = require('express-jwt')
const jwks = require('jwks-rsa')

const domain = process.env.ISSUER_BASE_URL
const audience = process.env.AUDIENCE

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`
    }),
    audience: audience,
    issuer: `https://${domain}/`,
    algorithms: ["RS256"]
});

module.exports = jwtCheck