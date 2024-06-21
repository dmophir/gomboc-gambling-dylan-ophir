export type roll       = 1 | 2 | 3 | 4 | 5 | 6;
export type sqliteBool = 0 | 1;

export const PORT = 3001;
export type account    = {
    game_id:    number,
    balance:    number
};
export type history    = {
    game_id:    number,
    start_bal:  number,
    wager:      number,
    prediction: roll,
    outcome:    roll,
    success:    sqliteBool,
    final_bal:  number
};
export type wager      = {
    amount:     number,
    prediction: number
}