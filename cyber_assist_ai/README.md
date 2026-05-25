# Cyber-Assist AI: Hacker Interface 🥷💚

Welcome to your local, private, and interactive AI assistant designed for cybersecurity enthusiasts.

## Features
- **Hacker UI**: Matrix-style background, CRT scanlines, and glowing terminal interface.
- **Dynamic Themes**: UI colors change based on state (Green: Idle, Blue: Processing, Red: Alert).
- **Interactive**: Mouse-following glow and responsive animations.
- **Local AI**: Runs Llama models locally on your system using `llama-cpp-python`.
- **Voice Support**: Interactive voice synthesis for AI responses.
- **Custom Icon**: Featuring a winged-skull stylized avatar.

## System Requirements
- **OS**: Windows (Optimized)
- **CPU**: Intel Core i7 (Handled via CPU inference)
- **RAM**: 16GB
- **GPU**: Intel Integrated Graphics (Compatible)

## Setup Instructions

### 1. Prerequisites
- Install [Python 3.10+](https://www.python.org/downloads/) (Add to PATH during installation).
- Install [Node.js](https://nodejs.org/).
- Install C++ Build Tools (Required for `llama-cpp-python`):
  - Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
  - Select "Desktop development with C++".

### 2. Automated Setup
Run the `setup.bat` file:
```bash
setup.bat
```

### 3. Download an AI Model
You need a Llama model in **GGUF** format.
- Recommended: [Llama-3-8B-Instruct-GGUF](https://huggingface.co/lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF) (Choose `Q4_K_M`).
- Place the downloaded `.gguf` file inside the `backend/` folder.
- Rename it to `model.gguf`.

### 4. Launch the AI
Run the `start_app.bat` file:
```bash
start_app.bat
```

## Troubleshooting
- **Model Errors**: Ensure the `.gguf` file is in the `backend` folder.
- **Voice issues**: Ensure browser permissions for Speech Synthesis.
- **Build Errors**: Check Visual Studio C++ Build Tools installation.

---
*Stay secure, stay anonymous.*
