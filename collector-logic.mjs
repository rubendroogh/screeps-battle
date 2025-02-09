import { RESOURCE_ENERGY } from "game/constants";
import { Creep, StructureContainer, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export const MaxCollectors = 3;

/**
 * 
 * @param {Creep} creep 
 */
export function CollectorLoop(creep) {
    // TODO: Change to a percentage-based system
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        DepositEnergyInSpawner(creep);
    }
    else {
        GrabClosestNonEmptyEnergyContainer(creep);
    }
}

/**
 * @param {Creep} creep
 */
function GrabClosestNonEmptyEnergyContainer(creep) {
    let closestContainer = FindClosestNonEmptyEnergyContainer(creep);
    creep.moveTo(closestContainer);
    PickupIfInRange(creep, closestContainer);
}

/**
 * @param {Creep} creep
 * @returns {StructureContainer}
 */
function FindClosestNonEmptyEnergyContainer(creep) {
    let allContainers = getObjectsByPrototype(StructureContainer).filter(container => container.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
    let closestContainer = creep.findClosestByPath(allContainers);

    return closestContainer;
}

/**
 * 
 * @param {Creep} creep 
 * @param {StructureContainer} container 
 */
function PickupIfInRange(creep, container) {
    let itemInRange = creep.findInRange([container], 1);
    if (itemInRange.length > 0) {
        let container = itemInRange[0];
        creep.withdraw(container, RESOURCE_ENERGY);
    }
}

/**
 * @param {Creep} creep
 */
function DepositEnergyInSpawner(creep) {
    let closestSpawner = FindClosestSpawner(creep);
    creep.moveTo(closestSpawner);
    DepositIfInRange(creep, closestSpawner);
}

/**
 * @todo Find closest NON-FULL spawner
 * @param {Creep} creep 
 * @returns {StructureSpawn}
 */
function FindClosestSpawner(creep) {
    let allSpawners = getObjectsByPrototype(StructureSpawn);
    let closestSpawner = creep.findClosestByPath(allSpawners);

    return closestSpawner;
}

/**
 * @param {Creep} creep
 * @param {StructureSpawn} spawner 
 */
function DepositIfInRange(creep, spawner) {
    let itemInRange = creep.findInRange([spawner], 1);

    if (itemInRange.length > 0) {
        let spawner = itemInRange[0];
        creep.transfer(spawner, RESOURCE_ENERGY);
    }
}