# gRPC Calculator (Rust + React)

A full-stack calculator project built to learn and demonstrate **modern gRPC development**:
- A Rust gRPC server using `tonic`
- A React web app using **gRPC-Web**
- Protocol Buffers as a shared contract
- Reflection, interceptor-based auth, and request counting

This repo is beginner-friendly, but it also showcases production-style backend concepts that employers look for.

---

## Why this project is valuable

This project demonstrates that you can:
- design API contracts with `.proto`
- implement strongly typed RPC services in Rust
- connect a browser UI to gRPC via gRPC-Web
- add middleware/interceptors and CORS correctly
- expose reflection for API discovery and debugging
- structure backend + frontend in one repository

---

## Tech Stack

### Backend (`/`)
- **Rust** (Edition 2024)
- `tonic` for gRPC
- `tokio` for async runtime
- `tonic-prost-build` for code generation from `.proto`
- `tonic-reflection` for server reflection
- `tonic-web` for gRPC-Web support
- `tower-http` for CORS

### Frontend (`/frontend`)
- **React + Vite**
- `@protobuf-ts/grpcweb-transport` for gRPC-Web client calls
- Tailwind CSS utilities for UI styling

### Shared Contract
- `proto/calculator.proto` (backend source of truth)
- `frontend/protos/calculator.proto` (frontend copy used for TS client generation)

---

## Project Structure

```text
grpc-calculator/
├── proto/
│   └── calculator.proto          # gRPC services + request/response messages
├── src/
│   ├── main.rs                   # gRPC server (Calculator + Admin services)
│   └── client.rs                 # Rust gRPC client example
├── build.rs                      # Compiles proto files during build
├── Cargo.toml                    # Rust dependencies and binaries
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # React calculator UI
│   │   └── generated/            # Generated TS gRPC clients/types
│   ├── protos/calculator.proto   # Proto used for frontend codegen
│   └── package.json              # Frontend scripts/dependencies
└── Readme.md
```

---

## Features Implemented

### Calculator gRPC service
- `Add(a, b)`
- `Subtract(a, b)`
- `Multiply(a, b)`
- `Divide(a, b)` with divide-by-zero validation

### Admin gRPC service
- `GetRequestCount()` returns total processed requests
- request counter is stored in shared async state (`Arc<RwLock<u64>>`)

### Cross-cutting behavior
- **Interceptor-based auth** on admin endpoint (`authorization` token check)
- **gRPC reflection** enabled for tooling and discovery
- **CORS + gRPC-Web** enabled so browser frontend can call Rust backend

---

## API Contract (Proto)

Both services are defined in `calculator` package:
- `service Calculator` for math operations
- `service Admin` for operational monitoring (`GetRequestCount`)

Input message:
- `CalculatorRequest { int64 a, int64 b }`

Output message:
- `CalculatorResponse { int64 result }`
- `CounterResponse { uint64 count }`

---

## How to Run (Step-by-Step)

### 1) Prerequisites

Install:
- Rust (stable)
- Node.js (LTS) + npm
- `protoc` (Protocol Buffers compiler)

Check quickly:
```bash
rustc --version
cargo --version
node --version
npm --version
protoc --version
```

### 2) Start Rust gRPC server

From project root:
```bash
cargo run --bin server
```

Server runs at:
- `http://[::1]:50051` (also reachable as `http://localhost:50051`)

### 3) Run Rust CLI client (optional)

In another terminal:
```bash
cargo run --bin client
```

This sends an `Add` request and prints the response.

### 4) Start React frontend

```bash
cd frontend
npm install
npm run dev
```

Open:
- `http://localhost:5173`

Use the UI to call add/subtract/multiply/divide on the Rust gRPC server.

---

## Testing Admin endpoint auth (important detail)

`Admin.GetRequestCount` is protected by an interceptor.  
Required header:

```text
authorization: Bearer some-secret-token
```

Without this token, the server returns `Unauthenticated`.

---

## Reflection support

Server reflection is enabled in `src/main.rs`, which helps API clients/tools discover available services without manually loading proto files in some workflows.

---

## Notes for recruiters / professional reviewers

This project is intentionally small in domain but rich in engineering concepts:
- contract-first API with protobuf
- async, typed backend services in Rust
- shared backend state and service composition
- middleware/interceptor usage for auth concerns
- browser compatibility via gRPC-Web and CORS layering
- full-stack integration from protocol to UI

It demonstrates practical understanding of distributed API design, not just frontend rendering.

---

## Future Improvements

- move frontend to consume proto from a single shared source
- add unit/integration tests for server and RPC handlers
- add Docker + `docker-compose` for one-command local startup
- add CI for lint/build/test pipelines
- externalize auth token and addresses with environment variables

---

## Quick Commands Reference

From root:
```bash
# backend server
cargo run --bin server

# rust client
cargo run --bin client
```

From `frontend/`:
```bash
# install + run web app
npm install
npm run dev

# production build
npm run build
```
