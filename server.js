const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const articles = [
    {
        author: "Yaju",
        publisher: "ABC"
    },
    {
        author: "Raju",
        publisher: "XYZ"
    },
    {
        author: "Sanju",
        publisher: "MNO"
    },
    {
        author: "Ranju",
        publisher: "OPQ"
    }
]

app.use(express.json())

app.get('/articles', checkauthenticationToken, (req, res) => {
    console.log("req.author")
    console.log(req.author)
    const getArticleAuthor = articles.filter(article => {
        if (article.author == req.author.name || article.author == req.author.author) {
            console.log("article.author if")
            console.log(article.author)
            console.log("true")
            return true
        } else{
            console.log("article.author else")
            console.log(article.author)
            console.log("false")
            return false
        }
    })
    res.json(getArticleAuthor)
})

function checkauthenticationToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, author) => {
        if (err) return res.sendStatus(403)
        req.author = author
        console.log("req.author====")
        console.log(req.author)
        next()
    })
}

app.listen(9090, (err) => {
    if (err) return "Error server"
    console.log("Server is up and running 9090")
})