import { Button, Space, Tabs } from "antd";
import { TrackData } from "./ApproachTrack/types";
import { replace } from "typescript-array-utils";
import { emptyTrack } from "./ApproachTrack/data";
import {Tab} from "rc-tabs/lib/interface"
import { TrackTab } from "./ApproachTrack/TrackTab";

export function Tracks(props: { tracks: TrackData[], setTracks: (tracks: TrackData[]) => any }) {
    const tabs: Tab[] = props.tracks.map((val: TrackData, idx: number) => {
        return {
            key: "" + idx,
            children: <TrackTab track={val} setTrackData={(track: TrackData) => {
                props.setTracks(replace(props.tracks, idx, track))
            }} />,
            label: `${val.code} - ${val.name}` as string|React.ReactNode,
            closable: true
        }
    });
    tabs.push({
        key: "buttons",
        children: <Space/>,
        label: <>
            <Button onClick={() => {props.setTracks(props.tracks.concat(emptyTrack))}}>Add approach track</Button>
            </>,
        closable: false,
        disabled: true,
    })
    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            // noop
        } else {
            props.setTracks(props.tracks.filter((v, idx) => {
                return "" + idx !== targetKey
            }))
        }
    };
    return <Tabs items={tabs} onEdit={onEdit} type="editable-card" hideAdd={true}/>
}
