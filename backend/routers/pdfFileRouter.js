import express from 'express'
import { createCharacterizationFile } from '../controllers/pdfFileController.js'
const pdfFileRouter = express.Router()

pdfFileRouter.post('/createCharacterizationFile', createCharacterizationFile)

export {
    pdfFileRouter
}