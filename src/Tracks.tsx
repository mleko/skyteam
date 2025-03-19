import { Col, Row, Tabs } from "antd";
import { Module, Track, TrackData } from "./Track";
import { InputForm } from "./InputForm";
import { replace } from "typescript-array-utils";
import { EmptyTrack } from "./App";
import { Content } from "antd/es/layout/layout";

export function Tracks(props: { tracks: TrackData[], setTracks: (tracks: TrackData[]) => any }) {
    const tabs = props.tracks.map((val: TrackData, idx: number) => {
        return {
            key: "" + idx,
            children: <TrackRow track={val} setTrackData={(track: TrackData) => {
                props.setTracks(replace(props.tracks, idx, track))
            }} />,
            label: `${val.code} - ${val.name}`
        }
    });
    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            props.setTracks(props.tracks.concat(EmptyTrack))
        } else {
            props.setTracks(props.tracks.filter((v, idx) => {
                return "" + idx !== targetKey
            }))
        }
    };
    return <Tabs items={tabs} onEdit={onEdit} type="editable-card" />
}

function TrackRow(props: { track: TrackData, setTrackData: (nData: TrackData) => any }) {
    const { track, setTrackData: setData } = props

    const setTrackData = (nData: TrackData) => {
        if (track.modules.indexOf(Module.skill1) !== -1 && nData.modules.indexOf(Module.skill2) !== -1) {
            nData = Object.assign({}, nData, { modules: nData.modules.filter((val) => val !== Module.skill1) })
        }
        if (track.modules.indexOf(Module.skill2) !== -1 && nData.modules.indexOf(Module.skill1) !== -1) {
            nData = Object.assign({}, nData, { modules: nData.modules.filter((val) => val !== Module.skill2) })
        }
        const cpy = nData.modules.concat([])
        nData = Object.assign({}, nData, {
            modules: cpy.sort((a: Module, b: Module) => {
                if (a === Module.skill1 || a === Module.skill2) {
                    return 1
                } else if (b === Module.skill1 || b === Module.skill2) {
                    return -1
                }
                return 0
            })
        })
        setData(nData)
    }

    return  <Content style={{ padding: 24 }}>
        <Row>
            <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 12 }}>
                <InputForm data={track} onChange={setTrackData} />
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 12 }} style={{ justifyContent: "center", display: "flex" }}>
                <div style={{ display: "flex", marginTop: 122 }}>
                    <Track {...track} />
                </div>
            </Col>
        </Row>
    </Content>
}
