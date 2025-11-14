import { Card, Checkbox, Collapse, Form, Input, InputNumber, Space, Switch, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { replace } from "typescript-array-utils";
import { SpaceData, TrackData } from "./types";

export function InputForm(props: { data: TrackData, onChange: (s: TrackData) => any }) {

    const onCountChange = (value: number | null) => {
        if (value === null) { return }
        const sliced = props.data.spaces.slice(0, value)
        const expanded = sliced.concat(Array(value - sliced.length).fill({planeCount: 0, trafficDice:0, turns: Array(5).fill(true) }))
        props.onChange(Object.assign({}, props.data, { spaces: expanded }))
    }
    const onSpaceChange = (value: SpaceData, idx: number) => {
        props.onChange(Object.assign({}, props.data, { spaces: replace(props.data.spaces, idx, value) }))
    }
    const onTakeOffChange = (checked: boolean) => {
        props.onChange(Object.assign({}, props.data, {takeOff: checked}))
    }

    const collapseItems = [
        {
            key: 'more',
            label: 'More options...',
            children: <>
                <Form.Item label="Takeoff mode">
                    <Space>
                        <Form.Item name="takeoff" noStyle>
                            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked={props.data.takeOff || false} onChange={onTakeOffChange}/>
                        </Form.Item>
                        <Typography.Link href="https://boardgamegeek.com/thread/3338779/a-take-off-version">Rules</Typography.Link>
                    </Space>
                </Form.Item>
                <Form.Item label="Copilot lands">
                    <Space>
                        <Form.Item name="copilot-lands" noStyle>
                            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked={props.data.copilotLands || false} onChange={(checked) => {props.onChange(Object.assign({}, props.data, {copilotLands: checked}))}}/>
                        </Form.Item>
                    </Space>
                </Form.Item>
            </>
          }
    ]

    return (<Form size="small">
        <Card>
            <Form.Item name="spaceCount" label="Number of spaces">
                <InputNumber min={1} max={10} defaultValue={props.data.spaces.length} onChange={onCountChange} />
            </Form.Item>
            <Form.Item name="trackCode" label="Track code">
                <Input defaultValue={props.data.code} maxLength={2} onChange={(evt) => {props.onChange(Object.assign({}, props.data, {code: evt.currentTarget.value}))}} />
            </Form.Item>
            <Collapse items={collapseItems} bordered={false} ghost={true}/>
        </Card>
        {props.data.spaces.map((val, idx) => {
            return <SpaceInputForm key={idx} idx={idx} space={val} onChange={(v) => onSpaceChange(v, idx)} />
        })}
    </Form>)
}

function SpaceInputForm(props: { space: SpaceData, idx: number, onChange: (s: SpaceData) => any }) {
    const s = props.space
    return <Card style={{minHeight: 165}}>
        <Form.Item name={`reroll`} label="Reroll">
            <Checkbox checked={props.space.reroll} style={{margin: 2}} onChange={(e) => {
                props.onChange(Object.assign({}, s, { reroll: e.target.checked }))
            }}/>
        </Form.Item>
        <Form.Item name={`bad-vis`} label="Bad visibility">
            <Checkbox checked={props.space.badVisibility} style={{margin: 2}} onChange={(e) => {
                props.onChange(Object.assign({}, s, { badVisibility: e.target.checked }))
            }}/>
        </Form.Item>
                <Form.Item name={`turbulence`} label="Turbulence">
            <Checkbox checked={props.space.turbulence} style={{margin: 2}} onChange={(e) => {
                props.onChange(Object.assign({}, s, { turbulence: e.target.checked }))
            }}/>
        </Form.Item>
    </Card>
}
