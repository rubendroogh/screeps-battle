import * as utils from 'game/utils';
import * as constants from 'game/constants';

export function getClosestEmptySpace(pos){
    let terrain = utils.getTerrainAt(pos);
    let range = 1;

    if (terrain == constants.TERRAIN_WALL){
        while (true) {
            for (let i = 0 - range; i < 0 + range; i++){
                for (let j = 0 - range; j < 0 + range; j++){
                    terrain = utils.getTerrainAt({x: (i + pos.x), y: (j + pos.y)});
                    if (terrain == constants.TERRAIN_PLAIN || terrain == constants.TERRAIN_SWAMP) {
                        return {x: (i + pos.x), y: (j + pos.y)};
                    }
                }
            }
            range++;
        }
    } else return pos;
}