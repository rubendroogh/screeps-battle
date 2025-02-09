import * as utils from 'game/utils';
import * as prototypes from 'game/prototypes';
import * as constants from 'game/constants';

import * as creeps from './creeps.mjs';
import * as general from './general.mjs';
import * as squad from './squad.mjs';
import * as map from './map.mjs';


var myCreeps = [];
var mySpawn = [];

var CollectorBlueprint = [constants.MOVE, constants.CARRY, constants.WORK];
var FighterBlueprint = [constants.MOVE, constants.MOVE, constants.MOVE, constants.MOVE, constants.ATTACK];

var Collectors = [];
var Fighters = [];
var Miscs = [];

var EnemyCreeps = [];
var Containers = [];
var EnemySpawn = [];
var mGeneral = new general.General();

let spawnX = general.General.mySpawn[0].x;
let spawnY = general.General.mySpawn[0].y;

export function loop() {
    mGeneral.update();
}