# SahiHai API Documentation

## Base URL

- **Local Development**: `http://192.168.1.34:5051`
- **Production (Vercel)**: `https://sahihai-backend.vercel.app` (replace with your actual URL)

---

## Endpoints

### 1. Health Check

```
GET /
```

**Description**: Verify server is running

**Response**:

```json
{
  "message": "SahiHai Server is running!"
}
```

---

### 2. Analyze Bill/Audio

```
POST /api/analyze
```

**Description**: Upload a bill image or audio file for analysis

**Headers**:

```
Content-Type: multipart/form-data
```

**Form Data**:

- `mediaFile` (file, required) - Image (JPG, PNG) or Audio (MP3, M4A)

**Response** (Success 200):

```json
{
  "_id": "123456",
  "deviceId": "device_uuid",
  "fileName": "bill_image.jpg",
  "fileUrl": "uploads/...",
  "analysis": {
    "items": [],
    "totalAmount": 0,
    "fraudScore": 0,
    "flaggedItems": [],
    "summary": ""
  },
  "createdAt": "2026-01-04T00:00:00Z"
}
```

**Response** (Error 500):

```json
{
  "error": "Failed to analyze media.",
  "details": "Error message"
}
```

---

### 3. Detect Appliance Age

```
POST /api/appliance/detect
```

**Description**: Upload appliance photo to detect age and model

**Headers**:

```
Content-Type: multipart/form-data
```

**Form Data**:

- `file` (file, required) - Image of appliance

**Response** (Success 200):

```json
{
  "_id": "appliance_id",
  "brand": "Samsung",
  "model": "XYZ",
  "estimatedAge": "3 years",
  "warrantyExpiry": "2026-01-04",
  "maintenance_tip": "Regular cleaning recommended"
}
```

---

### 4. Get Appliance List

```
GET /api/appliance/list
```

**Description**: Retrieve all registered appliances

**Response** (Success 200):

```json
[
  {
    "_id": "id1",
    "brand": "Samsung",
    "model": "XYZ",
    "estimatedAge": "3 years",
    "warrantyExpiry": "2026-01-04",
    "maintenance_tip": "Regular cleaning"
  }
]
```

---

### 5. Check for Scam Indicators

```
POST /api/scam/check
```

**Description**: Analyze screenshot for potential scam indicators

**Headers**:

```
Content-Type: multipart/form-data
```

**Form Data**:

- `file` (file, required) - Screenshot image

**Response** (Success 200):

```json
{
  "isScam": false,
  "riskLevel": "Low",
  "reason": "No suspicious indicators found"
}
```

**Possible Risk Levels**: "Low", "Medium", "High"

---

### 6. Draft Complaint Letter

```
POST /api/sarkari/draft
```

**Description**: Generate formal complaint letter from audio recording

**Headers**:

```
Content-Type: multipart/form-data
```

**Form Data**:

- `file` (file, required) - Audio recording (MP3, M4A)

**Response** (Success 200):

```json
{
  "letter": "Dear [Department],\n\nI am writing to lodge a formal complaint...\n\nYours faithfully,\n[Name]"
}
```

---

### 7. Chat Consultation

```
POST /api/chat/consult
```

**Description**: Get AI assistance on bill-related queries

**Headers**:

```
Content-Type: application/json
```

**Request Body**:

```json
{
  "userMessage": "Is this charge reasonable?",
  "scanContext": {
    "fraudScore": 65,
    "summary": "Bill has 3 suspicious items",
    "flaggedItems": [
      {
        "item": "Service Charge",
        "claimedPrice": 500,
        "marketPrice": 200,
        "discrepancy": 150
      }
    ]
  }
}
```

**Response** (Success 200):

```json
{
  "reply": "Based on your bill analysis, the service charge seems 150% overcharged..."
}
```

---

### 8. Get Recent Scans

```
GET /api/scans
```

**Description**: Get recent scans and total savings

**Response** (Success 200):

```json
{
  "scans": [],
  "totalSaved": 0
}
```

---

### 9. Get Scan History

```
GET /api/scans/history
```

**Headers**:

```
x-device-id: device_uuid_here
```

**Description**: Get all scans for a device

**Response** (Success 200):

```json
[
  {
    "_id": "scan_id",
    "fileName": "bill.jpg",
    "analysis": {...},
    "createdAt": "2026-01-04T00:00:00Z"
  }
]
```

---

### 10. Get Scan Statistics

```
GET /api/scans/stats
```

**Headers**:

```
x-device-id: device_uuid_here
```

**Description**: Get statistics for a device

**Response** (Success 200):

```json
{
  "totalScans": 5,
  "totalSaved": 1500,
  "averageFraudScore": 42
}
```

---

## Error Handling

### Common Error Responses

**400 - Bad Request**

```json
{
  "error": "No file uploaded."
}
```

**500 - Server Error**

```json
{
  "error": "Failed to process request.",
  "details": "Error details here"
}
```

---

## Authentication (Future Enhancement)

Currently, all endpoints are public. Future versions will include:

- JWT token authentication
- Rate limiting per device ID
- User accounts and login

---

## File Upload Limits

- **Maximum file size**: 10 MB
- **Supported image formats**: JPG, PNG
- **Supported audio formats**: MP3, M4A

---

## Request/Response Headers

**All Requests**:

```
Content-Type: application/json (or multipart/form-data for file uploads)
```

**All Responses**:

```
Content-Type: application/json
```

---

## Example Usage

### Using cURL

```bash
# Health check
curl http://192.168.1.34:5051/

# Upload bill image
curl -X POST http://192.168.1.34:5051/api/analyze \
  -F "mediaFile=@bill.jpg"

# Check scam indicators
curl -X POST http://192.168.1.34:5051/api/scam/check \
  -F "file=@screenshot.png"

# Chat consultation
curl -X POST http://192.168.1.34:5051/api/chat/consult \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Is this fair price?",
    "scanContext": {
      "fraudScore": 50,
      "summary": "...",
      "flaggedItems": []
    }
  }'
```

### Using JavaScript/Axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.34:5051",
  timeout: 10000,
});

// Upload bill
const formData = new FormData();
formData.append("mediaFile", billFile);
const result = await api.post("/api/analyze", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## Rate Limits (Future)

- 100 requests/minute per device
- 10 file uploads/hour per device

---

## Support & Feedback

For issues or improvements:

- GitHub: [SahiHai Issues](https://github.com/yourrepo/issues)
- Email: support@sahihai.com

---

**API Version**: 1.0.0  
**Last Updated**: January 4, 2026
