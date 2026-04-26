/**
 * UNIVERSAL DATA PARSING & NORMALIZATION SYSTEM
 * Ensures the UI never crashes and always displays high-quality fallback data.
 * Supports multiple stacks (MERN, Python, Java, Rust, Go, etc.)
 */

/**
 * Detects the primary stack/language from a tech stack array
 */
const detectStack = (techStack) => {
  const stack = (techStack || []).map(t => t.toLowerCase());
  
  if (stack.some(t => t.includes('python') || t.includes('django') || t.includes('flask'))) return 'python';
  if (stack.some(t => t.includes('java') || t.includes('spring'))) return 'java';
  if (stack.some(t => t.includes('rust') || t.includes('actix') || t.includes('rocket'))) return 'rust';
  if (stack.some(t => t.includes('go') || t.includes('gin') || t.includes('echo'))) return 'go';
  if (stack.some(t => t.includes('c#') || t.includes('.net'))) return 'dotnet';
  
  return 'mern'; // Default
};

/**
 * Gets stack-specific defaults
 */
const getStackDefaults = (stackType) => {
  const defaults = {
    mern: {
      frontend: "React.js + Tailwind CSS",
      backend: "Node.js (Express)",
      database: "MongoDB Atlas",
      deployment: { fe: "Vercel", be: "Render" }
    },
    python: {
      frontend: "React or Streamlit",
      backend: "Python (FastAPI/Django)",
      database: "PostgreSQL",
      deployment: { fe: "Vercel", be: "Railway/Heroku" }
    },
    java: {
      frontend: "Angular or React",
      backend: "Java (Spring Boot)",
      database: "MySQL / Oracle",
      deployment: { fe: "Vercel", be: "AWS / Azure" }
    },
    rust: {
      frontend: "Next.js or WebAssembly",
      backend: "Rust (Actix/Axum)",
      database: "PostgreSQL (Supabase)",
      deployment: { fe: "Vercel", be: "DigitalOcean" }
    },
    go: {
      frontend: "React or Vue.js",
      backend: "Go (Gin/Fiber)",
      database: "PostgreSQL / Redis",
      deployment: { fe: "Netlify", be: "Google Cloud Run" }
    },
    dotnet: {
      frontend: "Blazor or React",
      backend: "C# (.NET Core)",
      database: "SQL Server",
      deployment: { fe: "Azure Static Apps", be: "Azure App Service" }
    }
  };

  return defaults[stackType] || defaults.mern;
};

/**
 * Normalizes Architecture Data
 */
export const parseArchitecture = (arch, techStack = []) => {
  const stackType = detectStack(techStack);
  const stackDefaults = getStackDefaults(stackType);

  const defaults = {
    frontend: { framework: stackDefaults.frontend, components: ["Main Dashboard", "Control Panel", "Adaptive UI"] },
    backend: { framework: stackDefaults.backend, components: ["API Gateway", "Business Logic Layer", "Data Access Object"] },
    database: { type: stackDefaults.database, collections: ["Core_Data", "User_Records"] },
    services: ["Neural Logic Layer", "Vector Memory Store", "Security Middleware"],
    deployment: { 
        frontend: stackDefaults.deployment.fe, 
        backend: stackDefaults.deployment.be, 
        database: "Managed Cloud DB" 
    }
  };

  if (!arch || typeof arch !== 'object') return defaults;

  return {
    frontend: {
      framework: arch.frontend?.framework || defaults.frontend.framework,
      components: Array.isArray(arch.frontend?.components) ? arch.frontend.components : defaults.frontend.components
    },
    backend: {
      framework: arch.backend?.framework || defaults.backend.framework,
      components: Array.isArray(arch.backend?.components) ? arch.backend.components : defaults.backend.components
    },
    database: {
      type: arch.database?.type || defaults.database.type,
      collections: Array.isArray(arch.database?.collections) ? arch.database.collections : defaults.database.collections
    },
    services: Array.isArray(arch.services) ? arch.services : defaults.services,
    deployment: {
      frontend: arch.deployment?.frontend || defaults.deployment.frontend,
      backend: arch.deployment?.backend || defaults.deployment.backend,
      database: arch.deployment?.database || defaults.deployment.database
    }
  };
};

/**
 * Normalizes Improvements Data
 */
export const parseImprovements = (improvements) => {
  const defaults = {
    suggestions: [
      { title: "Technical Scalability", description: "Optimize resource allocation for high concurrency.", category: "Technical" },
      { title: "UX Fluidity", description: "Implement optimistic UI updates for faster interactions.", category: "UX" }
    ],
    nextSteps: ["Define system requirements", "Setup development environment", "Initialize core repository"]
  };

  if (!improvements || typeof improvements !== 'object') return defaults;

  return {
    suggestions: Array.isArray(improvements.suggestions) 
      ? improvements.suggestions.slice(0, 5).map(s => ({
          title: s.title || "Upgrade Node",
          description: s.description || "Enhance system capabilities.",
          category: s.category || "General"
        }))
      : defaults.suggestions,
    nextSteps: Array.isArray(improvements.nextSteps) ? improvements.nextSteps : defaults.nextSteps
  };
};

/**
 * Normalizes Validation Data
 */
export const parseValidation = (val) => {
  const defaults = {
    uniquenessScore: 75,
    marketAnalysis: "Unique technical implementation in the current market landscape.",
    similarIdeas: []
  };

  if (!val || typeof val !== 'object') return defaults;

  return {
    uniquenessScore: typeof val.uniquenessScore === 'number' ? val.uniquenessScore : defaults.uniquenessScore,
    marketAnalysis: val.marketAnalysis || defaults.marketAnalysis,
    similarIdeas: Array.isArray(val.similarIdeas) ? val.similarIdeas : defaults.similarIdeas
  };
};

/**
 * Normalizes Idea Data
 */
export const parseIdea = (idea) => {
  if (!idea) return null;

  return {
    ...idea,
    title: idea.title || "Untitled Blueprint",
    description: idea.description || "No description provided.",
    tech_stack: Array.isArray(idea.tech_stack) ? idea.tech_stack : [],
    problem_statement: idea.problem_statement || "General industry challenge.",
    solution: idea.solution || "Optimized technical implementation.",
    uniqueness_factor: idea.uniqueness_factor || "Innovative technical workflow."
  };
};
