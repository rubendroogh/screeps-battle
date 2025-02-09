import * as creeps from './creeps.mjs';
import * as utils from 'game/utils';
import * as visuals from 'game/visual';
import * as prototypes from 'game/prototypes';
import * as general from './general.mjs';
import * as constants from 'game/constants';


export const SQUAD_MODES = {
    AT_REST: 1,
    MOVE: 2,
    GUARD: 3,
    ATTACK_MOVE: 4,
    GATHER: 5,
}

export class squad {
    Name = "";
    SquadMode = SQUAD_MODES.AT_REST;
    squadFull = false;
    x = 10;
    y = 90;
    Creeps = [];

    DestVisual = null;

    constructor() {
  
    }

    update(){
        this.Complete = true;
        for (let i = 0; i < this.Creeps.length; i++) {
            this.Creeps[i].update(this);
            if (this.Creeps[i].Object == null) this.Complete = false;
        }

        this.drawDestination();
    }

    drawDestination(){
        if (this.DestVisual == null ) this.DestVisual = new visuals.Visual(10, true);
        this.DestVisual.clear().circle({x: (this.x), y: (this.y)}, {fill: "#d65e5e", radius: 1} ).text(this.Name,{x: (this.x), y: (this.y)}, {font: 0.5});
    }

    setOrder(squadMode, position) {
        this.x = position.x;
        this.y = position.y;
        this.SquadMode = squadMode;
    }

    isOrderExecuted(){
        for (let i = 0; i < this.Creeps.length; i++) {
            if (this.Creeps[i].State != creeps.CREEP_STATES.IDLE) return false;
        }
        return true;
    }
}

export class CollectingSquad extends squad {
    constructor(name) {
        super();
        this.Name = name;
        var mySpawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(StructureSpawn => StructureSpawn.my);
        this.Creeps[this.Creeps.length] = new creeps.Collector(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Collector(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Collector(general.General.mySpawn[0].id);
    }

    update() {
        super.update();
        let containers = general.General.Containers.filter(container => container.store.getUsedCapacity(constants.RESOURCE_ENERGY) > 5);;
        this.setOrder(SQUAD_MODES.GATHER, utils.findClosestByPath(this, containers));
        this.SquadMode = SQUAD_MODES.GATHER;
    }
}

export class FightingSquad extends squad {
    Target = null;

    update(){
        super.update();
        if (this.isOrderExecuted() && this.Complete) this.setOrder(SQUAD_MODES.ATTACK_MOVE, general.General.EnemySpawn[0]);
    }

    constructor(name) {
        super();
        this.Name = name;
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
    }
}

export class DefendingSquad extends squad {
    Target = null;

    update(){
        super.update();
        if (utils.getTicks() > 1500) this.setOrder(SQUAD_MODES.ATTACK_MOVE, general.General.EnemySpawn[0]);
    }

    constructor(name) {
        super();
        this.Name = name;
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
        this.Creeps[this.Creeps.length] = new creeps.Fighter(general.General.mySpawn[0].id);
    }
}