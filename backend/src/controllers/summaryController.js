import axios from "axios";
import Summary from "../models/Summary.js"; // import the model

export const generateSummary = async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    if (!transcript || !prompt) {
      return res.status(400).json({ message: "Transcript and prompt are required" });
    }

    // Call AI API
    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${prompt}\n\nTranscript:\n${transcript}`
            }
          ]
        }
      ]
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      }
    });

    // Extract summary from response
    const summaryText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Save to DB
    const savedSummary = await Summary.create({
      transcript,
      prompt,
      summary: summaryText
    });

    res.json({ summary: savedSummary.summary, id: savedSummary._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating summary" });
  }
};
