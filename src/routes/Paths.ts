export default {
    Database:       './dist/db/gamble.sqlite',
    Root:           '/',                // GET: game home page
    Api: {
        Base:       '/api',             // all: redirect to root
        Account:    '/account',     // GET: get current game number and account balance
        History:    '/history',     // GET: get complete player action history over all games
        Game:       '/game'         // POST: send new move data, DELETE: withdraw from game
    }
} as const;