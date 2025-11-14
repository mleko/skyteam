export interface TrackData {
    code: string
    spaces : SpaceData[]
    takeOff?: boolean
    copilotLands?: boolean
}
export interface SpaceData {
    reroll?: boolean
    turbulence?: boolean
    badVisibility?: boolean
}
