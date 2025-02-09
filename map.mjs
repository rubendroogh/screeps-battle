import * as visuals from 'game/visual';
import * as utils from 'game/utils';
import * as general from './general.mjs';

export const SECTOR_TYPES = {
    DEFAULT: "#ffffff",
    DEFENCE: "#1d7ff0",
    WILD: "#aeb8b7",
    HOME: "#1ced3f",
    ENEMY: "#db7612",
}

export const THREAT_COLORS = {
    SAFE: "#1aff00",
    NEUTRAL: "#8f8d8d",
    DANGEROUS: "#ff6145",
}

export class Sector {
    Visual = null;
    Threat = 0;
    ThreatTimer = 0;
    SectorType = SECTOR_TYPES.DEFAULT;

    safeColor = "#1aff00"; neutralColor = "#8f8d8d"; threatColor = "#ff6145";
    Pos = {x: 0, y: 0};

    updateThreat(){
        if (this.Threat > 0) this.ThreatTimer++
        else this.ThreatTimer = 0;

        let enemies = utils.findInRange(this.Pos, general.General.EnemyCreeps, 2);
        let friends = utils.findInRange(this.Pos, general.General.MyCreeps, 2);
        this.threat = enemies.length - friends.length;
    }
}

export class SectorMap {
    sectorMap = [];
    sectorVisuals = null;

    constructor() {
        this.createSectors();
    }

    createSectors(){
        for(let x = 0; x < 20; x++ ) {
            this.sectorMap[x] = [];
            for(let y = 0; y < 20; y++ ) {
                this.sectorMap[x][y] = new Sector();
                this.sectorMap[x][y].Pos = {x: (x * 5 + 2),y: (y * 5 + 2)}

                if (x <= 3) this.sectorMap[x][y].SectorType = SECTOR_TYPES.HOME;
                else if (x >= 16) this.sectorMap[x][y].SectorType = SECTOR_TYPES.ENEMY;
                else this.sectorMap[x][y].SectorType = SECTOR_TYPES.WILD;
            }
        }
    }
    
    drawSectors(){
        for (let x = 0; x < 20; x++ ) {
            for (let y = 0; y < 20; y++ ) {
                if (this.sectorMap[x][y].Visual == null) this.sectorMap[x][y].Visual = new visuals.Visual(11, true);
                this.sectorMap[x][y].updateThreat();
                let color;
                let opacity = Math.min(this.sectorMap[x][y].threat / 10, 0.8 );
                if (opacity < 0) opacity = opacity * -1;
                opacity = Math.max(opacity, 0.05);

                this.sectorMap[x][y].Visual.clear()
                
                
                if (this.sectorMap[x][y].threat < 0 ) color = THREAT_COLORS.SAFE;
                else if (this.sectorMap[x][y].threat == 0 ) color = THREAT_COLORS.NEUTRAL;
                else if (this.sectorMap[x][y].threat > 0 ) color = THREAT_COLORS.DANGEROUS;
                
                this.sectorMap[x][y].Visual.rect({x: (x * 5), y: (y * 5)}, 4, 4, {opacity: opacity, lineStyle: "dashed", fill: (color)});
                this.sectorMap[x][y].Visual.rect({x: (x * 5), y: (y * 5)}, 0.25, 0.25, {opacity: 1, lineStyle: "dashed", fill: (this.sectorMap[x][y].SectorType)});
            }
        }
    }

    getSectorsByType(type) {
        let returnvalue = [];
        for(let x = 0; x < 20; x++ ) {
            for(let y = 0; y < 20; y++ ) {
                if (this.sectorMap[x][y].SectorType == type)
                    returnvalue[returnvalue.length] = this.sectorMap[x][y];
            }
        }

        return returnvalue;
    }
    
    getThreatSectors() {
        let returnvalue = [];
    
        for(let x = 0; x < 20; x++ ) {
            this.sectorMap[x] = [];
            for(let y = 0; y < 20; y++ ) {
                if (this.sectorMap[x][y].threat > 0)
                    returnvalue[returnvalue.length] = this.sectorMap[x][y];
            }
        }

        return returnvalue;
    }
}

export var sectorMap = new SectorMap();
