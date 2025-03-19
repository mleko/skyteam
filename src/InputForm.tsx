import { Card, Checkbox, Collapse, Form, Input, InputNumber, Radio, RadioChangeEvent, Select, Space, Switch, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Module, SpaceData, TrackData, Turns } from "./Track";
import { replace } from "typescript-array-utils";

interface ModuleOption {
    label: string
    value: string
    excludes?: string
}
const modules: ModuleOption[] = [
    {
        label: "1 Special ability",
        value: "skill1",
    },
    {
        label: "2 Special abilities",
        value: "skill2",
    },
    {
        label: "Ice brakes",
        value: "ice"
    },
    {
        label: "Intern",
        value: "intern"
    },
    {
        label: "Kerosene",
        value: "fuel"
    },
    {
        label: "Kerosene leak",
        value: "leak"
    },
    {
        label: "Wind",
        value: "wind"
    },
]

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
    const onModuleChange = (val: Module[], option: ModuleOption | ModuleOption[]) => {
        props.onChange(Object.assign({}, props.data, {modules: val}))
    }
    const onColorChange = (e: RadioChangeEvent) => {
        props.onChange(Object.assign({}, props.data, {color: e.target.value ? e.target.value : null}))
    }
    const onTakeOffChange = (checked: boolean) => {
        props.onChange(Object.assign({}, props.data, {takeOff: checked}))
    }

    const collapseItems = [
        {
            key: 'more',
            label: 'More options...',
            children: <>
                <Form.Item label="Color">
                    <Space>
                        <Form.Item name="color" noStyle>
                            <Radio.Group defaultValue={props.data.color || ""} buttonStyle="solid" onChange={onColorChange}>
                                <Radio.Button value="">None</Radio.Button>
                                <Radio.Button value="green">Green</Radio.Button>
                                <Radio.Button value="yellow">Yellow</Radio.Button>
                                <Radio.Button value="red">Red</Radio.Button>
                                <Radio.Button value="black">Black</Radio.Button>
                                <Radio.Button value="auto">Auto</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Typography.Link href="https://boardgamegeek.com/filepage/278760/skyteam-difficulty-calculator">Base for auto</Typography.Link>
                    </Space>
                </Form.Item>
                <Form.Item label="Takeoff mode">
                    <Space>
                        <Form.Item name="takeoff" noStyle>
                            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked={props.data.takeOff || false} onChange={onTakeOffChange}/>
                        </Form.Item>
                        <Typography.Link href="https://boardgamegeek.com/thread/3338779/a-take-off-version">Rules</Typography.Link>
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
            <Form.Item name="airportName" label="Airport name">
                <Input defaultValue={props.data.name} onChange={(evt) => {props.onChange(Object.assign({}, props.data, {name: evt.currentTarget.value}))}} />
            </Form.Item>
            <Form.Item name="airportCode" label="Airport code">
                <Input defaultValue={props.data.code} onChange={(evt) => {props.onChange(Object.assign({}, props.data, {code: evt.currentTarget.value}))}} />
            </Form.Item>
            <Form.Item name="modules" label="Modules" valuePropName="_">
                <Select mode="multiple" allowClear options={modules} value={props.data.modules} onChange={onModuleChange}/>
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
        <Form.Item name={`plane count ${props.idx}`} label="Number of planes">
            <InputNumber defaultValue={s.planeCount || 0} min={0} max={4} onChange={(value) => {
                props.onChange(Object.assign({}, s, { planeCount: value }))
            }} />
        </Form.Item>
        <Form.Item name={`dice count ${props.idx}`} label="Number of traffic dice">
            <InputNumber defaultValue={s.trafficDice || 0} min={0} max={4} onChange={(value) => {
                props.onChange(Object.assign({}, s, { trafficDice: value }))
            }} />
        </Form.Item>
        <Form.Item name={`wind ${props.idx}`} label="Turns">
            <TurnBoxes turns={props.space.turns} onChange={(value) => {
                props.onChange(Object.assign({}, s, { turns: value }))
            }}/>
        </Form.Item>
    </Card>
}

function TurnBoxes(props: { turns: Turns, onChange: (turns: Turns) => any }) {
    return <>{
        props.turns.map((val, idx) => {
            return <Checkbox key={idx} checked={props.turns[idx]} style={{margin: 2}} onChange={(e) => {
                props.onChange(replace(props.turns, idx, e.target.checked) as Turns)
            }}/>
        })
    }
    </>
}
