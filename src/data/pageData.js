/**
 * Central data for all new site IA pages.
 * Keep content here so page components stay clean.
 */

// Icon imports for dynamic rendering (matches App.jsx icons)
import React from 'react';
import {
  TrendingUp, Sparkles, MessageCircle, Globe2, LayoutDashboard,
  Zap, Target, Workflow, Shield, Handshake,
  User, Building2, Bot, Link, Rocket
} from 'lucide-react';

// ────────────────────────────────────────────────────────
// INTEGRATION DATA (shared across integrations page + role/function pages)
// ────────────────────────────────────────────────────────

export const INTEGRATIONS = [
  {
    name: 'Slack',
    slug: 'slack',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    description: 'Your AI employee joins Slack channels, responds to messages, and posts updates -- just like a real teammate.',
    status: 'available',
  },
  {
    name: 'Gmail / Email',
    slug: 'email',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    description: 'Send, receive, and manage email threads. Draft responses, follow up on leads, and handle inbox zero.',
    status: 'available',
  },
  {
    name: 'WhatsApp',
    slug: 'whatsapp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    description: 'Communicate with customers and teams on WhatsApp. Handle support queries, send updates, and manage conversations.',
    status: 'available',
  },
  {
    name: 'ClickUp',
    slug: 'clickup',
    logo: 'https://img.icons8.com/?size=100&id=znqq179L1K9g&format=png&color=000000',
    description: 'Create tasks, update statuses, log time, and manage projects directly inside ClickUp.',
    status: 'available',
  },
  {
    name: 'Notion',
    slug: 'notion',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    description: 'Read and write to Notion databases, update wikis, and manage documentation.',
    status: 'available',
  },
  {
    name: 'Google Drive',
    slug: 'google-drive',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
    description: 'Access, create, and organize files in Google Drive. Generate reports and share documents.',
    status: 'available',
  },
  {
    name: 'Jira',
    slug: 'jira',
    logo: 'https://img.icons8.com/?size=100&id=oROcPah5ues6&format=png&color=000000',
    description: 'Manage sprints, create issues, update tickets, and track engineering progress in Jira.',
    status: 'planned',
  },
  {
    name: 'HubSpot',
    slug: 'hubspot',
    logo: 'https://img.icons8.com/?size=100&id=eoxMN35VcUdL&format=png&color=000000',
    description: 'Manage CRM contacts, update deals, send marketing emails, and track sales pipelines.',
    status: 'planned',
  },
  {
    name: 'Zapier / Webhooks',
    slug: 'zapier',
    logo: 'https://img.icons8.com/?size=100&id=xYxLR0gkqFjt&format=png&color=000000',
    description: 'Connect to 5,000+ apps via Zapier or custom webhooks. Trigger actions across your entire stack.',
    status: 'planned',
  },
];

// ────────────────────────────────────────────────────────
// ROLES DATA
// ────────────────────────────────────────────────────────

export const ROLES = [
  {
    slug: 'growth-content-lead',
    title: 'Build a Growth & Content Lead',
    shortTitle: 'Growth & Content Lead',
    description: 'An AI employee that owns your content pipeline -- from ideation to distribution -- driving organic growth every single day.',
    heroSubtitle: 'Your AI-powered content engine. Researches trends, writes posts, manages distribution channels, and reports on growth metrics -- every day, without prompting.',
    whatTheyDo: [
      'Research trending topics and competitor content gaps',
      'Draft blog posts, social media captions, and email newsletters',
      'Schedule and publish content across platforms',
      'Track engagement metrics and optimize based on performance',
      'Manage editorial calendars and content backlogs',
      'Repurpose long-form content into social snippets and threads',
    ],
    weeklyOutputs: [
      '3-5 blog posts drafted and published',
      '15-20 social media posts across platforms',
      '2 email newsletters prepared and sent',
      'Weekly content performance report with insights',
      'Competitor content analysis summary',
    ],
    whereTheyWork: ['Slack', 'Gmail / Email', 'Notion', 'Google Drive', 'ClickUp'],
    howYouManage: 'Assign content briefs and set priorities like you would with a human content lead. Review drafts before publish if you want, or let them run autonomously. They escalate to you when they need brand-voice guidance or approval on sensitive topics.',
    exampleTasks: [
      { title: 'Write a LinkedIn post about our product launch', tag: 'Content' },
      { title: 'Research top 10 keywords for Q1 blog strategy', tag: 'Research' },
      { title: 'Draft a weekly email newsletter for subscribers', tag: 'Email' },
      { title: "Analyze last month's blog traffic and recommend topics", tag: 'Analytics' },
      { title: 'Repurpose our case study into 5 Twitter threads', tag: 'Social' },
      { title: 'Update our content calendar for the next 2 weeks', tag: 'Planning' },
    ],
    color: 'bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    status: 'available',
  },
  {
    slug: 'support-research-lead',
    title: 'Build a Support & Research Lead',
    shortTitle: 'Support & Research Lead',
    description: 'An AI employee that handles customer support tickets, conducts market research, and surfaces insights that keep your team informed.',
    heroSubtitle: 'Your dedicated support and intelligence officer. Resolves tickets, researches markets, and delivers insights -- so your human team focuses on strategy, not triage.',
    whatTheyDo: [
      'Triage and respond to customer support tickets',
      'Escalate complex issues to relevant human team members',
      'Conduct market and competitor research on demand',
      'Compile research summaries and insight reports',
      'Monitor customer sentiment and flag emerging patterns',
      'Maintain and update FAQ databases and help articles',
    ],
    weeklyOutputs: [
      '50-100 support tickets triaged and resolved',
      '2-3 market research summaries with actionable insights',
      'Weekly customer sentiment report',
      'Updated FAQ entries based on common queries',
      'Escalation log with recommended actions',
    ],
    whereTheyWork: ['Slack', 'Gmail / Email', 'WhatsApp', 'Notion', 'ClickUp'],
    howYouManage: 'Set response templates and SLA targets. Your AI employee follows them precisely. It escalates edge-cases to you with full context -- no back-and-forth needed. Assign research topics ad-hoc or schedule recurring reports.',
    exampleTasks: [
      { title: 'Respond to 20 pending support emails', tag: 'Support' },
      { title: 'Research 5 competitors and compare pricing models', tag: 'Research' },
      { title: 'Create a weekly NPS summary from customer feedback', tag: 'Analytics' },
      { title: 'Update help center articles with new feature info', tag: 'Docs' },
      { title: 'Draft an escalation summary for the engineering team', tag: 'Ops' },
      { title: 'Monitor social media for brand mentions today', tag: 'Monitoring' },
    ],
    color: 'bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-600',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    status: 'available',
  },
  {
    slug: 'operations-manager',
    title: 'Build an Operations Manager',
    shortTitle: 'Operations Manager',
    description: 'An AI employee that keeps your operations running -- tracking tasks, coordinating teams, and ensuring nothing falls through the cracks.',
    heroSubtitle: 'Your operational backbone. Manages task queues, coordinates across teams, tracks deliverables, and keeps your entire operation moving forward -- 24/7.',
    whatTheyDo: [
      'Track project milestones and flag delays proactively',
      'Coordinate task assignments across team members',
      'Generate daily standups and status reports',
      'Manage recurring operations checklists',
      'Monitor deadlines and send follow-up reminders',
      'Compile weekly operational summaries for leadership',
    ],
    weeklyOutputs: [
      'Daily standup summaries (5 per week)',
      'Weekly operations report with task completion rates',
      '10-20 follow-up reminders sent to team members',
      'Project milestone tracking dashboard updates',
      'Bottleneck identification and resolution suggestions',
    ],
    whereTheyWork: ['Slack', 'ClickUp', 'Gmail / Email', 'Notion', 'Google Drive'],
    howYouManage: 'Set your operational playbook -- recurring tasks, reporting cadences, and escalation rules. Your AI operations manager follows them religiously. Step in when strategic decisions are needed; it handles the execution.',
    exampleTasks: [
      { title: 'Send daily standup summary to #general in Slack', tag: 'Reports' },
      { title: 'Follow up on 5 overdue tasks in ClickUp', tag: 'Tracking' },
      { title: 'Prepare weekly ops report for the leadership team', tag: 'Reports' },
      { title: 'Coordinate with design and dev on launch timeline', tag: 'Coordination' },
      { title: 'Audit current project statuses and flag blockers', tag: 'Ops' },
      { title: 'Set up recurring checklists for client onboarding', tag: 'Process' },
    ],
    color: 'bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-600',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    status: 'available',
  },
];

export const PLANNED_ROLES = [
  { shortTitle: 'Executive Assistant', description: 'Calendar management, meeting prep, travel coordination', color: 'from-purple-500 to-violet-600' },
  { shortTitle: 'Data Analyst', description: 'Data cleaning, reporting, dashboard creation, trend analysis', color: 'from-cyan-500 to-blue-600' },
  { shortTitle: 'Social Media Manager', description: 'Community management, scheduling, engagement tracking', color: 'from-pink-500 to-rose-600' },
];

// ────────────────────────────────────────────────────────
// FUNCTIONS DATA
// ────────────────────────────────────────────────────────

export const FUNCTIONS = [
  {
    slug: 'sales',
    title: 'Build an AI Employee in Sales',
    shortTitle: 'Sales',
    description: 'Automate prospecting, lead qualification, follow-ups, and pipeline management with an AI employee dedicated to revenue.',
    heroSubtitle: 'Stop losing deals to slow follow-ups. Your AI sales employee prospects, qualifies, nurtures, and closes -- around the clock.',
    whatYouCanOffload: [
      'Lead prospecting and list building',
      'Initial outreach emails and follow-up sequences',
      'CRM updates and pipeline maintenance',
      'Meeting scheduling and calendar coordination',
      'Proposal and quote preparation',
      'Win/loss analysis and reporting',
    ],
    outputsYouGet: [
      'Qualified lead lists delivered daily',
      'Personalized outreach sequences sent automatically',
      'CRM always up to date with latest deal stages',
      'Weekly pipeline reports with forecasting',
      'Meeting prep briefs before every sales call',
    ],
    toolsTheyWorkIn: ['Gmail / Email', 'Slack', 'HubSpot', 'ClickUp', 'Google Drive'],
    dayToDay: [
      { time: 'Morning', activity: 'Scans for new inbound leads and enriches contact data. Sends personalized first-touch emails to qualified prospects.' },
      { time: 'Midday', activity: 'Follows up on open opportunities. Updates CRM with conversation notes. Prepares meeting briefs for afternoon calls.' },
      { time: 'Afternoon', activity: 'Drafts proposals based on call outcomes. Logs deal progress and flags stalled opportunities to your Slack.' },
      { time: 'End of day', activity: 'Sends daily pipeline summary. Queues next-day follow-ups. Updates forecasting spreadsheets.' },
    ],
    icon: 'TrendingUp',
    color: 'bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-600',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    slug: 'marketing',
    title: 'Build an AI Employee in Marketing',
    shortTitle: 'Marketing',
    description: 'From content creation to campaign execution, your AI marketing employee drives awareness and engagement while you focus on strategy.',
    heroSubtitle: 'Launch campaigns, create content, and grow your brand -- without hiring a full marketing team. Your AI employee handles execution end-to-end.',
    whatYouCanOffload: [
      'Content creation (blogs, social, email)',
      'Campaign setup and A/B testing',
      'SEO research and optimization',
      'Analytics tracking and reporting',
      'Brand monitoring and sentiment analysis',
      'Email sequence building and management',
    ],
    outputsYouGet: [
      'Published blog posts and social media content',
      'Email campaigns sent on schedule',
      'Weekly marketing performance dashboards',
      'SEO recommendations and implementation',
      'Competitor analysis reports',
    ],
    toolsTheyWorkIn: ['Notion', 'Gmail / Email', 'Slack', 'Google Drive', 'ClickUp'],
    dayToDay: [
      { time: 'Morning', activity: 'Reviews content calendar. Drafts scheduled social media posts. Checks overnight campaign performance metrics.' },
      { time: 'Midday', activity: 'Writes blog post draft. Researches keywords for upcoming content. Sends email newsletter to subscriber segment.' },
      { time: 'Afternoon', activity: 'Updates analytics dashboard. Monitors social engagement. Adjusts ad targeting based on performance data.' },
      { time: 'End of day', activity: 'Compiles daily marketing summary. Suggests content topics for the next day. Schedules next batch of posts.' },
    ],
    icon: 'Sparkles',
    color: 'bg-violet-50',
    iconBg: 'bg-violet-100 text-violet-600',
    lightColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
  {
    slug: 'support',
    title: 'Build an AI Employee in Support',
    shortTitle: 'Support',
    description: 'Never leave a customer waiting. Your AI support employee handles tickets, resolves issues, and keeps satisfaction scores high.',
    heroSubtitle: 'Instant, reliable customer support -- without scaling headcount. Your AI employee resolves tickets, escalates when needed, and learns from every interaction.',
    whatYouCanOffload: [
      'Ticket triage and categorization',
      'First-response drafting and sending',
      'FAQ and knowledge base maintenance',
      'Customer sentiment monitoring',
      'Escalation routing to the right team member',
      'Follow-up on resolved tickets for satisfaction',
    ],
    outputsYouGet: [
      'Tickets resolved within SLA targets',
      'Customer satisfaction summaries',
      'Updated knowledge base articles',
      'Escalation reports with full context',
      'Weekly support metrics dashboard',
    ],
    toolsTheyWorkIn: ['Gmail / Email', 'Slack', 'WhatsApp', 'ClickUp', 'Notion'],
    dayToDay: [
      { time: 'Morning', activity: 'Triages overnight support tickets. Sends first responses to new inquiries. Updates ticket statuses in project board.' },
      { time: 'Midday', activity: 'Resolves straightforward tickets. Drafts detailed responses for complex issues. Escalates edge cases with context.' },
      { time: 'Afternoon', activity: 'Follows up on pending tickets. Updates FAQ articles based on common questions. Logs customer feedback.' },
      { time: 'End of day', activity: 'Sends daily support summary to Slack. Reports on SLA compliance. Flags recurring issues for product team.' },
    ],
    icon: 'MessageCircle',
    color: 'bg-cyan-50',
    iconBg: 'bg-cyan-100 text-cyan-600',
    lightColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    slug: 'operations',
    title: 'Build an AI Employee in Operations',
    shortTitle: 'Operations',
    description: 'Keep your business running smoothly. Your AI operations employee manages tasks, coordinates teams, and ensures nothing slips.',
    heroSubtitle: 'Operational excellence on autopilot. Your AI employee tracks deliverables, coordinates across teams, and sends the reports -- so you focus on building.',
    whatYouCanOffload: [
      'Task tracking and deadline management',
      'Meeting scheduling and follow-ups',
      'Process documentation and SOPs',
      'Vendor and partner coordination',
      'Recurring operational checklists',
      'Status reporting and standups',
    ],
    outputsYouGet: [
      'Daily standup summaries in Slack',
      'Project milestone status updates',
      'Overdue task alerts and follow-ups',
      'Weekly operational performance reports',
      'Updated process documentation',
    ],
    toolsTheyWorkIn: ['ClickUp', 'Slack', 'Gmail / Email', 'Notion', 'Google Drive'],
    dayToDay: [
      { time: 'Morning', activity: 'Sends daily standup to team Slack channel. Reviews task board for blockers. Sends reminder emails for overdue items.' },
      { time: 'Midday', activity: 'Updates project milestones. Coordinates with team leads on deliverable statuses. Schedules recurring meetings.' },
      { time: 'Afternoon', activity: 'Audits current tasks and flags risks. Prepares status update for leadership. Documents new processes.' },
      { time: 'End of day', activity: "Compiles daily ops summary. Queues tomorrow's priorities. Updates the operational dashboard." },
    ],
    icon: 'LayoutDashboard',
    color: 'bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-600',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    slug: 'research',
    title: 'Build an AI Employee in Research',
    shortTitle: 'Research',
    description: 'Turn questions into answers. Your AI research employee gathers data, analyzes markets, and delivers insights -- fast.',
    heroSubtitle: 'Ask a question, get a research brief. Your AI employee scours the web, analyzes data, and delivers actionable insights -- in hours, not weeks.',
    whatYouCanOffload: [
      'Market and competitor analysis',
      'Industry trend reporting',
      'Data collection and synthesis',
      'Academic and technical literature reviews',
      'Pricing and feature benchmarking',
      'Customer and user research summaries',
    ],
    outputsYouGet: [
      'Structured research briefs on demand',
      'Competitor comparison matrices',
      'Market sizing and opportunity reports',
      'Trend analysis with source citations',
      'Weekly research digest for leadership',
    ],
    toolsTheyWorkIn: ['Notion', 'Google Drive', 'Slack', 'Gmail / Email', 'ClickUp'],
    dayToDay: [
      { time: 'Morning', activity: 'Checks research queue for new briefs. Begins data gathering on top-priority topics. Flags unclear research requests for clarification.' },
      { time: 'Midday', activity: 'Compiles findings into structured documents. Cross-references multiple sources. Drafts executive summary for first brief.' },
      { time: 'Afternoon', activity: 'Delivers completed research to Slack/Notion. Starts next-priority research task. Updates competitor tracking spreadsheet.' },
      { time: 'End of day', activity: 'Sends research status update. Queues continuing research items for tomorrow. Logs all sources used.' },
    ],
    icon: 'Globe2',
    color: 'bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
];

// ────────────────────────────────────────────────────────
// FEATURES DATA
// ────────────────────────────────────────────────────────

export const FEATURES = [
  {
    slug: 'one-click-employees',
    title: 'One-Click AI Employees',
    shortTitle: 'One-Click Employees',
    description: 'Spin up a fully-configured AI employee in seconds. Choose a role, set permissions, and they start working immediately.',
    heroSubtitle: 'No setup wizards. No 20-step onboarding. Click "Create," choose a role, and your new AI employee is ready to receive tasks within seconds.',
    explanation: 'PilotUP eliminates the traditional hiring funnel. Instead of weeks spent sourcing, interviewing, and training, you build an AI employee with a single action. Select from pre-built role templates or customize from scratch -- either way, your new team member is operational in under a minute.',
    useCases: [
      { title: 'Instant team scaling', description: 'Need to triple your content output for a product launch? Spin up 3 content leads in seconds.' },
      { title: 'Rapid experimentation', description: 'Test a new function like outbound sales without committing to a full-time hire. Create an AI employee, run it for a week, measure results.' },
      { title: 'Founder mode', description: `You're a solo founder wearing 6 hats.Create AI employees for each hat and delegate immediately.` },
    ],
    icon: 'Zap',
    color: 'from-yellow-500 to-amber-600',
    lightColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
  },
  {
    slug: 'no-onboarding',
    title: 'No Onboarding Required',
    shortTitle: 'No Onboarding',
    description: `Your AI employees come pre-trained for their role. No ramp-up period, no training documents -- they're productive from day one.`,
    heroSubtitle: 'Skip the 3-month ramp-up. Every AI employee comes with deep domain knowledge for their role and learns your specific context as they work.',
    explanation: 'Traditional hires need weeks to learn your tools, processes, and culture. PilotUP AI employees are pre-loaded with domain expertise for their assigned role. They understand marketing, sales, support, and operations best practices from the start. As they work with you, they learn your specific preferences, brand voice, and operational nuances.',
    useCases: [
      { title: 'Zero ramp-up cost', description: 'No training materials to prepare, no shadowing sessions to schedule, no "first 90 days" plan needed.' },
      { title: 'Consistent quality from day one', description: 'Your AI employee delivers professional-grade output immediately -- not after 3 months of coaching.' },
      { title: 'Adaptive learning', description: 'Every piece of feedback you give makes them better. They remember past corrections and apply them to future tasks.' },
    ],
    icon: 'Target',
    color: 'from-green-500 to-emerald-600',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    slug: 'multi-channel-communication',
    title: 'Multi-Channel Communication',
    shortTitle: 'Multi-Channel Comms',
    description: 'Your AI employees communicate via email, WhatsApp, and calls -- just like real team members.',
    heroSubtitle: 'No special interfaces needed. Talk to your AI employee the way you talk to your team -- via email, chat, messaging apps, or voice.',
    explanation: 'PilotUP breaks the chatbot paradigm. Instead of forcing you into a single interface, your AI employee meets you where you already work. Send them an email, message them on Slack or WhatsApp, or even call them. They respond naturally and contextually across all channels.',
    useCases: [
      { title: 'Customer-facing communication', description: 'Your AI support lead can receive customer emails, respond professionally, and escalate complex cases -- all via real email.' },
      { title: 'Team coordination on Slack', description: 'Assign tasks by @mentioning your AI employee in a channel. They acknowledge, execute, and report back.' },
      { title: 'WhatsApp for fast decisions', description: `Get quick summaries, approve drafts, and make decisions via WhatsApp when you're away from your desk.` },
    ],
    icon: 'MessageCircle',
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    slug: 'tool-native-work',
    title: 'Tool-Native Execution',
    shortTitle: 'Tool-Native Work',
    description: `Your AI employees don't just generate text -- they work inside your apps.ClickUp, Notion, Google Drive, and more.`,
    heroSubtitle: 'Other AI tools generate output you have to copy-paste. PilotUP employees work directly inside the apps your team uses -- creating tasks, updating docs, and managing data in-place.',
    explanation: `PilotUP AI employees don't just draft content and hand it over.They log into your tools with their own credentials, create ClickUp tasks, update Notion databases, organize Google Drive folders, and manage Slack channels.The output lands exactly where it needs to be -- no copy- pasting, no manual transfers.`,
    useCases: [
      { title: 'Project management', description: 'Your AI ops manager creates ClickUp tasks with proper assignees, due dates, and labels -- directly in your workspace.' },
      { title: 'Document management', description: 'Research reports land in the right Google Drive folder, formatted and ready for review.' },
      { title: 'Wiki maintenance', description: 'Your AI employee updates Notion docs as processes change -- no manual documentation debt.' },
    ],
    icon: 'Workflow',
    color: 'from-violet-500 to-purple-600',
    lightColor: 'bg-violet-50',
    textColor: 'text-violet-600',
  },
  {
    slug: 'human-in-the-loop-guardrails',
    title: 'Human-in-the-Loop Guardrails',
    shortTitle: 'Human Guardrails',
    description: 'Stay in control. Set approval gates, review checkpoints, and escalation rules so nothing goes out without your sign-off.',
    heroSubtitle: 'Full autonomy with full control. Set exactly when your AI employee should ask for approval, what they can publish independently, and when to escalate.',
    explanation: "PilotUP gives you fine-grained control over your AI employee's autonomy. Define approval checkpoints for sensitive actions (publishing content, sending external emails, updating pricing). Set escalation rules for edge cases. Your AI employee operates independently within your guardrails and stops when human judgment is needed.",
    useCases: [
      { title: 'Content approval gates', description: '"Draft social posts independently, but get my approval before publishing anything about pricing or partnerships."' },
      { title: 'Spend controls', description: '"Process refunds under $50 automatically. Escalate anything above to me with full context."' },
      { title: 'Brand safety', description: '"Never respond to competitor comparisons publicly. Draft a response and send it to me for review."' },
    ],
    icon: 'Shield',
    color: 'from-red-500 to-rose-600',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
  },
  {
    slug: 'employee-collaboration',
    title: 'AI Employee Collaboration',
    shortTitle: 'Employee Collaboration',
    description: 'Your AI employees work together. Your content lead hands off to your social manager, your researcher feeds your sales lead.',
    heroSubtitle: 'Build a team, not a tool. PilotUP AI employees collaborate with each other -- handing off tasks, sharing context, and coordinating deliverables automatically.',
    explanation: `When you have multiple AI employees, they don't work in silos.Your research employee can pass findings directly to your content lead who turns them into blog posts.Your support lead can flag product feedback to your ops manager.They share context, hand off tasks, and coordinate -- just like a real high - performing team.`,
    useCases: [
      { title: 'Research → Content pipeline', description: 'Your research employee delivers a competitor analysis. Your content lead automatically drafts a blog post based on the findings.' },
      { title: 'Support → Product feedback loop', description: 'Your support lead identifies a recurring bug report. Your ops manager automatically creates a Jira ticket with aggregated customer feedback.' },
      { title: 'Sales → Marketing alignment', description: 'Your sales AI identifies high-performing outreach angles. Your marketing AI incorporates them into the next email campaign.' },
    ],
    icon: 'Handshake',
    color: 'from-teal-500 to-cyan-600',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-600',
  },
];

// ────────────────────────────────────────────────────────
// PRICING FAQ DATA (for pricing page)
// ────────────────────────────────────────────────────────

export const PRICING_FAQS = [
  {
    q: 'What are credits and how do they work?',
    a: 'Credits are the currency that powers your AI employees. Every action -- sending an email, writing a blog post, updating a task -- uses credits. Different tasks use different amounts. The free plan gives you 50,000 one-time credits to explore the platform.',
  },
  {
    q: 'Can I switch plans later?',
    a: `Absolutely. You can upgrade, downgrade, or cancel at any time. If you upgrade mid-cycle, you\'ll be prorated for the remainder. No lock-in contracts.`,
  },
  {
    q: 'What happens when I run out of credits?',
    a: 'Your AI employees will pause until your credits renew at the start of your next billing cycle. On the Growth plan, you can also purchase top-up credit bundles at any time.',
  },
  {
    q: 'Is the free plan really free forever?',
    a: 'Yes. The Starter plan is free forever with 50,000 one-time credits, 1 company profile, and 3 active agents. Perfect for exploring and building your first AI employee.',
  },
  {
    q: 'Do you offer custom enterprise plans?',
    a: 'Yes. If you need dedicated infrastructure, custom SLAs, or more than 25 agents, talk to our sales team. We build custom packages for high-scale companies.',
  },
  {
    q: 'How does billing work for annual plans?',
    a: `Annual plans offer a 20% discount. You\'re billed once per year at the discounted rate. The monthly price shown for annual plans reflects the per-month equivalent.`,
  },
];

// ────────────────────────────────────────────────────────
// HOW IT WORKS STEPS DATA
// ────────────────────────────────────────────────────────

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Create an Account',
    description: 'Sign up in under 30 seconds. No credit card required. Start exploring the platform immediately.',
    icon: 'User',
  },
  {
    step: 2,
    title: 'Create a Company Profile',
    description: 'Tell us about your business -- industry, size, and goals. This helps your AI employees understand your context from day one.',
    icon: 'Building2',
  },
  {
    step: 3,
    title: 'Build Your First AI Employee',
    description: 'Choose a role template or start from scratch. Set their name, responsibilities, and permissions. Task them to help build the rest of your company.',
    icon: 'Bot',
  },
  {
    step: 4,
    title: 'Invite Them to Your Apps',
    description: 'Connect Slack, Email, ClickUp, Notion, and more. Your AI employee gets their own access and starts working inside your existing tools.',
    icon: 'Link',
  },
  {
    step: 5,
    title: 'Assign Tasks and Start Working',
    description: 'Assign your first task -- just like you would with a human teammate. Watch them plan, execute, and report back. Scale from there.',
    icon: 'Rocket',
  },
];

// ────────────────────────────────────────────────────────
// PLAN COMPARISON TABLE DATA
// ────────────────────────────────────────────────────────

export const PLAN_COMPARISON = [
  { feature: 'Credits', starter: '50,000 (one-time)', growth: '250,000 / month', executive: '1,000,000 / month' },
  { feature: 'Company Profiles', starter: '1', growth: '3', executive: 'Unlimited' },
  { feature: 'Active AI Employees', starter: '3', growth: '10', executive: '25' },
  { feature: 'Role Templates', starter: 'Basic', growth: 'All Templates', executive: 'All + Custom' },
  { feature: 'Integrations', starter: '3 integrations', growth: 'All integrations', executive: 'All + API access' },
  { feature: 'Support', starter: 'Community', growth: 'Priority', executive: 'Dedicated Manager' },
  { feature: 'Credit Top-Ups', starter: '--', growth: '✓', executive: '✓' },
  { feature: 'Custom Training', starter: '--', growth: '--', executive: '✓' },
  { feature: 'SSO / SAML', starter: '--', growth: '--', executive: '✓' },
  { feature: 'SLA', starter: '--', growth: '99.5%', executive: '99.9%' },
];

// ────────────────────────────────────────────────────────
// ICON COMPONENT MAPPING
// ────────────────────────────────────────────────────────

const ICON_MAP = {
  'TrendingUp': TrendingUp,
  'Sparkles': Sparkles,
  'MessageCircle': MessageCircle,
  'Globe2': Globe2,
  'LayoutDashboard': LayoutDashboard,
  'Zap': Zap,
  'Target': Target,
  'Workflow': Workflow,
  'Shield': Shield,
  'Handshake': Handshake,
  'User': User,
  'Building2': Building2,
  'Bot': Bot,
  'Link': Link,
  'Rocket': Rocket,
};

export const getIconComponent = (iconName) => {
  const IconComponent = ICON_MAP[iconName];
  return IconComponent ? React.createElement(IconComponent, { className: 'w-5 h-5 sm:w-6 sm:h-6', strokeWidth: 2 }) : null;
};
