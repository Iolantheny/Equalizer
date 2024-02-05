import { useRef, useState, useEffect } from "react";
import "./App.css";

function App() {
  const [music, setMusic] = useState(null);
  const audioRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    const borderWidth = 1;

    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = "rgb(255, 255, 255)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        canvasCtx.fillStyle = `rgb(0, 128, 0)`;
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        canvasCtx.strokeStyle = "rgb(255, 255, 255)";
        canvasCtx.lineWidth = borderWidth;
        canvasCtx.strokeRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      const audioSource = audioContext.createMediaElementSource(audioElement);
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);
      draw();
    }

    return () => {
      audioContext.close();
    };
  }, [music]);

  return (
    <div className="app">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="canvas"
      ></canvas>
      <div>
        {music && (
          <audio ref={audioRef} controls>
            <source src={URL.createObjectURL(music)} />
          </audio>
        )}
        <input
          type="file"
          name="music-file"
          onChange={({ target: { files } }) => setMusic(files[0])}
          accept="audio/*"
        />
      </div>
    </div>
  );
}

export default App;
