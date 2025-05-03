const startButton = document.getElementById('start-recording');
const stopButton = document.getElementById('stop-recording');
const transcription = document.getElementById('transcription');
const emotion = document.getElementById('emotion');

let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert("Your browser does not support speech recognition.");
}

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    startButton.addEventListener('click', () => {
        recognition.start();
        startButton.disabled = true;
        stopButton.disabled = false;
        transcription.innerText = "Listening...";
    });

    stopButton.addEventListener('click', () => {
        recognition.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    });

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        transcription.innerText = `You said: "${text}"`;
        analyzeEmotion(text);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        transcription.innerText = "Error recognizing speech. Try again.";
        startButton.disabled = false;
        stopButton.disabled = true;
    };
}

// Simple emotion analysis using keywords
function analyzeEmotion(text) {
    const emotions = {
        happy: ["happy", "joy", "excited", "great", "amazing"],
        sad: ["sad", "down", "depressed", "unhappy", "cry"],
        angry: ["angry", "mad", "furious", "rage"],
        neutral: ["okay", "fine", "normal", "alright"]
    };

    let detectedEmotion = "neutral";

    for (let [emotionType, keywords] of Object.entries(emotions)) {
        for (let keyword of keywords) {
            if (text.toLowerCase().includes(keyword)) {
                detectedEmotion = emotionType;
                break;
            }
        }
    }

    emotion.innerText = `Detected Emotion: ${detectedEmotion.toUpperCase()}`;
}