import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://workoai-ai.onrender.com';

function App() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('brief');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain' && file.type !== 'application/pdf') {
      setError('Please upload a .txt or .pdf file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/api/upload`, formData);
      setText(response.data.text);
      setFileName(response.data.filename);
      setSummary('');
      setStats(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text or upload a file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSummary('');
      
      const response = await axios.post(`${API_URL}/api/summarize`, { text, style });
      
      setSummary(response.data.summary);
      setStats({
        originalLength: response.data.originalLength,
        summaryLength: response.data.summaryLength,
        reduction: Math.round((1 - response.data.summaryLength / response.data.originalLength) * 100)
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setSummary('');
    setError('');
    setStats(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="logo">
            <h1>DeepRead AI</h1>
          </div>
          <p className="tagline">AI-Powered Document Summarization</p>
        </header>

        <div className="main-content">
          <div className="input-section">
            <div className="section-header">
              <h2>Input Document</h2>
              <div className="upload-btn-wrapper">
                <button className="btn-upload" onClick={() => fileInputRef.current?.click()}>
                  Upload .txt or .pdf File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.pdf"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {fileName && (
              <div className="file-badge">
                <span>{fileName}</span>
              </div>
            )}

            <textarea
              className="text-input"
              placeholder="Paste your text here or upload a .txt file..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
            />

            <div className="char-count">
              {text.length.toLocaleString()} characters
            </div>

            <div className="controls">
              <div className="style-selector">
                <label>Summarization Style:</label>
                <div className="style-buttons">
                  <button
                    className={`style-btn ${style === 'brief' ? 'active' : ''}`}
                    onClick={() => setStyle('brief')}
                  >
                    Brief
                  </button>
                  <button
                    className={`style-btn ${style === 'detailed' ? 'active' : ''}`}
                    onClick={() => setStyle('detailed')}
                  >
                    Detailed
                  </button>
                  <button
                    className={`style-btn ${style === 'bullets' ? 'active' : ''}`}
                    onClick={() => setStyle('bullets')}
                  >
                    Bullets
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleSummarize}
                  disabled={loading || !text.trim()}
                >
                  {loading ? 'Summarizing...' : 'Summarize'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleClear}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {summary && (
            <div className="output-section">
              <div className="section-header">
                <h2>Summary</h2>
                <button className="btn-copy" onClick={handleCopy}>
                  Copy
                </button>
              </div>

              {stats && (
                <div className="stats">
                  <div className="stat-item">
                    <span className="stat-label">Original:</span>
                    <span className="stat-value">{stats.originalLength.toLocaleString()} chars</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Summary:</span>
                    <span className="stat-value">{stats.summaryLength.toLocaleString()} chars</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Reduction:</span>
                    <span className="stat-value highlight">{stats.reduction}%</span>
                  </div>
                </div>
              )}

              <div className="summary-output">
                {summary}
              </div>
            </div>
          )}
        </div>

        <footer className="footer">
          <p>Worko.AI Assignment</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
