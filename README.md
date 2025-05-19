# VERISTREAM

![Last Commit](https://img.shields.io/badge/last%20commit-today-blue)
![JavaScript](https://img.shields.io/badge/javascript-60.2%25-yellow)
![Languages](https://img.shields.io/badge/languages-4-green)

**Transforming content into clarity and insight.**

[Live Demo](https://veristream-git-master-roshan-kr-singhs-projects.vercel.app/)

## 📌 Overview

VeriStream is a powerful content analysis platform that helps users authenticate, analyze, and transform various forms of content. Whether you need to verify text authenticity, analyze audio, or summarize web content, VeriStream provides the tools you need with advanced AI integration.

## ✨ Features

- **Content Verification** - Detect AI-generated content and verify authenticity
- **Audio Analysis** - Transcribe and analyze audio content
- **URL Summarization** - Extract insights from web pages, Wikipedia articles, and YouTube videos
- **Multi-language Support** - Detect and translate content across multiple languages
- **Fact Checking** - Verify claims against reliable sources
- **Security Verification** - Check URL safety with Google Safe Browsing API

## 🛠️ Tech Stack

<div align="center">
  
  ![JSON](https://img.shields.io/badge/-JSON-000000?style=for-the-badge&logo=json&logoColor=white)
  ![Wikipedia](https://img.shields.io/badge/-Wikipedia-000000?style=for-the-badge&logo=wikipedia&logoColor=white)
  ![npm](https://img.shields.io/badge/-npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
  ![.ENV](https://img.shields.io/badge/-.ENV-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
  ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![NumPy](https://img.shields.io/badge/-NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)
  ![Python](https://img.shields.io/badge/-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
  ![Pydantic](https://img.shields.io/badge/-Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white)
  ![YAML](https://img.shields.io/badge/-YAML-CB171E?style=for-the-badge&logo=yaml&logoColor=white)

</div>

## 🚀 Backend Architecture

The backend is built with FastAPI and provides several endpoints for content analysis:

- **`/check_url`** - Verifies URL safety and validity
- **`/analyze_audio`** - Transcribes and analyzes uploaded audio files
- **`/url_summary`** - Extracts and summarizes content from URLs
- **`/analyze_text`** - Performs in-depth analysis on text content

## 💻 Frontend

The frontend is developed using React and modern JavaScript, styled with Tailwind CSS, and includes Motion for fluid animations. The interface provides an intuitive way to interact with VeriStream's powerful analysis features.

## 📋 Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/Roshansingh9/veristream.git
cd veristream/backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with required API keys
# GROQ_API_KEY=your_groq_api_key
# GOOGLE_API_KEY=your_google_api_key

# Run the server
uvicorn main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
```

## 📊 Core Utilities

- **Language Detection & Translation** - Accurately identifies 40+ languages and provides translation capabilities
- **Fact Checking** - Validates content against Google's Fact Check API and Wikipedia
- **Audio Transcription** - Uses Whisper model for accurate transcription
- **URL Safety** - Integrates with Google Safe Browsing API
- **Content Analysis** - Utilizes LLaMA 3.3 model for in-depth content verification

## 👤 Author

**Roshan Kr Singh**
- GitHub: [Roshansingh9](https://github.com/Roshansingh9)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- LLaMA 3.3 model for sophisticated text analysis
- Whisper model for audio transcription
- Google Safe Browsing API for URL verification
