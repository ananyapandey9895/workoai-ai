const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only .txt and .pdf files are allowed'));
    }
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getPromptForStyle = (text, style) => {
  const prompts = {
    brief: `Provide a brief, concise summary of the following text in 2-3 sentences. Do not use asterisks or special formatting characters:\n\n${text}`,
    detailed: `Provide a comprehensive and detailed summary of the following text, covering all key points and important details. Write in plain text without using asterisks, bold formatting, or any special characters:\n\n${text}`,
    bullets: `Summarize the following text as clear, concise bullet points. Use bullet points (•) to list the main ideas. Do not use asterisks or any markdown formatting:\n\n${text}`
  };
  return prompts[style] || prompts.brief;
};

app.post('/api/summarize', async (req, res) => {
  try {
    const { text, style = 'brief' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text input is required' });
    }

    if (text.length < 50) {
      return res.status(400).json({ error: 'Text must be at least 50 characters long' });
    }

    if (text.length > 50000) {
      return res.status(400).json({ error: 'Text exceeds maximum length of 50,000 characters' });
    }

    if (!['brief', 'detailed', 'bullets'].includes(style)) {
      return res.status(400).json({ error: 'Invalid summarization style' });
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    const prompt = getPromptForStyle(text, style);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ 
      summary,
      style,
      originalLength: text.length,
      summaryLength: summary.length
    });

  } catch (error) {
    console.error('Summarization error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.message?.includes('API key')) {
      return res.status(401).json({ error: 'Invalid API key. Please check your Gemini API configuration.' });
    }
    
    if (error.message?.includes('quota')) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    }

    res.status(500).json({ error: `Failed to generate summary: ${error.message}` });
  }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text;
    
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else {
      text = req.file.buffer.toString('utf-8');
    }
    
    if (text.length < 50) {
      return res.status(400).json({ error: 'File content must be at least 50 characters long' });
    }

    res.json({ text, filename: req.file.originalname });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to process file' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
