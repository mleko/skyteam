import { SpaceData, TrackData } from "./types"

interface TrackView {
    code: string
    spaces: SpaceView[]
}
interface SpaceView {
    player: "pilot" | "copilot"
    altitude: number
    plane: boolean
    reroll: boolean
    turbulence: boolean
    badVisibility: boolean
}

function dataToView(data: TrackData): TrackView {
    const n = data.spaces.length
    const track: TrackView = {
        code: data.code,
        spaces: data.spaces.map((dat: SpaceData, idx: number, arr: SpaceData[]): SpaceView => {
            return {
                player: (idx % 2) === (data.copilotLands ? 0 : 1) ? "copilot" : "pilot",
                altitude: (data.takeOff ? n - idx - 1 : idx) * 1000,
                plane: data.takeOff ? idx === (n - 1) : idx === 0,
                reroll: !!dat.reroll,
                badVisibility: !!dat.badVisibility,
                turbulence: !!dat.turbulence,
            }
        })
    }

    return track
}

export function Track(props: TrackData) {
    const view = dataToView(props)
    return (
        <svg className="track-img" fill="pink" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${spaceW} ${props.spaces.length * (spaceH + 1) + spaceH / 2 - 3}`}>
            {renderStrip(view.spaces.length)}
            {renderHeader(view.code)}
            {renderSpaces(view.spaces, spaceH / 2)}
        </svg>
    );
}

function renderStrip(n: number): JSX.Element {
    return <>
        <rect
            fill="#92a0a0"
            width={spaceW}
            height={spaceH / 2 + (spaceH + 1) * n}
        />
    </>
}

function renderHeader(code: string): any[] {
    const elements: any[] = []
    elements.push(<rect key="dbg2" height={2} width={spaceW} y={spaceH / 2 - 2} fill="white" rx={0} />)
    elements.push(<text key="txt1" y={spaceH/5 + 30} x={14} fill="white" style={{font: "950 65px sans-serif"}}>{code}</text>)
    return elements;
}

function renderSpaces(spacesData: SpaceView[], yOffset: number): any[] {
    const spaces: any[] = []
    for (let i = 0; i < spacesData.length; i++) {
        spaces.push(<Space key={i} idx={i} data={spacesData[i]} yOffset={yOffset} />)
    }
    return spaces
}

const baseSize = 300

const spaceW = baseSize * 0.956
const spaceH = baseSize * 0.524

const innerSpaceW = baseSize * 0.883
const innerSpaceH = baseSize * 0.403

function Space(props: { idx: number, data: SpaceView, yOffset: number }): JSX.Element {
    const { yOffset } = props
    const elements: any[] = []
    elements.push(<rect
        key="sep"
        fill="white"
        width={spaceW}
        height={1}
        y={spaceH}
    />)
    elements.push(<image key="bfg" href="assets/bg.png" width={innerSpaceW} height={innerSpaceH} y={(spaceH - innerSpaceH) / 2} x={(spaceW - innerSpaceW) / 2} />)
    
    elements.push(<svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 265 120" key="overlay" width={innerSpaceW} height={innerSpaceH} y={(spaceH - innerSpaceH) / 2} x={(spaceW - innerSpaceW) / 2} preserveAspectRatio="none">{overlay(props.data.player === "pilot")}</svg>)

    let horizonLeftLong = !props.data.plane;
    let horizonRightLong = !props.data.plane;

    if (props.data.plane) {
        elements.push(<image key="ap" href="assets/plane.png" height={baseSize * 0.203} width={baseSize * 0.524} x={baseSize * (1 - 0.524) / 2} y={(spaceH - baseSize * 0.203) / 2} />)
    }
    if (!props.data.plane) {
        const longL = 0.32;
        const short = 0.2
        elements.push(<line key="horL1" stroke="white" strokeWidth={1} x1={spaceW * (1-longL)/2} x2={spaceW * (1+longL)/2} y1={spaceH*0.25} y2={spaceH*0.25} />)
        elements.push(<line key="horL2" stroke="white" strokeWidth={1} x1={spaceW * (1-short)/2} x2={spaceW * (1+short)/2} y1={spaceH*0.3} y2={spaceH*0.3} />)
        elements.push(<line key="horL3" stroke="white" strokeWidth={1} x1={spaceW * (1-longL)/2} x2={spaceW * (1+longL)/2} y1={spaceH*0.35} y2={spaceH*0.35} />)
        elements.push(<line key="horL4" stroke="white" strokeWidth={1} x1={spaceW * (1-longL)/2} x2={spaceW * (1+longL)/2} y1={spaceH*0.65} y2={spaceH*0.65} />)
        elements.push(<line key="horL5" stroke="white" strokeWidth={1} x1={spaceW * (1-short)/2} x2={spaceW * (1+short)/2} y1={spaceH*0.7} y2={spaceH*0.7} />)
        elements.push(<line key="horL6" stroke="white" strokeWidth={1} x1={spaceW * (1-longL)/2} x2={spaceW * (1+longL)/2} y1={spaceH*0.75} y2={spaceH*0.75} />)
    }
    if (props.data.altitude > 0) {
        elements.push(<text key="alt" textAnchor="middle" fill="white" style={{ fontSize: spaceH * 0.22, fontWeight: "bold", letterSpacing: baseSize * 0.015 }} x={baseSize * 0.49} y={(spaceH + baseSize * 0.078) / 2}>{props.data.altitude}</text>)
    }
    {
        type icon = {key:string, icon:string}
        let leftIcons:  icon[] = [];
        if (props.data.turbulence) {
            leftIcons.push({key: "turb", icon: "assets/turbwind.svg"})
        }
        if (props.data.badVisibility) {
            leftIcons.push({key: "badVis", icon: "assets/hide.png"})
        }

        let rightIcons:  icon[] = [];
        if (props.data.reroll) {
            rightIcons.push({key: "reroll", icon: "assets/reroll.png"})
        }

        const swapPositions = props.data.player === "pilot" && leftIcons.length >= 2;
        if (swapPositions) {
            [leftIcons, rightIcons] = [rightIcons, leftIcons]
        }

        if (rightIcons.length > 0) {
            horizonRightLong = false;
            for (let i = 0; i < rightIcons.length; i++) {
                elements.push(<image key={rightIcons[i].key} href={rightIcons[i].icon} height={baseSize * 0.15} width={baseSize * 0.15} x={baseSize * (1 - 0.32)} y={(spaceH - baseSize * 0.15) / 2 +(baseSize * 0.15 * (i)) - (baseSize * 0.14 / 2 * (rightIcons.length-1))} />)
            }
        }
        if (leftIcons.length > 0) {
            horizonLeftLong = false;
            for (let i = 0; i < leftIcons.length; i++) {
                elements.push(<image key={leftIcons[i].key} href={leftIcons[i].icon} height={baseSize * 0.15} width={baseSize * 0.15} x={baseSize * (0.14)} y={(spaceH - baseSize * 0.15) / 2 +(baseSize * 0.15 * (i)) - (baseSize * 0.14 / 2 * (leftIcons.length-1))} />)
            }
        }
    }
    {
        const horizonOffset = 0.07;
        const horizonLengthLeft = !horizonLeftLong ? 0.04 : 0.2;
        const horizonLengthRight = !horizonRightLong ? 0.04 : 0.2;
        const horizonY = spaceH / 2

        elements.push(<line key="horizonL" stroke="white" strokeWidth={2} x1={spaceW * horizonOffset} x2={spaceW * (horizonOffset + horizonLengthLeft)} y1={horizonY} y2={horizonY} />)
        elements.push(<line key="horizonR" stroke="white" strokeWidth={2} x1={spaceW * (1 - horizonOffset - horizonLengthRight)} x2={spaceW * (1 - horizonOffset)} y1={horizonY} y2={horizonY} />)
    }
    return <g transform={`translate(0, ${props.idx * (spaceH + 1) + yOffset})`}>{elements}</g>
}

function overlay(pilot: boolean) {
    const color = pilot ? "#1bf" : "#fc8"
    return <g transform={pilot ? "" : "scale(-1,1) translate(-265,0)"}>
        <path d="m15,45v-34h235v34" stroke={color} stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <path d="m15,75v34h235v-34" stroke={color} stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <path d="m22,28,10-10v5h8v10h-8v5z" fill={color} stroke-linejoin="round" />
    </g>
}
