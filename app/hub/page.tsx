'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Code2, DollarSign, Megaphone, TrendingUp, Users, Globe,
  BookOpen, ExternalLink, Search, Layers, ChevronRight, Star
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Category = 'programming' | 'finance' | 'marketing' | 'sales' | 'tech' | 'design' | 'hr';

interface Resource {
  title: string;
  description: string;
  url: string;
  tags: string[];
  type: 'course' | 'tool' | 'article' | 'docs' | 'community' | 'framework';
  free: boolean;
}

interface HubCategory {
  id: Category;
  label: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  tagline: string;
  resources: Resource[];
}

const HUB_DATA: HubCategory[] = [
  {
    id: 'programming',
    label: 'Programming',
    icon: Code2,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-500/5',
    tagline: 'Languages, frameworks, tools & best practices',
    resources: [
      { title: 'MDN Web Docs', description: 'Definitive reference for HTML, CSS, and JavaScript', url: 'https://developer.mozilla.org', tags: ['JS', 'HTML', 'CSS'], type: 'docs', free: true },
      { title: 'freeCodeCamp', description: 'Free full-stack web development curriculum with certifications', url: 'https://www.freecodecamp.org', tags: ['Full Stack', 'Beginner'], type: 'course', free: true },
      { title: 'Next.js Docs', description: 'Official documentation for the Next.js React framework', url: 'https://nextjs.org/docs', tags: ['React', 'Next.js', 'TypeScript'], type: 'docs', free: true },
      { title: 'TypeScript Handbook', description: 'Official guide to TypeScript — types, generics, utilities', url: 'https://www.typescriptlang.org/docs', tags: ['TypeScript'], type: 'docs', free: true },
      { title: 'LeetCode', description: 'Practice DSA problems and prepare for coding interviews', url: 'https://leetcode.com', tags: ['DSA', 'Interviews'], type: 'tool', free: true },
      { title: 'GitHub', description: 'Version control, open-source, Actions CI/CD', url: 'https://github.com', tags: ['Git', 'DevOps'], type: 'tool', free: true },
      { title: 'Vercel', description: 'Deploy Next.js and React apps in seconds', url: 'https://vercel.com', tags: ['Deployment', 'Cloud'], type: 'tool', free: true },
      { title: 'The Odin Project', description: 'Full-stack web development curriculum, project-based', url: 'https://www.theodinproject.com', tags: ['Full Stack', 'Open Source'], type: 'course', free: true },
      { title: 'Roadmap.sh', description: 'Visual learning roadmaps for every developer role', url: 'https://roadmap.sh', tags: ['Career', 'Learning Path'], type: 'community', free: true },
      { title: 'Tailwind CSS Docs', description: 'Utility-first CSS framework — complete reference', url: 'https://tailwindcss.com/docs', tags: ['CSS', 'Tailwind'], type: 'docs', free: true },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-green-500/5',
    tagline: 'Investing, markets, personal finance & wealth',
    resources: [
      { title: 'Investopedia', description: 'Financial education, definitions, and market analysis', url: 'https://www.investopedia.com', tags: ['Markets', 'Concepts'], type: 'article', free: true },
      { title: 'Zerodha Varsity', description: 'Free Indian stock market education by Zerodha', url: 'https://zerodha.com/varsity', tags: ['Stock Market', 'India'], type: 'course', free: true },
      { title: 'TradingView', description: 'Advanced charting, technical analysis, market screeners', url: 'https://www.tradingview.com', tags: ['Charts', 'Technical Analysis'], type: 'tool', free: true },
      { title: 'Yahoo Finance', description: 'Real-time stock quotes, news, portfolio tracking', url: 'https://finance.yahoo.com', tags: ['Stocks', 'News'], type: 'tool', free: true },
      { title: 'J.P. Morgan Learning', description: 'Financial modeling, investment banking concepts', url: 'https://www.jpmorgan.com/insights', tags: ['Investment Banking', 'Modeling'], type: 'article', free: true },
      { title: 'NSE India', description: 'National Stock Exchange — market data, indices, F&O', url: 'https://www.nseindia.com', tags: ['NSE', 'India', 'Derivatives'], type: 'tool', free: true },
      { title: 'Screener.in', description: 'Indian company financials, screener, peer comparison', url: 'https://www.screener.in', tags: ['Fundamental Analysis', 'India'], type: 'tool', free: true },
      { title: 'Khan Academy Finance', description: 'Beginner-friendly finance and economics videos', url: 'https://www.khanacademy.org/economics-finance-domain', tags: ['Beginner', 'Economics'], type: 'course', free: true },
      { title: 'CFA Institute', description: 'Professional investment management and financial analysis', url: 'https://www.cfainstitute.org', tags: ['CFA', 'Professional'], type: 'community', free: false },
      { title: 'Moneycontrol', description: 'Indian financial news, mutual funds, portfolio tracker', url: 'https://www.moneycontrol.com', tags: ['India', 'MF', 'News'], type: 'tool', free: true },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-pink-500/5',
    tagline: 'Digital marketing, SEO, content & campaigns',
    resources: [
      { title: 'HubSpot Academy', description: 'Free certifications in inbound marketing, SEO, email', url: 'https://academy.hubspot.com', tags: ['Inbound', 'Certifications'], type: 'course', free: true },
      { title: 'Google Digital Garage', description: 'Free digital marketing fundamentals by Google', url: 'https://learndigital.withgoogle.com', tags: ['Google', 'Beginner'], type: 'course', free: true },
      { title: 'Semrush', description: 'SEO, competitor analysis, keyword research, backlinks', url: 'https://www.semrush.com', tags: ['SEO', 'Competitor Analysis'], type: 'tool', free: false },
      { title: 'Google Analytics 4', description: 'Website traffic analytics, conversion tracking, GA4', url: 'https://analytics.google.com', tags: ['Analytics', 'Google'], type: 'tool', free: true },
      { title: 'Mailchimp', description: 'Email marketing, automation, audience management', url: 'https://mailchimp.com', tags: ['Email Marketing', 'Automation'], type: 'tool', free: true },
      { title: 'Canva', description: 'Design graphics, social media posts, presentations', url: 'https://www.canva.com', tags: ['Design', 'Social Media'], type: 'tool', free: true },
      { title: 'Buffer', description: 'Social media scheduling and analytics', url: 'https://buffer.com', tags: ['Social Media', 'Scheduling'], type: 'tool', free: true },
      { title: 'Ahrefs Blog', description: 'Expert SEO tutorials and case studies', url: 'https://ahrefs.com/blog', tags: ['SEO', 'Content'], type: 'article', free: true },
      { title: 'Meta Business Suite', description: 'Facebook and Instagram ads, insights, and management', url: 'https://business.facebook.com', tags: ['Meta Ads', 'Social'], type: 'tool', free: true },
      { title: 'Moz Beginner's SEO Guide', description: 'Comprehensive beginner guide to search engine optimization', url: 'https://moz.com/beginners-guide-to-seo', tags: ['SEO', 'Beginner'], type: 'article', free: true },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: TrendingUp,
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-orange-500/5',
    tagline: 'CRM, pipeline, negotiation & revenue ops',
    resources: [
      { title: 'HubSpot CRM', description: 'Free CRM for tracking deals, contacts, and pipelines', url: 'https://www.hubspot.com/products/crm', tags: ['CRM', 'Free'], type: 'tool', free: true },
      { title: 'Salesforce Trailhead', description: 'Free learning platform for Salesforce CRM and Sales Cloud', url: 'https://trailhead.salesforce.com', tags: ['Salesforce', 'CRM'], type: 'course', free: true },
      { title: 'Apollo.io', description: 'Sales intelligence, prospecting, and outreach automation', url: 'https://www.apollo.io', tags: ['Prospecting', 'Outreach'], type: 'tool', free: true },
      { title: 'Pipedrive', description: 'Visual sales pipeline CRM designed for sales teams', url: 'https://www.pipedrive.com', tags: ['CRM', 'Pipeline'], type: 'tool', free: false },
      { title: 'LinkedIn Sales Navigator', description: 'Advanced prospecting on LinkedIn — target buyers', url: 'https://business.linkedin.com/sales-solutions', tags: ['LinkedIn', 'Prospecting'], type: 'tool', free: false },
      { title: 'Gong.io', description: 'Revenue intelligence — call recording, deal coaching', url: 'https://www.gong.io', tags: ['Revenue Intelligence', 'Coaching'], type: 'tool', free: false },
      { title: 'SPIN Selling (Book)', description: 'The classic methodology for complex B2B sales', url: 'https://www.amazon.in/SPIN-Selling-Neil-Rackham/dp/0070511136', tags: ['B2B', 'Methodology', 'Book'], type: 'article', free: false },
      { title: 'Lemlist', description: 'Personalized cold email outreach and sequences', url: 'https://lemlist.com', tags: ['Cold Email', 'Outreach'], type: 'tool', free: false },
      { title: 'Close.com Blog', description: 'Sales tactics, scripts, and playbooks from practitioners', url: 'https://blog.close.com', tags: ['Sales Tactics', 'Scripts'], type: 'article', free: true },
      { title: 'Zoho CRM', description: 'Affordable CRM with automation, email, and analytics', url: 'https://www.zoho.com/crm', tags: ['CRM', 'India-friendly'], type: 'tool', free: true },
    ],
  },
  {
    id: 'tech',
    label: 'Tech & AI',
    icon: Globe,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-500/5',
    tagline: 'AI, cloud, DevOps, cybersecurity & emerging tech',
    resources: [
      { title: 'AWS Free Tier', description: 'Build on Amazon Web Services — 100+ products free', url: 'https://aws.amazon.com/free', tags: ['Cloud', 'AWS'], type: 'tool', free: true },
      { title: 'Google AI Studio', description: 'Experiment with Gemini models — prompting and APIs', url: 'https://aistudio.google.com', tags: ['AI', 'Gemini', 'LLM'], type: 'tool', free: true },
      { title: 'OpenAI Platform', description: 'GPT-4, DALL-E, Whisper APIs — build AI products', url: 'https://platform.openai.com', tags: ['AI', 'GPT', 'API'], type: 'tool', free: false },
      { title: 'Docker Docs', description: 'Containerization from beginner to production', url: 'https://docs.docker.com', tags: ['Docker', 'DevOps'], type: 'docs', free: true },
      { title: 'Kubernetes Docs', description: 'Container orchestration — production-grade deployments', url: 'https://kubernetes.io/docs', tags: ['K8s', 'DevOps'], type: 'docs', free: true },
      { title: 'OWASP Top 10', description: 'Web application security risks — must-read for devs', url: 'https://owasp.org/www-project-top-ten', tags: ['Security', 'Web Dev'], type: 'article', free: true },
      { title: 'Hugging Face', description: 'Open-source AI models, datasets, and spaces', url: 'https://huggingface.co', tags: ['AI', 'ML', 'Open Source'], type: 'community', free: true },
      { title: 'fast.ai', description: 'Practical deep learning for coders — free courses', url: 'https://www.fast.ai', tags: ['Deep Learning', 'Python'], type: 'course', free: true },
      { title: 'Cloudflare Docs', description: 'CDN, Workers, DNS, security — edge computing', url: 'https://developers.cloudflare.com', tags: ['CDN', 'Edge', 'Security'], type: 'docs', free: true },
      { title: 'Product Hunt', description: 'Discover the latest tech products and AI tools', url: 'https://www.producthunt.com', tags: ['Tech News', 'Tools'], type: 'community', free: true },
    ],
  },
  {
    id: 'design',
    label: 'Design & UI/UX',
    icon: Layers,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-500/5',
    tagline: 'UI/UX, design systems, prototyping & inspiration',
    resources: [
      { title: 'Figma', description: 'Industry-standard UI design and prototyping tool', url: 'https://www.figma.com', tags: ['UI/UX', 'Prototyping'], type: 'tool', free: true },
      { title: 'Dribbble', description: 'Design inspiration, portfolio sharing, job board', url: 'https://dribbble.com', tags: ['Inspiration', 'Portfolio'], type: 'community', free: true },
      { title: 'Behance', description: 'Creative work showcase by Adobe — UI, branding, motion', url: 'https://www.behance.net', tags: ['Portfolio', 'Inspiration'], type: 'community', free: true },
      { title: 'Material Design 3', description: 'Google's design system — components, motion, tokens', url: 'https://m3.material.io', tags: ['Design System', 'Google'], type: 'docs', free: true },
      { title: 'Radix UI', description: 'Unstyled, accessible React component primitives', url: 'https://www.radix-ui.com', tags: ['React', 'Accessibility'], type: 'framework', free: true },
      { title: 'shadcn/ui', description: 'Beautiful Tailwind + Radix component collection', url: 'https://ui.shadcn.com', tags: ['Tailwind', 'React', 'Components'], type: 'framework', free: true },
      { title: 'Coolors', description: 'Color palette generator and explorer', url: 'https://coolors.co', tags: ['Colors', 'Branding'], type: 'tool', free: true },
      { title: 'Google Fonts', description: '1,500+ free, open-source web fonts', url: 'https://fonts.google.com', tags: ['Typography', 'Fonts'], type: 'tool', free: true },
      { title: 'Unsplash', description: 'Free high-quality stock photography', url: 'https://unsplash.com', tags: ['Photography', 'Stock'], type: 'tool', free: true },
      { title: 'Laws of UX', description: 'UX design principles backed by psychology', url: 'https://lawsofux.com', tags: ['UX Theory', 'Psychology'], type: 'article', free: true },
    ],
  },
  {
    id: 'hr',
    label: 'HR & Management',
    icon: Users,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    tagline: 'People operations, leadership, hiring & culture',
    resources: [
      { title: 'SHRM', description: 'Society for Human Resource Management — policies, templates', url: 'https://www.shrm.org', tags: ['HR Policy', 'Professional'], type: 'community', free: false },
      { title: 'LinkedIn Talent Solutions', description: 'Hiring, employer branding, recruiter tools', url: 'https://business.linkedin.com/talent-solutions', tags: ['Hiring', 'Recruitment'], type: 'tool', free: false },
      { title: 'Lattice', description: 'Performance management, OKRs, and engagement surveys', url: 'https://lattice.com', tags: ['Performance', 'OKRs'], type: 'tool', free: false },
      { title: 'Culture Amp', description: 'Employee engagement surveys and people analytics', url: 'https://www.cultureamp.com', tags: ['Engagement', 'Analytics'], type: 'tool', free: false },
      { title: 'Workable', description: 'Applicant tracking system (ATS) for streamlined hiring', url: 'https://www.workable.com', tags: ['ATS', 'Hiring'], type: 'tool', free: false },
      { title: 'Notion HR Templates', description: 'Free HR templates: onboarding, 1-on-1s, reviews', url: 'https://www.notion.so/templates/category/hr', tags: ['Templates', 'Free'], type: 'tool', free: true },
      { title: 'Glassdoor for Employers', description: 'Employer branding, reviews, salary benchmarks', url: 'https://www.glassdoor.co.in/employers', tags: ['Branding', 'Salaries'], type: 'tool', free: false },
      { title: 'Paul Graham Essays', description: 'Startup management, hiring philosophy, and culture', url: 'http://www.paulgraham.com/articles.html', tags: ['Leadership', 'Startups'], type: 'article', free: true },
      { title: 'Mercer India', description: 'Salary benchmarking, compensation & benefits insights', url: 'https://www.mercer.com/en-in', tags: ['Compensation', 'Benchmarking'], type: 'community', free: false },
      { title: 'Remote.com', description: 'Global HR compliance, payroll, and contractor management', url: 'https://remote.com', tags: ['Remote Work', 'Payroll'], type: 'tool', free: false },
    ],
  },
];

const TYPE_BADGE: Record<string, string> = {
  course: 'bg-blue-500/20 text-blue-400',
  tool: 'bg-yellow-500/20 text-yellow-400',
  article: 'bg-green-500/20 text-green-400',
  docs: 'bg-purple-500/20 text-purple-400',
  community: 'bg-pink-500/20 text-pink-400',
  framework: 'bg-orange-500/20 text-orange-400',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hub() {
  const [activeCategory, setActiveCategory] = useState<Category>('programming');
  const [search, setSearch] = useState('');

  const category = HUB_DATA.find((c) => c.id === activeCategory)!;

  const filtered = category.resources.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <main className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 mb-3 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <BookOpen className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 text-sm font-medium">Knowledge Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            The <span className="text-yellow-500">Ultimate</span> Resource Hub
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Curated tools, courses, docs, and communities for programming, finance, marketing, sales, tech, design, and HR — everything at one place.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {HUB_DATA.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <motion.button key={cat.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                  isActive ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-yellow-500/5 border-yellow-500/10 text-gray-300 hover:border-yellow-500/30'
                }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : cat.color}`} />
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${category.label} resources...`}
            className="w-full pl-10 pr-4 py-2.5 bg-yellow-500/5 border border-yellow-500/15 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 text-sm"
          />
        </div>

        {/* Category Header */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className={`bg-gradient-to-r ${category.gradient} border border-yellow-500/10 rounded-2xl p-5 mb-6 flex items-center space-x-4`}>
              {(() => { const Icon = category.icon; return <Icon className={`w-10 h-10 ${category.color}`} />; })()}
              <div>
                <h2 className="text-xl font-bold text-white">{category.label}</h2>
                <p className="text-gray-400 text-sm">{category.tagline}</p>
              </div>
              <div className="ml-auto text-xs text-gray-500">{filtered.length} resources</div>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((r) => (
                <motion.a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group block bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 rounded-xl p-5 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">{r.title}</h3>
                    </div>
                    <div className="flex items-center space-x-1 ml-2 shrink-0">
                      {r.free && <Star className="w-3 h-3 text-yellow-500" title="Free" />}
                      <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mb-3 leading-relaxed">{r.description}</p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[r.type]}`}>{r.type}</span>
                    {r.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-gray-500">{tag}</span>
                    ))}
                    {!r.free && <span className="ml-auto text-xs text-gray-600">Paid</span>}
                  </div>
                </motion.a>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No resources match "<span className="text-yellow-400">{search}</span>"</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer CTA */}
        <div className="mt-12 text-center p-8 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Want to generate business reports?</h3>
          <p className="text-gray-400 text-sm mb-4">Use the Dashboard Generator to produce Excel/Power BI-ready reports for your business.</p>
          <Link href="/dashboard-generator"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-colors text-sm">
            <span>Open Dashboard Generator</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
