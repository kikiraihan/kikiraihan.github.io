// Site-wide profile data. Edit here instead of inside components.
export default defineAppConfig({
  profile: {
    name: 'Moh. Zulkifli Katili',
    shortName: 'Kiki',
    role: 'Software Engineer',
    location: 'Gorontalo, Indonesia',
    email: 'mohzulkiflikatili@gmail.com',
    tagline: 'I build systems, products, and experiences that solve real problems.',
    description:
      'Software engineer combining backend engineering, product thinking, AI, and visual design. Payments, data, knowledge graphs, and interfaces people enjoy using.',
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
    { label: 'LinkedIn', icon: 'simple-icons:linkedin', url: 'https://www.linkedin.com/in/moh-zulkifli-katili-3ba18319a/', handle: 'Moh Zulkifli Katili' },
    { label: 'Instagram', icon: 'simple-icons:instagram', url: 'https://www.instagram.com/inikikikatili/', handle: '@inikikikatili' },
    { label: 'X / Twitter', icon: 'simple-icons:x', url: 'https://twitter.com/inikikikatili', handle: '@inikikikatili' },
  ],

  // Capabilities, grouped by what they enable — not a giant tech list.
  skills: [
    { group: 'Backend', note: 'APIs, services, transaction flows', items: ['PHP / Laravel', 'Go (GoFiber, Gin, go-zero)', 'Node.js / NestJS (TypeScript)', 'Python / FastAPI', 'REST APIs · SNAP bank integration', 'Kafka · Redis queues'] },
    { group: 'Frontend', note: 'Interfaces that stay maintainable', items: ['React / Next.js', 'Vue / Nuxt', 'TypeScript', 'Livewire', 'Tailwind CSS', 'PWA'] },
    { group: 'Data', note: 'Storage, analysis, visualization', items: ['PostgreSQL', 'MySQL', 'MongoDB · Neo4j', 'Redis', 'SPARQL / RDF', 'Pandas · Plotly', 'Ledger reconciliation'] },
    { group: 'AI', note: 'From research to usable tools', items: ['RAG (pgvector)', 'LLM apps (Gemini, LangChain)', 'Tool calling', 'Prompt-injection guardrails', 'Knowledge graphs', 'Network analysis', 'Classic ML'] },
    { group: 'Infrastructure', note: 'Shipping and keeping it running', items: ['Docker', 'CI/CD (GitHub Actions, Jenkins)', 'Blue-green deployment', 'Huawei Cloud · Alibaba Cloud', 'Kubernetes (deploy & operate)', 'Linux', 'Git'] },
    { group: 'Design', note: 'Brand, UI, and illustration', items: ['Figma', 'Illustrator', 'Photoshop', 'Design systems'] },
  ],

  // Optional live chat (the old site used Crisp). Loaded lazily after user idle; set '' to disable.
  crispWebsiteId: '3dea4f52-4980-41f6-abc6-6146629b7981',
})
