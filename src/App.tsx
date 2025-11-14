import React, { useState } from 'react';
import './App.css';
import { ConfigProvider, Layout, theme } from "antd";

import { ApproachTrack, TrackData as ApproachTrackData, sampleTrack as sampleApproachTrack } from "./ApproachTrack"
import { AltitudeTrack, TrackData as AltitudeTrackData } from "./AltitudeTrack"
import { Tracks } from "./Tracks";
import { loadURL, setURL } from "./url";

export interface TracksData {
  approach: ApproachTrackData[]
  altitude: AltitudeTrackData[]
}

function App() {
  const [tracks, setTracks] = useState<TracksData>(loadURL() || { approach: [sampleApproachTrack], altitude: [] })

  const setTracksData = (tracks: TracksData) => {
    setURL(tracks)
    setTracks(tracks)
  }


  return (
    <ConfigProvider
      theme={{ algorithm: theme.compactAlgorithm }}
    >
      <Layout className="hidden-print">
        <Tracks tracks={tracks} setTracks={setTracksData} />
      </Layout>
      <div className="only-print">
        {renderPrint(tracks)}
      </div>
    </ConfigProvider>
  );
}

function renderPrint(tracks: TracksData) {
  const { approach, altitude } = tracks;
  const pages = [];
  for (let i = 0; i < approach.length; i += 2) {
    const pageEls = [];
    pageEls.push(<div key={i} style={{ display: "inline-block", verticalAlign: "top", marginRight: 2 }}><ApproachTrack {...approach[i]} /></div>)
    if (i + 1 < approach.length) {
      pageEls.push(<div key={i + 1} style={{ display: "inline-block", verticalAlign: "top", marginRight: 8 }}><ApproachTrack {...approach[i + 1]} /></div>)
    }
    pages.push(<div key={"app" + i} className="page" style={{ display: "inline-block", verticalAlign: "top" }}>{pageEls}</div>)
  }

  for (let i = 0; i < altitude.length; i += 2) {
    const pageEls = [];
    pageEls.push(<div key={i} style={{ display: "inline-block", verticalAlign: "top", marginRight: 2 }}><AltitudeTrack {...altitude[i]} /></div>)
    if (i + 1 < altitude.length) {
      pageEls.push(<div key={i + 1} style={{ display: "inline-block", verticalAlign: "top", marginRight: 8 }}><AltitudeTrack {...altitude[i + 1]} /></div>)
    }
    pages.push(<div key={"alt" + i} className="page" style={{ display: "inline-block", verticalAlign: "top" }}>{pageEls}</div>)
  }
  return pages;
}

export default App;
