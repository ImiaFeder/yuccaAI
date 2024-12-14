<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Interface</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .chat-container {
            max-width: 600px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .message {
            margin-bottom: 15px;
        }
        .message label {
            font-weight: bold;
        }
        .response {
            margin-top: 10px;
            padding: 10px;
            background-color: #f4f4f4;
            border-radius: 5px;
        }
        button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
        }
        button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <h2>Chatbot</h2>
        <form method="POST" action="index.php">
            <div class="message">
                <label for="question">Masukkan Pertanyaan Anda:</label>
                <textarea name="question" id="question" rows="4" style="width: 100%;"></textarea>
            </div>
            <button type="submit">Kirim</button>
        </form>

        <?php
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $user_input = $_POST["question"];
            if (!empty($user_input)) {
                // Kirim permintaan ke Flask API
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "http://localhost:5000/chat");
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["question" => $user_input]));
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                $response = curl_exec($ch);
                curl_close($ch);

                if ($response) {
                    $response_data = json_decode($response, true);

                    // Jika ada kesalahan dari API, tampilkan pesan error
                    if (isset($response_data['error'])) {
                        echo "<div class='response'>Error: " . htmlspecialchars($response_data['error']) . "</div>";
                    } else {
                        // Tampilkan jawaban dari model
                        echo "<div class='response'><strong>Jawaban:</strong><br>" . htmlspecialchars($response_data['response']) . "</div>";
                    }
                } else {
                    echo "<div class='response'>Gagal terhubung ke backend.</div>";
                }
            } else {
                echo "<div class='response'>Mohon masukkan pertanyaan.</div>";
            }
        }
        ?>
    </div>
</body>
</html>
