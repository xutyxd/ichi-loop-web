# <div style="display: flex; align-items: center; gap: 8px"><img src="./public/favicon.ico" alt="IchiLoop logo" height="38"> IchiLoop (壱Loop)</div>
*A YouTube Loop Pad Experiment*

---
## 🌐 Live Demo

🚀 **Try it now:** [https://ichi-loop.app](https://ichi-loop.app)

## 🎧 Overview

**IchiLoop (壱Loop)** is an experimental proof-of-concept project that explores the feasibility of using the **YouTube IFrame Player API** to create a functional **audio loop pad**.

The primary goal was to determine whether **seamless, low-latency audio loops** could be achieved by controlling a hidden YouTube player through JavaScript.

---

## 🧠 Core Concept

The application allows a user to:

- Load a YouTube video by its URL  
- Define a precise `startTime` and `endTime` for a segment of the video  
- Trigger **Play**, which starts the video at `startTime`  
- Define a **Loop** behavior, which plays the video indefinitely  
- Define a **Gate** behavior, which plays the video only while the pad is held down
- Define a **One-Shot** behavior, which triggers the video once from the `startTime` and stops after the `endTime`

By leveraging the YouTube API, the application can seamlessly control the playback of a video and ensure that the looped segment is consistent and precise.

---

## 🧩 Basic Features

- **Session Management** – Maintain a list of sessions (projects)  
- **Pad Grid** – A grid of pads for the active session  
- **Loop Configuration** – Add a YouTube URL, title, start time, and end time  
- **Playback Engine** – Core logic that toggles play/pause and enforces looping behavior  

---

## 🛠️ Tech Stack

| Technology | Description |
|-------------|-------------|
| [![Angular](https://img.shields.io/badge/Angular-v20-red?logo=angular)](https://angular.dev/) | Frontend framework used to build the SPA |
| [![YouTube IFrame API](https://img.shields.io/badge/YouTube-IFrame%20API-lightgrey?logo=youtube)](https://developers.google.com/youtube/iframe_api_reference) | Core “audio engine” for video playback and looping |

---

## 🚧 Status: Proof-of-Concept

This is an **experimental build** and not a full-fledged application.  
The core looping mechanism works, but several challenges remain before it could be production-ready:

- Mobile browser limitations  
- API latency  

---


### 💡 Author’s Note

This project was built as an experiment to explore creative uses of the YouTube API and modern frontend frameworks. Feedback, forks, and contributions are welcome!
