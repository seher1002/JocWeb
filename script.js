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
        'ACE': 14, 'JACK': 11, 'QUEEN': 12, 'KING': 13
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

//Memory Game
let deckId = '';
let memoryBoard = [];
let selectedCards = [];
let matchedPairs = 0;

async function initializeMemoryGame() {
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();
    deckId = data.deck_id;

    const drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=12`);
    const drawData = await drawResponse.json();
    const cards = drawData.cards;
    
    // Duplicate the card array to form pairs, shuffle them randomly
    memoryBoard = shuffle([...cards, ...cards]);
    
    matchedPairs = 0;
    selectedCards = [];
    document.getElementById('memoryResult').textContent = '';

    renderMemoryBoard();
}

function renderMemoryBoard() {
    const boardElement = document.getElementById('memoryBoard');
    boardElement.innerHTML = '';

    memoryBoard.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', handleCardClick);
        
        // Initially show the card back
        cardElement.innerHTML = '<div class="card-back"></div>';
        boardElement.appendChild(cardElement);
    });
}

function handleCardClick(event) {
    const index = parseInt(event.currentTarget.dataset.index, 10);
    if (selectedCards.length < 2 && !selectedCards.includes(index)) {
        selectedCards.push(index);
        displayCard(index);

        if (selectedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function displayCard(index) {
    const cardElement = document.querySelector(`div.memory-card[data-index='${index}']`);
    const card = memoryBoard[index];
    cardElement.innerHTML = `<img src="${card.image}" alt="${card.code}" class="card-front">`;
}

function checkMatch() {
    const [first, second] = selectedCards;
    const firstCard = memoryBoard[first];
    const secondCard = memoryBoard[second];

    if (firstCard.value === secondCard.value) {
        matchedPairs++;
    } else {
        hideCard(first);
        hideCard(second);
    }

    selectedCards = [];
    checkGameCompletion();
}

function hideCard(index) {
    const cardElement = document.querySelector(`div.memory-card[data-index='${index}']`);
    cardElement.innerHTML = '<div class="card-back"></div>';
}

function checkGameCompletion() {
    const resultElement = document.getElementById('memoryResult');
    if (matchedPairs === memoryBoard.length / 2) {
        resultElement.textContent = 'You found all pairs! Congratulations!';
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
