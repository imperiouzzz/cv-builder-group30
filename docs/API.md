# CV Builder — API Reference

Base URL: `http://localhost:4000/api`

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## Auth

### POST /auth/register
Register a new user.

**Body:**
```json
{ "email": "user@example.com", "password": "mypassword" }
```
**Response 201:**
```json
{ "success": true, "token": "eyJ...", "user": { "id": "uuid", "email": "..." } }
```

---

### POST /auth/login
**Body:** same as register
**Response 200:** same as register

---

### GET /auth/me *(protected)*
Returns the current authenticated user.

---

## CVs

### GET /cvs *(protected)*
Returns all CVs for the authenticated user.

### POST /cvs *(protected)*
Create a new empty CV.
**Body:** `{ "title": "My CV" }` *(optional)*

### GET /cvs/:id *(protected)*
Get one CV with all sections.

### PUT /cvs/:id *(protected)*
Full CV save. Replaces all sections atomically.

**Body shape:**
```json
{
  "title": "Software Engineer CV",
  "template": "classic",
  "font": "sans",
  "fullName": "Okang-Mensah Maurus",
  "jobTitle": "Backend Developer",
  "email": "maurusokangmensah@gmail.com",
  "phone": "0535603362",
  "linkedin": "https://linkedin.com/in/maurus-okang-mensah-936b13354",
  "github": "",
  "summary": "Self-motivated Computer Science student at KNUST...",
  "sectionOrder": ["summary","education","work","skills","projects","volunteering","references"],
  "education": [
    { "degree": "BSc. Computer Science", "institution": "KNUST", "location": "Kumasi, Ghana", "startDate": "", "endDate": "September 2027", "gpa": "", "achievements": "" }
  ],
  "workExp": [
    { "title": "Intern", "company": "Bsystems Limited", "location": "", "startDate": "September 2024", "endDate": "October 2024", "description": "• Built REST APIs using Django REST Framework\n• Participated in code reviews" }
  ],
  "skills": [
    { "name": "Python", "category": "technical" },
    { "name": "Django REST Framework", "category": "technical" }
  ],
  "projects": [],
  "volunteering": [],
  "references": [],
  "customSections": []
}
```

### DELETE /cvs/:id *(protected)*
Delete a CV.

### POST /cvs/:id/duplicate *(protected)*
Creates a copy of the CV titled `"[Original Title] (Copy)"`.

---

## ATS

### POST /ats/score/:cvId *(protected)*
Recompute and persist the ATS score for a CV.
**Response:** `{ "success": true, "data": { "score": 72 } }`

### POST /ats/match/:cvId *(protected)*
Compare CV against a job description.

**Body:** `{ "jobDescription": "We are looking for a Python developer with Django..." }`

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 68,
    "matched": ["python", "django", "postgresql", "backend"],
    "missing": ["kubernetes", "aws", "typescript", "react"]
  }
}
```

---

## PDF

### GET /pdf/:cvId *(protected)*
Generates and streams a PDF for the specified CV.

**Response:** `Content-Type: application/pdf` binary stream.

The frontend downloads this as a file using an axios blob request.

---

## Error Responses

All errors follow:
```json
{ "success": false, "message": "Human-readable error message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Bad request |
| 401 | Missing or invalid JWT |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already exists) |
| 422 | Validation error |
| 500 | Internal server error |
