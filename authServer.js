const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())

let refreshTokens = []//Should be in DB

app.post('/newToken', (req, res) => {
    const refreshToken = req.body.token
    console.log("Re.body.token\n")
    console.log(req.body.token)
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, author) => {
        console.log("refreshToken--\n")
        console.log(refreshToken)
        console.log("author name-----\n")
        console.log(author.name)
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ author: author.name })
        console.log("AccessToken---")
        console.log(accessToken)
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token != req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    const authorName = req.body.author
    const author = { name: authorName }
    console.log("author name-----\n")
    console.log(author.name)
    const accessToken = generateAccessToken(author)
    console.log("AccessTokenLogin---")
    console.log(accessToken)
    const refreshToken = jwt.sign(author, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, author: author, refreshToken: refreshToken })
})

function generateAccessToken(author) {
    return jwt.sign(author, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

app.listen(7070, (err) => {
    if (err) return "Error server"
    console.log("Server is up and running 7070")
})