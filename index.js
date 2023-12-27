const express = require('express')
const os = require('os')
const axios = require('axios');

const PORT = process.env.PORT || 80

const app = express()

app.locals.version = require('./package.json').version
app.set('trust proxy', true)

app.get('/health', async (_req, res) => {
    res.json({ 'message': 'OK' });
});

app.get('/', async (req, res) => {
    let result = { error: null }
    const clientIP = req.headers['x-forwarded-for']
    const elbIP = req.socket.remoteAddress
    const dockerIP = req.socket.localAddress
    const dockerName = os.hostname()
    const service = 'API Gateway service v3'
    console.log('Service hit');
    let user = null;

    try {
        const userResponse = await axios.get(process.env.USER_SERVICE_API_BASE)
        const userData = await userResponse.json();
        user = {
            url: process.env.TRE_SERVICE_API_BASE,
            data: userData,
        }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            user = error.response.data
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            user = error.request
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            user = error.message
          }
    }

    res.json({ ...result, clientIP, elbIP, dockerIP, dockerName, service, user })
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})