# Production Ready API

A **production-oriented REST API** built with **Node.js**, designed to demonstrate **real-world backend and system design practices** such as stateless authentication, horizontal scalability, distributed rate limiting, and containerized infrastructure.

This project goes beyond a basic CRUD API by focusing on **scalability, correctness, and infrastructure awareness**.

---

## Key Features

### Core Backend

- RESTful API built with **Node.js & Express**
- **MVC architecture** (Models, Controllers, Routes)
- Centralized error handling
- Environment-based configuration
- Secure authentication & authorization using **JWT (HTTP-only cookies)**
- Stateless API design (safe behind load balancers)

---

### Advanced API Capabilities

- **Pagination** for large datasets
- **Filtering** using query parameters
- **Sorting** by one or more fields
- **Field limiting** for optimized responses
- Reusable query utilities for clean controller logic
- Protection against NoSQL injection & malformed queries

---

### Performance & Scalability

- **Horizontal scaling** with multiple API instances
- **Nginx reverse proxy** for load balancing
- **Redis-backed token bucket rate limiting**
  - Per-user rate limits
  - Burst-friendly (token bucket algorithm)
  - Distributed enforcement across all API instances
  - Automatic cleanup using TTL
- Stateless design ensures any request can be handled by any instance

---

### Infrastructure & DevOps

- Fully **Dockerized** backend
- **Docker Compose** for multi-service orchestration
- **Nginx** as a reverse proxy and load balancer
- **Redis** for shared state (rate limiting)
- **MongoDB Atlas** as external persistent storage
- Environment variables injected at runtime
- Clean `.gitignore` and `.dockerignore`

---

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB Atlas**
- **Redis**
- **Nginx**
- **Docker**
- **Docker Compose**

---

## Architecture Overview

Client
|
v
Nginx (Reverse Proxy / Load Balancer)
|
v
Node.js API (Multiple Instances)
| |
| └── Redis (Distributed Rate Limiting)
|
└── MongoDB Atlas (Persistent Storage)

## Project Structure

├── controllers/
├── models/
├── routes/
├── middlewares/
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
- `middlewares/` → Rate limiter

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

## Rate Limiting (Token Bucket)

The API uses a **Redis-backed token bucket algorithm** to control request rates.

- Rate limits are enforced **per user**
- Allows short bursts while enforcing an average rate
- Limits are applied **globally across all API instances**
- Redis TTL ensures automatic cleanup of inactive buckets

This design works correctly behind Nginx and multiple Node.js containers.

---

## Why This Project

This project was built to demonstrate:

- Real backend architecture (not just CRUD)
- Stateless design principles
- Distributed coordination using Redis
- Practical Docker & Nginx usage
- Production-aware API design decisions
