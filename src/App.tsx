import React, { useState } from 'react';
import './App.css';
import { Color, Module, Track, TrackData } from "./Track";
import {  ConfigProvider, Layout, theme } from "antd";
import { Tracks } from "./Tracks";
import { loadURL, setURL } from "./url";


const turns: [boolean, boolean, boolean, boolean, boolean] = [true, true, true, true, true]

const dat: TrackData = {
  name: "Warsaw Chopin Airport",
  code: "WAW",
  color: Color.red,
  spaces: [
    { planeCount: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: [false, true, true, true, false] },
    { planeCount: 2, trafficDice: 1, turns: [false, false, true, true, true] },
    { planeCount: 2, trafficDice: 0, turns: turns },
    { planeCount: 1, trafficDice: 0, turns: [true, true, true, false, false] },
    { planeCount: 0, trafficDice: 2, turns: turns },
  ],
  modules: [Module.wind, Module.fuel]
}
export const EmptyTrack: TrackData = {
  name: "Airport",
  code: "NEW",
  spaces: [
    { planeCount: 0, trafficDice: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: turns },
    { planeCount: 0, trafficDice: 0, turns: turns },
  ],
  modules: [],
}

function App() {
  const [data, setData] = useState<TrackData[]>( loadURL() || [dat])

  const setTrackData = (data: TrackData[]) => {
    setURL(data)
    setData(data)
  }

  const pages = [];
  for(let i = 0; i<data.length;i+=2) {
    const pageEls = [];
    pageEls.push(<div key={i} style={{display: "inline-block", verticalAlign: "top", marginRight: 10}}><Track {...data[i]}/></div>)
    if(i+1 < data.length) {
      pageEls.push(<div key={i+1} style={{display: "inline-block", verticalAlign: "top", marginRight: 10}}><Track {...data[i+1]}/></div>)
    }
    pages.push(<div key={i} className="page" style={{display: "inline-block", verticalAlign: "top"}}>{pageEls}</div>)
  }

  return (
    <ConfigProvider
      theme={{ algorithm: theme.compactAlgorithm }}
    >
      <Layout className="hidden-print">
        <Tracks tracks={data} setTracks={setTrackData}/>
      </Layout>
        <div className="only-print">
          {pages}
        </div>
    </ConfigProvider>
  );
}

export default App;
