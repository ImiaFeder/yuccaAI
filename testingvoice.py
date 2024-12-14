from elevenlabs import generate, set_api_key

# Inisialisasi API key Anda
set_api_key("YOUR_API_KEY")

# Parameter teks yang akan diubah ke ucapan
def convert_text_to_speech(text, voice_id="21m00Tcm4TlvDq8ikWAM", model_id="eleven_multilingual_v2"):
    try:
        # Mengonversi teks ke ucapan
        audio = generate(
            text=text,
            voice=voice_id,
            model=model_id
        )

        # Menyimpan hasil audio ke file mp3
        output_file = "output_audio.mp3"
        with open(output_file, "wb") as f:
            f.write(audio)
        print(f"Audio berhasil disimpan di: {output_file}")

    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

# Contoh teks
example_text = "Hello! 你好! Hola! नमस्ते! Bonjour! こんにちは! مرحبا! 안녕하세요! Ciao! Cześć! Привіт! வணக்கம்!"

# Panggil fungsi untuk mengonversi teks ke ucapan
convert_text_to_speech(example_text)
