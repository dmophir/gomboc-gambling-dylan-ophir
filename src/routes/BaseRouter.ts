import Paths                          from './Paths'
import express, { Request, Response } from 'express'

const router: express.Router = express.Router()

router.get(Paths.Root, (_: Request, res: Response) => {
    res.sendFile('index.html', { root: process.cwd() + '/src/public'})
})

export default router