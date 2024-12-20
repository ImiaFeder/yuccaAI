let isRecording = false;
let socket;
let microphone;

const socket_port = 5001;
socket = io("http://" + window.location.hostname + ":" + socket_port.toString());

let transcriptBuffer = ""; // Buffer for full transcription
let silenceTimeout; // Timeout to detect silence
const SILENCE_DURATION = 1500; // 2 seconds of silence threshold

// Update captions on the webpage
socket.on("transcription_update", (data) => {
  document.getElementById("captions").innerHTML = data.transcription;
  console.log("data " + data);
  console.log("data transkrip : " + data.transcription);

  // Append transcription to buffer
  transcriptBuffer += data.transcription + " ";

  // Reset silence timeout whenever new transcription arrives
  resetSilenceTimeout();
});

// Reset silence detection timer
function resetSilenceTimeout() {
  clearTimeout(silenceTimeout);
  silenceTimeout = setTimeout(() => {
    console.log("Silence detected, sending transcription to Gemini...");
    sendToGemini(transcriptBuffer);
    transcriptBuffer = ""; // Clear buffer after sending
  }, SILENCE_DURATION);
}

// Fetch the microphone stream
async function getMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream, { mimeType: "audio/webm" });
  } catch (error) {
    console.error("Error accessing microphone:", error);
    throw error;
  }
}

// Open the microphone and stream data to the server
async function openMicrophone(microphone, socket) {
  return new Promise((resolve) => {
    microphone.onstart = () => {
      console.log("Client: Microphone opened");
      document.body.classList.add("recording");
      resolve();
    };
    microphone.ondataavailable = async (event) => {
      console.log("client: microphone data received");
      if (event.data.size > 0) {
        socket.emit("audio_stream", event.data);
      }
    };
    microphone.start(900); // Send data chunks every 700ms
  });
}

// Start recording function
async function startRecording() {
  isRecording = true;
  transcriptBuffer = ""; // Reset transcript buffer
  microphone = await getMicrophone();
  console.log("Client: Waiting to open microphone");
  await openMicrophone(microphone, socket);
}

// Stop recording and send transcript to Gemini
async function stopRecording() {
  if (isRecording === true) {
    microphone.stop();
    microphone.stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
    socket.emit("toggle_transcription", { action: "stop" });
    isRecording = false;

    console.log("Client: Microphone closed");
    document.body.classList.remove("recording");

    // Send any remaining transcription to Gemini
    // if (transcriptBuffer.length > 0) {
    //   console.log("Sending remaining transcription to Gemini...");
    //   await sendToGemini(transcriptBuffer);
    //   transcriptBuffer = ""; // Clear buffer
    // }
  }
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  const recordButton = document.getElementById("record");

  recordButton.addEventListener("click", () => {
    if (!isRecording) {
      socket.emit("toggle_transcription", { action: "start" });
      startRecording().catch((error) =>
        console.error("Error starting recording:", error)
      );
    } else {
      stopRecording().catch((error) =>
        console.error("Error stopping recording:", error)
      );
    }
  });
});

// Send transcript to server
async function sendToGemini(inputText) {
  try {
    const response = await fetch(
      `http://127.0.0.1:8001/send-to-gemini?text=${encodeURIComponent(inputText)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    const geminiResponse = data.response;

    console.log("Gemini Response:", geminiResponse);
    document.getElementById("gemini-response").innerText = geminiResponse;
  } catch (error) {
    console.error("Error sending to Gemini API:", error);
  }
}


