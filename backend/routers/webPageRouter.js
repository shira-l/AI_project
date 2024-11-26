import express from 'express'
import { getWebPage } from '../controllers/webPageController.js'
const webPageRouter = express.Router()

webPageRouter.post('/getWebPage', getWebPage)

export {
    webPageRouter
}
