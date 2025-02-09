import { ATTACK, CARRY, ERR_NOT_IN_RANGE, ERR_NO_BODYPART, HEAL, MOVE, OK, RANGED_ATTACK, WORK } from 'game/constants';

// NOTE: all body types must be different from each other due to my cool system
export const ROLE_UNDEFINED = []
export const ROLE_COLLECTOR_BODY = [CARRY, MOVE, MOVE]
export const ROLE_BUILDER_BODY = [CARRY, MOVE, WORK, HEAL]
export const ROLE_DEFENDER_BODY = [MOVE, RANGED_ATTACK]
export const ROLE_ATTACKER_BODY = [MOVE, MOVE, MOVE, ATTACK]
export const ROLE_RANGER_BODY = [MOVE, RANGED_ATTACK]
export const ROLE_HEALER_BODY = [MOVE, MOVE, HEAL]