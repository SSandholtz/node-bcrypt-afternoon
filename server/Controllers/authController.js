const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')
        let result = await db.get_user(username)
        let existingUser = result[0]
        if (existingUser) {
            res.status(409).send({ message: 'Username Taken'})
        }
        else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            let registerUser = await db.register_user([isAdmin, username, hash])
            let user = registerUser[0]
            req.session.user = { isAdmin: user.isAdmin, id: user.id, username: user.username }
            res.status(201).send(req.session.user)
        }
    },

    login: async (req, res) => {
        const { username, password, } = req.body
        const db = req.app.get('db')
        const foundUser = await db.get_user(username)
        const user = foundUser[0]
        if (foundUser) {
            const isAuthenticated = bcrypt.compareSync(password.user.hash)
            if (isAuthenticated) {
                req.session.user = { isAdmin: user.isAdmin, id: user.id, username: user.username }
                res.send(200).send(req.session.user)
            }
            else {
                res.status(403).send({ message: 'Incorrect password' })
            }
        }
        else {
            res.status(401).send({ message: 'User not found. Please register as a new user before logging in'})
        }
    },

    logout: async (req, res) => {
        req.session.destroy()
        res.status(200).send({ message: 'Logout Successful'})
    }
}