import * as sql             from "sqlite3";
import * as fs              from "fs";
import { account, history, roll, sqliteBool, wager } from "../types/custom.dt";

sql.verbose()

class DBConnector {
    private _db: sql.Database;
    static readonly playerID: number = 1;

    constructor(dbfile: string){
        if (fs.existsSync(dbfile) === true) {
            this._db = sql.cached.Database(dbfile, sql.OPEN_READWRITE, (err) => {
                if (err) {
                    console.log(`Error on db connection: ${err}`);
                    process.exit(1);
                }
            });
        } 
        else {
            this._db = new sql.Database(dbfile, (err) => {
                if (err) {
                    console.log(`Effor on database creation: ${err}`);
                    process.exit(1);
                }
            });
            this.initTable();
        }
    }

    private initTable(): Promise<void> {
        let createTableQuery: string = `
            CREATE TABLE account (
                game_id INT NOT NULL,
                balance INT NOT NULL
            );
            INSERT INTO account (game_id, balance)
                values (1, 1000);

            CREATE TABLE history (
                game_id INT NOT NULL,
                start_bal INT NOT NULL,
                wager INT NOT NULL,
                prediction INT NOT NULL,
                outcome INT NOT NULL,
                success INT NOT NULL,
                final_bal INT NOT NULL
            );
            INSERT INTO history (game_id, start_bal, wager, prediction, outcome, success, final_bal)
            VALUES
                (1, 1000, 200, 4, 3, 0,  800),
                (1,  800, 200, 2, 1, 0,  600),
                (1,  600, 200, 3, 2, 0,  400),
                (1,  400, 200, 6, 6, 1, 1400),
                (1, 1400, 300, 5, 4, 0, 1100),
                (1, 1100, 300, 1, 5, 0,  800);
        `;

        return new Promise((resolve, reject) => {
            this._db.exec(createTableQuery, function (err) {
                if (err) reject(err);
                else resolve();
            })
        })

    }

    resetGame(): void {
        this._db.run(`
            UPDATE account
            SET balance = 1000,
                game_id = game_id + 1
            WHERE rowid=${DBConnector.playerID}
        `)
    }

    updateGame(newWager: wager, outcome: number) {
        let _db = this._db
        let successBool: sqliteBool = newWager.prediction === outcome ? 1 : 0;
        let sign: number = successBool === 1 ? 5 : -1

        this._db.get(`
            SELECT * 
            FROM account 
            WHERE rowid=${DBConnector.playerID}
        `, function (err, row: account){
            if (err) {
                console.log(err);
                process.exit(1);
            }
            else {
                var newState: history = {
                    game_id:    row.game_id,
                    start_bal:  row.balance,
                    wager:      newWager.amount,
                    prediction: newWager.prediction as roll,
                    outcome:    outcome as roll,
                    success:    successBool as number as sqliteBool,
                    final_bal:  Math.max(row.balance + (newWager.amount * sign), 0)
                }
                _db.run(`
                    UPDATE account
                    SET balance = ${newState.final_bal}
                    WHERE rowid = ${DBConnector.playerID};
                `)
                _db.run(`
                    INSERT INTO history (game_id, start_bal, wager, prediction, outcome, success, final_bal)
                    VALUES( ${newState.game_id}, ${newState.start_bal}, ${newState.wager}, ${newState.prediction}, ${newState.outcome}, ${newState.success}, ${newState.final_bal} );
                `)

                if (newState.final_bal === 0){
                    _db.run(`
                        UPDATE account
                        SET balance = 1000,
                            game_id = game_id + 1
                        WHERE rowid=${DBConnector.playerID}
                    `)
                }
            }
        });
    }

    getBalance(): Promise<account>{
        return new Promise((resolve, reject) => {
            this._db.get(`
                SELECT balance 
                FROM account 
                WHERE rowid = ${DBConnector.playerID}
            `, function (err, row){
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(row as account);
                }
            })
        })
    }

    getHistory(): Promise<history[]>{
        return new Promise((resolve, reject) => {
            this._db.all(`
                SELECT *
                FROM history
                `, function (err, rows) {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    else {
                        resolve(rows as history[])
                    }
                })
        })
    }
}

export = DBConnector;