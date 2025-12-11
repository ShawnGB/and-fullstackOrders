# Fullstack Orders Application

A minimalistic online shop built with NestJS, NextJS, PostgreSQL, and JWT authentication.

## Tech Stack

- **Backend**: NestJS
- **Frontend**: NextJS
- **Database**: PostgreSQL
- **Authentication**: JWT

## Project Structure

```
├── backend/    # NestJS REST API
└── frontend/   # NextJS application
```

## Setup

### Prerequisites

- Node.js
- PostgreSQL (via Docker or local installation)
- Git

### Initial Setup

1. Create NestJS project in `backend/` directory
2. Create NextJS project in `frontend/` directory
3. Setup PostgreSQL database (Docker recommended)
4. Configure CORS in NestJS backend to allow requests from NextJS frontend

```typescript
const app = await NestFactory.create(AppModule);
app.enableCors();
await app.listen(process.env.PORT ?? 3000);
```

### GitHub Setup

- Setup branch protection on main branch
- Configure CI workflow to run frontend and backend tests

## Features

### 1. Products (CRUD)

**Entity Properties:**
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `price` - Product price

**Requirements:**
- REST API endpoints (create, read, update, delete)
- SQL database persistence
- NextJS UI for product list and creation form
- Tests for both frontend and backend
- **Public Access**: GET /products (all other endpoints require authentication)

### 2. Orders (CRUD)

**Entity Properties:**
- `id` - Unique identifier
- `productIds` - Array of product IDs
- `totalPrice` - Total order price
- `customerId` - Customer ID

**Requirements:**
- REST API endpoints (create, read, update, delete)
- SQL database persistence
- NextJS UI for order list and creation form
- Tests for both frontend and backend
- User can only manage their own orders

### 3. Customers (CRUD)

**Entity Properties:**
- `id` - Unique identifier
- `name` - Customer name
- `email` - Customer email
- `password` - Hashed password
- `orderIds` - Array of order IDs

**Requirements:**
- REST API endpoints (create, read, update, delete)
- SQL database persistence with **hashed passwords**
- NextJS UI for customer list and creation form
- Tests for both frontend and backend
- User can only manage their own customer data

### 4. User Authentication (JWT)

**Requirements:**
- Add password field to customer model
- **Hash passwords before saving to database**
- Login endpoint that returns JWT token
- Protected endpoints (all except GET /products)
- User-specific data access (users can only access their own data)

## Bonus Features

### Deployment (Docker)

- Create Dockerfile for backend
- Create Dockerfile for frontend
- Create docker-compose.yml to run both services
- Deploy both images separately on Render

### Documentation (Swagger)

- Document API using NestJS Swagger
- Reference: [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)

## Development

### Backend

```bash
cd backend
npm install
npm run start:dev
npm run test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run test
```

## Testing

Both frontend and backend must have comprehensive test coverage for all CRUD operations and authentication flows.