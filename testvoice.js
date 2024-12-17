import { ElevenLabsClient } from "elevenlabs";

// Inisialisasi ElevenLabs Client dengan API key Anda
const client = new ElevenLabsClient({ apiKey: "YOUR_API_KEY" });

// Fungsi untuk mengonversi teks ke ucapan
async function convertTextToSpeech() {
    try {
        const audio = await client.textToSpeech.convert("21m00Tcm4TlvDq8ikWAM", {
            model_id: "eleven_multilingual_v2",
            text: "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요! Ciao! Cześć! Привіт! வணக்கம்!"
        });

        // Simpan hasil ke file audio
        const fs = require("fs");
        fs.writeFileSync("output_audio.mp3", audio);
        console.log("Audio berhasil disimpan di: output_audio.mp3");
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
}

// Panggil fungsi
convertTextToSpeech();
