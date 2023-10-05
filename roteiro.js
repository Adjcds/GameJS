const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obtendo pontuação alta do armazenamento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Passando um valor aleatório de 1 - 30 como posição do alimento
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Limpando o temporizador e recarregando a página no game over
    clearInterval(setIntervalId);
    alert("Fim de jogo! Pressione OK para repetir...");
    location.reload();
}

const changeDirection = e => {
    // Alterando o valor da velocidade com base no pressionamento da tecla
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (['w', 'W'].includes(e.key) && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (['s', 'S'].includes(e.key) && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (['a', 'A'].includes(e.key) && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (['d', 'D'].includes(e.key) && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Função para mostrar o alerta de controle no início do jogo
const showControlsAlert = () => {
    alert("Para jogar, use as setas do teclado ou as teclas A, S, W e D. Pressione OK para iniciar.");
}

// Chamando changeDirection em cada clique de chave e passando o valor do conjunto de dados de chave como um objeto
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

// Mostrar o alerta de controles antes de iniciar o jogo
showControlsAlert();

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Verificar se a cobra atingiu o alimento
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Empurrando a posição do alimento para a matriz do corpo da cobra
        score++; // pontuação incremental em 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Atualização da posição da cabeça da cobra com base na velocidade da corrente
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Deslocando os valores dos elementos no corpo da cobra por um
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Definindo o primeiro elemento do corpo da cobra para a posição atual da cobra

    // Verificar se a cabeça da cobra está fora da parede, se assim definir gameOver como verdadeiro
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adicionando um div para cada parte do corpo da cobra
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Verificar se a cabeça da cobra atingiu o corpo, se assim definir gameOver como verdadeiro
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
