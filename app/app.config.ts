// Site-wide profile data. Edit here instead of inside components.
export default defineAppConfig({
  profile: {
    name: 'Moh. Zulkifli Katili',
    shortName: 'Kiki',
    role: 'Senior Fullstack Engineer',
    location: 'Greater Jakarta, Indonesia',
    email: 'mohzulkiflikatili@gmail.com',
    tagline: 'Software engineer for payments, data and AI — with a designer\'s eye for the interface.',
    description:
      'I\'m a software engineer in Greater Jakarta. By day I build payment systems; the rest of the time I\'m bringing AI, data and design into what I make.',
    portrait: '/images/profile/portrait.jpg',
    avatar: '/images/profile/avatar.webp',
    // Rotating words in the hero (ported from the old Typed.js animation).
    typed: ['payment systems', 'APIs', 'AI / RAG tools', 'knowledge graphs', 'data products', 'interfaces'],
  },

  nav: [
    { label: 'Work', to: '/work' },
    { label: 'About', to: '/about' },
    { label: 'Writing', to: '/writing' },
    { label: 'Lab', to: '/lab' },
    { label: 'Contact', to: '/contact' },
  ],

  socials: [
    { label: 'GitHub', icon: 'simple-icons:github', url: 'https://github.com/kikiraihan', handle: '@kikiraihan' },
    { label: 'LinkedIn', icon: 'simple-icons:linkedin', url: 'https://www.linkedin.com/in/moh-zulkifli-katili/', handle: 'Moh Zulkifli Katili' },
    { label: 'Instagram', icon: 'simple-icons:instagram', url: 'https://www.instagram.com/inikikikatili/', handle: '@inikikikatili' },
    { label: 'X / Twitter', icon: 'simple-icons:x', url: 'https://twitter.com/inikikikatili', handle: '@inikikikatili' },
  ],

  // Which kinds of work are shown (Work page, home "Selected work", case-study pages, sitemap).
  // Set one to false to hide those projects everywhere; links to them elsewhere become plain text.
  work: {
    engineering: true,
    design: true,
  },

  // GitHub contribution graph on the home page (data fetched at build time, see server/routes/github-contributions.json.ts).
  github: {
    username: 'kikiraihan',
  },

  // Capabilities, grouped by what they enable — not a giant tech list.
  skills: [
    { group: 'Backend', note: 'APIs, services, transaction flows', items: ['PHP / Laravel', 'Go (GoFiber, Gin, go-zero)', 'Node.js / NestJS (TypeScript)', 'Python / FastAPI', 'C++ (CLI utilities)', 'REST APIs · SNAP bank integration', 'Kafka · Redis queues', 'PHPUnit'] },
    { group: 'Frontend', note: 'Interfaces that stay maintainable', items: ['React / Next.js', 'Vue / Nuxt', 'TypeScript', 'Livewire', 'Tailwind CSS', 'PWA'] },
    { group: 'Data', note: 'Storage, analysis, visualization', items: ['PostgreSQL', 'MySQL', 'MongoDB · Neo4j', 'Redis', 'SPARQL / RDF', 'Pandas · psycopg2 · Plotly', 'Ledger reconciliation'] },
    { group: 'AI', note: 'From research to usable tools', items: ['RAG (pgvector)', 'LLM apps (Gemini, LangChain)', 'Tool calling', 'Prompt-injection guardrails', 'Hugging Face open-weights models', 'Knowledge graphs', 'Network analysis', 'Classic ML'] },
    { group: 'Infrastructure', note: 'Shipping and keeping it running', items: ['Docker', 'CI/CD (GitHub Actions, Jenkins)', 'Blue-green deployment', 'Huawei Cloud · Alibaba Cloud (DRC)', 'Kubernetes (deploy & operate)', 'Linux', 'Git'] },
    { group: 'Design', note: 'Brand, UI, and illustration', items: ['Brand identity', 'Figma', 'Illustrator', 'Photoshop', 'Design systems'] },
  ],

  // Floating "Ask something" entry point (app/components/layout/AskChat.vue).
  // - 'whatsapp' (default): our own theme-styled button that opens a WhatsApp chat with `whatsapp.number`.
  // - 'crisp': Crisp's own launcher bubble, loaded when the browser is idle, with Crisp's styling untouched.
  askChat: {
    provider: 'whatsapp' as 'whatsapp' | 'crisp',
    whatsapp: {
      // international format, digits only (e.g. '6281234567890'); '' hides the button
      number: '6282291501085',
      // pre-filled first message
      message: 'Hi Kiki, I came across your website and would like to ask something.',
    },
  },

  // Optional live chat (the old site used Crisp). Loaded lazily after user idle; set '' to disable.
  // Used only when askChat.provider is 'crisp'.
  crispWebsiteId: '3dea4f52-4980-41f6-abc6-6146629b7981',
})
