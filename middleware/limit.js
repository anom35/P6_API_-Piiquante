const rateLimit = require("express-rate-limit")

// limite à 10 requêtes toutes les 5mn
const reqLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10
})

module.exports = { reqLimiter }