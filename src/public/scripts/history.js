const formatSuccess = (success = 0 | 1) => {
    if (success===0) return 'Loss'
    else return 'Win'
}

displayHistory()

function displayHistory() {
    Http
      .get('/api/history')
      .then(resp => resp.json())
      .then(resp => {
        var allUsersTemplate = document.getElementById('all-users-template'),
          allUsersTemplateHtml = allUsersTemplate.innerHTML,
          template = Handlebars.compile(allUsersTemplateHtml);
        var allUsersAnchor = document.getElementById('all-users-anchor');
        allUsersAnchor.innerHTML = template({
          history: resp.history.map(move => ({
            ...move,
            successFormatted: formatSuccess(move.success),
          })),
        });
      });

    Http
    .get('/api/account')
    .then(resp => resp.json())
    .then(resp => {
      var accountBalanceTemplate = document.getElementById('account-balance-template'),
        accountBalanceHtml = accountBalanceTemplate.innerHTML,
        template = Handlebars.compile(accountBalanceHtml);
      var accountBalanceAnchor = document.getElementById('account-balance-anchor');
      accountBalanceAnchor.innerHTML = template({
        accounts: resp.accounts.map(account => ({
          ...account,
          balance: account.balance.toString(),
        })),
      });
    });
}

document.addEventListener('click', event => {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches('#place-wager-btn')) {
        placeBet();
    } 
    else if (ele.matches('#withdraw-btn')) {
        withdraw();
    }
}, false);

function placeBet(){
    var wagerInput      = document.getElementById('wager-input');
    var predictionInput = document.getElementById('prediction-input');

    var req = {
      wager: {
        amount:     Number(wagerInput.value),
        prediction: Number(predictionInput.value)
      }
    };
    
    console.log(req);

    Http
      .post('/api/game', req)
      .then(resp => {resp.json()})
      .then(resp => {
        console.log(resp)
      });
    displayHistory()
}

function withdraw() {
  Http.delete('/api/game')
  displayHistory()
}