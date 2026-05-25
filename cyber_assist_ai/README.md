# Cyber-Assist AI: Hacker Interface 🥷💚

Welcome to your local, private, and interactive AI assistant designed for cybersecurity enthusiasts.

## Features
- **Hacker UI**: Matrix-style background, CRT scanlines, and glowing green terminal interface.
- **Dynamic Themes**: The interface changes color (Green, Yellow, Red) based on AI state (Idle, Processing, Alert).
- **Interactive**: Mouse-trailing effects and responsive animations.
- **AI Avatar**: Personalized "hoodie hacker" icon for the AI character.
- **Local AI**: Runs Llama models locally on your system using `llama-cpp-python`.
- **Voice Support**: Interactive voice synthesis for AI responses.
- **Streaming**: Real-time communication with the AI.

## System Requirements
- **OS**: Windows (optimized for your system)
- **CPU**: Intel Core i7
- **RAM**: 16GB
- **GPU**: Intel Graphics (runs on CPU by default)

## Setup Instructions

### 1. Prerequisites
- Install [Python 3.10+](https://www.python.org/downloads/) (Add to PATH during installation).
- Install [Node.js](https://nodejs.org/).
- Install C++ Build Tools (Required for `llama-cpp-python`):
  - Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
  - Select "Desktop development with C++".

### 2. Automated Setup
Run the `setup.bat` file in the root directory:
```bash
setup.bat
```

### 3. Download an AI Model
You need a Llama model in **GGUF** format.
- Recommended: [Llama-3-8B-Instruct-GGUF](https://huggingface.co/lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF) (Choose a `Q4_K_M` version for 16GB RAM).
- Place the downloaded `.gguf` file inside the `backend/` folder.
- Rename it to `model.gguf`.

### 4. Launch the AI
Run the `start_app.bat` file:
```bash
start_app.bat
```

## Cyber Security Note
This tool is for educational and assistance purposes only. Use it responsibly in your cybersecurity journey.

---
*Created with thrills for the modern hacker.*
