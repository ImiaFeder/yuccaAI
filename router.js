const express = require('express');
const router = express.Router();

// Konfigurasi API Key untuk Gemini
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const genAI = new GoogleGenerativeAI("AIzaSyDph-qHn3vEm8wbBScbQai0aIqkj-BZC0U");
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig : generationConfig
  });
  
  
  router.get('/send-to-gemini', async (req, res) => {
    const { text } = req.query; // Ambil teks dari query parameter
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }
    try {
      const chatSession = model.startChat({ history: [] });
      const result = await chatSession.sendMessage(text);
      const responseText = result.response.text();
  
      // Kirimkan respons dari Gemini API kembali ke client
      res.json({ response: responseText });
    } catch (error) {
      console.error('Error with Gemini API:', error);
      res.status(500).json({ error: 'Failed to process the text' });
    }
  });
  
  module.exports = router;