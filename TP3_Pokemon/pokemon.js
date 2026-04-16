#!/usr/bin/env node
import inquirer from 'inquirer';

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
let player = { hp: 300, maxHp: 300, name: "", moves: [] };
let enemy = { hp: 300, maxHp: 300, name: "", moves: [] };
let gameOver = false;

const { pNameInput } = await inquirer.prompt([
            {
                type: 'input',
                name: 'pNameInput',
                message: "What's your Pokemon?"
            }
    ]);



async function startGame(pNameInput) {
        if (!pNameInput) return console.log("Veuillez entrer un nom de Pokémon !");
        try {
            const pRes = await fetch(API_URL + pNameInput);
            if (!pRes.ok) throw new Error("Pokémon introuvable");
            const pData = await pRes.json();

            const randomId = Math.floor(Math.random() * 151) + 1;
            const eRes = await fetch(API_URL + randomId);
            const eData = await eRes.json();

            player.name = pData.name.toUpperCase();
            player.moves = await fetchMoves(pData.moves);

            enemy.name = eData.name.toUpperCase();
            enemy.moves = await fetchMoves(eData.moves);


        } catch (error) {
            console.log("Erreur: Le Pokémon n'existe pas ou l'API est indisponible.");
            // location.reload();
        }
    }

async function fetchMoves(allMovesList) {
        let validMoves = [];
        // Mélanger les attaques disponibles
        let shuffled = allMovesList.sort(() => 0.5 - Math.random());

        for (let item of shuffled) {
            if (validMoves.length === 5) break;
            
            let res = await fetch(item.move.url);
            let moveData = await res.json();

            // On ne garde que les attaques avec une puissance (dégâts > 0)
            if (moveData.power !== null && moveData.power > 0) {
                validMoves.push({
                    name: moveData.name.toUpperCase(),
                    power: moveData.power,
                    accuracy: moveData.accuracy !== null ? moveData.accuracy : 100,
                    pp: moveData.pp
            });
        }
    }
    return validMoves;
}

await startGame(pNameInput);
while (!gameOver) {
        const { pMoveInput } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'pMoveInput',
                message: "What's your Move?",
                choices: player.moves.map((move, index) => ({
                    name: `${move.name} (PP: ${move.pp}) (ACC: ${move.accuracy}) (Power: ${move.power})`,
                    value: index
                }))
            }
        ]);
        
    await playTurn(pMoveInput);
    if (gameOver) {
        const { restart } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'restart',
                message: "Voulez-vous rejouer ?"
            }
        ]); 
        if (restart) {
            player = { hp: 300, maxHp: 300, name: "", moves: [] };
            enemy = { hp: 300, maxHp: 300, name: "", moves: [] };
            gameOver = false;
            const newGame = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'pNameInputNew',
                    message: "What's your Pokemon?"
                }
            ]);
            await startGame(newGame.pNameInputNew);
        } else {
            console.log("Merci d'avoir joué !");
        }
    };
}

    function updateUI() {
        if (player.hp < 0) player.hp = 0;
        if (enemy.hp < 0) enemy.hp = 0;
        console.log(`\n${player.name} HP: ${player.hp}/${player.maxHp} | ${enemy.name} HP: ${enemy.hp}/${enemy.maxHp}\n`);

    }

    async function playTurn(playerMoveIndex) {
        if (gameOver) return;

        const pMove = player.moves[playerMoveIndex];
        const eMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];

        console.log(`--- NOUVEAU TOUR ---`);

        // TOUR DU JOUEUR
        // Règle spécifique : si le PP est inférieur à celui de l'ennemi, l'attaque échoue
        if (pMove.pp < eMove.pp) {
            console.log(`${player.name} tente d'utiliser ${pMove.name}... Mais échoue ! (PP inférieurs à l'ennemi : ${pMove.pp} vs ${eMove.pp})`);
            pMove.pp--;
        } else {
            // Prise en compte de la précision
            if (Math.random() * 100 <= pMove.accuracy) {
                enemy.hp -= pMove.power;
                pMove.pp--;
                console.log(`${player.name} utilise ${pMove.name} et inflige ${pMove.power} dégâts !`);
            } else {
                console.log(`${player.name} utilise ${pMove.name}... Mais l'attaque rate !`);
                pMove.pp--;
            }
        }

        updateUI();
        if (checkWin()) return;

        // TOUR DE L'ENNEMI
        if (eMove.pp < pMove.pp) {
            console.log(`${enemy.name} tente d'utiliser ${eMove.name}... Mais échoue !`);
            eMove.pp--; 
        } else {
            if (Math.random() * 100 <= eMove.accuracy) {
                player.hp -= eMove.power;
                eMove.pp--;
                console.log(`${enemy.name} utilise ${eMove.name} et vous inflige ${eMove.power} dégâts !`);
            } else {
                eMove.pp--;
                console.log(`${enemy.name} utilise ${eMove.name}... Mais l'attaque rate !`);
            }
        }
        updateUI();
        checkWin();
    }

    function checkWin() {
        if (enemy.hp === 0) {
            console.log(`VICTOIRE ! ${enemy.name} est KO.`);
            endGame();
            return true;
        }
        if (player.hp === 0) {
            console.log(`DÉFAITE... ${player.name} est KO.`);
            endGame();
            return true;
        }
        return false;
    }

    function endGame() {
        gameOver = true;
        console.log("Game Over!");
        // const restart = inquirer.prompt([
        //     {
        //         type: 'confirm',
        //         name: 'restart',
        //         message: "Voulez-vous rejouer ?"
        //     }
        // ]).then(({ restart }) => {
        //     if (restart) {
        //         player = { hp: 300, maxHp: 300, name: "", moves: [] };
        //         enemy = { hp: 300, maxHp: 300, name: "", moves: [] };
        //         gameOver = false;
        //         startGame(pNameInput);
        //     } else {
        //         console.log("Merci d'avoir joué !");
        //     }
        // });
    }