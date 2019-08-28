let GameMap = require('./gamemap');
let Team = require('./team');

/*
  NPC:
    Main idea is to have several different types of analysis for next steps, each of them has a action associated and a action value
    An action is an in-game option the npc can make just like the player (optimized for given scenario)
		An action value is the maximun calculated 'profit' of every action
		Every time the NPC is invoked to do an action, it takes into account every possible action value and does which ever is the most worth it
		Also there are increasing weights for actions that have been performed multiple times in row and some randomness associated with the process of selecting them
*/

let NPC = function () {

	/*
		Utility function for permuting arrays randomly
	*/
	let permuteArray = function (array) {
		for (let i = 0; i < array.length; i++) {
			let temp = array[i];
			let tgIndx = Math.floor(Math.random() * array.length);
			array[i] = array[tgIndx];
			array[tgIndx] = temp;
		}
		return array;
	}

	/* NPC VARIABLES */

	let debuggingMode = false;
	this.setDebuggingMode = (val) => debuggingMode = val;
	let npcRefreshRate = 100;
	this.setNpcRefreshRate = (val) => npcRefreshRate = val;

	/* NPC GAME OBJECTS */

	let gamemap;
	this.setGameMap = igamemap => gamemap = igamemap;

	let myTeam;
	this.setTeam = team => myTeam = team;

	let enemies = [];
	this.setEnemies = enemyList => {
		for (enemy of enemyList) {
			if (enemy != myTeam) {
				enemies.push(enemy);
			}
		}
	}

	let actionlist;

	/* NPC FUNCTIONS */

	/*
		Initializes NPC logic by filling list of possible actions
	*/
	this.init = () => {
		actionlist = [
			new nothing(),
			new defensiveColonization(),
			new defensiveFortification(),
			new attack()
		]
	}

	/*
		Handles NPC action depending on game conditions
	*/
	this.takeAction = function () {
		let chosenAction = actionlist[0];
		for (action of actionlist) {
			if (action.actionValue() > chosenAction.actionValue()) {
				chosenAction = action;
			}
		}
		chosenAction.action();
	}

	/*
		Handles the action value and action for npc's defensive colonization
	*/
	let defensiveColonization = function () {
		this.actionValue = function () {
			if (myTeam.hasMoney() && gamemap.getUncolonizedHexagons().length > 0) {
				let mySize = myTeam.getHexagonCount();
				let averageEnemySize = 0;
				for (enemy of enemies) {
					averageEnemySize += enemy.getHexagonCount();
				}
				averageEnemySize /= enemies.length;
				let powerRelation = mySize / averageEnemySize;
				/*
					Simple line equation from point (0, 15) to (2, 0), where x = powerRelation and y = output
					Intuitively: the bigger the average enemy is in comparison to us, the more we want to expand to compete. 
				*/
				if (debuggingMode) console.log('DEFENSIVE COLONIZATION PROFIT: ' + ((-15 / 2) * powerRelation + 40))
				return ((-15 / 2) * powerRelation + 40);
			} else {
				return -1000;
			}
		}
		this.action = function () {
			if (debuggingMode) console.log('COLONIZING');
			/* If there is a neighbor from which it can expand, the use it */
			for (hexagon of permuteArray(gamemap.getHexagons(myTeam))) {
				for (neighbor of permuteArray(hexagon.getNeighbors())) {
					if (!neighbor.hasTeam()) {
						gamemap.hexagonAction(neighbor, myTeam);
						return;
					}
				}
			}
			/* Otherwise, colonize random spot */
			for (hexagon of permuteArray(gamemap.getUncolonizedHexagons())) {
				if (!hexagon.hasTeam()) {
					gamemap.hexagonAction(hexagon, myTeam);
					return;
				}
			}
		}
	}

	/*
		Handles the action value and action for npc's offensive colonization
	*/
	let offensiveColonization = () => {
		this.actionValue = () => {

		}
		this.action = () => {

		}
	}

	/*
		Handles the action value and action for npc's attack
	*/
	let attack = function () {

		const bias = 3;
		let chosenHex;

		let relativePower = (hex) => {
			let value = hex.getFortification();
			for (neighbor of hex.getNeighbors()) {
				if (neighbor.getTeam() == hex.getTeam()) {
					value += neighbor.getFortification();
				} else {
					value -= neighbor.getFortification();
				}
			}
			return value;
		}

		this.actionValue = function () {
			if (!myTeam.hasMoney()) {
				return -1000;
			}
			let enemyHex = [];
			for (enemy of enemies) {
				enemyHex = enemyHex.concat(gamemap.getHexagons(enemy));
			}
			enemyHex.sort((hexA, hexB) => {
				return relativePower(hexA) < relativePower(hexB);
			});
			chosenHex = enemyHex[0];
			if (debuggingMode) console.log('ENEMY ATTACK VALUE: ' + (relativePower(chosenHex) / 2 + bias));
			return relativePower(chosenHex) / 2 + bias;
		}

		this.action = function () {
			if (debuggingMode) console.log('ATTACKING');
			gamemap.hexagonAction(chosenHex, myTeam);
		}
	}


	/*
		Handles the action value and action for npc's kamikase
	*/
	let kamikase = function () {

		let timeSinceLastConsideration = 0;
		const considerationCooldown = 1000;
		const kamikaseDelta = 0.4;
		const baseThreshold = 0.8;

		let getKamikaseDamage = (team) => {
			let hexagons = gamemap.getHexagons(team);
			let hexDamage = 0;
			for (hex of hexagons) {
				hexDamage += hex.getFortification();
			}
			return hexDamage;
		}

		let getKamikaseLostHexCount = (team) => {
			let hexagons = gamemap.getHexagons(team);
			let hexCount = 0;
			for (hex of hexagons) {
				if (hex.getFortification() == 1) {
					hexCount++;
				}
			}
			return hexCount;
		}

		this.actionValue = function () {
			timeSinceLastConsideration += npcRefreshRate; 
			if (timeSinceLastConsideration < considerationCooldown) {
				return -1000;
			}
			if (!gamemap.kamikaseAvailable()) {
				return -1000;
			}
			let amountOfFriendlyHexagons = gamemap.getHexagons(myTeam).length;
			if (amountOfFriendlyHexagons <= 3) {
				return -1000;
			}
			timeSinceLastConsideration = 0;
			let enemyDamage = 0;
			let enemyLostHexagons = 0;
			for (enemy of enemies) {
				enemyDamage += getKamikaseDamage(enemy);
				enemyLostHexagons += getKamikaseLostHexCount(enemy);
			}
			let friendlyDamage = getKamikaseDamage(myTeam);
			let friendlyLostHex = getKamikaseLostHexCount(myTeam);
			if (friendlyLostHex + 3 >= amountOfFriendlyHexagons) {
				return -1000;
			}
			let randomProbabiltyOfChoice = (- kamikaseDelta / 2.0 - Math.random() * kamikaseDelta) + baseThreshold;
			let losingRatio = enemyLostHexagons / friendlyLostHex;
			let damageRatio = enemyDamage / friendlyDamage;
			if (randomProbabiltyOfChoice >= losingRatio) {
				return (1 / losingRatio) * 3.0 + damageRatio * 1.5;
			}
			return -1000;
		}

		this.action = function () {
			gamemap.kamikase();
		}
	}

	/*
		Handles the action value and action for npc's defensive fortification
	*/
	let defensiveFortification = function () {

		const bias = 10;

		let bestTarget;

		let allyNeighbors = (hex) => {
			let num = 0;
			for (neighbor of hex.getNeighbors()) {
				if (neighbor.getTeam() === myTeam) {
					num++;
				}
			}
			return num;
		}

		this.actionValue = function () {
			let myHex = gamemap.getHexagons(myTeam);
			let fortificationOptions = [];
			for (hex of myHex) {
				let enemyAdvantage = hex.overwelmed();
				if (enemyAdvantage < 1) {
					continue;
				}
				let price = Math.min(10 - hex.getFortification(), enemyAdvantage);
				if (price <= enemyAdvantage) {
					fortificationOptions.push({ price: price, hex: hex });
				}
			}

			if (fortificationOptions.length == 0) {
				return -1000;
			}

			fortificationOptions.sort((a, b) => {
				a.price < b.price;
			});

			if (fortificationOptions[0].price > myTeam.getMoney()) {
				return -1000;
			}

			bestTarget = fortificationOptions[0].hex;
			if (debuggingMode) console.log('DEFENSIVE FORTIFICATION PROFIT: ' + (allyNeighbors(bestTarget) + 1 - fortificationOptions[0].price + 10));
			return allyNeighbors(bestTarget) + 1 /* Is allied to itself */ - fortificationOptions[0].price + bias;
		}
		this.action = function () {
			if (debuggingMode) console.log('FORTIFICATING');
			gamemap.hexagonAction(bestTarget, myTeam);
		}
	}

	/*
		Handles the action value and action for npc's offensive colonization
	*/
	let offensiveForitification = () => {
		this.actionValue = () => {

		}
		this.action = () => {

		}
	}


	/*
		NPC empty action with neutral value
	*/
	let nothing = function () {
		this.actionValue = function () {
			return 0;
		}
		this.action = function () {
			if (debuggingMode) console.log('DOING NOTHING');
		}
	}

}

module.exports = NPC;