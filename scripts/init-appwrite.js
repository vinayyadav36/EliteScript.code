import { Client, Databases, Permission, Role } from "node-appwrite";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const ENDPOINT = env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const SERVICES_COLLECTION_ID = env.VITE_APPWRITE_SERVICES_COLLECTION_ID;
const API_KEY = env.APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;

if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID || !PRODUCTS_COLLECTION_ID || !SERVICES_COLLECTION_ID) {
  console.error("Missing required environment variables in .env");
  process.exit(1);
}

if (!API_KEY) {
  console.error("Missing APPWRITE_API_KEY. Add it to .env or export it in your shell.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForAttribute(collectionId, key, retries = 45) {
  for (let i = 0; i < retries; i++) {
    try {
      const collection = await databases.getCollection(DATABASE_ID, collectionId);
      const attr = collection.attributes.find((a) => a.key === key);
      if (attr && attr.status === "available") return true;
    } catch {}
    await sleep(2000);
  }
  return false;
}

async function createDatabaseIfNotExists(id, name) {
  try {
    await databases.get(id);
    console.log(`Database "${id}" already exists`);
  } catch {
    console.log(`Creating database "${id}"...`);
    await databases.create(id, name);
    console.log(`Database "${id}" created`);
  }
}

async function createCollectionIfNotExists(id, name) {
  try {
    await databases.getCollection(DATABASE_ID, id);
    console.log(`Collection "${id}" already exists`);
  } catch {
    console.log(`Creating collection "${id}"...`);
    await databases.createCollection(DATABASE_ID, id, name, [
      Permission.read(Role.any()),
    ]);
    console.log(`Collection "${id}" created`);
  }
}

async function createAttr(collectionId, attrName, createFn) {
  try {
    await createFn();
    const ready = await waitForAttribute(collectionId, attrName);
    console.log(`  Attribute "${attrName}" ${ready ? "ready" : "timeout (check console)"}`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`  Attribute "${attrName}" already exists`);
    } else {
      throw e;
    }
  }
}

async function seedDocument(collectionId, data) {
  const id = crypto.randomUUID();
  await databases.createDocument(DATABASE_ID, collectionId, id, data);
  console.log(`  Seeded: ${data.name || data.title}`);
}

async function init() {
  console.log("\n=== Appwrite Database Initialization ===\n");

  await createDatabaseIfNotExists(DATABASE_ID, "SaltedHash Public");

  await createCollectionIfNotExists(PRODUCTS_COLLECTION_ID, "Products");
  await createCollectionIfNotExists(SERVICES_COLLECTION_ID, "Services");

  console.log("\nBuilding Products attributes...");
  await createAttr(PRODUCTS_COLLECTION_ID, "name", () =>
    databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, "name", 255, true)
  );
  await createAttr(PRODUCTS_COLLECTION_ID, "price", () =>
    databases.createIntegerAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, "price", true)
  );
  await createAttr(PRODUCTS_COLLECTION_ID, "description", () =>
    databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, "description", 1000, true)
  );
  await createAttr(PRODUCTS_COLLECTION_ID, "category", () =>
    databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, "category", 100, true)
  );

  console.log("\nBuilding Services attributes...");
  await createAttr(SERVICES_COLLECTION_ID, "title", () =>
    databases.createStringAttribute(DATABASE_ID, SERVICES_COLLECTION_ID, "title", 255, true)
  );
  await createAttr(SERVICES_COLLECTION_ID, "description", () =>
    databases.createStringAttribute(DATABASE_ID, SERVICES_COLLECTION_ID, "description", 1000, true)
  );
  await createAttr(SERVICES_COLLECTION_ID, "tags", () =>
    databases.createStringAttribute(DATABASE_ID, SERVICES_COLLECTION_ID, "tags", 255, true, undefined, true)
  );
  await createAttr(SERVICES_COLLECTION_ID, "benefits", () =>
    databases.createStringAttribute(DATABASE_ID, SERVICES_COLLECTION_ID, "benefits", 1000, true, undefined, true)
  );

  console.log("\nSeeding Products...");
  await seedDocument(PRODUCTS_COLLECTION_ID, {
    name: "Rose Powder",
    price: 450,
    description:
      "Pure, finely-milled organic rose petal powder to balance pH and deeply hydrate sensitive skin.",
    category: "Natural",
  });
  await seedDocument(PRODUCTS_COLLECTION_ID, {
    name: "Neem Powder",
    price: 350,
    description:
      "Cold-processed neem leaf powder packed with anti-bacterial agents to purify and deeply cleanse oily skin types.",
    category: "Natural",
  });
  await seedDocument(PRODUCTS_COLLECTION_ID, {
    name: "Dung Cakes",
    price: 150,
    description:
      "Traditional, sun-dried organic cow dung cakes curated for heritage rituals and natural purification purposes.",
    category: "Natural",
  });

  console.log("\nSeeding Services...");
  await seedDocument(SERVICES_COLLECTION_ID, {
    title: "AI & Machine Learning",
    description:
      "Custom intelligence models, NLP pipelines, and automation workflows tailored to your specific business logic. From data strategy to deployed inference endpoints.",
    tags: ["Python", "TensorFlow", "FastAPI", "Pandas", "Scikit-learn", "OpenAI API", "LangChain"],
    benefits: [
      "Automate repetitive tasks to reduce operational costs by up to 60%.",
      "Make data-backed decisions with custom dashboards and predictive models.",
      "Deploy chatbots and document processors that work 24/7 without breaks.",
    ],
  });
  await seedDocument(SERVICES_COLLECTION_ID, {
    title: "Web Architecture & Dev",
    description:
      "High-performance, edge-optimized applications built on modern frameworks. We deliver scalable, production-grade cloud foundations architecture.",
    tags: ["Vue 3", "Vite", "TypeScript", "Tailwind v4", "Node.js", "Vercel"],
    benefits: [
      "Blazing fast Core Web Vitals for immediate SEO ranking boosts.",
      "Zero-maintenance serverless scalability.",
      "Type-safe robust frontend ecosystems.",
    ],
  });
  await seedDocument(SERVICES_COLLECTION_ID, {
    title: "SaaS MVP Development",
    description:
      "Rapidly transform validated product hypotheses into scalable tech realities. Speed-to-market engineering without sacrificing long-term technical debt.",
    tags: ["MVP Strategy", "Supabase", "Appwrite", "Stripe Integration", "Auth Frameworks"],
    benefits: [
      "Launch working software within 4 to 6 weeks.",
      "Integrated usage tracking and global billing mechanics.",
      "Clean handoffs optimized for internal core teams.",
    ],
  });
  await seedDocument(SERVICES_COLLECTION_ID, {
    title: "Digital Growth Strategy",
    description:
      "Engineering-led distribution networks. We align product analytics infrastructure with programmatic marketing matrices for measurable scale.",
    tags: ["SEO Architecture", "Mixpanel", "Google Analytics 4", "Growth Loops"],
    benefits: [
      "Track the complete customer lifetime value metric lifecycle.",
      "Programmatic automated inbound organic funnel engines.",
      "Conversion rate design optimization sweeps.",
    ],
  });
  await seedDocument(SERVICES_COLLECTION_ID, {
    title: "Automation & Integration",
    description:
      "Eliminate functional silos by tying disparate enterprise tools together. Clean software plumbing making cross-department workflows friction-free.",
    tags: ["Make.com", "Zapier", "Webhooks", "Cron Utilities", "Custom APIs"],
    benefits: [
      "Saves hundreds of manual team structural handling hours.",
      "Real-time structural pipeline system syncing metrics.",
      "Automated failover logging error notifications.",
    ],
  });

  console.log("\n=== Initialization Complete ===\n");
}

init().catch((err) => {
  console.error("Initialization failed:", err);
  process.exit(1);
});
