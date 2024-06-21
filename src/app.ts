import express    from 'express'
import Paths      from './routes/Paths'
import BaseRouter from './routes/BaseRouter'
import ApiRouter  from './routes/ApiRouter'
import path       from 'path'

const app = express();
app.use(express.static(path.join(process.cwd(), 'src/public')))
app.use(express.json())

app.use(BaseRouter)
app.use(Paths.Api.Base, ApiRouter)

export default app