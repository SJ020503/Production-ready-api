# Production Ready API

A production-oriented REST API built with Node.js that demonstrates **real-world backend engineering practices**, including clean architecture, scalability, containerization, and robust API features.

---

## Key Features

### Core Backend

- RESTful API using **Node.js & Express**
- **MVC architecture** (Models, Controllers, Routes)
- Centralized error handling
- Environment-based configuration
- Secure authentication & authorization (JWT)

### API Capabilities

- **Pagination** for large datasets
- **Filtering** using query parameters
- **Sorting** by fields
- **Field limiting** for optimized responses
- Reusable API utilities for query handling

### Performance & Scalability

- **Stateless API design**
- **Redis** for caching / rate limiting support
- Horizontal scaling via Docker Compose
- Ready for reverse proxy & load balancing

### Infrastructure & DevOps

- Fully **Dockerized** backend
- **Docker Compose** for multi-service orchestration
- Externalized **MongoDB Atlas**
- Clean `.gitignore` and `.dockerignore`
- Environment variables injected at runtime

---

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB Atlas**
- **Redis**
- **Docker**
- **Docker Compose**

---

## Architecture Overview

Client
|
Express API (Node.js)
|
├── MongoDB Atlas (persistent storage)
└── Redis (cache / rate limiting)

## Project Structure

├── controllers/
├── models/
├── routes/
├── utils/
├── app.js
├── server.js
├── Dockerfile
├── docker-compose.yml
└── README.md

- `controllers/` → Request handling & business logic
- `models/` → Database schemas & data access
- `routes/` → API endpoints
- `utils/` → Reusable helpers (errors, API features, etc.)

---

## Advanced API Query Features

The API supports production-grade query capabilities for handling large datasets efficiently.

## Pagination

Paginate results using query parameters.

Example:
GET /api/v1/resources?page=2&limit=10

- page → page number (default: 1)
- limit → number of results per page

## Filtering

Filter results dynamically using query parameters.

Example:
GET /api/v1/resources?price[gte]=1000&ratingsAverage[gte]=4

Supported operators:

- gte (greater than or equal)
- lte (less than or equal)

## Sorting

Sort results by one or more fields.

Examples:
GET /api/v1/resources?sort=price
GET /api/v1/resources?sort=-price,ratingsAverage

- Prefix a field with '-' for descending order
- Multiple sort fields are supported

## Field Limiting

Limit fields returned in the response to reduce payload size.

Example:
GET /api/v1/resources?fields=name,price,ratingsAverage
