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

let NPC = function() {

	let permuteArray = function(array) {
		for (let i = 0; i < array.length; i++) {
			let temp = array[i];
			let tgIndx = Math.floor(Math.random() * array.length);
			array[i] = tgIndx;
			array[tgIndx] = temp;
		}
		return array;
	}

	let myTeam;
	let enemies = [];
	let gamemap;

	this.setTeam = team => myTeam = team;
	
	this.setEnemies = enemyList => {
		for (enemy of enemyList) {
			if (enemy != myTeam) {
				enemies.push(enemy);
			}
		}
	}

	this.setGameMap = igamemap => gamemap = igamemap;

	let actionlist;

	this.init = () => {
		actionlist = [
			new nothing(),
			new colonization(),
			new fortificate()
		]
	}

	this.takeAction = function() {
		let chosenAction = actionlist[0];
		for (action of actionlist) {
			if (action.actionValue() > chosenAction.actionValue()) {
				chosenAction = action;
			}
		}
		chosenAction.action();
  }

  let colonization = function() {
    this.actionValue = function() {
			if (myTeam.hasMoney() && gamemap.getUncolonizedHexagons() > 0) {
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
				return (-15 / 2) * powerRelation + 15;
			} else {
				return -1000;
			}
    }
    this.action = function() {
			console.log('COLONIZING');
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
			for (hexagon of permuteArray(gamemap.getHexagons(myTeam))) {
				if (!hexagon.hasTeam()) {
					gamemap.hexagonAction(hexagon, myTeam);
					return;
				}
			}
    }
  }

	let attack = function() {
		this.actionValue = function() {
			return -1000;
		}
		this.action = function() {

		}
	}

	let kamikase = function() {
		this.actionValue = function() {
			return -1000;
		}
		this.action = function() {

		}
	}
	
	let fortificate = function() {
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
		this.actionValue = function() {
			let myHex = gamemap.getHexagons(myTeam);
			let fortificationOptions = [];
			for (hex of myHex) {
				let enemyAdvantage = hexagon.overwelmed();
				if (enemyAdvantage < 1) {
					continue;
				}
				let price = Math.max(10, enemyAdvantage + hexagon.getFortification());
				if (price <  enemyAdvantage) {
					fortificationOptions.push( { price: price, hex: hex } );
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
			return allyNeighbors(bestTarget) + 1 - fortificationOptions[0].price + 3;
		}
		this.action = function() {
			console.log('FORTIFICATING');
			gamemap.hexagonAction(bestTarget, myTeam);
		}
	}

	/*
		Does nothing, completely neutral
	*/
	let nothing = function() {
		this.actionValue = function() {
			return 0;
		}
		this.action = function() {
			console.log('DOING NOTHING');
		}
	}
}

module.exports = NPC;