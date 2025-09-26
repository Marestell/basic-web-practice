let playerCard = [7, 5, 7, 2];
let playerSum = playerCard[0] + playerCard[1];

let bankCard = [7, 5, 6, 4];
let bankSum = bankCard[0] + bankCard[1];

for (let i = 2; i < 4 ; i++) {
    if (bankSum < 17) {
        bankSum += bankCard[i]
    } else {
        console.log(`Bank have ${bankSum} points`);
        break;
    }
}

playerSum += playerCard[2];
console.log(`You have ${playerSum} points`);

if (bankSum > 21 || (playerSum <= 21 && playerSum > bankSum)) {
    console.log('You win!');
} else if (bankSum === playerSum) {
    console.log("Draw");
} else if (playerSum === 21) {
    console.log("Blackjack! You win!");
} else if (playerSum > 21) {
    console.log('Bust! You lost');
} else if (playerSum < 21) {
    console.log("Want to get more card?");
}