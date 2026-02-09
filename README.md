# DeepRead AI - Document Summarization Service

An AI-powered document summarization application that uses Google Gemini AI to generate intelligent summaries from text and PDF documents.

## Features

- 📄 **Multiple Input Methods**: Paste text directly or upload .txt/.pdf files
- 🤖 **AI-Powered**: Integrated with Google Gemini 1.5 Flash model
- 🎨 **Three Summarization Styles**:
  - **Brief**: Concise 2-3 sentence summary
  - **Detailed**: Comprehensive summary with all key points
  - **Bullets**: Key points in bullet format
- ✅ **Input Validation**: Min 50 characters, max 50,000 characters
- 📊 **Statistics**: Shows original length, summary length, and reduction percentage
- 📋 **Copy to Clipboard**: One-click copy functionality
- 🎯 **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

### Frontend
- **React 18**: UI framework
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with animations

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **Google Generative AI SDK**: Gemini API integration
- **dotenv**: Environment variable management

## Project Structure

```
pls/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   └── .env               # Frontend environment variables
│
├── server/                # Node.js backend
│   ├── server.js          # Express server & API routes
│   ├── package.json       # Backend dependencies
│   └── .env               # Backend environment variables (API key)
│
└── README.md              # Project documentation
```

## How It Works

### Architecture Flow

1. **User Input**: User pastes text or uploads a .txt/.pdf file
2. **File Processing** (if uploaded):
   - Frontend sends file to `/api/upload` endpoint
   - Backend extracts text using `pdf-parse` (for PDFs) or reads directly (for .txt)
   - Extracted text is returned to frontend
3. **Summarization**:
   - User selects summarization style (Brief/Detailed/Bullets)
   - Frontend sends text + style to `/api/summarize` endpoint
   - Backend creates appropriate prompt based on style
   - Gemini AI generates summary
   - Summary with statistics is returned to frontend
4. **Display**: Frontend shows summary with character counts and reduction percentage

### API Endpoints

#### POST `/api/upload`
Handles file uploads (.txt and .pdf)

**Request**: FormData with file
**Response**: 
```json
{
  "text": "extracted text content",
  "filename": "document.pdf"
}
```

#### POST `/api/summarize`
Generates AI summary

**Request**:
```json
{
  "text": "text to summarize",
  "style": "brief|detailed|bullets"
}
```

**Response**:
```json
{
  "summary": "generated summary",
  "style": "brief",
  "originalLength": 1500,
  "summaryLength": 300
}
```

#### GET `/api/health`
Health check endpoint

**Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Clone/Download Project

```bash
cd pls
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
echo "PORT=5002" >> .env

# Replace 'your_api_key_here' with your actual Gemini API key
```

### 4. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create .env file
echo "PORT=3001" > .env
echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" >> .env
```

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:5002`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```
Frontend will run on `http://localhost:3001`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3001
```

## Usage Guide

1. **Enter Text**:
   - Paste text directly into the textarea, OR
   - Click "Upload .txt or .pdf File" to upload a document

2. **Select Style**:
   - Choose Brief, Detailed, or Bullets

3. **Generate Summary**:
   - Click "SUMMARIZE" button
   - Wait for AI to process (usually 2-5 seconds)

4. **View Results**:
   - See your summary with statistics
   - Click "Copy" to copy summary to clipboard

5. **Clear**:
   - Click "CLEAR" to reset and start over

## Error Handling

The application handles various errors:

- **No text input**: "Please enter some text or upload a file"
- **Text too short**: "Text must be at least 50 characters long"
- **Text too long**: "Text exceeds maximum length of 50,000 characters"
- **Invalid file type**: "Please upload a .txt or .pdf file"
- **API errors**: Displays specific error messages from Gemini API
- **Network errors**: "Failed to generate summary. Please try again."

## Environment Variables

### Backend (.env in server/)
```
GEMINI_API_KEY=your_gemini_api_key
PORT=5002
```

### Frontend (.env in client/)
```
PORT=3001
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

## Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "@google/generative-ai": "latest",
  "dotenv": "^16.3.1",
  "pdf-parse": "^1.1.1"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-scripts": "5.0.1",
  "axios": "^1.6.0"
}
```

## Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error:
```bash
# Kill process on port 5002
lsof -ti:5002 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### API Key Issues
- Verify your API key is correct in `server/.env`
- Check if API key has proper permissions
- Ensure no extra spaces in .env file

### PDF Not Loading
- Ensure file is a valid PDF
- Check file size (max 5MB)
- Verify pdf-parse is installed: `npm list pdf-parse`

### Summary Not Generating
- Check backend terminal for error messages
- Verify Gemini API key is valid
- Ensure text meets minimum length requirement (50 chars)

## Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd client
npm start  # Hot reload enabled
```

## Production Build

### Frontend
```bash
cd client
npm run build
```
Creates optimized production build in `client/build/`

## License

This project is created as part of Workoai assignment.

## Support

For issues or questions, please check:
1. All dependencies are installed
2. Environment variables are set correctly
3. Both servers are running
4. API key is valid and has quota remaining
