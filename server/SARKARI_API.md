# Sarkari Saathi API Documentation

## Overview

The Sarkari Saathi feature helps users generate official complaint letters for government departments. It supports both audio recording and text input.

## Endpoints

### 1. Draft Letter from Audio

**Endpoint:** `POST /api/sarkari/draft`

**Description:** Records user's complaint via audio, transcribes it, and generates a formal complaint letter.

**Request:**

- **Method:** POST
- **Content-Type:** multipart/form-data
- **Body:**
  - `file`: Audio file (m4a, mp3, wav, etc.)

**Response:**

```json
{
  "letter": "Dear Sir/Madam,\n\nI am writing to formally lodge a complaint..."
}
```

**Example (cURL):**

```bash
curl -X POST http://localhost:5051/api/sarkari/draft \
  -F "file=@complaint.m4a"
```

---

### 2. Draft Letter from Text

**Endpoint:** `POST /api/sarkari/draft-text`

**Description:** Generates a formal complaint letter from user-provided text input.

**Request:**

- **Method:** POST
- **Content-Type:** application/json
- **Body:**

```json
{
  "complaint": "My electricity meter is showing wrong readings and I am being overcharged..."
}
```

**Response:**

```json
{
  "letter": "Dear Sir/Madam,\n\nI am writing to formally lodge a complaint..."
}
```

**Example (cURL):**

```bash
curl -X POST http://localhost:5051/api/sarkari/draft-text \
  -H "Content-Type: application/json" \
  -d '{"complaint": "My electricity meter is faulty"}'
```

---

### 3. Generate PDF

**Endpoint:** `POST /api/sarkari/generate-pdf`

**Description:** Converts a drafted letter into a professionally formatted PDF file.

**Request:**

- **Method:** POST
- **Content-Type:** application/json
- **Body:**

```json
{
  "letter": "Dear Sir/Madam,\n\nI am writing to formally lodge a complaint...",
  "userInfo": {
    "name": "John Doe",
    "address": "123 Main St, Delhi",
    "phone": "+91 9876543210"
  }
}
```

**Response:**

- **Content-Type:** application/pdf
- **Content-Disposition:** attachment; filename=complaint-letter-{timestamp}.pdf
- Returns downloadable PDF file

**Example (cURL):**

```bash
curl -X POST http://localhost:5051/api/sarkari/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"letter": "Dear Sir/Madam...", "userInfo": {"name": "John"}}' \
  -o complaint.pdf
```

---

## Frontend Integration

### React Native / Expo

#### Example 1: Record Audio and Draft Letter

```javascript
import * as FileSystem from "expo-file-system";

const draftFromAudio = async (audioUri) => {
  const formData = new FormData();
  formData.append("file", {
    uri: audioUri,
    name: "complaint.m4a",
    type: "audio/m4a",
  });

  try {
    const response = await fetch("http://localhost:5051/api/sarkari/draft", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();
    console.log("Letter:", data.letter);
    return data.letter;
  } catch (error) {
    console.error("Error:", error);
  }
};
```

#### Example 2: Draft Letter from Text

```javascript
const draftFromText = async (complaintText) => {
  try {
    const response = await fetch(
      "http://localhost:5051/api/sarkari/draft-text",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaint: complaintText,
        }),
      }
    );

    const data = await response.json();
    return data.letter;
  } catch (error) {
    console.error("Error:", error);
  }
};
```

#### Example 3: Generate and Download PDF

```javascript
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const generateAndDownloadPDF = async (letterText, userInfo) => {
  try {
    const response = await fetch(
      "http://localhost:5051/api/sarkari/generate-pdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          letter: letterText,
          userInfo: userInfo,
        }),
      }
    );

    // Save PDF to local file system
    const blob = await response.blob();
    const fileUri = `${FileSystem.documentDirectory}complaint-letter.pdf`;

    // For web, trigger download
    if (Platform.OS === "web") {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "complaint-letter.pdf";
      link.click();
    } else {
      // For native, save and share
      await FileSystem.writeAsStringAsync(fileUri, await blob.text(), {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(fileUri);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
```

---

## AI Model Flow

### Audio Processing:

1. **Primary**: Gemini 2.0 Flash (Audio transcription)
2. **Fallback**: Groq Whisper Large V3

### Letter Drafting:

1. **Primary**: Groq (llama-3.3-70b-versatile)
2. **Fallback 1**: Groq (mixtral-8x7b-32768)
3. **Fallback 2**: Gemini (models/gemini-2.0-flash)

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Description of error",
  "details": "Technical error details (in development)"
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `400`: Bad Request (missing required fields)
- `500`: Internal Server Error (AI service failure, etc.)

---

## Notes

### Audio File Requirements:

- **Formats**: m4a, mp3, wav, aac
- **Max Size**: 10MB (configurable in multer settings)
- **Languages Supported**: English, Hindi, Hinglish (multilingual)

### PDF Features:

- Professional formatting with headers and footers
- Date stamp
- Optional user information (name, address, phone)
- Signature placeholder
- A4 page size
- Generated by SahiHai branding

### Rate Limiting:

- Groq has generous free tier limits
- Gemini free tier: 15 RPM (requests per minute)
- Backend automatically switches to fallback models on quota exhaustion

---

## Testing

### Test Audio Upload:

```bash
# Record a test complaint
curl -X POST http://localhost:5051/api/sarkari/draft \
  -F "file=@test-complaint.m4a"
```

### Test Text Input:

```bash
curl -X POST http://localhost:5051/api/sarkari/draft-text \
  -H "Content-Type: application/json" \
  -d '{"complaint": "Test complaint about billing issue"}'
```

### Test PDF Generation:

```bash
curl -X POST http://localhost:5051/api/sarkari/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "letter": "Dear Sir/Madam, This is a test letter.",
    "userInfo": {
      "name": "Test User",
      "address": "123 Test St",
      "phone": "1234567890"
    }
  }' -o test.pdf
```
