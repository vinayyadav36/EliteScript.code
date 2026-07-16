import { Venture, Service, ProcessStep } from './types';

export const VENTURES: Venture[] = [
  {
    id: 'triu-naturals',
    name: 'TRIU Naturals',
    tagline: 'Rooted care. Refined formulations.',
    category: 'E-Commerce & Wellness',
    description: 'A premium botanical care brand crafting micro-batch organic skincare, therapeutic hair oils, and raw natural products with deep Ayurvedic roots and clean modern standards.',
    longDescription: 'TRIU Naturals represents the intersection of ancient agricultural wisdom and pristine scientific refinement. Created as an in-house SALTEDHASH consumer venture, we designed the entire technical supply chain, micro-batch inventory tracking, and beautiful editorial storefront. Every product is batch-stamped, hand-filled, and prepared exclusively on-order to preserve natural enzymatic integrity.',
    status: 'In Market',
    features: [
      'Ayurvedic botanical extracts with absolute zero synthetic preservatives',
      'Cold-pressed single-source oils and certified organic active ingredients',
      'Limited production runs (typically 100 bottles per batch)',
      'Fully traceable supply chain with micro-batch batch-stamp validation'
    ],
    stats: [
      { label: 'Formulations', value: '09 Core' },
      { label: 'Batch Size', value: '150 Max' },
      { label: 'Organic Rating', value: '100%' },
      { label: 'Customer Retention', value: '84%' }
    ],
    accentColor: '#4f5c4b', // Olive/sage green
    logoText: 'T R I U'
  },
  {
    id: 'shri-nandi',
    name: 'Shri Nandi Marketing',
    tagline: 'Automated local growth infrastructure.',
    category: 'Marketing & Systems',
    description: 'An automation-first local search engine optimization, marketing pipeline, and customer acquisition engine engineered for high-density service providers.',
    longDescription: 'Shri Nandi Marketing Services is a programmatic local marketing pipeline that eliminates repetitive ad agency work. Powered by custom background scraper queues and localized keyword engines, it identifies hyper-local search layout vacancies and deploys targeted regional campaigns automatically. Built to service growth-minded businesses in expanding economic zones.',
    status: 'Scaling',
    features: [
      'Programmatic landing-page generation with dynamic keyword mapping',
      'Automated Google Business Profile synchronization and post scheduling',
      'Instant local review generation funnels with customized QR targets',
      'Consolidated multi-channel messaging inbox for real-time lead tracking'
    ],
    stats: [
      { label: 'Leads Generated', value: '12k+' },
      { label: 'Local Rankings', value: 'Top 3' },
      { label: 'Automation Index', value: '94%' },
      { label: 'Ad-Spend Saved', value: '45%' }
    ],
    accentColor: '#3c5a6c', // Steel/slate blue
    logoText: 'SHRI NANDI'
  },
  {
    id: 'saltedhash-studio',
    name: 'SALTEDHASH Studio',
    tagline: 'The custom software & product foundry.',
    category: 'Venture Studio',
    description: 'Our elite engineering and strategic consulting arm. We partner with visionaries to design, prototype, audit, and launch scalable digital systems, AI agent pipelines, and high-performance SaaS.',
    longDescription: 'The core engine of SALTEDHASH. Rather than acting as a simple freelance pool or generic software agency, the Studio acts as a dedicated temporary technical co-founder. We write production-grade TypeScript, Go, and Rust, build bulletproof cloud infrastructure, and craft editorial-quality design systems that make products feel instantly credible.',
    status: 'In Market',
    features: [
      'Dedicated elite team of engineers, product strategists, and designers',
      'Strict 4-to-8 week rapid functional MVP development cycle',
      'Clean architectural codebases delivered with zero lock-in or licensing fees',
      'Continuous security audit and penetration vetting during development'
    ],
    stats: [
      { label: 'Projects Shipped', value: '34' },
      { label: 'Avg Time to MVP', value: '38 Days' },
      { label: 'Secured Capital', value: '$18M+' },
      { label: 'Client Net Promoter', value: '98' }
    ],
    accentColor: '#121212', // Charcoal/dark
    logoText: 'S A L T E D H A S H'
  },
  {
    id: 'krypton-audit',
    name: 'Krypton Audit',
    tagline: 'Automated code review & vulnerability analysis.',
    category: 'AI Product',
    description: 'A security-focused code review utility utilizing fine-tuned local models to analyze codebases for critical structural flaws, OWASP leaks, and smart contract design bugs.',
    longDescription: 'Krypton Audit was born out of our own Studio need for fast, high-quality, pre-commit structural audits. We fine-tuned specialized open-weights models on historical vulnerability databases. The engine performs continuous static and semantic analysis, creating beautiful, executive-friendly vulnerability risk scorecards in under three minutes.',
    status: 'Private Beta',
    features: [
      'Continuous pre-commit scan hooks for GitHub, GitLab, and local CLI',
      'Zero-data-leak pipeline: your proprietary code is never stored or used for public training',
      'Specialized AST parsing combined with fine-tuned semantic analysis models',
      'Actionable patch suggestions complete with automated PR branch creation'
    ],
    stats: [
      { label: 'Vulnerabilities Checked', value: '400+' },
      { label: 'Scan Time', value: '<3 Min' },
      { label: 'False Positives', value: '<2.1%' },
      { label: 'Active Beta Testers', value: '280+' }
    ],
    accentColor: '#6d4c41', // Deep copper
    logoText: 'K R Y P T O N'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning Integration',
    category: 'Intelligence',
    tagline: 'Pragmatic, logic-led AI solutions that eliminate operational friction.',
    description: 'We ignore the speculative hype and focus purely on practical utility. We build autonomous agent pipelines, custom semantic search engines (RAG), and proprietary LLM integrations that drive business decisions and automate high-cost operational bottlenecks.',
    details: [
      'Structured entity extraction and document parsing agents',
      'Vector database architecture and proprietary context-grounded search (RAG)',
      'Fine-tuning of specialized open models for low-latency domain-specific reasoning',
      'LLM routing and hybrid agent workflows with deterministic fallback guards'
    ],
    capabilities: ['Llama-3/Claude/Gemini orchestration', 'Qdrant & pgvector', 'LangChain & custom workflows', 'HuggingFace pipelines']
  },
  {
    id: 'web-arch',
    title: 'High-Performance Web Architecture',
    category: 'Engineering',
    tagline: 'Pragmatic, high-speed, and deeply scalable web platform engineering.',
    description: 'We construct beautiful, secure, and blazing-fast web frontends and backends. Adhering to strict web vitals, our code is written in clean, modern TypeScript, React, Go, or Node, backed by edge-routed architectures that scale effortlessly.',
    details: [
      'SPA, SSR, and Static Site Generation (SSG) hybrid platforms',
      'Modular RESTful and GraphQL API design with robust schema verification',
      'Sub-second first-contentful-paint latency tuning and bundle optimization',
      'Highly responsive, fluid typography systems designed for desktop and mobile'
    ],
    capabilities: ['React & Vite / Next.js', 'TypeScript & Node.js', 'Go & Rust backends', 'Tailwind CSS & CSS-in-JS']
  },
  {
    id: 'saas-mvp',
    title: 'SaaS MVP Development (4-6 Weeks)',
    category: 'Execution',
    tagline: 'Transform concepts into production-grade functional software, rapid.',
    description: 'We help early-stage founders and corporate innovators launch high-fidelity products in weeks, not quarters. We take complete ownership of the technical stack, database design, payment gateway connections, and user authentication so you can sell with confidence.',
    details: [
      'Comprehensive product scoping, user flow design, and database schema modeling',
      'Secure user onboarding, social logins, and multi-tenant authentication',
      'Stripe subscription integration, tiered pricing plans, and webhooks tracking',
      'Complete CI/CD setups, cloud monitoring, and live release tracking'
    ],
    capabilities: ['Firebase / Postgres / Supabase', 'Stripe Billing API', 'OAuth 2.0 Auth', 'Vercel / Cloud Run / AWS']
  },
  {
    id: 'design-systems',
    title: 'Product Design Systems',
    category: 'Aesthetics',
    tagline: 'Bridging the divide between modern typography, brand intent, and code.',
    description: 'We construct highly customized, modular UI component libraries that align with brand goals. Our design systems are structured on grid discipline, logical sizing, and restrained color hierarchies to project premium authority.',
    details: [
      'Custom Figma component libraries with complete Auto-Layout and variable systems',
      'Clean, accessible Tailwind utility libraries mapped directly to React props',
      'Staggered micro-animations and micro-interactions for polished UI feedback',
      'Strict AAA contrast standards and comprehensive responsive testing structures'
    ],
    capabilities: ['Figma Design Files', 'Tailwind Custom Themes', 'Framer Motion / Motion.js', 'Component Library Dev']
  },
  {
    id: 'automation-workflow',
    title: 'Workflow Automation & Integration',
    category: 'Efficiency',
    tagline: 'Connecting disparate legacy software into clean programmatic streams.',
    description: 'We map operational blockages and construct bulletproof bridges between your existing CRM, inventory management systems, and messaging apps, freeing up thousands of manual human labor hours.',
    details: [
      'Event-driven serverless background pipelines with persistent error-retry queues',
      'Custom CRM automation integrations (Salesforce, HubSpot, custom DBs)',
      'Programmatic reporting dashboards, daily Slack summaries, and alert systems',
      'Bulk data processing, automated CSV synthesis, and spreadsheet synchers'
    ],
    capabilities: ['Serverless Cloud Functions', 'Webhooks & REST brokers', 'HubSpot & Salesforce APIs', 'Node / Python workers']
  },
  {
    id: 'security-audit',
    title: 'Security, Code Review & Auditing',
    category: 'Security',
    tagline: 'Scrubbing architecture and source code to ensure structural integrity.',
    description: 'A deep architectural assessment of your existing code. We highlight security risks, highlight structural bad patterns, analyze SQL-injection points, and deliver a detailed executive scorecard outlining necessary remediations.',
    details: [
      'Thorough static analysis (SAST) and software dependency vulnerability scrubbing',
      'Comprehensive code reviews checking for thread-safety, race conditions, and memory leaks',
      'Identity and Access Management (IAM) privilege structure auditing',
      'Comprehensive reporting package detailing actionable patches and timeline priorities'
    ],
    capabilities: ['Static Code Analysis', 'OWASP Top 10 Auditing', 'IAM Security Audits', 'Vulnerability Remediation']
  },
  {
    id: 'shri-nandi-marketing',
    title: 'Shri Nandi Marketing Services',
    category: 'Marketing & Business Consultancy',
    tagline: 'Programmatic local marketing and automated customer acquisition pipelines.',
    description: 'We construct full-funnel automated marketing ecosystems that dominate local search. By mapping keyword vacancies and deploying programmatic SEO, we consistently place your service business in front of high-intent local buyers.',
    details: [
      'Automated Google Business Profile synchronization and reputation management',
      'Hyper-localized landing page generation scaled via headless CMS architecture',
      'Custom lead-capture QR funnels and automated SMS follow-up pipelines',
      'Performance reporting dashboards showing exact acquisition costs per channel'
    ],
    capabilities: ['Programmatic SEO', 'Local GBP Optimization', 'Review Automation', 'Lead Routing Pipelines']
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    phase: 'Phase 01',
    title: 'Deconstruction & Strategy',
    description: 'We disassemble your requirements to find the core problem. We ignore feature bloat and map out a lean, high-trust digital route containing only the essential metrics needed for success.',
    deliverables: ['Problem-definition document', 'Core UX user flow maps', 'Technical feasibility study', 'Strict project architecture roadmap'],
    duration: 'Week 1'
  },
  {
    phase: 'Phase 02',
    title: 'Aesthetic & Data Architecture',
    description: 'We simultaneously design the visual landscape and the database schema. The design language is curated to project high-end premium value, while the schema is optimized for lightning-fast queries and extreme durability.',
    deliverables: ['High-fidelity interactive Figma prototype', 'Modular Tailwind theme definitions', 'SQL/NoSQL relational data model', 'API endpoint specifications'],
    duration: 'Week 2'
  },
  {
    phase: 'Phase 03',
    title: 'Intense Engineering Sprint',
    description: 'Our senior engineers write pristine TypeScript, Go, or Rust code. We operate in weekly continuous-deployment cycles, so you can test the real functional product in your browser from the very first sprint.',
    deliverables: ['Fully functional web application in secure staging', 'Interactive user authentication and forms', 'Third-party API and database hooks', 'Git commit audit history'],
    duration: 'Weeks 3–5'
  },
  {
    phase: 'Phase 04',
    title: 'Audit, Polish & Deployment',
    description: 'We run deep automated code reviews, optimize asset loading for sub-second performance, establish robust cloud monitoring dashboards, and securely hand over the entire codebase key with zero vendor lock-in.',
    deliverables: ['Production deployment on secure Cloud Run/AWS infrastructure', 'Clean architectural codebase handoff (Git Repository)', 'Custom administration and analytics dashboard', '30-day technical support warranty'],
    duration: 'Week 6'
  }
];

export const PHILOSOPHY_POINTS = [
  {
    title: 'Problem-First Logic',
    description: 'We do not sell pre-fabricated templates or push unnecessary buzzwords. We start by deeply understanding the commercial or operational friction you face, then select the optimal technical stack to dissolve it.'
  },
  {
    title: 'Absolute Craft Discipline',
    description: 'Every layout border, typography weight, micro-interaction, and data query is designed with intense intention. A high-trust brand is built on a thousand micro-decisions executed with absolute precision.'
  },
  {
    title: 'Zero Technical Lock-In',
    description: 'You own your code. Period. We deliver pristine, thoroughly commented repositories, clear documentation, and standard cloud configurations. If you choose to expand your internal team tomorrow, they can build on our foundations with ease.'
  },
  {
    title: 'Long-Term Partnership',
    description: 'We are not a transactional agency trying to maximize billable hours. We operate as a tactical venture studio, investing our reputation and deep care into building durable digital institutions.'
  }
];
