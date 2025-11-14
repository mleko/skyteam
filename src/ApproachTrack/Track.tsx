import { allFalse, allTrue } from "../util"
import { trackColor } from "./trackColor"
import { Color, Module, SpaceData, TrackData, Turns } from "./types"

interface TrackView {
    name: string
    code: string
    color?: Color
    spaces: SpaceView[]
    modules: Module[]
}
interface SpaceView {
    planeCount: number
    airport: boolean
    clouds: boolean
    trafficDice: number
    turns: Turns
    alarm: boolean
    silence: boolean
}

function dataToView(data: TrackData): TrackView {
    const n = data.spaces.length
    const track: TrackView = {
        code: data.code,
        name: data.name,
        color: data.color === "auto" ? trackColor(data) : data.color,
        modules: data.modules,
        spaces: data.spaces.map((dat: SpaceData, idx: number, arr: SpaceData[]) => {
            return {
                planeCount: dat.planeCount || 0,
                trafficDice: dat.trafficDice || 0,
                turns: dat.turns,
                airport: data.takeOff ? idx === (n-1) : idx === 0,
                clouds: !data.takeOff ? idx === (n-1) : idx === 0,
                alarm: dat.alarm || false,
                silence: dat.totalTrust || false
            }
        })
    }

    return track
}

export function Track(props: TrackData){
    const view = dataToView(props)
    return ( 
        <svg className="track-img" fill="pink" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${spaceW} ${props.spaces.length * (spaceH+1) + spaceH/2-3}`}>
            <filter id="filter_black">
                <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.00 0 0 0 0
                        0.00 0 0 0 0
                        0.00 0 0 0 0
                        0 0 0 0.80 0" />
            </filter>
            <filter id="filter_red">
                <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.80 0 0 0 0
                        0.02 0 0 0 0
                        0.01 0 0 0 0
                        0 0 0 0.70 0" />
            </filter>
            <filter id="filter_yellow">
                <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1.00 0 0 0 0
                        0.45 0 0 0 0
                        0.00 0 0 0 0
                        0 0 0 0.8 0" />
            </filter>
            <filter id="filter_green">
                <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0.35 0 0 0 0
                        0.80 0 0 0 0
                        0.05 0 0 0 0
                        0 0 0 0.70 0" />
            </filter>
            {renderStrip(view.spaces.length, view.color)}
            {renderHeader(view.name, view.code, view.modules)}
            {renderSpaces(view.spaces, spaceH/2)}
        </svg>
    );
}

function renderStrip(n: number, color?: Color): JSX.Element {
    return <>
        <rect
            fill="#92a0a0"
            width={spaceW}
            height={spaceH/2 + (spaceH+1)*n}
        />
        {color ? <image key="overlay" width={spaceW} height={spaceH/2+spaceH} href="assets/trackmask.png" preserveAspectRatio="none" filter={`url(#filter_${color})`}/> : null}
    </>
}

function renderHeader(name: string, code: string, modules: Module[]): any[] {
    const elements: any[] = []
    elements.push(<rect key="dbg2" height={2} width={spaceW} y={spaceH/2-2} fill="white" rx={0}/>)
    elements.push(<text key="txt1" y={spaceH/5 + 5} x={14} fill="white" style={{font: "950 25px sans-serif"}}>{code}</text>)
    elements.push(<text key="txt2" y={spaceH/5 + 30} x={14} fill="white" style={{font: "950 20px sans-serif"}}>{name}</text>)
    for (let i = 0; i < modules.length; i++) {
        elements.push(<image key={`module${i}`} href={`assets/${modules[modules.length - i - 1]}.png`} width={26} height={26} x={spaceW - 40 - i * 30} y={12}/>)
    }
    return elements;
}

function renderSpaces(spacesData: SpaceView[], yOffset: number): any[] {
    const spaces: any[] = []
    for(let i = 0; i<spacesData.length; i++) {
        spaces.push(<Space key={i} idx={i} data={spacesData[i]} yOffset={yOffset}/>)
    }
    return spaces
}

const baseSize = 300

const spaceW = baseSize * 0.956
const spaceH = baseSize * 0.524

const innerSpaceW = baseSize * 0.883
const innerSpaceH = baseSize * 0.403

function Space(props: {idx: number, data: SpaceView, yOffset: number}): JSX.Element {
    const {yOffset} = props
    const elements: any[] = []
    elements.push(<rect
        key="sep"
        fill="white"
        width={spaceW}
        height={1}
        y={spaceH}
    />)
    elements.push(<image key="bfg" href="assets/bg.png" width={innerSpaceW} height={innerSpaceH} y={(spaceH-innerSpaceH)/2} x={(spaceW-innerSpaceW)/2}/>)
    elements.push(...renderPlanes(props.data.planeCount))

    if (props.data.airport) {
        elements.push(<image key="ap" href="assets/airport2.png" height={baseSize * 0.223} width={baseSize * 0.524} x={baseSize * (1-0.524) / 2} y={(spaceH -  baseSize * 0.223) / 2}/>)
    }
    if (props.data.clouds) {
        elements.push(<image key="cd" href="assets/cloud.svg" height={baseSize * 0.523} width={baseSize * 0.924} x={baseSize * (1-0.974) / 2} y={(spaceH -  baseSize * 0.573) / 2}/>)
    }
    if (props.data.trafficDice) {
        elements.push(...renderTrafficDies(props.data.trafficDice))
    }
    if (props.data.turns && !allTrue(props.data.turns) && !allFalse(props.data.turns)) {
        elements.push(...renderWinds(props.data.turns))
    }
    if (props.data.alarm) {
        elements.push(<image key="alarm" href="assets/alarm.png" height={baseSize * 0.10} width={baseSize * 0.10} x={baseSize * 0.79} y={(baseSize * .17) / 2}/>)
    }
    if (props.data.silence) {
        elements.push(<image key="mute" href="assets/mute.svg" height={baseSize * 0.10} width={baseSize * 0.10} x={baseSize * 0.79} y={(baseSize * (.17 + (props.data.alarm ? .25 : 0))) / 2}/>)
    }
    return <g transform={`translate(0, ${props.idx * (spaceH+1) + yOffset})`}>{elements}</g>
}

function renderPlanes(no: number): any[] {
    if (no === 0){return []}
    const size = baseSize * 0.065 //0.085;// 0.102;
    const parentSize = spaceH;
    const baseOffset = (parentSize - ((no-1)*size*1.2+size))/2
    const planes: any[] = []
    for(let i = 0; i<no; i++) {
        planes.push(<image key={`p${i}`} href="assets/inc_plane.png" height={size} width={size} x={(spaceW - innerSpaceW)/2 + 5} y={baseOffset + size*i*1.2}/>)
    }
    return planes
}

function renderTrafficDies(no: number): any[] {
    const elements: any[] = []

    const baseH = baseSize * 0.141
    const baseW = baseH * (no+0.6)

    elements.push(<rect key="dbg1" height={baseH - 15} width={baseW} x={(spaceW-baseW)/2} y={innerSpaceH + (spaceH - innerSpaceH)/2 - baseH + 15} fill="white"/>)
    elements.push(<rect key="dbg2" height={baseH} width={baseW} x={(spaceW-baseW)/2} y={innerSpaceH + (spaceH - innerSpaceH)/2 - baseH} fill="white" rx={10}/>)
    const dieSize = baseH * 0.8
    const xOffset = (spaceW-baseW)/2
    const xxOffset = (baseW - dieSize * no)/2
    for(let i = 0; i<no; i++) {
        elements.push(<image key={`d${i}`} href="assets/traffic_die.png" height={dieSize} width={dieSize} x={xOffset + xxOffset + dieSize * (i)} y={innerSpaceH + (spaceH - innerSpaceH)/2 - baseH + 5}/>)
    }

    return elements
}

function renderWinds(winds: [boolean, boolean, boolean, boolean, boolean]): any[] {
    const elements: any[] = []

    const baseH = baseSize * 0.141
    const baseW = baseSize * 0.272

    elements.push(<rect key="wbg1" height={baseH - 15} width={baseW} x={(spaceW-baseW)/2} y={0} fill="white"/>)
    elements.push(<rect key="wbg2" height={baseH} width={baseW} x={(spaceW-baseW)/2} y={0} fill="white" rx={10}/>)

    const width = baseSize * 0.04
    const height = baseSize * 0.049
    const crossPart = width / 3.5

    const offsetX = (spaceW - width) / 2
    const offsetY = (baseH - height) / 4

    for(let i = 0; i < winds.length; i++) {
        const rotate = 30 * (i-2)
        const fill = i === 2 ? "black" : "white"
        if (winds[i]) {
            elements.push(<polygon key={`w${i}`} points={`${offsetX},${offsetY} ${offsetX+width},${offsetY} ${offsetX+width/2},${offsetY+height}`} style={{fill:fill, stroke:"green", strokeWidth:1}} transform={`rotate(${rotate}, ${spaceW/2}, ${spaceH/4})`}/>)
        } else {
            elements.push(
                <g key={`w${i}`} transform={`rotate(${rotate}, ${spaceW/2}, ${spaceH/4})`}>
                    <polygon points={`${offsetX + crossPart},${offsetY} ${offsetX+crossPart*2},${offsetY} ${offsetX+crossPart*2},${offsetY+crossPart} ${offsetX+crossPart*3},${offsetY+crossPart} ${offsetX+crossPart*3},${offsetY+crossPart*2} ${offsetX+crossPart*2},${offsetY+crossPart*2} ${offsetX+crossPart*2},${offsetY+crossPart*3} ${offsetX+crossPart},${offsetY+crossPart*3} ${offsetX+crossPart},${offsetY+crossPart*2} ${offsetX+crossPart},${offsetY+crossPart*2} ${offsetX},${offsetY+crossPart*2} ${offsetX},${offsetY+crossPart*1} ${offsetX+crossPart},${offsetY+crossPart*1}`} style={{fill:"red", stroke:"red", strokeWidth:1}} transform={`rotate(45, ${offsetX+crossPart*3/2}, ${offsetY+crossPart*3/2})`}/>
                </g>
            )
        }
    }

    return elements
}
