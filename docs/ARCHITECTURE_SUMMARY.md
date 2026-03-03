# AI NUSANTARA - Architecture Summary

This document provides a high-level overview of the AI NUSANTARA system architecture. For detailed technical specifications, see the full architecture documents created by the system architect agent.

## System Overview

AI NUSANTARA is a multi-tier AI-powered platform designed specifically for Indonesian academic institutions.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │    Web     │  │   Mobile   │  │  Desktop   │            │
│  │ (Next.js)  │  │(React Nat) │  │ (Electron) │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
└────────┼────────────────┼────────────────┼─────────────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
┌─────────────────────────┴─────────────────────────────────┐
│                      API GATEWAY                          │
│                   (Kong / Express)                         │
│         Auth, Rate Limiting, Load Balancing               │
└─────────────────────────┬─────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────┐  ┌───────▼──────┐  ┌──────▼────────┐
│ Web Service  │  │ AI Service   │  │ Data Service  │
│  (Fastify)   │  │  (FastAPI)   │  │   (Node)      │
│              │  │              │  │               │
│ - Users      │  │ - LLM Router │  │ - Documents   │
│ - Auth       │  │ - RAG        │  │ - Search      │
│ - Billing    │  │ - Embeddings │  │ - Processing  │
└───────┬──────┘  └───────┬──────┘  └──────┬────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────┐
│                      DATA LAYER                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │PostgreSQL│  │ Qdrant   │  │  Redis   │  │    S3    │  │
│  │(Primary) │  │(Vector DB)│  │ (Cache)  │  │(Storage) │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Web:** Next.js 14 (React, Server Components)
- **Mobile:** React Native (Phase 2)
- **Desktop:** Electron (Phase 3)
- **Styling:** Tailwind CSS + shadcn/ui

### Backend
- **API Gateway:** Kong or Express.js
- **Web Service:** Fastify (Node.js) or Go
- **AI Service:** FastAPI (Python)
- **Data Service:** Node.js or Go

### AI/ML
- **LLM Router:** Custom multi-model orchestration
- **Models:** Claude Opus, GPT-4, Llama 3, Mistral
- **Vector DB:** Qdrant for semantic search
- **Embeddings:** OpenAI text-embedding-3 or similar

### Data Storage
- **Primary:** PostgreSQL 15+
- **Vector:** Qdrant
- **Cache:** Redis 7+
- **Files:** AWS S3 or Google Cloud Storage

### Infrastructure
- **Cloud:** AWS or Google Cloud
- **Containers:** Docker
- **Orchestration:** Kubernetes (Phase 2+)
- **CI/CD:** GitHub Actions

## Core Components

### 1. Literature Review Assistant
- **RAG System:** Retrieval-Augmented Generation using Qdrant
- **PDF Processing:** PyPDF2, pdfplumber
- **Embedding Generation:** OpenAI or local models
- **LLM Orchestration:** Claude/GPT-4 for analysis

### 2. Citation Generator
- **Citation Parsing:** citation.js or similar
- **Style Templates:** APA, MLA, Chicago, IEEE
- **SINTA Integration:** Custom Indonesian journal database
- **Validation:** Citation style validators

### 3. Academic Writing Assistant
- **Grammar Check:** LanguageTool or custom models
- **Style Analysis:** Fine-tuned LLM on academic corpus
- **Tone Adjustment:** Prompt-engineered LLM
- **Plagiarism Check:** Third-party API integration

### 4. Knowledge Repository
- **Document Storage:** PostgreSQL + S3
- **Semantic Search:** Qdrant vector search
- **Knowledge Graph:** NetworkX or similar
- **Visualization:** D3.js or Cytoscape.js

## Data Models

### Key Entities

1. **Users**
   - Dosen, Mahasiswa, Admin
   - University affiliation
   - Subscription tier

2. **Documents**
   - PDF papers, notes, references
   - Metadata (authors, year, journal)
   - Embeddings for search

3. **Projects**
   - Research projects/groups
   - Collaborative spaces
   - Shared knowledge bases

4. **Citations**
   - Generated citations
   - Style formats
   - Source documents

## Scalability Strategy

### Phase 1: 10K Users
- Single server deployment
- Managed databases (RDS, ElastiCache)
- Simple load balancing

### Phase 2: 100K Users
- Distributed services
- Read replicas for database
- CDN for static assets
- Redis caching layer

### Phase 3: 1M+ Users
- Kubernetes cluster
- Database sharding
- Multi-region deployment
- Edge computing (Cloudflare Workers)

## Indonesian Market Optimizations

### Performance
- **CDN:** Singapore region (20-40ms latency to Indonesia)
- **Offline-First:** Service Workers for key features
- **Progressive Enhancement:** Core features work on slow connections

### Cost Optimization
- **Local Hosting:** Data residency in Indonesia (required by law)
- **Tiered Pricing:** 40% discounts for Indonesian universities
- **Bandwidth Optimization:** Compression, lazy loading

### Language Support
- **Bahasa Indonesia:** Full UI and content localization
- **Academic English:** Specialized models for academic English
- **Local Standards:** SINTA, FORLAP integration

## Security & Compliance

### Data Protection
- **Encryption:** End-to-end for sensitive documents
- **Data Residency:** Servers in Indonesia
- **Access Control:** Role-based permissions

### Compliance
- **PDPA:** Indonesian Personal Data Protection Act
- **Academic Ethics:** Approved by institutional review boards
- **Content Moderation:** AI-generated content transparency

### Academic Integrity
- **Plagiarism Prevention:** Built-in plagiarism checks
- **Citation Transparency:** Always show AI sources
- **Usage Tracking:** Log AI assistance for transparency

## Monitoring & Observability

### Metrics
- **Performance:** Response times, error rates
- **Usage:** DAU/WAU, feature usage
- **AI Costs:** Token usage, model costs
- **Business:** MRR, churn, LTV

### Tools
- **Logging:** ELK Stack or CloudWatch
- **Metrics:** Prometheus + Grafana
- **Error Tracking:** Sentry
- **Analytics:** PostHog or Mixpanel

## Cost Estimates

| Scale | Users | Infrastructure/Month |
|-------|-------|---------------------|
| Phase 1 | 10K (5 univ) | ~$770 (Rp 12M) |
| Phase 2 | 100K (50 univ) | ~$4,850 (Rp 77M) |
| Phase 3 | 1M (500 univ) | ~$35,500 (Rp 568M) |

## Development Roadmap

See [PHASES.md](./PHASES.md) for detailed development phases.

---

**For detailed architecture specifications, see:**
- AI_ACADEMIC_PLATFORM_ARCHITECTURE.md (full system architecture)
- AI_ACADEMIC_DATABASE_SCHEMA.md (complete database schema)
- AI_ACADEMIC_AI_INTEGRATION.md (AI integration strategy)

**Last Updated:** 2026-03-03
