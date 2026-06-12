# SenAI CRM – AI-Powered Customer Intelligence Platform

## Overview

SenAI CRM is an AI-powered customer intelligence platform that combines Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Agentic AI, and CRM analytics to automate email understanding, customer risk detection, and business decision-making.

The system ingests customer emails, classifies them using AI, detects special business scenarios, retrieves relevant company policies using RAG, and provides actionable recommendations through an interactive dashboard.

---

## Key Features

### AI Email Intelligence

* Automatic email classification
* Sentiment analysis
* Urgency detection
* Human escalation prediction
* Confidence scoring

Supported Categories:

* Inquiry
* Complaint
* Bug Report
* Billing
* Legal
* Compliance
* Security
* Feature Request
* Spam
* Internal

---

### Multi-Tool AI Agent

The system includes an autonomous AI agent capable of:

* Analyzing customer sentiment history
* Detecting churn risk
* Reviewing category statistics
* Generating business actions
* Producing reasoning traces

Agent Outputs:

* AUTO_PROCESS
* ESCALATE_TO_HUMAN
* PRIORITY_REVIEW

---

### Special Scenario Detection

The platform automatically detects:

* GDPR Requests
* Ransomware Threats
* SLA Breaches
* Customer Churn Risk

Each scenario triggers predefined business actions and escalations.

---

### Retrieval-Augmented Generation (RAG)

The platform contains a knowledge base consisting of:

* Refund Policies
* SLA Policies
* Escalation Rules
* Compliance Guidelines
* Pricing Policies

Pipeline:

Knowledge Base → Chunking → Embeddings → FAISS Vector Search → Retrieval

Technologies:

* Sentence Transformers
* FAISS
* Semantic Search

---

### Thread Intelligence

* Conversation grouping by thread_id
* Complete email timelines
* Thread-level context analysis
* Historical customer interaction tracking

---

### Analytics Dashboard

Provides business insights such as:

* Total Emails
* Complaint Volume
* Spam Detection Metrics
* Escalation Statistics
* Category Distribution
* Customer Sentiment Trends

---

## System Architecture

Email Dataset
↓
FastAPI Backend
↓
SQLite Database
↓
AI Classification Layer
↓
Hybrid AI Agent
↓
Special Scenario Engine
↓
RAG Knowledge Retrieval
↓
Analytics Engine
↓
React Dashboard

---

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Python

### AI / ML

* Groq API
* Llama 3.3 70B
* Sentence Transformers
* FAISS

### Frontend

* React
* Vite
* Recharts

### Deployment

* Docker
* Docker Compose

---

## API Endpoints

### Email APIs

* GET /emails
* GET /emails/{message_id}

### Thread APIs

* GET /threads
* GET /threads/{thread_id}

### Agent APIs

* GET /agent/run/{email_id}
* POST /agent/dry-run/{email_id}

### Analytics APIs

* GET /analytics/dashboard
* GET /analytics/categories
* GET /analytics/customer-risk/{sender}
* GET /analytics/sentiment/{sender}

### RAG APIs

* GET /rag/search?q=...

---

## Setup Instructions

### Backend

```bash
pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend

```bash
npm install

npm run dev
```

Backend:

```text
http://localhost:8000
```

Frontend:

```text
http://localhost:5173
```

---

## Future Improvements

* Thread-level summarization
* Knowledge citations in agent responses
* Multi-user authentication
* PostgreSQL support
* Production monitoring
* Cloud deployment

