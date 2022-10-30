const { validateAccessToken } = require('../service/token')


const authMiddleware = req => {
    const authHeader = req.headers.authorization
    if (!authHeader) return 401

    const accessToken = authHeader.split(' ')[1]
    if (!accessToken) return 401

    const tokenData = validateAccessToken(accessToken)
    if (!tokenData) return 401
    if (tokenData.userAgent !== req.headers['user-agent']) return 401

    return req
}

module.exports = { authMiddleware }