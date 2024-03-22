import mongoose from 'mongoose'
import config from 'config'
import express from 'express'

const app = express()
const PORT = config.get('port') || 5000


async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`App has been started ${PORT}...`))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()