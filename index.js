const express = require('express')
const os = require('os')

const PORT = process.env.PORT || 80

const app = express()

app.locals.version = require('./package.json').version
app.set('trust proxy', true)

app.get('/health', async (_req, res) => {
    res.json({'message':'OK'});
});

app.get('/', async (req, res) => {
    let result = { error: null }
    const clientIP = req.headers['x-forwarded-for']
    const elbIP = req.socket.remoteAddress
    const dockerIP = req.socket.localAddress
    const dockerName = os.hostname()
    const service = 'API Gateway service v3'
    console.log('Service hit');

    res.json({ ...result, clientIP, elbIP, dockerIP, dockerName, service })
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})