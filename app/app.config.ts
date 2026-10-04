// Site-wide profile data. Edit here instead of inside components.
// Text shown to visitors is written as `{ en: '…', id: '…' }` (English / Indonesian); components read it through
// useSiteConfig() (app/composables/useSiteConfig.ts), which picks the current language. Plain strings are the same in both.
export default defineAppConfig({
  profile: {
    name: 'Moh. Zulkifli Katili',
    shortName: 'Kiki',
    role: { en: 'Senior Fullstack Engineer', id: 'Senior Fullstack Engineer' },
    location: { en: 'Greater Jakarta, Indonesia', id: 'Jabodetabek, Indonesia' },
    email: 'mohzulkiflikatili@gmail.com',
    tagline: {
      en: 'Software engineer for payments, data and AI — with a designer\'s eye for the interface.',
      id: 'Software engineer untuk sistem pembayaran, data, dan AI — dengan mata seorang desainer untuk antarmuka.',
    },
    description: {
      en: 'I\'m a software engineer in Greater Jakarta. By day I build payment systems; the rest of the time I\'m bringing AI, data and design into what I make.',
      id: 'Saya software engineer di Jabodetabek. Sehari-hari saya membangun sistem pembayaran; di luar itu saya membawa AI, data, dan desain ke dalam apa yang saya buat.',
    },
    portrait: '/images/profile/portrait.jpg',
    avatar: '/images/profile/avatar.webp',
    // Rotating words in the hero (ported from the old Typed.js animation).
    typed: {
      en: ['payment systems', 'APIs', 'AI / RAG tools', 'knowledge graphs', 'data products', 'interfaces'],
      id: ['sistem pembayaran', 'API', 'tools AI / RAG', 'knowledge graph', 'produk data', 'antarmuka'],
    },
  },

  // `to` is the English path; components localize it (e.g. /work → /id/work) with useLocalePath().
  nav: [
    { label: { en: 'Work', id: 'Karya' }, to: '/work' },
    { label: { en: 'About', id: 'Tentang' }, to: '/about' },
    { label: { en: 'Writing', id: 'Tulisan' }, to: '/writing' },
    { label: { en: 'Lab', id: 'Lab' }, to: '/lab' },
    { label: { en: 'Contact', id: 'Kontak' }, to: '/contact' },
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
    { group: 'Backend', note: { en: 'APIs, services, transaction flows', id: 'API, layanan, alur transaksi' }, items: ['PHP / Laravel', 'Go (GoFiber, Gin, go-zero)', 'Node.js / NestJS (TypeScript)', 'Python / FastAPI', { en: 'C++ (CLI utilities)', id: 'C++ (utilitas CLI)' }, { en: 'REST APIs · SNAP bank integration', id: 'REST API · integrasi bank SNAP' }, 'Kafka · Redis queues', 'PHPUnit'] },
    { group: 'Frontend', note: { en: 'Interfaces that stay maintainable', id: 'Antarmuka yang tetap mudah dirawat' }, items: ['React / Next.js', 'Vue / Nuxt', 'TypeScript', 'Livewire', 'Tailwind CSS', 'PWA'] },
    { group: 'Data', note: { en: 'Storage, analysis, visualization', id: 'Penyimpanan, analisis, visualisasi' }, items: ['PostgreSQL', 'MySQL', 'MongoDB · Neo4j', 'Redis', 'SPARQL / RDF', 'Pandas · psycopg2 · Plotly', { en: 'Ledger reconciliation', id: 'Rekonsiliasi ledger' }] },
    { group: 'AI', note: { en: 'From research to usable tools', id: 'Dari riset menjadi tools yang bisa dipakai' }, items: ['RAG (pgvector)', { en: 'LLM apps (Gemini, LangChain)', id: 'Aplikasi LLM (Gemini, LangChain)' }, 'Tool calling', 'Prompt-injection guardrails', { en: 'Hugging Face open-weights models', id: 'Model open-weights Hugging Face' }, 'Knowledge graphs', { en: 'Network analysis', id: 'Analisis jaringan' }, { en: 'Classic ML', id: 'ML klasik' }] },
    { group: { en: 'Infrastructure', id: 'Infrastruktur' }, note: { en: 'Shipping and keeping it running', id: 'Merilis dan menjaganya tetap berjalan' }, items: ['Docker', 'CI/CD (GitHub Actions, Jenkins)', 'Blue-green deployment', 'Huawei Cloud · Alibaba Cloud (DRC)', { en: 'Kubernetes (deploy & operate)', id: 'Kubernetes (deploy & operasional)' }, 'Linux', 'Git'] },
    { group: { en: 'Design', id: 'Desain' }, note: { en: 'Brand, UI, and illustration', id: 'Brand, UI, dan ilustrasi' }, items: ['Brand identity', 'Figma', 'Illustrator', 'Photoshop', 'Design systems'] },
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
      message: {
        en: 'Hi Kiki, I came across your website and would like to ask something.',
        id: 'Halo Kiki, saya menemukan website kamu dan ingin bertanya sesuatu.',
      },
    },
  },

  // Optional live chat (the old site used Crisp). Loaded lazily after user idle; set '' to disable.
  // Used only when askChat.provider is 'crisp'.
  crispWebsiteId: '3dea4f52-4980-41f6-abc6-6146629b7981',
})
