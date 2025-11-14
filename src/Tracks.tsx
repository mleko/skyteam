import { Button, Col, Row, Space, Tabs } from "antd";
import { replace } from "typescript-array-utils";
import { Content } from "antd/es/layout/layout";
import { Tab } from "rc-tabs/lib/interface"

import { TracksData as TracksModel } from "./App";
import { ApproachTrack, InputForm as ApproachTrackInputForm, TrackData as ApproachTrackData, emptyTrack as emptyApproachTrack } from "./ApproachTrack";
import { AltitudeTrack, InputForm as AltitudeTrackInputForm, TrackData as AltitudeTrackData, emptyTrack as emptyAltitudeTrack } from "./AltitudeTrack";

export function Tracks(props: { tracks: TracksModel, setTracks: (tracks: TracksModel) => any }) {
    const setApproachTracks = (tracks: ApproachTrackData[]) => {
        props.setTracks(
            Object.assign({}, props.tracks, {approach: tracks})
        )
    }
    const setAltitudeTracks = (tracks: AltitudeTrackData[]) => {
        props.setTracks(
            Object.assign({}, props.tracks, {altitude: tracks})
        )
    }
    const tabs: Tab[] = [
        ...props.tracks.approach.map((val: ApproachTrackData, idx: number) => {
            return {
                key: "app" + idx,
                children: prepareTabContent(
                    <ApproachTrackInputForm data={val} onChange={(track: ApproachTrackData) => {setApproachTracks(replace(props.tracks.approach, idx, track))}}/>,
                    <ApproachTrack {...val}/>
                ),
                label: `${val.code} - ${val.name}` as string|React.ReactNode,
                closable: true
            }
        }),
        ...props.tracks.altitude.map((val: AltitudeTrackData, idx: number) => {
            return {
                key: "alt" + idx,
                children: prepareTabContent(
                    <AltitudeTrackInputForm data={val} onChange={(track: AltitudeTrackData) => {setAltitudeTracks(replace(props.tracks.altitude, idx, track))}}/>,
                    <AltitudeTrack {...val}/>
                ),
                label: `Altitude track ${val.code}` as string|React.ReactNode,
                closable: true
            }
        }),
    ];
    const onTabsEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            // noop
        } else {
            if (targetKey.toString().startsWith("app")){
                setApproachTracks(props.tracks.approach.filter((v, idx) => {
                    return "app" + idx !== targetKey
                }))
            } else if (targetKey.toString().startsWith("alt")){
                setAltitudeTracks(props.tracks.altitude.filter((v, idx) => {
                    return "alt" + idx !== targetKey
                }))
            }
        }
    };
    tabs.push({
        key: "buttons",
        children: <Space/>,
        label: <>
            <Button onClick={() => {setApproachTracks(props.tracks.approach.concat(emptyApproachTrack))}}>Add approach track</Button>
            <Button onClick={() => {setAltitudeTracks(props.tracks.altitude.concat(emptyAltitudeTrack(String.fromCodePoint(69 + props.tracks.altitude.length))))}}>Add altitude track</Button>
            </>,
        closable: false,
        disabled: true,
    })
    return <Tabs items={tabs} onEdit={onTabsEdit} type="editable-card" hideAdd={true}/>
}

function prepareTabContent(form: JSX.Element, track: JSX.Element): JSX.Element {
    return <Content style={{ padding: 24 }}>
        <Row>
            <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 12 }}>
                {form}
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 12 }} style={{ justifyContent: "center", display: "flex" }}>
                <div style={{ display: "flex", marginTop: 20 }}>
                    {track}
                </div>
            </Col>
        </Row>
    </Content>
}
