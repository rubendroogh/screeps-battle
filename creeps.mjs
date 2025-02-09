import * as utils from 'game/utils';
import * as constants from 'game/constants';
import * as general from './general.mjs';
import * as squad from './squad.mjs';
import * as visuals from 'game/visual';

export const CREEP_STATES = {
    IDLE: 0,
    EXECUTING_ORDER: 1,
}

export class BaseCreep {
    Id = null;
    Object = null;
    SpawnId = null;
    Spawn = null;
    Blueprint = [];
    State = 0;
    TaskVisual = null;

    x = null;
    y = null;
    Range = 7;

    /** 
     * @param {BigInteger} spawnId 
     * @param {string[]} blueprint
    **/
    constructor(spawnId, blueprint) {
        this.SpawnId = spawnId;
        this.Blueprint = blueprint        
    }

    update(squad) {
        this.Object = utils.getObjectById(this.Id);
        this.Spawn = utils.getObjectById(this.SpawnId);
        
        if (this.Object != undefined) {

            if (this.x == this.Object.x && this.y == this.Object.y && this.Object.fatigue == 0) {
                this.State = CREEP_STATES.IDLE;
            } else this.State = CREEP_STATES.EXECUTING_ORDER;

            this.x = this.Object.x;
            this.y = this.Object.y;
            this.drawTask(squad);
        }
        else if (this.Spawn.spawning == null){
            this.Id = null
            this.Spawn.spawnCreep(this.Blueprint);
        }

    }

    hasBody(body){
        let matches = 0;
    
        for (let i = 0; i < this.Blueprint.length; i ++) {
            for (let j = 0; j < body.length; j++) {
                if (body[j].type == this.Blueprint[i]) {
                    matches++;
                    i++;
                    j = 0;
                }
            }
        }
    
        if (matches == this.Blueprint.length) return true;
        else return false;
    }

    drawTask(squad){
        if (this.TaskVisual == null ) this.TaskVisual = new visuals.Visual(9, true);
        this.TaskVisual.clear().line(this.Object,squad);
    }
}

export class Collector extends BaseCreep {
    static blueprint = [constants.MOVE, constants.MOVE, constants.CARRY];

    /** 
     * @param {BigInteger} spawnId 
    **/
    constructor(spawnId) {
        super(spawnId, Collector.blueprint);
    }

    update(squad){
        super.update(squad);
        if (this.Object == undefined) return;
        this.behaviour(squad);
    }

    behaviour(squad){
            let target = utils.findClosestByPath(squad, general.General.Containers)

            if (this.Object.store[constants.RESOURCE_ENERGY] == 0) {
                if (this.Object.withdraw(target, constants.RESOURCE_ENERGY) == constants.ERR_NOT_IN_RANGE)
                    this.Object.moveTo(target);
            }
            if (this.Object.store[constants.RESOURCE_ENERGY] > 0) {
                if (this.Object.transfer(this.Spawn, constants.RESOURCE_ENERGY))
                    this.Object.moveTo(this.Spawn);
            }       
    }
}

export class Fighter extends BaseCreep {
    static blueprint = [constants.MOVE, constants.MOVE, constants.ATTACK];

    /** 
     * @param {BigInteger} spawnId 
    **/
    constructor(spawnId) {
        super(spawnId, Fighter.blueprint);
    }

    update(squad){
        super.update(squad);
        if (this.Object == undefined) return;
        this.behaviour(squad);
    }

    behaviour(mSquad){
        switch(mSquad.SquadMode) {
            case squad.SQUAD_MODES.ATTACK_MOVE:
                this.attackMove(mSquad);
                break;
            default:
                let target2 = this.Object.moveTo({x: mSquad.x, y: mSquad.y});
                break;
        }
    }

    attackMove(pos){
        let targets = [];
        let target1 = utils.findInRange(this.Object, general.General.EnemyCreeps, this.Range);
        let target2 = utils.findInRange(this.Object,general.General.EnemySpawn, this.Range)
        targets = target1.concat(target2);

        if (targets.length < 1) this.Object.moveTo(pos);
        else {
            let target = utils.findClosestByPath(this.Object, targets)
            if (this.Object.attack(target) == constants.ERR_NOT_IN_RANGE) 
            this.Object.moveTo(target);
        }
    }
}