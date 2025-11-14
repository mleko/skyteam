import {TrackData} from "./types"

export const emptyTrack = (code : string) : TrackData => {
  return {code: code, spaces: [
      {},
      {},
      {},
      {},
      {}, 
      {}, 
      {}
    ]}
}
