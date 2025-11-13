import { Col, Row} from "antd";
import { Track } from "./Track";
import { Module, TrackData } from "./types"
import { InputForm } from "./InputForm";
import { Content } from "antd/es/layout/layout";

export function TrackTab(props: { track: TrackData, setTrackData: (nData: TrackData) => any }) {
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
