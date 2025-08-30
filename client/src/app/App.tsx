
import "./App.css";
import AudioRecorder from "../features/audioRecorder/AudioRecorder";

function App() {

  return (
    <div style={{ padding: 32 }}>
      <div style={{ minHeight: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
        <h2 style={{ margin: 0 }}>Audio Recorder Demo</h2>
      </div>
      <AudioRecorder />
    </div>
  );
}

export default App;