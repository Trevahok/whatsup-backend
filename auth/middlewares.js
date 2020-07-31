import jwt from 'jsonwebtoken'

export const loginRequiredMiddleware = (req, res, next) => {
    const token = req.header('authorization') || req.header('Authorization') || req.query.token || null
    if (!token) {
        console.log('Middleware failed: No token')
        return res.status(401).json({ errors:[ "Unauthorized access" ] })
    }

    try {
        const verfied = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verfied
        next()

    } catch (err) {
        console.log('Middleware failed: ' ,err)
        res.status(401).json({ errors:[ "Invalid Token"] })

    }
}