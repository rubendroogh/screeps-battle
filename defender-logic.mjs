import { Creep, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export const MaxDefenders = 8;

/**
 * 
 * @param {Creep} creep 
 * @param {number} index
 */
export function DefenderLoop(creep, index) {
    // Form a defensive line around the spawn and attack anything that comes too close

    GetInPositionAndDefend(creep, index);
}

/**
 * @param {Creep} creep
 * @param {number} index 
 */
export function GetInPositionAndDefend(creep, index) {
    const spawn = getObjectsByPrototype(StructureSpawn).filter(x => x.my)[0];
    const perimeter = 4;

    // 4 above the spawner, 4 below
    let coords = { x: spawn.x + -3, y: spawn.y + perimeter };

    if (index == 1) {
        coords = { x: spawn.x + -1, y: spawn.y + perimeter };
    }
    else if (index == 2) {
        coords = { x: spawn.x + 1, y: spawn.y + perimeter };
    }
    else if (index == 3) {
        coords = { x: spawn.x + 3, y: spawn.y + perimeter };
    }
    else if (index == 4) {
        coords = { x: spawn.x + -3, y: spawn.y - perimeter };
    }
    else if (index == 5) {
        coords = { x: spawn.x + -1, y: spawn.y - perimeter };
    }
    else if (index == 6) {
        coords = { x: spawn.x + 1, y: spawn.y - perimeter };
    }
    else if (index == 7) {
        coords = { x: spawn.x + 3, y: spawn.y - perimeter };
    }

    creep.moveTo(coords);

    if (creep.getRangeTo(coords) < 1) {
        let closeCreeps = creep.findInRange([creep], 1).filter(x => !x.my);
        let closeCreeps = creep.findInRange([creep], 2).filter(x => !x.my);
        if (closeCreeps.length) {
            closeCreeps.forEach(badCreep => {
                creep.attack(badCreep);
                creep.rangedAttack(badCreep);
            });
        }
    }
}