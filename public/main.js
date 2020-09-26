
//client side javascript
const submit = document.getElementById('submit')
submit.addEventListener('click', (event) => findWinner(event))
const bet = document.getElementById("betAmount");
const display = document.getElementById('display');
let casinoTotal = 0;
let wins = 0;
let losses = 0;
let result;
let playerChoice;


function findWinner(x) {
  console.log("Running findWinner...");
  const betAmount = parseInt(bet.value);
  const winnings = betAmount * 2;
  const pick = Math.ceil(Math.random() * 2);
  result = pick === 1 ? 'red' : 'black'
  const userChoice = document.getElementById('userChoice').value
  if (userChoice === result) {
    winner = "player";
    casinoTotal -= winnings;
    display.innerHTML = `You won $${winnings}!`;
    wins += 1
  } else {
    winner = "casino";
    casinoTotal += betAmount;
    display.innerHTML = `You lost $${betAmount}!`;
    losses += 1
  }
  fetch("/game", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wins: wins,
      losses: losses,
      casinoTotal: casinoTotal,
    }),
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    // window.location.reload(true)
  })
}

// let game = {
//   wins: 0,
//   losses: 0,
//   money: 10,000
// }
//
//
// if( casinioWins === true){
//   game.money += betAmount
//   game.wins += 1
// }else{
//   game.money -= betAmount
//   game.losses += 1
// }



// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const name = this.parentNode.parentNode.childNodes[1].innerText
//         const msg = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'name': name,
//             'msg': msg
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
//keep the fetch on the button
