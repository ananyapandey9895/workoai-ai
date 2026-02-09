# 📘 DeepRead AI – Document Summarization Service

DeepRead AI is a full‑stack, AI‑powered document summarization application that leverages **Google Gemini AI** to generate accurate, human‑like summaries from plain text and PDF documents. It supports multiple summarization styles, file uploads, validation, and a clean modern UI.

---

## ✨ Key Features

* **Multiple Input Methods** – Paste text or upload `.txt` / `.pdf` files
* **AI‑Powered Summaries** – Powered by **Google Gemini 2.5 Flash**
* **Three Summarization Styles**

  * **Brief** – 2–3 concise sentences
  * **Detailed** – Covers all key points
  * **Bullets** – Easy‑to‑scan bullet summary
* **Robust Validation** – 50 to 50,000 characters supported
* **Smart Statistics** – Original length, summary length & reduction %
* **Copy to Clipboard** – One‑click copy
* **Modern UI** – Clean layout with smooth animations

---

## 🛠 Tech Stack

### Frontend

* **React** – Component‑based UI
* **Axios** – API communication
* **CSS3** – Custom styling & animations

### Backend

* **Node.js** – Server runtime
* **Express.js** – API framework
* **Multer** – File uploads
* **pdf-parse** – PDF text extraction
* **Google Generative AI SDK** – Gemini integration
* **dotenv** – Environment variable handling

---

## 📁 Project Structure

```
pls/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env
│
├── server/                 # Node.js backend
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Application Flow

1. **User Input**

   * Paste text OR upload a `.txt` / `.pdf` file

2. **File Processing (Backend)**

   * `.pdf` → extracted using `pdf-parse`
   * `.txt` → read directly

3. **Summarization**

   * User selects summary style
   * Backend builds a style‑specific prompt
   * Gemini AI generates summary

4. **Result Display**

   * Summary shown with length stats and reduction percentage

---

## 🔌 API Endpoints

### POST `/api/upload`

Handles file uploads

**Response**

```json
{
  "text": "extracted text",
  "filename": "document.pdf"
}
```

---

### POST `/api/summarize`

Generates summary using Gemini AI

**Request**

```json
{
  "text": "text to summarize",
  "style": "brief | detailed | bullets"
}
```

**Response**

```json
{
  "summary": "generated summary",
  "style": "brief",
  "originalLength": 1500,
  "summaryLength": 300
}
```

---

### GET `/api/health`

Health check endpoint

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🚀 Setup Instructions

### Prerequisites

* Node.js (v14+)
* npm or yarn
* Google Gemini API key

---

### 1️⃣ Get Gemini API Key

1. Visit Google AI Studio
2. Create an API key
3. Copy and store it safely

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```
GEMINI_API_KEY=your_api_key_here
PORT=5002
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create `.env` file:

```
PORT=3001
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

---

### 4️⃣ Run the Application

**Backend**

```bash
cd server
npm run dev
```

**Frontend**

```bash
cd client
npm start
```

---

## Access the App

```
http://localhost:3001
```

---

## Error Handling

* Empty input
* Invalid file types
* Character limit violations
* API/network failures
* PDF parsing issues

Clear, user‑friendly error messages are displayed for each case.

---

## Production Build

```bash
cd client
npm run build
```

Creates an optimized production build in `client/build/`.

---

## License

This project was built as part of a **WorkoAI assignment**.

---

## Support & Troubleshooting

Before raising an issue, ensure:

* Dependencies are installed
* Environment variables are correct
* Both frontend & backend are running
* Gemini API key is valid and has quota

---

✨ *DeepRead AI makes document understanding faster, smarter, and effortless.*
