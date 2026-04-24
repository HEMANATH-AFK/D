# ProjectForge AI: Professional Technical Documentation

**Version:** 1.0.0  
**Last Updated:** April 24, 2026  
**Status:** Production-Ready  

---

## 1. 📘 Project Overview

### What is ProjectForge AI?
ProjectForge AI is a **Cinematic SaaS Platform** designed to revolutionize the way software project ideas are generated, evaluated, and archived. It leverages state-of-the-art Artificial Intelligence to synthesize "Architectural Blueprints" for complex software ecosystems, providing users with detailed technical roadmaps.

### Problem it Solves
Most project generators provide generic, repetitive ideas without technical depth. ProjectForge AI solves this by:
- Providing **high-fidelity technical stacks**.
- Ensuring **semantic uniqueness** through vector-based similarity checks.
- Offering a **cinematic, immersive environment** that reduces creative fatigue.

### Target Users
Primary users are **College Students**, **Aspiring Developers**, and **Startup Founders** who need high-quality, resume-worthy project ideas that go beyond the basic "To-Do List" or "Blog" clones.

---

## 2. 🏗️ System Architecture

### High-Level Architecture
ProjectForge AI follows a **Modern MERN (MongoDB, Express, React, Node.js)** architecture with a dedicated **AI Synthesis Layer**.

- **Frontend (Presentation Layer)**: A React-based SPA that utilizes Three.js for 3D visuals and Framer Motion for cinematic interaction.
- **Backend (Service Layer)**: An Express server handling business logic, authentication, and AI orchestration.
- **AI Layer (Synthesis Core)**: Integration with Google Gemini for generating blueprints and text embeddings.
- **Database (Data Layer)**: MongoDB for persistent storage of user profiles, architectural blueprints, and settings.

### Communication Flow
1. **Request**: User triggers a "Synthesis" from the Frontend.
2. **Orchestration**: Backend verifies JWT, fetches user profile (skills/interests).
3. **AI Logic**: 
    - Fetches existing project embeddings.
    - Generates a new idea via Gemini.
    - Calculates Cosine Similarity against existing ideas.
4. **Persistence**: Saves the unique blueprint to MongoDB.
5. **Response**: Delivers the cinematic blueprint to the client for rendering.

---

## 3. ⚙️ Tech Stack

### Frontend Technologies
- **React 18**: Component-based UI logic.
- **Tailwind CSS**: Utility-first styling with high-end glassmorphism.
- **Framer Motion**: Gesture-driven animations and page transitions.
- **Three.js / React Three Fiber**: Cinematic 3D starfield and AI Core backgrounds.
- **GSAP**: High-precision motion control for marquee and scroll effects.
- **Lucide React**: Premium iconography.

### Backend Technologies
- **Node.js**: Asynchronous runtime.
- **Express.js**: REST API framework.
- **JWT (JsonWebToken)**: Stateless authentication.
- **Bcrypt.js**: Secure password hashing.

### Database & AI
- **MongoDB / Mongoose**: NoSQL document storage.
- **Google Gemini API**: 
    - `gemini-1.5-pro`: Complex blueprint generation.
    - `text-embedding-004`: Semantic vector generation.

---

## 4. 🔐 Authentication Flow

### Signup/Login Process
1. **Data Submission**: User provides email/password.
2. **Encryption**: Password is hashed using Bcrypt (salt rounds: 10).
3. **Token Generation**: Upon successful validation, a JWT is generated containing the `userId`.
4. **Storage**: The token is stored in `localStorage` on the client.

### Protected Routes
- All `/api/ideas` and `/api/user` routes are protected by an `auth` middleware.
- The middleware extracts the `Authorization` header, verifies the JWT, and attaches the `user` object to the request.

---

## 5. 💡 Core Features

### AI Idea Generator
- **Function**: Synthesizes unique architectural blueprints based on user skill sets.
- **Mechanism**: Uses a custom RAG (Retrieval-Augmented Generation) flow to check semantic similarity before presenting the idea to the user.

### Neural Archive (History)
- **Function**: A secure vault of all previously generated blueprints.
- **Mechanism**: Fetches user-specific ideas from MongoDB and renders them using the **Kinetic Card** system.

### Forge Architect (Chatbot)
- **Function**: Real-time AI consultation for project refinement.
- **Mechanism**: Maintains a strictly alternating conversation history and uses RAG to provide context-aware suggestions based on the user's archive.

### Neural Core (Dashboard)
- **Function**: High-level visualization of system activity and project metrics.
- **Mechanism**: Aggregates data points (avg innovation score, total projects) and renders them via the **AI Thinking Core** visual.

---

## 6. 🤖 AI + RAG System

### Generation Logic
The system uses **Constraint-Based Prompting**:
1. It passes the user's domain and skills to Gemini.
2. It provides a list of *already generated titles* to avoid repetition.
3. It enforces a strict JSON output format for seamless frontend integration.

### Semantic Validation (RAG)
1. Every new idea is converted into a **768-dimensional vector** using Gemini Embeddings.
2. The system calculates **Cosine Similarity** against the user's previous ideas.
3. If the similarity score is > 0.8, the idea is rejected, and a new synthesis is initiated.

---

## 7. 🗄️ DATABASE DESIGN

### User Model
| Field | Type | Purpose |
| :--- | :--- | :--- |
| `name` | String | Display name |
| `email` | String | Unique identifier |
| `password` | String | Hashed credentials |
| `skills` | Array | Used for AI context |
| `domain` | String | User's technical focus |

### Idea Model
| Field | Type | Purpose |
| :--- | :--- | :--- |
| `user` | ObjectId | Reference to User model |
| `title` | String | Project name |
| `description` | String | Detailed Roadmap |
| `techStack` | Array | Technical requirements |
| `innovationScore`| Number | AI-calculated uniqueness |
| `embedding` | Array | 768-dim vector for similarity checks |

---

## 8. 🔌 API DOCUMENTATION

### Authentication
- `POST /api/auth/register`: Create new user account.
- `POST /api/auth/login`: Authenticate and receive JWT.

### Ideas
- `POST /api/ideas/generate`: Initiate AI synthesis (Requires Auth).
- `GET /api/ideas`: Fetch user archive.
- `POST /api/ideas/search`: Semantic search through history.
- `DELETE /api/ideas/:id`: Purge a blueprint.

### Chat
- `POST /api/chat`: Communicate with the Forge Architect.

---

## 9. ✨ UI/UX FEATURES

- **Cinematic Loader**: A "Travel to Void" intro that zooms out from the AFK logo into the application.
- **Magnetic Fluid Cursor**: A velocity-aware cursor that stretches and snaps to interactive nodes.
- **3D AI Core**: A React Three Fiber background centerpiece that reacts to scroll depth.
- **Glassmorphism 2.0**: Heavy backdrop blurs and asymmetrical layouts for a premium feel.

---

## 10. 🚀 SETUP & INSTALLATION

### 1. Clone Repository
```bash
git clone <repository-url>
cd projectforge-ai
```

### 2. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GOOGLE_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies
```bash
npm run install-all  # or cd client && npm install && cd ../server && npm install
```

### 4. Run Application
```bash
npm start
```

---

## 11. ⚠️ KNOWN ISSUES & LIMITATIONS
- **API Latency**: Gemini 1.5 Pro synthesis can take 3-5 seconds depending on server load.
- **Browser Compatibility**: `backdrop-filter` may require a polyfill for very old Safari versions.
- **Embedding Search**: Similarity check is currently $O(N)$, which is fine for individual users but may require a Vector DB (like Pinecone) for massive scale.

---

## 12. 🔮 FUTURE IMPROVEMENTS
- **Vector DB Integration**: Migrate to a dedicated vector database for $O(1)$ similarity search.
- **Multi-Agent Mode**: Separate AI agents for "The Architect", "The Coder", and "The Reviewer".
- **Real-time Collaboration**: Live blueprint editing with multiple team members.
- **Advanced Analytics**: Deeper insights into user skill growth over time.

