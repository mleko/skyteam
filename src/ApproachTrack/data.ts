import { Color, Module, TrackData } from "./types"

const turns: [boolean, boolean, boolean, boolean, boolean] = [true, true, true, true, true]

export const sampleTrack: TrackData = {
  name: "Warsaw Chopin Airport",
  code: "WAW",
  color: Color.red,
  spaces: [
    { planeCount: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: [false, true, true, true, false] },
    { planeCount: 2, trafficDice: 1, turns: [false, false, true, true, true] },
    { planeCount: 2, trafficDice: 0, turns: turns },
    { planeCount: 1, trafficDice: 0, turns: [true, true, true, false, false] },
    { planeCount: 0, trafficDice: 2, turns: turns },
  ],
  modules: [Module.wind, Module.fuel]
}
export const emptyTrack: TrackData = {
  name: "Airport",
  code: "NEW",
  spaces: [
    { planeCount: 0, trafficDice: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: turns },
  ],
  modules: [],
}
