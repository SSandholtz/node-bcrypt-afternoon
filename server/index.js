require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')

const authCtrl = require('./Controllers/authController.js')
const treasureCtrl = require('./Controllers/treasureController.js')

const auth = require('./middleware/authMiddleware.js')

const PORT = 4000

const { CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()

app.use(express.json())



massive(CONNECTION_STRING).then(db => {
    app.set ('db', db)
    app.listen(PORT, () => console.log('Listening on:', PORT))
})

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)