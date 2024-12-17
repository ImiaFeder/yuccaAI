from deepgram import DeepgramClient, SpeakOptions

DEEPGRAM_API_KEY = ""

TEXT = {
    "text": "Halo namaku yucca, maskot unicorn dari Universitas Ciputra!"
}
FILENAME = "audio.mp3"


def main():
    try:
        deepgram = DeepgramClient(DEEPGRAM_API_KEY)

        options = SpeakOptions(
            model="aura-asteria-en",
        )

        response = deepgram.speak.v("1").save(FILENAME, TEXT, options)
        print(response.to_json(indent=4))

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    main()