import { allFalse } from "../util";
import { Color, Module, TrackData } from "./types";

export function trackColor(data: TrackData): Color|undefined {
    const turns = 7
    const spareDice =
        turns * 2 * 4 // base
        - turns * (2 + 2) // engine + rudder
        - 3 - 4 // landing gear + flaps
        - data.spaces.reduce((p, v) => {return p + (v.planeCount || 0) }, 0) // planes
        - (data.modules.indexOf(Module.ice) !== -1 ? 8 : 1) // brakes
        - (data.modules.indexOf(Module.fuel) !== -1 ? 5 : 0) // fuel
        // + (data.modules.includes(Module.skill1) || data.modules.includes(Module.skill2) ? 3 : 0) // extra dice from skill
        - calcDicePlanes(data);
    if (spareDice >= 8) {
        return Color.green
    } else if (spareDice >= 6) {
        return Color.yellow
    } else if (spareDice >= 4) {
        return Color.red
    }
    return Color.black
}

function calcDicePlanes(data: TrackData): number {
    let planes = 0;
    const spaces = data.spaces.concat().reverse()
    const log = []
    for (let space = 0; space < spaces.length - 1; ){
        planes += spaces[space].trafficDice || 0
        if (space + 1 === spaces.length - 1) {
            // airport is only available space, just break
            log.push("airport")
            break
        }
        if ((spaces[space+1].trafficDice || 0) < (spaces[space+2].trafficDice || 0)) {
            // greedy and naive, but if double hop add more planes than a single hop, do a single hop
            log.push("single hop - price")
            space++
            continue;
        }
        if (spaces[space].turns.reduce((p, val, idx) => {
            return p || (val && spaces[space+1].turns[idx]) || allFalse(spaces[space].turns) || allFalse(spaces[space+1].turns)
        }, false)) {
            // if double hop is possible, do it
            log.push("double hop")
            space += 2
        } else {
            log.push("single hop - turns")
            space++
        }
    }
    // console.log(log)

    return planes
}
