import jwt from 'jsonwebtoken'

export const loginRequiredMiddleware = (req, res, next) => {
    const token = req.header('Authorization') || req.query.token || null
    if (!token) return res.status(401).json({ errors:[ "Unauthorized access" ] })

    try {
        const verfied = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verfied
        next()

    } catch (err) {
        res.status(401).json({ errors:[ "Invalid Token"] })

    }
}