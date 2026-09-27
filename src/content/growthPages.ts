export type ServiceOffer = {
  slug: string;
  title: string;
  offer: 'workflow_audit' | 'implementation' | 'maintenance';
  problem: string;
  fit: string;
  deliverables: string[];
  exclusions: string[];
  inputs: string[];
  process: string[];
};

export const SERVICE_OFFERS: ServiceOffer[] = [
  {
    slug: 'workflow-audit',
    title: 'Workflow audit',
    offer: 'workflow_audit',
    problem:
      'A team is using several AI tools, but nobody can say which step should stay manual and which one is worth automating.',
    fit: 'Founders and operators who can describe one workflow and the tools already in it.',
    deliverables: [
      'A written map of the current workflow',
      'A short list of steps that are and are not good automation candidates',
      'Links to relevant directory listings, with ownership called out when a product is One9’s',
    ],
    exclusions: [
      'No implementation in this offer',
      'No promised time savings or ranking outcome',
      'No price on this page — scope is confirmed after the intake',
    ],
    inputs: [
      'The workflow or problem',
      'Tools already in use',
      'Who does the work today',
      'The outcome you want',
    ],
    process: [
      'You send the intake',
      'We read it and reply if the workflow is a fit',
      'A person reviews the notes. This is not an automatic quote.',
    ],
  },
  {
    slug: 'implementation',
    title: 'Scoped implementation',
    offer: 'implementation',
    problem:
      'The workflow is understood, and you want a bounded automation built against the systems you already use.',
    fit: 'Teams that can name the system of record and a person who can approve access.',
    deliverables: [
      'One agreed workflow, not an open-ended retainer',
      'A working automation or a documented reason it should not be built',
      'Handoff notes for the person who will run it',
    ],
    exclusions: [
      'No unlimited revisions',
      'No claim that every SaaS product has a supported connector',
      'Systems are limited to ones you can grant access to and we confirm in writing',
    ],
    inputs: [
      'The audit notes or an equivalent description',
      'Admin access or a sandbox for the systems involved',
      'A decision maker for scope changes',
    ],
    process: [
      'Intake and a scope conversation',
      'Written scope before build work',
      'Build, handoff, and a list of what was left out',
    ],
  },
  {
    slug: 'maintenance',
    title: 'Maintenance',
    offer: 'maintenance',
    problem:
      'An automation already runs, and it needs someone to notice breakage, model changes, and workflow drift.',
    fit: 'Teams with a workflow that is already in production and a named owner.',
    deliverables: [
      'A review of failures and changed vendor behavior',
      'Small fixes inside the original scope',
      'A note when the workflow should be rebuilt instead of patched',
    ],
    exclusions: [
      'Not a 24/7 on-call promise',
      'Not a response-time guarantee',
      'New workflows are a new scope, not silent additions',
    ],
    inputs: [
      'Access to logs or the run history',
      'The original scope',
      'A contact who can approve a change',
    ],
    process: [
      'You describe what is drifting',
      'We confirm what is in scope',
      'Fixes and notes are recorded against that scope',
    ],
  },
];

export function serviceBySlug(slug: string): ServiceOffer | undefined {
  return SERVICE_OFFERS.find((offer) => offer.slug === slug);
}

export type SolutionGuide = {
  slug: string;
  title: string;
  task: string;
  audience: string;
  criteria: string[];
  constraints: string[];
  workflow: string[];
  job: string;
  serviceSlug: string;
};

export const SOLUTION_GUIDES: SolutionGuide[] = [
  {
    slug: 'customer-support',
    title: 'Customer-support automation',
    task: 'Reply to repeated customer questions without hiding the queue from a person.',
    audience: 'A small support team that already has an inbox and a set of known answers.',
    criteria: [
      'The tool can draft from your own help content, not only a generic model',
      'A person can approve a reply before it is sent',
      'The queue still shows which tickets were not touched',
    ],
    constraints: [
      'A chat widget is not a support process',
      'Free trials and free plans are different; confirm the vendor’s current terms',
      'Do not send customer data to a tool whose data terms you have not read',
    ],
    workflow: [
      'Collect the ten questions that already have a stable answer',
      'Draft replies in a tool that can cite that material',
      'Keep a human send step for anything about billing, account access, or a complaint',
    ],
    job: 'support',
    serviceSlug: 'workflow-audit',
  },
  {
    slug: 'content-production',
    title: 'Content production',
    task: 'Turn a founder’s notes into a draft that an editor can actually ship.',
    audience: 'A founder or marketer who already knows the claim they want to make.',
    criteria: [
      'The draft stays tied to notes you provided',
      'You can see what was invented versus quoted',
      'Publishing still has an editor',
    ],
    constraints: [
      'Generated volume is not a distribution strategy',
      'Pricing and “free” labels on this site are catalog data unless a source is linked',
      'Do not present an untested product as a hands-on review',
    ],
    workflow: [
      'Start from a source note, a call transcript, or a changelog',
      'Ask for an outline before a full draft',
      'Edit the claims, then publish on a channel you already use',
    ],
    job: 'performance-marketing',
    serviceSlug: 'workflow-audit',
  },
  {
    slug: 'coding-assistance',
    title: 'Coding assistance',
    task: 'Use an assistant on a real repository without giving it the whole company.',
    audience: 'A developer who can review a diff.',
    criteria: [
      'The assistant can work against the repository you choose',
      'You can run tests before accepting a change',
      'Secrets are not required in the prompt',
    ],
    constraints: [
      'An assistant that writes code is not a substitute for review',
      'Open-source and open-weight are not the same thing',
      'Hosted copilots and local editors have different data paths',
    ],
    workflow: [
      'Pick one failing test or one small change',
      'Let the assistant propose a diff',
      'Run the tests and read the diff before merging',
    ],
    job: 'engineering',
    serviceSlug: 'implementation',
  },
  {
    slug: 'knowledge-search',
    title: 'Internal knowledge search',
    task: 'Find an answer in documents the company already has.',
    audience: 'An operator who can point at the source of truth: docs, tickets, or a drive.',
    criteria: [
      'Answers cite a document a person can open',
      'You can leave private folders out',
      'Stale documents can be excluded',
    ],
    constraints: [
      'A chatbot over an entire drive will surface old and conflicting notes',
      'Connector support has to be checked against the systems you actually use',
      'This guide is a selection checklist, not evidence of search demand',
    ],
    workflow: [
      'Choose one corpus, such as the help center or the onboarding folder',
      'Ask questions you already know the answer to',
      'Keep the source link next to the answer before anyone relies on it',
    ],
    job: 'operations',
    serviceSlug: 'implementation',
  },
];

export function solutionBySlug(slug: string): SolutionGuide | undefined {
  return SOLUTION_GUIDES.find((guide) => guide.slug === slug);
}
