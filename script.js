// War Game Code
function playWar() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => response.json())
    .then(data => {
        const deckId = data.deck_id;
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(response => response.json())
        .then(data => {
            displayWarCards(data.cards);
            determineWarWinner(data.cards);
        });
    });
}

function displayWarCards(cards) {
    const playerCard = document.getElementById('playerCard');
    const computerCard = document.getElementById('computerCard');
    playerCard.innerHTML = `<img src="${cards[0].image}" alt="Player's card">`;
    computerCard.innerHTML = `<img src="${cards[1].image}" alt="Computer's card">`;
}

function determineWarWinner(cards) {
    const playerValue = getWarCardValue(cards[0].value);
    const computerValue = getWarCardValue(cards[1].value);

    let resultText = '';
    if (playerValue > computerValue) {
        resultText = 'You win!';
    } else if (playerValue < computerValue) {
        resultText = 'Computer wins!';
    } else {
        resultText = 'It\'s a tie!';
    }

    const resultElement = document.getElementById('result');
    resultElement.textContent = resultText;
}

function getWarCardValue(cardValue) {
    const values = {
        'ACE': 14, 'KING': 13, 'QUEEN': 12, 'JACK': 11
    };
    return values[cardValue] || parseInt(cardValue, 10);
}


let drawnCards = [];

function drawCard() {
    fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=1')
    .then(response => response.json())
    .then(data => {
        const card = data.cards[0];
        if (!drawnCards.find(c => c.code === card.code)) {
            drawnCards.push(card);
            sortDrawnCards();
            displayDrawnCards();
        } else {
            drawCard();
        }
    })
    .catch(error => console.log(error));
}

function sortDrawnCards() {
    const valuesOrder = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        'ACE': 11, 'JACK': 12, 'QUEEN': 13, 'KING': 14
    };
    drawnCards.sort((a, b) => valuesOrder[a.value] - valuesOrder[b.value]);
}

function displayDrawnCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    drawnCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        const img = document.createElement('img');
        img.src = card.image;
        cardElement.appendChild(img);
        cardsContainer.appendChild(cardElement);
    });
}

