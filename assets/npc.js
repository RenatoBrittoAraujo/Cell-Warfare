let GameMap = require('./gamemap');
let Team = require('./team');

/*
  NPC:
    Main idea is to have several different types of actions, each of them has a actions associated and a action value
    An action is an in-game option the npc can take (optimized for given scenario)
		An action value is the maximun calculated 'profit' of every action
		Every time the NPC is invoked to do an action, it takes into account every possible action value and does which ever is the most worth it
*/

let NPC = function() {

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
			new colonization()
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
			if (myTeam.hasMoney()) {
				return 1;
			} else {
				return -1000;
			}
    }
    this.action = function() {
			console.log('COLONIZING');
			for (hexagon of gamemap.getHexagons(myTeam)) {
				for (neighbor of hexagon.getNeighbors()) {
					if (!neighbor.hasTeam()) {
						gamemap.hexagonAction(neighbor, myTeam);
						return;
					}
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
		this.actionValue = function() {
			return -1000;
		}
		this.action = function() {

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