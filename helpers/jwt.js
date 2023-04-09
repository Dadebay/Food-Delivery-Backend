const { expressjwt: jwt } = require('express-jwt')

function checkJwt() {
    const secret = process.env.JWT_SECRET
    return jwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/users',
        ],
    })
}
module.exports = checkJwt
