function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    })
}



window.onload = async() => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const bgImg = await loadTexture('assets/png/Background/starBackground.png')

    const heroImg = await loadTexture('assets/png/player.png')
    const heroLeftImg = await loadTexture('assets/png/playerLeft.png')
    const heroRightImg = await loadTexture('assets/png/playerRight.png')
    const enemyImg = await loadTexture('assets/png/enemyShip.png')
    
    const bgPattern = ctx.createPattern(bgImg, 'repeat');
    ctx.fillStyle = bgPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        heroLeftImg,
        canvas.width / 2 - 45 - heroLeftImg.width * 0.7,
        canvas.height - (canvas.height / 4) + 15,
        heroLeftImg.width * 0.7,
        heroLeftImg.height * 0.7
    );

    ctx.drawImage(
        heroImg,
        canvas.width / 2 - 45,
        canvas.height - (canvas.height / 4)
    );

    ctx.drawImage(
        heroRightImg,
        canvas.width / 2 - 45 + heroImg.width,
        canvas.height - (canvas.height / 4) + 15,
        heroRightImg.width * 0.7,
        heroRightImg.height * 0.7
    );

    createEnemies2(ctx, canvas, enemyImg);
};

function createEnemies1(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
        for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
            ctx.drawImage(enemyImg, x, y);
        }
    }
}

function createEnemies2(ctx, canvas, enemyImg) {
    for (let y = 0; y < 5; y += 1) {
        const MONSTER_TOTAL = 5 - y
        const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
        const START_X = (canvas.width - MONSTER_WIDTH) / 2;
        const STOP_X = START_X + MONSTER_WIDTH;
        for (let x = START_X; x < STOP_X; x += enemyImg.width) {
            ctx.drawImage(enemyImg, x, y * enemyImg.height);
        }
    }
}