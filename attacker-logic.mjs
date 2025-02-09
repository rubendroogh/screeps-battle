import { BOTTOM, BOTTOM_RIGHT, TOP } from "game/constants";
import { Creep, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export const MaxAttackers = 99999;

/**
 * 
 * @param {Creep} creep 
 * @param {number} index
 */
export function AttackerLoop(creep, index) {
    const enemySpawn = getObjectsByPrototype(StructureSpawn).filter(x => !x.my)[0];
    const mySpawn = getObjectsByPrototype(StructureSpawn).filter(x => x.my)[0];

    if (InRangeOfMySpawn(creep, mySpawn) && index % 2 == 0) {
        creep.move(BOTTOM);
    }
    else if (InRangeOfMySpawn(creep, mySpawn) && index % 2 != 0) {
        creep.move(TOP);
    }

    creep.moveTo(enemySpawn);
    AttackIfInRange(creep, enemySpawn);
}

/**
 * 
 * @param {Creep} creep 
 * @param {StructureSpawn} spawner 
 */
function InRangeOfMySpawn(creep, spawner) {
    let itemInRange = creep.findInRange([spawner], 4);
    return itemInRange.length > 0;
}

/**
 * 
 * @param {Creep} creep 
 * @param {StructureSpawn} spawner 
 */
function AttackIfInRange(creep, spawner) {
    let itemInRange = creep.findInRange([spawner], 1);
    if (itemInRange.length > 0) {
        let spawner = itemInRange[0];
        creep.attack(spawner);
    }
}