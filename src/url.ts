import JsonURL from "@jsonurl/jsonurl";
import {z} from 'zod'

import {allFalse, allTrue} from "./util";
import {TracksData} from "./App";
import {Color, Module, SpaceData as ApproachSpaceData, TrackData, Turns} from "./ApproachTrack";
import {SpaceData as AltitudeSpaceData, TrackData as AltitudeTrackData} from "./AltitudeTrack";

const zTurnL = z.union([z.literal("t"), z.literal("f")])
const zAppSpaceFlag = z.enum(["alarm", "silence"])

const zAppTurnExport = z.tuple([
    zTurnL, zTurnL, zTurnL, zTurnL, zTurnL
])

const zAppSpaceExport = z.object({
    pc: z.number().int().optional(),
    td: z.number().int().optional(),
    trn: zAppTurnExport.optional(),
    fg: z.array(zAppSpaceFlag).optional(),
})

const zAppTrackExport = z.object({
    n: z.string(),
    c: z.string(),
    s: z.array(zAppSpaceExport),
    m: z.nativeEnum(Module).array().optional(),
    clr: z.union([z.nativeEnum(Color), z.literal("auto")]).optional(),
    x: z.object({
        takeOff: z.object({}).optional()
    }).optional(),
})

type appTrackExport = z.infer<typeof zAppTrackExport>
type appSpaceExport = z.infer<typeof zAppSpaceExport>
type appTurnExport = z.infer<typeof zAppTurnExport>
type appSpaceFlag = z.infer<typeof zAppSpaceFlag>

///

const zAltSpaceFlag = z.enum(["reroll", "bad-vis", "tur-wind"])

const zAltSpaceExport = z.object({
    fg: z.array(zAltSpaceFlag).optional(),
})

const zAltTrackExport = z.object({
    c: z.string(),
    s: z.array(zAltSpaceExport),
    x: z.object({
        takeOff: z.object({}).optional(),
        copilotLands: z.object({}).optional()
    }).optional(),
})

type altTrackExport = z.infer<typeof zAltTrackExport>
type altSpaceExport = z.infer<typeof zAltSpaceExport>
type altSpaceFlag = z.infer<typeof zAltSpaceFlag>

///

const zV1Export = z.object({
    app: zAppTrackExport.array().optional(),
    alt: zAltTrackExport.array().optional(),
    v: z.literal(1)
})

type v1Export = z.infer<typeof zV1Export>

///

export function setURL(data : TracksData) {
    const url = new URL(window.location.href)
    const t = JsonURL.stringify(toExport(data))
    if (t) {
        url.hash = t
    }
    window.history.replaceState(null, "", url)
}

const parsers = [parseV0, parseV1]

export function loadURL() : TracksData | undefined {
    try {
        const url = new URL(window.location.href)
        const t = url.hash.substring(1)
        if (t) {
            const raw = JsonURL.parse(t)
            const version = raw["v"] || 0
            if(!(version in parsers)) {
                throw new Error("Unknown version")
            }
            return parsers[version](raw)
            
        }
    } catch(e) {
        console.error("Failed to load url data")
    }
    return undefined
}

function parseV0(raw: any): TracksData {
    const exTrack = zAppTrackExport.array().parse(raw)
    return {approach: fromAppTrackExport(exTrack), altitude: []}
}

function parseV1(raw: any): TracksData {
    const tracks = zV1Export.parse(raw)
    return {
        approach: fromAppTrackExport(tracks.app || []), 
        altitude: fromAltTrackExport(tracks.alt || []),
    }
}

function toExport(tracks: TracksData): v1Export {
    const exp: v1Export = {
        app: tracks.approach.length > 0 ? toAppTrackExport(tracks.approach) : undefined,
        alt: tracks.altitude.length > 0 ? toAltTrackExport(tracks.altitude) : undefined,
        v: 1
    }
    if (exp.app === undefined) { delete exp.app }
    if (exp.alt === undefined) { delete exp.alt }
    return exp;
}

function toAppTrackExport(tracks: TrackData[]): appTrackExport[] {
    return tracks.map((val: TrackData) => {
        const e: appTrackExport = {
            n: val.name,
            c: val.code,
            s: val.spaces.map((val: ApproachSpaceData) => {
                const sd: appSpaceExport = {}
                if (val.planeCount) {
                    sd.pc = val.planeCount
                }
                if (val.trafficDice) {
                    sd.td = val.trafficDice
                }
                if (!(allTrue(val.turns) || allFalse(val.turns))) {
                    sd.trn = val.turns.map((v) => v ? "t" : "f") as appTurnExport
                }
                const flags: Array<appSpaceFlag> = [];
                if (val.alarm){
                    flags.push("alarm")
                }
                if (val.totalTrust) {
                    flags.push("silence")
                }
                if (flags.length){
                    sd.fg = flags;
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

function toAltTrackExport(tracks: AltitudeTrackData[]): altTrackExport[] {
    return tracks.map((val: AltitudeTrackData) => {
        const e: altTrackExport = {
            c: val.code,
            s: val.spaces.map((val: AltitudeSpaceData): altSpaceExport => {
                const sd: altSpaceExport = {}
                const flags: Array<altSpaceFlag> = [];
                if (val.reroll){
                    flags.push("reroll")
                }
                if (val.badVisibility) {
                    flags.push("bad-vis")
                }
                if (val.turbulence) {
                    flags.push("tur-wind")
                }
                if (flags.length){
                    sd.fg = flags;
                }
                return sd
            }),
        }
        if (val.takeOff || val.copilotLands) {
            e.x = {}
            if (val.takeOff) {
                e.x.takeOff = {}
            }
            if (val.copilotLands) {
                e.x.copilotLands = {}
            }
        }
        return e
    })
}

function fromAppTrackExport(tracks: appTrackExport[]): TrackData[] {
    return tracks.map((val) => {
        return {
            name: val.n,
            code: val.c,
            modules: val.m || [],
            spaces: val.s.map((sVal): ApproachSpaceData => {
                return {
                    turns: sVal.trn ? sVal.trn.map((v) => v === "t") as Turns : [true, true, true, true, true],
                    planeCount: sVal.pc || 0,
                    trafficDice: sVal.td || 0,
                    alarm: (sVal.fg || []).indexOf("alarm") !== -1,
                    totalTrust:  (sVal.fg || []).indexOf("silence") !== -1,
                }
            }),
            color: val.clr || undefined,
            takeOff: val.x && val.x.takeOff !== undefined
        }
    })
}

function fromAltTrackExport(tracks: altTrackExport[]): AltitudeTrackData[] {
    return tracks.map((val) => {
        return {
            code: val.c,
            spaces: val.s.map((sVal): AltitudeSpaceData => {
                return {
                    reroll: (sVal.fg || []).indexOf("reroll") !== -1,
                    badVisibility: (sVal.fg || []).indexOf("bad-vis") !== -1,
                    turbulence: (sVal.fg || []).indexOf("tur-wind") !== -1,
                }
            }),
            takeOff: val.x && val.x.takeOff !== undefined,
            copilotLands: val.x && val.x.copilotLands !== undefined,
        }
    })
}
