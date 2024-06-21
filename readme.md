# Gomboc Gambling Casino

## Project Description
This full-stack application uses `npm`, `Node.js`, and `Typescript` to simulate a casino game where users can bet on the outcome of dice rolls. It preserves a history of all moves the player has made across all games and preserves state in an `sqlite` database.

## Design
### Frontend
This application uses a simple single-page site to accept user input and retrieve current gameplay state. It makes use of `Handlebars.js` in separate Javascript files to update elements in the HTML.

### Backend and API
The logic of this application is entirely handled by an `ExpressJS` app written in Typescript. All interactions between the user and the game itself is handled via REST API calls. Depending on the call, the request is forwarded to a Typescript object acting as the interface between the APIs and the database.

Except for the extra feature, the game logic as described in the requirements has been entirely implemented. 

### Database
The application uses an sqlite database to store and preserve state. SQLite was chosen because other database engines are much harder to install blindly via `node install`. The application can install, create, and open an SQLite database without any user interaction.

## Operation
As per the requirements, this application has a very simple operation:

- Install all dependencies: `npm install`
- Run the application in development mode: `npm run dev`
- Run the application in production mode: `npm start`