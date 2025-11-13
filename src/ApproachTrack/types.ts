export interface TrackData {
    name: string
    code: string
    color?: ColorInput
    spaces: SpaceData[]
    modules: Module[],
    takeOff?: boolean
}
export interface SpaceData {
    planeCount?: number
    trafficDice?: number
    turns: Turns
    alarm?: boolean
}

export enum Module {
    "skill1" = "skill1", 
    "skill2" = "skill2", 
    "ice" = "ice", 
    "intern" = "intern",
    "fuel" =  "fuel",
    "leak" = "leak",
    "wind" = "wind"
}
export enum Color {
    "black" = "black",
    "red" = "red",
    "yellow" = "yellow",
    "green" = "green"
}
export type ColorInput = Color | "auto"
export type Turns = [boolean,boolean,boolean,boolean,boolean]
