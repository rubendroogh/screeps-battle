import * as squad from './squad.mjs';
import * as utils from 'game/utils';
import * as prototypes from 'game/prototypes';
import * as map from './map.mjs';
import * as tools from './tools.mjs';


export class General {
    squads = [];

    // scores ranging from 0 to 1
    startingResourceScore = 0;
    threatScore = 0;
    securityScore = 0;
    gatherCapacityScore = 0;

    static AdminedCreeps = [];
    static mySpawn = [];
    static Miscs = [];
    static EnemyCreeps = [];
    static MyCreeps = [];
    static Containers = [];
    static EnemySpawn = [];

    constructor(){
        this.updateKnowledge();
        this.adminCreeps();

        let y = 2;
        if (General.mySpawn[0].x > 10) y = 17;
        map.sectorMap.sectorMap[y][1].SectorType = map.SECTOR_TYPES.DEFENCE;
        map.sectorMap.sectorMap[y][18].SectorType = map.SECTOR_TYPES.DEFENCE;
    }

    update(){   
        this.updateKnowledge();
        this.adminCreeps();
        this.orderNewSquads();
        map.sectorMap.drawSectors();

        for (let i = 0; i < this.squads.length; i ++) {
            this.squads[i].update();
        }
    }

    addSquad(squad) {
        this.squads[this.squads.length] = squad;
        return squad;
    }

    updateKnowledge() {
        General.MyCreeps = utils.getObjectsByPrototype(prototypes.Creep).filter(creep => creep.my);
        General.EnemyCreeps = utils.getObjectsByPrototype(prototypes.Creep).filter(creep => !creep.my);
        General.Containers = utils.getObjectsByPrototype(prototypes.StructureContainer);
        General.mySpawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(StructureSpawn => StructureSpawn.my);
        General.EnemySpawn = utils.getObjectsByPrototype(prototypes.StructureSpawn).filter(StructureSpawn => !StructureSpawn.my);
    }

    adminCreeps(){
        for (let i = 0; i < General.MyCreeps.length; i++) {
            if (this.checkIfAdmined(General.MyCreeps[i].id)) continue
            for (let j = 0; j < this.squads.length; j ++) {
                for (let k = 0; k < this.squads[j].Creeps.length; k++) {
                    if (this.squads[j].Creeps[k].hasBody(General.MyCreeps[i].body) && !this.checkIfAdmined(General.MyCreeps[i].id) && this.squads[j].Creeps[k].Id == null) {
                        this.squads[j].Creeps[k].Id = General.MyCreeps[i].id;
                        General.AdminedCreeps[General.AdminedCreeps.length] = General.MyCreeps[i].id;
                    }

                    if (!this.checkIfAdmined(this.squads[j].Creeps[k].Id)) {
                        let index = General.AdminedCreeps.indexOf(this.squads[j].Creeps[k].Id);
                        if (index > -1) {
                            General.AdminedCreeps.splice(index,1)
                        }
                    }
                }
            }
        }
    }

    checkIfAdmined(id){
        if (General.AdminedCreeps.find(Id => Id == id) != undefined) return true;
        else return false;
    }

    getSquadTypeCount(className) {
        let count = 0;

        for (let i = 0; i < this.squads.length; i ++) {
            if (this.squads[i].constructor.name == className) count++;
        }

        return count;
    }

    updateSituationScoring(){
        this.startingResourceScore = 0;
        this.threatScore = 0;
        this.securityScore = 0;
        this.gatherCapacityScore = 0;
    }

    getSquadsInSector(sector) {
        let results = [];

        for (let i = 0; i < this.squads.length; i ++) {
            if ( Math.floor(sector.x / 5) ==  Math.floor(this.squads[i].x / 5) )
                results[results.length] = this.squads[i];
        }
        
        return results;
    }

    orderNewSquads(){   
        let spawnX = General.mySpawn[0].x;
        let spawnY = General.mySpawn[0].y;
        let defenceSectors = map.sectorMap.getSectorsByType(map.SECTOR_TYPES.DEFENCE);

        while (this.getSquadTypeCount("CollectingSquad") < 1)
            this.addSquad(new squad.CollectingSquad("C-Squad"))
            .setOrder(squad.SQUAD_MODES.GATHER, tools.getClosestEmptySpace({x: spawnX, y: spawnY}) );
        while (this.getSquadTypeCount("DefendingSquad") < defenceSectors.length){
            for (let i =0; i < defenceSectors.length; i++) {
                let squads = this.getSquadsInSector(defenceSectors[i]);
                let squadFound = false;
                for (let j =0; j < squads.length; j++) {
                    if (squads[j].constructor.name == "DefendingSquad") squadFound = true;
                }

                if (!squadFound) 
                    this.addSquad(new squad.DefendingSquad("D-Squad"))
                    .setOrder(squad.SQUAD_MODES.ATTACK_MOVE, tools.getClosestEmptySpace({x: defenceSectors[i].Pos.x, y: defenceSectors[i].Pos.y}));
            }
        }
        while (this.getSquadTypeCount("FightingSquad") < 2)
            this.addSquad(new squad.FightingSquad("f-Squad"))
            .setOrder(squad.SQUAD_MODES.ATTACK_MOVE, tools.getClosestEmptySpace({x: spawnX, y: spawnY + 37}));
    }
}