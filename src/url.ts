import JsonURL from "@jsonurl/jsonurl";
import {allFalse, allTrue, Color, Module, SpaceData, TrackData, Turns} from "./Track";
import {z} from 'zod'

const zTurnL = z.union([z.literal("t"), z.literal("f")])

const zTurn = z.tuple([
    zTurnL, zTurnL, zTurnL, zTurnL, zTurnL
])

const zExportSpace = z.object({
    pc: z.number().int().optional(),
    td: z.number().int().optional(),
    trn: zTurn.optional()
})

const zExportTrack = z.object({
    n: z.string(),
    c: z.string(),
    s: z.array(zExportSpace),
    m: z.nativeEnum(Module).array().optional(),
    clr: z.union([z.nativeEnum(Color), z.literal("auto")]).optional(),
    x: z.object({
        takeOff: z.object({}).optional()
    }).optional()
})

type exportTrack = z.infer<typeof zExportTrack>
type exportSpace = z.infer<typeof zExportSpace>
type exportTurn = z.infer<typeof zTurn>

export function setURL(data : TrackData[]) {
    const url = new URL(window.location.href)
    const t = JsonURL.stringify(toExport(data))
    if (t) {
        url.hash = t
    }
    window.history.replaceState(null, "", url)
}

export function loadURL() : TrackData[] | undefined {
    try {
        const url = new URL(window.location.href)
        const t = url.hash.substring(1)
        if (t) {
            const parsed = JsonURL.parse(t)
            const exTrack = zExportTrack.array().parse(parsed)
            return fromExport(exTrack)
        }
    } catch(e) {
        console.error("Failed to load url data")
    }
    return undefined
}

function toExport(tracks: TrackData[]): exportTrack[] {
    return tracks.map((val: TrackData) => {
        const e: exportTrack = {
            n: val.name,
            c: val.code,
            s: val.spaces.map((val: SpaceData) => {
                const sd: exportSpace = {}
                if (val.planeCount) {
                    sd.pc = val.planeCount
                }
                if (val.trafficDice) {
                    sd.td = val.trafficDice
                }
                if (!(allTrue(val.turns) || allFalse(val.turns))) {
                    sd.trn = val.turns.map((v) => v ? "t" : "f") as exportTurn
                }
                return sd
            }),
        }
        if( val.modules.length > 0) {
            e.m = val.modules
        }
        if (val.color) {
            e.clr = val.color
        }
        if (val.takeOff) {
            e.x = {
                takeOff: {}
            }
        }
        return e
    })
}
function fromExport(tracks: exportTrack[]): TrackData[] {
    return tracks.map((val) => {
        return {
            name: val.n,
            code: val.c,
            modules: val.m || [],
            spaces: val.s.map((sVal): SpaceData => {
                return {
                    turns: sVal.trn ? sVal.trn.map((v) => v === "t") as Turns : [true, true, true, true, true],
                    planeCount: sVal.pc || 0,
                    trafficDice: sVal.td || 0,
                }
            }),
            color: val.clr || undefined,
            takeOff: val.x && val.x.takeOff !== undefined
        }
    })
}
