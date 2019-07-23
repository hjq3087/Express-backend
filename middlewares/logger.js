// 工具函数 log
const log = console.log.bind(console)
// middleware logger function
const logger = (req, res, next) => {
    log(`request to ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next()
}

module.exports = logger