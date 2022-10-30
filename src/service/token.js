const jwt = require('jsonwebtoken');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')



const generateTokens = payload => {
    const accessToken = jwt.sign(payload, process.env.access_secret, { expiresIn: '30m' })
    const refreshToken = jwt.sign(payload, process.env.refresh_secret, { expiresIn: '7d' })

    return {
        accessToken,
        refreshToken
    }

}

const saveToken = (userLogin, refreshToken) => {
    const db = low(adapter)
    db.get('users').find({ userLogin: userLogin }).set('refreshToken', refreshToken).write()
}

const removeToken = (refreshToken) => {
    const db = low(adapter)
    db.get('users').find({ refreshToken }).unset('refreshToken').write()
}


const validateAccessToken = token => {
    try {
        const tokenData = jwt.verify(token, process.env.access_secret)
        return tokenData
    } catch (error) {
        return null
    }
}

const validateRefreshToken = token => {
    try {
        const tokenData = jwt.verify(token, process.env.refresh_secret)
        return tokenData
    } catch (error) {
        return null
    }
}

const refreshThisToken = (refreshToken, userAgent) => {
    const db = low(adapter)

    if (!refreshToken) return 401

    const getToken = db.get('users').find({ refreshToken }).value()
    const tokenData = validateRefreshToken(refreshToken)

    if (!tokenData || !getToken) return 401

    const tokens = generateTokens({ userAgent })
    saveToken(getToken.userLogin, tokens.refreshToken)

    return tokens
}

module.exports = {
    saveToken,
    generateTokens,
    removeToken,
    refreshThisToken,
    validateAccessToken,
    validateRefreshToken
}