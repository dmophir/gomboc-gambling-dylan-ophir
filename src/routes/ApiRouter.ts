import Paths                          from './Paths'
import DBConnector                    from '../db/db'
import express, { Request, Response } from 'express'

const db: DBConnector        = new DBConnector(Paths.Database)
const router: express.Router = express.Router()

router.all(Paths.Root, (_: Request, res: Response) =>{
    res.redirect(Paths.Root)
})

router.get(Paths.Api.Account, (_: Request, res: Response) => {
    db.getBalance()
    .then(function (results){
        res.send({accounts: [results]})
    })
})

router.get(Paths.Api.History, (_: Request, res: Response) => {
    db.getHistory()
    .then(function (results){
        results.reverse()
        res.send({history : results})
    })    
})

router.post(Paths.Api.Game, (req: Request, res: Response) => {
    let wager = req.body.wager
    let roll  = Math.floor(Math.random() * (6 - 1 + 1)) + 1
    let result: string = roll !== wager.prediction ? 'Loss' : 'Win'

    if (result === 'Win'){
        db.getBalance().then(function (results) {
            if (results.balance >= 10000){
                var reroll = Math.random()
                console.log(`trying to reroll ${roll}`)
                if (reroll >= 0.1) {
                    roll = Math.floor(Math.random() * (6 - 1 + 1)) + 1
                    result = roll !== wager.prediction ? 'Loss' : 'Win'
                    console.log(`rerolling ${roll}`)
                }
            }
            else if (results.balance >= 5000){
                console.log(`trying to reroll ${roll}`)
                var reroll = Math.random()
                if (reroll >= 0.7) {
                    roll = Math.floor(Math.random() * (6 - 1 + 1)) + 1
                    result = roll !== wager.prediction ? 'Loss' : 'Win'
                    console.log(`rerolling ${roll}`)
                }
            }
        })
        console.log(roll)
    }

    db.updateGame(wager, roll)
    res.send({outcome : result})
})

router.delete(Paths.Api.Game, (_, res: Response) => {
    db.resetGame()
    res.redirect(Paths.Root)
})

export default router