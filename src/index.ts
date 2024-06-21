import app from './app'
import { PORT } from './types/custom.dt'

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})