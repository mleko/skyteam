import React, { useState } from 'react';
import './App.css';
import { Track, } from "./ApproachTrack/Track";
import { TrackData as ApproachTrackData } from "./ApproachTrack/types"
import { sampleTrack } from "./ApproachTrack/data"
import { ConfigProvider, Layout, theme } from "antd";
import { Tracks } from "./Tracks";
import { loadURL, setURL } from "./url";

function App() {
  const [data, setData] = useState<ApproachTrackData[]>(loadURL() || [sampleTrack])

  const setTrackData = (data: ApproachTrackData[]) => {
    setURL(data)
    setData(data)
  }

  const pages = [];
  for (let i = 0; i < data.length; i += 2) {
    const pageEls = [];
    pageEls.push(<div key={i} style={{ display: "inline-block", verticalAlign: "top", marginRight: 10 }}><Track {...data[i]} /></div>)
    if (i + 1 < data.length) {
      pageEls.push(<div key={i + 1} style={{ display: "inline-block", verticalAlign: "top", marginRight: 10 }}><Track {...data[i + 1]} /></div>)
    }
    pages.push(<div key={i} className="page" style={{ display: "inline-block", verticalAlign: "top" }}>{pageEls}</div>)
  }

  return (
    <ConfigProvider
      theme={{ algorithm: theme.compactAlgorithm }}
    >
      <Layout className="hidden-print">
        <Tracks tracks={data} setTracks={setTrackData} />
      </Layout>
      <div className="only-print">
        {pages}
      </div>
    </ConfigProvider>
  );
}

export default App;
