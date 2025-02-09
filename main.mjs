import { getObjectsByPrototype } from 'game/utils';
import { Creep, StructureSpawn } from 'game/prototypes';
import { ROLE_ATTACKER_BODY, ROLE_COLLECTOR_BODY, ROLE_DEFENDER_BODY, ROLE_UNDEFINED } from './role-constants.mjs';
import { CollectorLoop, MaxCollectors } from './collector-logic.mjs';
import { AttackerLoop, MaxAttackers } from './attacker-logic.mjs';
import { DefenderLoop, MaxDefenders } from './defender-logic.mjs';

export function loop() {
    let myCreeps = getObjectsByPrototype(Creep).filter(x => x.my);
    let enemies = getObjectsByPrototype(Creep).filter(x => !x.my);

    let collectorCreeps = GetCreepsOfRole(myCreeps, ROLE_COLLECTOR_BODY);
    let defenderCreeps = GetCreepsOfRole(myCreeps, ROLE_DEFENDER_BODY);
    let attackerCreeps = GetCreepsOfRole(myCreeps, ROLE_ATTACKER_BODY);

    let spawnObject = getObjectsByPrototype(StructureSpawn).filter(x => x.my)[0];

    if (collectorCreeps.length < MaxCollectors) {
        spawnObject.spawnCreep(ROLE_COLLECTOR_BODY);
    }
    else if (defenderCreeps.length < MaxDefenders) {
        spawnObject.spawnCreep(ROLE_DEFENDER_BODY);
    }
    else {
        spawnObject.spawnCreep(ROLE_ATTACKER_BODY);
    }

    collectorCreeps.forEach(creep => { CollectorLoop(creep); });
    attackerCreeps.forEach((creep, index) => { AttackerLoop(creep, index); });
    defenderCreeps.forEach((creep, index) => { DefenderLoop(creep, index); });
}

/**
 * 
 * @param {Creep[]} creeps
 * @param {ROLE_UNDEFINED | ROLE_COLLECTOR_BODY} role
 * @returns An array of creeps of that role
 */
function GetCreepsOfRole(creeps, role) {
    return creeps.filter(creep => {
        for (let index = 0; index < creep.body.length; index++) {
            const bodyPart = creep.body[index];
            const roleBodyPart = role[index];
    
            if (bodyPart.type != roleBodyPart) {
                return false;
            }
        }

        return true;
    })
}