const path = require('path')
const express = require('express')
const logger = require('./middlewares/logger')
// 工具函数 log
const log = console.log.bind(console)
// 解决跨域问题
const cors = require('cors')

// 创建一个 express 实例
const app = express()

// 调用 middleware function
// logger
app.use(logger)
// CORS
app.use(cors())
// body parser
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// set static folder
const staticPath = path.join(__dirname, 'public')
app.use(express.static(staticPath))

// TodoAPI routes
app.use('/api/todo', require('./routers/api/todo'))
// Pokemons routes
app.use('/api/pokemon', require('./routers/api/pokemon'))

const main = () => {
    let PORT = process.env.PORT || 5000
    let server = app.listen(PORT, () => {
        let host = server.address().address
        let port = server.address().port

        log(`Server is on http://${host}:${port}`)
    })
}

if (require.main === module) {
    main()
}
