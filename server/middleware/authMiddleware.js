module.exports = {
    usersOnly: (req, res) => {
        if (!req.session.user) {
            res.status(401).send({ message: 'Please log in'})
        }
        next()
    },

    adminsOnly: (req, res) => {
        if (!req.session.user.isAdmin) {
            res.status(403).send({ message: 'You are not an admin'})
        }
        next()
    }
}