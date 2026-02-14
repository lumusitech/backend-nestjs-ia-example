# NestJS AI Integration Project

This project is a NestJS backend application that integrates with OpenAI to provide various AI-powered features such as text analysis, audio processing, image generation, and a context-aware chatbot.

***Warning:*** In this course, the suffixes useCase were used to refer to helper or util functions, not as use cases specific to hexagonal or clean architecture.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation & Local Setup](#installation--local-setup)
- [Configuration](#configuration)
- [Functionalities & API Reference](#functionalities--api-reference)
  - [Orthography Check](#orthography-check)
  - [Pros & Cons Discussion](#pros--cons-discussion)
  - [Translation](#translation)
  - [Text to Audio](#text-to-audio)
  - [Audio to Text](#audio-to-text)
  - [Image Generation](#image-generation)
  - [Sam Assistant (Chatbot)](#sam-assistant-chatbot)
- [Key Tools & Libraries](#key-tools--libraries)

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (LTS version recommended).
- **pnpm**: This project uses `pnpm` as the package manager.
- **OpenAI API Key**: You need a valid API key from OpenAI to use the services.

## Installation & Local Setup

Follow these steps to get the project running on your local machine:

1.  **Clone the repository**:

    ```bash
    git clone git@github.com:lumusitech/backend-nestjs-ia-example.git
    cd nest-ia
    ```

2.  **Install dependencies**:

    ```bash
    pnpm install
    ```

3.  **Environment Setup**:
    - Copy the example environment file.
      ```bash
      cp .env.template .env
      ```
    - Open `.env` and populate it with your credentials (mainly `OPENAI_API_KEY`).

4.  **Run the application**:
    - For development (watch mode):
      ```bash
      pnpm start:dev
      ```
    - The server will start at `http://localhost:3000` (or the port specified in `.env`).

## Configuration

The application uses standard NestJS configuration. Ensure your `.env` file contains:

```env
OPENAI_API_KEY=sk-your-openai-api-key
SERVER_URL=http://localhost:3000
```

## Functionalities & API Reference

### Orthography Check

Analyzes text for spelling and grammatical errors, providing corrections and a score.

- **Endpoint**: `POST /ai/orthography-check`
- **Body**:
  ```json
  {
    "prompt": "Ola ke ase"
  }
  ```
- **Response**: JSON containing the user score, list of errors with corrections, and a feedback message.

### Pros & Cons Discussion

Generates a list of pros and cons for a given topic.

- **Endpoint**: `POST /ai/pros-cons-discusses`
- **Body**:
  ```json
  {
    "prompt": "Buying a macbook pro"
  }
  ```
- **Response**: Markdown formatted text with a structured list of pros and cons.

### Pros & Cons Discussion (Stream)

Similar to the standard discussion but streams the response token by token, useful for real-time UI updates.

- **Endpoint**: `POST /ai/pros-cons-discusses-stream`
- **Body**: Same as above.
- **Response**: Streamed text chunks.

### Translation

Translates input text into a specified target language.

- **Endpoint**: `POST /ai/translate`
- **Body**:
  ```json
  {
    "prompt": "Hello world",
    "lang": "Spanish"
  }
  ```

### Text to Audio

Converts provided text into an audio file (speech).

- **Endpoint**: `POST /ai/text-to-audio`
- **Body**:
  ```json
  {
    "prompt": "This is a test audio",
    "voice": "nova"
  }
  ```
- **Response**: Returns an audio file (`.mp3`).
- **Note**: Available voices depend on OpenAI's TTS models (e.g., alloy, echo, fable, onyx, nova, shimmer).

### Audio to Text

Transcribes an uploaded audio file into text.

- **Endpoint**: `POST /ai/audio-to-text`
- **Body**: `multipart/form-data`
  - `file`: (The audio file)
  - `prompt`: (Optional, context or language hint)
- **Response**: JSON with the transcription.

### Image Generation

Generates an image based on a text prompt using DALL-E.

- **Endpoint**: `POST /ai/image-generation`
- **Body**:
  ```json
  {
    "prompt": "A futuristic city in space",
    "originalImage": "optional-base64",
    "maskImage": "optional-base64"
  }
  ```
- **Response**: JSON with the URL to the generated image.
-   **Get Image**: `GET /ai/image-generation/:filename` returns the image file directly (`image/png`), allowing it to be viewed in browsers or tools like Postman.

### Image Variation
Generates a variation of an existing image using DALL-E.

-   **Endpoint**: `POST /ai/image-variation`
-   **Body**:
    ```json
    {
      "baseImage": "http://localhost:3000/ai/image-generation/1768429792892.png"
    }
    ```
-   **Response**: JSON with the URL to the generated variation.

### Image to Text
Extracts information or describes an uploaded image using GPT-4 Vision.

-   **Endpoint**: `POST /ai/extract-text-from-image`
-   **Body**: `multipart/form-data`
    -   `file`: (The image file)
    -   `prompt`: (Optional, question about the image, default: "¿Qué logras ver en la imagen?")
-   **Response**: JSON with the description/answer.

### Sam Assistant (Chatbot)

A chatbot assistant capable of maintaining conversation context and answering questions based on a specific knowledge base (PDF file).

- **Endpoint**: `POST /sam-assistant/chat`
- **Body**:
  ```json
  {
    "prompt": "What are the terms regarding refunds?",
    "conversationId": "optional-uuid"
  }
  ```
- **Internal Mechanism**: Uses `pdf-parse` to read a "Terms and Conditions" PDF and feeds it as system context to OpenAI.

## Key Tools & Libraries

- **OpenAI SDK** (`openai`): The official Node.js library for interacting with OpenAI's API (GPT-4, DALL-E, Whisper, TTS).
- **Multer** (`@types/multer`): Middleware for handling `multipart/form-data`, primarily used for uploading audio files for transcription.
- **PDF Parse** (`pdf-parse`): A library used to extract raw text from PDF files. In this project, it's used to parse the `terms-and-conditions.pdf` file to provide context for the Sam Assistant.
- **Sharp** (`sharp`): A high-performance image processing library. Used here to convert images to PNG format and ensure they have an alpha channel, which is often a requirement for image editing APIs (like DALL-E's edit/variation endpoints).
- **File System & Path** (`fs`, `path`): Native Node.js modules used extensively for:
  - Storing generated files (images, audio).
  - Reading context files (PDFs).
  - Managing local file paths for persistence.
