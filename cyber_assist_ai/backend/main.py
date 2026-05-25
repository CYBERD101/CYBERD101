import os
import json
import asyncio
from typing import List, Optional
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Check if we should run in mock mode
MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"

if not MOCK_MODE:
    try:
        from llama_cpp import Llama
    except ImportError:
        print("llama-cpp-python not installed. Falling back to MOCK_MODE.")
        MOCK_MODE = True

app = FastAPI(title="Cyber-Assist AI API")

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model_path: Optional[str] = "model.gguf"

# Initialize Llama model (lazy loading)
llm = None

def get_llm(model_path: str):
    global llm
    if llm is None and not MOCK_MODE:
        if os.path.exists(model_path):
            llm = Llama(
                model_path=model_path,
                n_ctx=2048,
                n_threads=os.cpu_count() or 4,
                n_gpu_layers=0
            )
        else:
            print(f"Model file not found at {model_path}. Using MOCK_MODE.")
            return None
    return llm

async def mock_ai_response(content: str):
    responses = [
        "Initializing secure connection...",
        "Analyzing packet headers...",
        "Bypassing firewall protocols...",
        f"Accessing database for: {content[:20]}...",
        "Decrypting hash...",
        "System breach successful. I am your Cyber-Assist AI. How can I help you today, Hacker?"
    ]
    for resp in responses:
        yield f"data: {json.dumps({'choices': [{'delta': {'content': resp + ' '}}]})}\n\n"
        await asyncio.sleep(0.5)
    yield "data: [DONE]\n\n"

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if MOCK_MODE:
        return StreamingResponse(mock_ai_response(request.messages[-1].content), media_type="text/event-stream")

    model = get_llm(request.model_path)
    if model is None:
         return StreamingResponse(mock_ai_response(request.messages[-1].content), media_type="text/event-stream")

    # Format prompt for Llama
    prompt = ""
    for msg in request.messages:
        prompt += f"{msg.role.upper()}: {msg.content}\n"
    prompt += "ASSISTANT: "

    def generate():
        output = model(
            prompt,
            max_tokens=512,
            stream=True,
            stop=["USER:", "\n\n"]
        )
        for chunk in output:
            yield f"data: {json.dumps(chunk)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/health")
def health():
    return {"status": "online", "mock_mode": MOCK_MODE}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
