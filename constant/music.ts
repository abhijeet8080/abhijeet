export interface Track {
  id: string;
  title: string;
  artist: string;
  /**
   * Audio source. These are demo streams — replace with your own files:
   * drop mp3s into public/music/ and use src: "/music/your-track.mp3"
   */
  src: string;
  /** Cover art gradient [from, to] */
  colors: [string, string];
}

export const PLAYLIST: Track[] = [
  {
    id: "music",
    title: "Loser - Tame Impala",
    artist: "abhi os radio",
    src: "/music/music.mp3",
    colors: ["#4FC3F7", "#0A84FF"],
  },
  // {
  //   id: "midnight-compile",
  //   title: "Midnight Compile",
  //   artist: "abhi os radio",
  //   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  //   colors: ["#4FC3F7", "#0A84FF"],
  // },
  // {
  //   id: "deploy-2am",
  //   title: "Deploy at 2AM",
  //   artist: "abhi os radio",
  //   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  //   colors: ["#BF5AF2", "#5E5CE6"],
  // },
  // {
  //   id: "merge-conflict-blues",
  //   title: "Merge Conflict Blues",
  //   artist: "abhi os radio",
  //   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  //   colors: ["#FF9F0A", "#FF375F"],
  // },
  // {
  //   id: "refactor-rain",
  //   title: "Refactor Rain",
  //   artist: "abhi os radio",
  //   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  //   colors: ["#30D158", "#0D9488"],
  // },
  // {
  //   id: "production-down",
  //   title: "Production Is Down",
  //   artist: "abhi os radio",
  //   src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  //   colors: ["#F97316", "#EF4444"],
  // },
];
