const jwt = require('jsonwebtoken');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db/db.json')



const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.access_secret, { expiresIn: '1d' })
    const refreshToken = jwt.sign(payload, process.env.refresh_secret, { expiresIn: '7d' })

    return {
        accessToken,
        refreshToken
    }

}

const saveToken = (userLogin, refreshToken) => {
    const db = low(adapter)

    const tokenData = db.get('users').find({ refreshToken: refreshToken }).value()
    if (!tokenData) {
        db.get('users').find({ userLogin: userLogin }).set('refreshToken', refreshToken).write()
    }
}

const removeToken = (userLogin, refreshToken) => {
    const db = low(adapter)

    const tokenData = db.get('users').find({ refreshToken: refreshToken }).value()
    if (tokenData) {
        db.get('users').find({ userLogin: userLogin }).unset('refreshToken').write()
    }
}


const validateAccessToken = (token) => {
    try {
        const tokenData = jwt.verify(token, process.env.access_secret)
        return tokenData
    } catch (error) {
        return null
    }
}

const validateRefreshToken = (token) => {
    try {
        const tokenData = jwt.verify(token, process.env.refresh_secret)
        return tokenData
    } catch (error) {
        return null
    }
}

const refreshThisToken = (refreshToken) => {
    const db = low(adapter)
    if (!refreshToken) {
        return 401
    }

    const tokenData = validateRefreshToken(refreshToken)
    const getToken = db.get('users').find({ refreshToken: refreshToken }).value()

    if (!tokenData || !getToken) {
        return 401
    }
    const user_data = {
        userLogin: getToken.userLogin,
    }

    const tokens = generateTokens(user_data)
    saveToken(user_data.userLogin, tokens.refreshToken)

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