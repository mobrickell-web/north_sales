export const siteConfig = {
  name: "North Point Sales Group",
  shortName: "North Point",
  description:
    "Sales organization consulting that drives stronger teams and better business results.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  cta: {
    label: "Schedule a Consultation",
    labelLines: ["Schedule a", "Consultation"] as const,
    href: "#cta",
  },
  nav: [
    { href: "#top", label: "Home" },
    { href: "#why-partner", label: "Why Choose Us" },
    { href: "#results", label: "Results" },
    { label: "STEPS", href: "#steps" },
    { label: "HOW IT WORKS", href: "#how-it-works" },
    { label: "CHALLENGES", href: "#challenges" },

    { href: "#why-north-point", label: "Solutions" },
    { href: "#resources", label: "FAQ's" },
  ],
  hero: {
    titleLine1: "Stronger Sales Organization",
    titleLine2: "Better Bottom-Line Results.",
    eyebrow: "Driving Revenue Growth Through Sales Organization Excellence",
    body: "We help established companies uncover the revenue and profit potential already existing within their sales organization—and then help leadership capture it.",
    primaryCta: {
      label: "Schedule a Consultation",
      href: "#cta",
    },
    secondaryCta: {
      label: "See How We Help in 60 Seconds",
      href: "#video",
    },
    image: {
      src: "/images/hero-image.svg",
      alt: "Sales leaders collaborating in a boardroom overlooking the city",
    },
  },
  whyChooseUs: {
    badge: "Why Choose Us",
    title: "Why Partner With North Point Sales Group?",
    pillars: [
      {
        id: "expertise",
        title: "Expertise That Delivers",
        description:
          "Decades of sales leadership experience across industries and markets.",
        icon: "/icons/deliver.svg",
      },
      {
        id: "data",
        title: "Data-Driven Approach",
        description: "We use insights and analytics to drive better decisions.",
        icon: "/icons/data.svg",
      },
      {
        id: "customized",
        title: "Customized Solutions",
        description:
          "Every organization is unique. We build solutions tailored to your goals, culture, and market dynamics.",
        icon: "/icons/solution.svg",
      },
      {
        id: "impact",
        title: "Measurable Impact",
        description:
          "We focus on outcomes that improve your top and bottom line.",
        icon: "/icons/impact.svg",
      },
      {
        id: "partnership",
        title: "Partnership You Can Trust",
        description:
          "We work alongside your team as a true extension of your business.",
        icon: "/icons/trust.svg",
      },
    ],
    // Modal content for the "MORE" CTA
    modal: {
      title: "WHY EXECUTIVE TEAMS ENGAGE NORTH POINT SALES GROUP",
      pillars: [
        {
          id: "exec-partnership",
          title: "Executive Partnership",
          description:
            "We work side-by-side with leadership to solve meaningful challenges and create lasting improvement.",
          icon: "/icons/user.svg",
        },
        {
          id: "focused-engagement",
          title: "Focused 60-Day Engagement",
          description:
            "A structured, intensive process designed to create measurable momentum in a short period of time.",
          icon: "/icons/calendar.svg",
        },
        {
          id: "remote-nationwide",
          title: "Remote Nationwide",
          description:
            "We partner with growth-oriented companies across the U.S. through a proven virtual model.",
          icon: "/icons/globe.svg",
        },
        {
          id: "confidential",
          title: "Confidential By Design",
          description:
            "Your business, your team, your challenges—always handled with complete discretion.",
          icon: "/icons/shield-lock.svg",
        },
        {
          id: "customized-business",
          title: "Customized To Your Business",
          description:
            "No templates. Every engagement is tailored to your goals, your team, and your market.",
          icon: "/icons/target.svg",
        },
      ],
    },
  },
  //steps section
  salesEngagement: {
    badge: "Steps",
    title: "Our 60-Day Sales Performance Engagement",
    steps: [
      {
        stepNumber: 1,
        title: "Discover",
        description:
          "We gain a deep understanding of your business, goals, challenges, and current sales performance.",
        icon: "search", // Lucide Search icon
      },
      {
        stepNumber: 2,
        title: "Assess",
        description:
          "We assess people, processes, pipeline, tools, and metrics to identify gaps and the biggest opportunities.",
        icon: "clipboard-list", // Lucide ClipboardList icon
      },
      {
        stepNumber: 3,
        title: "Design",
        description:
          "We develop a customised strategy, systems, and action plan aligned with your objectives.",
        icon: "workflow", // Lucide LayoutGrid or Workflow icon
      },
      {
        stepNumber: 4,
        title: "Implement",
        description:
          "We work alongside your team to implement priorities and build momentum quickly.",
        icon: "settings", // Lucide Settings icon
      },
      {
        stepNumber: 5,
        title: "Optimize",
        description:
          "We refine processes, reinforce accountability, and improve performance using data and feedback.",
        icon: "bar-chart-3", // Lucide BarChart3 icon
      },
      {
        stepNumber: 6,
        title: "Sustain",
        description:
          "We establish systems and habits that ensure lasting improvement and long-term results.",
        icon: "check", // Lucide Check icon
      },
    ],
    banner: {
      title: "DONE WITH YOU. DONE FOR YOU.",
      description:
        "We combine your team’s involvement with our execution support to ensure meaningful, lasting change.",
    },
  },
  //how it works section

  howItWorks: {
    badge: "HOW IT WORKS",
    title: "OUR PROVEN PROCESS",
    steps: [
      {
        id: "discover-assess",
        stepNumber: "1.",
        title: "DISCOVER & ASSESS",
        icon: "search-nodes",
        bullets: [
          "Understand your business, goals, and challenges",
          "Assess current state and identify opportunities",
        ],
      },
      {
        id: "design-align",
        stepNumber: "2.",
        title: "DESIGN & ALIGN",
        icon: "target",
        bullets: [
          "Define winning strategy and operating model",
          "Align structure, roles, and processes for success",
        ],
      },
      {
        id: "implement-grow",
        stepNumber: "3.",
        title: "IMPLEMENT & GROW",
        icon: "trending-up",
        bullets: [
          "Execute with focus and accountability",
          "Enable your team and drive continuous improvement",
        ],
      },
    ],
    // Modal View 1 Data
    modalPillars: [
      {
        id: "sales-performance",
        title: "SALES PERFORMANCE",
        icon: "bar-chart",
        bullets: [
          "Increase productivity",
          "Improve consistency",
          "Shorten sales cycles",
          "Improve forecasting",
          "Increase profitability",
          "Create sustainable growth",
        ],
      },
      {
        id: "sales-systems",
        title: "SALES SYSTEMS",
        icon: "settings",
        bullets: [
          "Sales processes",
          "CRM optimization",
          "Pipeline management",
          "Forecasting",
          "Performance dashboards",
          "Sales meetings",
          "Accountability systems",
        ],
      },
      {
        id: "sales-leadership",
        title: "SALES LEADERSHIP",
        icon: "users",
        bullets: [
          "Develop stronger sales leaders",
          "Improve accountability",
          "Improve coaching",
          "Create high-performing teams",
        ],
      },
    ],
    // Modal View 2 Data
    // Update siteConfig.howItWorks.modalComponents in @/config/site.ts
    modalComponents: [
      {
        num: 1,
        title: "SALES LEADERSHIP",
        desc: "Assessing leadership effectiveness, expectations communication, coaching and accountability.",
        overview:
          "Strong sales performance begins with effective leadership. We evaluate how sales leadership is currently guiding, managing, developing and holding the sales organization accountable. The objective is not to judge leadership style, but to determine whether the current leadership structure is producing the level of consistency, direction and performance the organization requires.",
        areas: [
          "Leadership roles and responsibilities",
          "Communication of expectations",
          "Coaching and performance management",
          "Accountability standards",
          "Sales meeting effectiveness",
          "Decision-making authority",
          "Manager-to-salesperson ratios",
          "Leadership visibility into pipeline and activity",
          "Alignment between leadership priorities and company objectives",
          "Whether managers are spending their time where it creates the greatest value",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "Where appropriate, we help leadership strengthen the structure, expectations and management practices needed to improve sales execution.",
      },
      {
        num: 2,
        title: "SYSTEMS & PROCESSES",
        desc: "Evaluating the sales process from prospecting through closing and account development.",
        overview:
          "A strong sales organization should not depend entirely on individual salespeople figuring out what works. We evaluate the sales process from initial prospecting through qualification, presentation, closing, onboarding and account development to determine whether there is a clear, repeatable structure supporting the team.",
        areas: [
          "Prospecting procedures",
          "Lead handling",
          "Qualification standards",
          "Sales stages",
          "Follow-up procedures",
          "Proposal and quotation processes",
          "Closing procedures",
          "Handoff to operations or customer service",
          "Account development procedures",
          "Documentation and consistency",
          "Bottlenecks or unnecessary steps",
          "Areas where sales opportunities may be getting lost",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "Our objective is to help create practical sales processes that support consistency without creating unnecessary bureaucracy.",
      },
      {
        num: 3,
        title: "TEAM PERFORMANCE",
        desc: "Analyzing individual and team performance, consistency, productivity, skills and performance standards.",
        overview:
          "An organization can have talented salespeople and still underperform as a team. We evaluate individual and collective sales performance to understand where the team is performing well, where inconsistencies exist and what may be preventing stronger overall results.",
        areas: [
          "Individual production",
          "Team production",
          "Productivity levels",
          "Activity levels",
          "Conversion performance",
          "Skill differences",
          "Territory or account performance",
          "Performance expectations",
          "Consistency among representatives",
          "Top-performer practices",
          "Underperformance patterns",
          "Management response to performance issues",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "The objective is to identify practical opportunities to raise overall team effectiveness without assuming every salesperson needs to work the same way.",
      },
      {
        num: 4,
        title: "PROSPECTING & LEAD DEVELOPMENT",
        desc: "Examining how opportunities are identified, qualified, developed and moved forward.",
        overview:
          "Revenue growth depends on having enough qualified opportunities entering the sales pipeline. We evaluate how prospects are identified, contacted, qualified, developed and moved toward meaningful sales conversations.",
        areas: [
          "Target market definition",
          "Prospect identification",
          "Lead sources",
          "Outbound prospecting",
          "Inbound lead handling",
          "Appointment setting",
          "Initial messaging",
          "Qualification criteria",
          "Follow-up frequency",
          "Lead nurturing",
          "Referral development",
          "Prospecting productivity",
          "Conversion from lead to qualified opportunity",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "We look for ways to improve both the quantity and quality of sales opportunities being created.",
      },
      {
        num: 5,
        title: "SALES PRESENTATIONS",
        desc: "Evaluating how value is communicated, objections are handled and prospects are guided to decisions.",
        overview:
          "A sales presentation should help a prospective customer understand value, recognize relevance and make an informed business decision. We evaluate how the organization communicates its value throughout the sales conversation.",
        areas: [
          "Opening the sales conversation",
          "Discovery questions",
          "Needs identification",
          "Value proposition",
          "Differentiation",
          "Presentation structure",
          "Product or service positioning",
          "Financial justification",
          "Handling objections",
          "Competitive comparisons",
          "Proposal presentation",
          "Closing conversations",
          "Next-step agreements",
          "Consistency of messaging across the team",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "The objective is not to turn salespeople into scripted presenters. It is to help ensure that important value is being communicated clearly and persuasively.",
      },
      {
        num: 6,
        title: "PIPELINE MANAGEMENT",
        desc: "Reviewing pipeline integrity, opportunity stages, forecasting, stalled deals and follow-up disciplines.",
        overview:
          "A sales pipeline should provide leadership with a realistic picture of future revenue—not simply a list of possible deals. We evaluate how opportunities are entered, categorized, advanced, forecast and managed.",
        areas: [
          "Pipeline stages",
          "Opportunity qualification",
          "Stage definitions",
          "Deal progression",
          "Probability assumptions",
          "Forecast accuracy",
          "Pipeline coverage",
          "Sales cycle length",
          "Stalled opportunities",
          "Follow-up discipline",
          "Opportunity aging",
          "Closing-date accuracy",
          "Lost-deal analysis",
          "Management pipeline reviews",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "Improved pipeline management can help leadership make better decisions while helping salespeople focus on the opportunities most likely to produce results.",
      },
      {
        num: 7,
        title: "CRM UTILIZATION",
        desc: "Assessing how effectively CRM technology supports the sales process and improves execution.",
        overview:
          "A CRM should support the sales organization—not become an administrative burden that salespeople avoid using. We evaluate how effectively the CRM is supporting sales activity, visibility, follow-up and management decision-making.",
        areas: [
          "CRM adoption",
          "Data accuracy",
          "Opportunity tracking",
          "Contact management",
          "Activity documentation",
          "Follow-up reminders",
          "Reporting",
          "Pipeline visibility",
          "Sales forecasting",
          "Management usage",
          "Duplicate or unnecessary data entry",
          "Automation opportunities",
          "Integration with other systems",
          "Whether the CRM reflects the actual sales process",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "The objective is to make CRM usage practical, useful and directly connected to improved sales execution.",
      },
      {
        num: 8,
        title: "PERFORMANCE MEASUREMENT",
        desc: "Determining what is measured, what should be measured and how metrics drive better decisions.",
        overview:
          "What gets measured should help leadership make better decisions. We evaluate whether the organization is measuring the right indicators and whether those measurements are helping improve performance.",
        areas: [
          "Revenue",
          "Gross profit",
          "New accounts",
          "Existing-account growth",
          "Average transaction value",
          "Sales activity",
          "Appointment generation",
          "Conversion rates",
          "Proposal-to-close ratios",
          "Sales cycle length",
          "Pipeline coverage",
          "Customer retention",
          "Forecast accuracy",
          "Individual and team productivity",
        ],
        note: "We also examine whether too much is being measured, too little is being measured, or whether the organization is focusing on metrics that do not materially improve decision-making.",
        objective:
          "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
      },
      {
        num: 9,
        title: "COMPENSATION & INCENTIVES",
        desc: "Evaluating compensation plans and incentives that drive the right behaviors and desired results.",
        overview:
          "Compensation should reward the behaviors and results the organization wants to produce. We evaluate whether current compensation and incentive programs support company objectives while remaining understandable and motivating to the sales team.",
        areas: [
          "Base salary and commission structure",
          "Straight commission structures",
          "Commission percentages",
          "Accelerators",
          "Bonuses",
          "Gross-margin incentives",
          "New-account incentives",
          "Existing-account incentives",
          "Team incentives",
          "Quotas",
          "Thresholds",
          "Commission timing",
          "Territory considerations",
          "Incentive clarity",
          "Unintended behaviors created by the compensation plan",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "The objective is to create alignment between salesperson earnings, company profitability and desired sales behavior.",
      },
      {
        num: 10,
        title: "RECRUITING & ONBOARDING",
        desc: "Reviewing how talent is identified, selected and onboarded to become productive faster.",
        overview:
          "Sales performance begins before a salesperson ever speaks with a prospect. We evaluate how sales talent is identified, selected, introduced to the organization and prepared to become productive.",
        areas: [
          "Position requirements",
          "Ideal candidate profile",
          "Recruiting sources",
          "Job advertisements",
          "Screening procedures",
          "Interview process",
          "Sales assessments",
          "Reference checks",
          "Compensation communication",
          "New-hire orientation",
          "Product and service knowledge",
          "Sales-process training",
          "CRM training",
          "Initial performance expectations",
          "30-, 60- and 90-day productivity milestones",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "Our objective is to help reduce poor hiring decisions and shorten the time required for new salespeople to become productive.",
      },
      {
        num: 11,
        title: "CUSTOMER RETENTION & DEVELOPMENT",
        desc: "Identifying opportunities to strengthen relationships, grow accounts and increase customer value.",
        overview:
          "Some of the most valuable revenue opportunities may already exist within the current customer base. We evaluate how the organization maintains, strengthens and expands existing customer relationships.",
        areas: [
          "Customer retention",
          "Account communication",
          "Account reviews",
          "Renewal processes",
          "Cross-selling",
          "Upselling",
          "Additional-location opportunities",
          "Additional-product or service opportunities",
          "Referral generation",
          "Dormant-account reactivation",
          "Customer concentration",
          "At-risk accounts",
          "Account ownership",
          "Customer lifetime value",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review.",
        objective:
          "The objective is to help the organization protect existing revenue while identifying appropriate opportunities for additional profitable growth.",
      },
      {
        num: 12,
        title: "TRAINING & DEVELOPMENT",
        desc: "Determining the right training and development to close skill gaps and improve overall performance.",
        overview:
          "Training should address actual performance needs rather than simply provide more information. We evaluate whether salespeople and sales managers have the knowledge, skills and support necessary to perform effectively.",
        areas: [
          "Prospecting skills",
          "Discovery",
          "Qualification",
          "Presentation skills",
          "Value communication",
          "Objection handling",
          "Negotiation",
          "Closing",
          "Account development",
          "CRM usage",
          "Pipeline management",
          "Sales management skills",
          "Coaching",
          "Product knowledge",
          "Industry knowledge",
          "Continuing development",
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review. Training recommendations are based on identified needs. If training is not necessary, we do not recommend it.",
        objective:
          "The objective is targeted development that improves execution—not training for the sake of training.",
      },
    ],
  },

  challenges: {
    badge: "CHALLENGES",
    subheading: "IS YOUR SALES ORGANIZATION",
    title: "Performing at Its Full Potential?",
    intro:
      "Many businesses hit a plateau in sales growth. The problem is rarely the product or the market—it's usually the systems, processes, leadership, and accountability behind the sales team.",
    highlightText: "That's where North Point Sales Group can help.",
    sectionTitle: "COMMON CHALLENGES WE HELP SOLVE",
    items: [
      {
        id: "inconsistent-revenue",
        title: "INCONSISTENT REVENUE",
        desc: "Unpredictable results and lack of a steady sales pipeline.",
        icon: "/icons/p6.svg",
      },
      {
        id: "underperforming-teams",
        title: "UNDERPERFORMING SALES TEAMS",
        desc: "Teams lack the skills, coaching, and accountability to win.",
        icon: "/icons/p7.svg",
      },
      {
        id: "lack-of-process",
        title: "LACK OF PROCESS & ACCOUNTABILITY",
        desc: "No repeatable sales process or system to drive performance.",
        icon: "/icons/p8.svg",
      },
      {
        id: "recruiting-talent",
        title: "DIFFICULTY RECRUITING & RETAINING TOP TALENT",
        desc: "Struggling to attract, develop, and keep the right people.",
        icon: "/icons/p9.svg",
      },
      {
        id: "leaders-overwhelmed",
        title: "SALES LEADERS OVERWHELMED",
        desc: "Leaders are stretched thin and lack the tools for scale.",
        icon: "/icons/p10.svg",
      },
      {
        id: "slow-growth",
        title: "SLOW GROWTH & MISSED TARGETS",
        desc: "Growth stalls and opportunities are left on the table.",
        icon: "/icons/Group 147.svg",
      },
    ],
    audioBanner: {
      title: "LISTEN TO OUR 2-MINUTE EXECUTIVE OVERVIEW",
      subtitle: "(90–120 SECONDS)",
      preferText: "Prefer to listen instead of watch?",
      phoneNumber: "Call 888-555-POINT (7646) and press 1",
      actionText: "to hear a brief overview of how we can help.",
    },
    typicalEngagement: {
      title: "TYPICAL ENGAGEMENT",
      bullets: [
        "Comprehensive diagnostic of the 12 Sales Performance Components™",
        "Executive Implementation Plan with prioritized recommendations",
        "Implementation support: Done With You and Done For You",
        "Active engagement typically 60 days",
        "Ongoing support as needed",
      ],
      footer: "Our objective is to improve sales performance — not disrupt it.",
    },
    investment: {
      title: "INVESTMENT",
      description:
        "North Point Sales Group engagements begin at $50,000. Final professional fees are determined by the size and complexity of the sales organization, diagnostic scope, implementation requirements, and North Point professional resources required.",
      buttonText: "HOW IS OUR FEE DETERMINED? — MORE ›",
    },
    modal: {
      title: "WHAT COULD A SMALL IMPROVEMENT BE WORTH?",
      revenueTiers: [
        {
          revenue: "$20 MILLION",
          label: "ANNUAL REVENUE",
          gain: "$1-$2 MILLION",
          sub: "in additional annual revenue",
        },
        {
          revenue: "$50 MILLION",
          label: "ANNUAL REVENUE",
          gain: "$2.5-$5 MILLION",
          sub: "in additional annual revenue",
        },
        {
          revenue: "$100 MILLION",
          label: "ANNUAL REVENUE",
          gain: "$5-$10 MILLION",
          sub: "in additional annual revenue",
        },
      ],
      impactNotice:
        "Relatively small improvements in an established sales organization can have a substantial impact on your bottom line.",
      whoWeWorkWithTitle: "WHO WE WORK WITH",
      whoWeWorkWith: [
        "Generate $10 million or more in annual revenue",
        "Have an established sales organization of approximately 5–50 people",
        "Have plateaued or inconsistent sales performance",
        "Have growth objectives that current performance isn't fully supporting",
        "Are ready to implement appropriate changes when opportunities are identified",
      ],
      industryNeutralNotice:
        "We are industry-neutral. We specialize in improving established sales organizations—across every industry.",
      whyUsTitle: "WHY NORTH POINT SALES GROUP?",
      whyUs: [
        "We look at the entire sales organization, not just individuals.",
        "We diagnose before recommending solutions.",
        "We work with what you already have—not disrupt it.",
        "We focus on implementation, not just recommendations.",
        "We work directly with leadership.",
        "We remain objective and bring an outside perspective.",
        "We focus on practical business results.",
      ],
      typicalDetailsTitle: "TYPICAL ENGAGEMENT",
      typicalDetails: [
        {
          title: "Typically 60 days",
          subtitle: "Timeline depends on scope and complexity.",
          icon: "/icons/p13.svg",
        },
        {
          title: "Mostly remote",
          subtitle: "On-site involvement when it adds value.",
          icon: "/icons/p14.svg",
        },
        {
          title: "Investment",
          subtitle:
            "Engagements begin at $50,000. Final investment based on scope, complexity and implementation needs.",
          icon: "/icons/p13.svg",
        },
      ],
    },
  },

  // siteConfig snippet
  solution: {
    badge: "Solutions",
    title: "Why North Point Sales Group?",
    bullets: [
      {
        id: "revenue-potential",
        label:
          "Revenue and profit potential within your existing sales operation",
        title:
          "Revenue and Profit Potential Within Your Existing Sales Operation",
        content:
          "Many companies assume growth requires more salespeople, more marketing, or more spending. Sometimes it does. But often, meaningful revenue potential already exists within the current structure. We look closely at how the existing sales organization is performing to identify where additional revenue and profit may be available before recommending expansion.",
      },
      {
        id: "focused-improvements",
        label: "Focused improvements where financial impact matters most",
        title: "Focused Improvement Where Financial Impact Matters Most",
        content:
          "We are not interested in changing things simply for the sake of change. If most of your sales operation is working well, we leave it alone. Our focus is on the specific areas that may be limiting performance and where improvement is most likely to create a meaningful business return.",
      },
      {
        id: "objective-evaluation",
        label: "Objective evaluation without predetermined solutions",
        title: "Objective Evaluation Without Predetermined Solutions",
        content:
          "We do not begin with a predetermined solution. The issue may involve sales leadership, recruiting, onboarding, lead generation, accountability, pipeline management, messaging, conversion, compensation, technology, or something else entirely. We first determine what is actually affecting performance, then recommend only what appears justified.",
      },
      {
        id: "implementation-support",
        label: "Implementation support that turns recommendations into action",
        title: "Implementation Support That Turns Recommendations Into Action",
        content:
          "A recommendation has little value if it never becomes part of the way the business operates. North Point does not simply identify opportunities and hand over a report. We help leadership put the agreed-upon improvements into practice, monitor how they are working, and make adjustments where necessary.",
      },
    ],
    pillars: [
      {
        id: "partnership",
        title: "Collaborative Partnership",
        icon: "/icons/partner.svg",
      },
      {
        id: "insights",
        title: "Actionable Insights",
        icon: "/icons/insights.svg",
      },
      {
        id: "sustainable",
        title: "Sustainable Results",
        icon: "/icons/sustainable.svg",
      },
      {
        id: "focused",
        title: "Focused on Your Growth",
        icon: "/icons/focused.svg",
      },
    ],
  },
  faq: {
    badge: "FAQ's",
    title: "Resources & Insights",
    questions: [
      "What is your typical engagement and investment?",
      "How long does a typical engagement last?",
      "How do you work with our leadership team?",
      "Is the engagement conducted remotely?",
      "Who is your ideal client?",
      "What happens after the 60-day engagement?",
      "What kind of results can we expect?",
      "Who do you typically work with?",
      "What industries do you serve?",
      "What makes North Point Sales Group different?",
      "How is the engagement billed?",
      "How do we get started?",
    ],
  },
  results: {
    badge: "Results",
    title: "Proven Results Across Organizations of All Sizes",
    intro: "Our clients achieve sustainable revenue growth through:",
    checkmark: "/icons/checkmark.svg",
    bullets: [
      "Sales strategy and planning",
      "Sales organization design",
      "Go-to-market optimization",
      "Sales talent assessment and development",
      "Sales performance management",
      "Leadership coaching and enablement",
    ],
    tagline: "Building High-Performing Sales Organizations That Win",
    stats: [
      {
        value: "79%",
        description: "of clients improve sales productivity within 12 months",
        source: "CSO Insights",
      },
      {
        value: "2.8x",
        description: "average increase in win rates after engagement",
        source: "North Point Advisors Client Data",
      },
      {
        value: "57%",
        description: "of clients exceed revenue targets year over year",
        source: "Gartner",
      },
    ],
  },
  process: {
    badge: "How It Works",
    title: "Our Proven Process",
    checkIcon: "/icons/check.svg",
    steps: [
      {
        id: "discover",
        icon: "/icons/discover.svg",
        title: "1. Discover & Assess",
        items: [
          "Understand your business, goals, and challenges",
          "Assess current state and identify opportunities",
        ],
      },
      {
        id: "design",
        icon: "/icons/design.svg",
        title: "2. Design & Align",
        items: [
          "Define winning strategy and operating model",
          "Align structure, roles, and processes for success",
        ],
      },
      {
        id: "grow",
        icon: "/icons/grow.svg",
        title: "3. Implement & Grow",
        items: [
          "Execute with focus and accountability",
          "Enable your team and drive continuous improvement",
        ],
      },
    ],
  },
  // config/site.ts
  footer: {
    ctaTitle: "Ready to Align Your Sales Organization and Accelerate Growth?",
    ctaSubtitle: "Let's start the conversation.",
    contactLinkLabel: "or Contact Us Directly",
    contactHref: "#contact",

    taglinePrimary: "EXECUTIVE SALES PERFORMANCE IMPLEMENTATION",
    taglineSecondary: "A DONE WITH YOU. DONE FOR YOU. SYSTEM.",

    // Standardized array of columns containing an array of groups
    columns: [
      {
        id: "quick-actions",
        groups: [
          {
            title: "Quick Actions",
            links: [
              { label: "Home", href: "#top" },
              { label: "Why choose us", href: "#why-north-point" },
              { label: "Results", href: "#results" },
              { label: "Steps", href: "#steps" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Challenges", href: "#challenges" },

              { label: "Solutions", href: "#why-north-point" },
              { label: "FAQ's", href: "#resources" },
            ],
          },
        ],
      },
      {
        id: "company",
        groups: [
          {
            title: "COMPANY",
            links: [
              { label: "About Us", href: "#about" },
              { label: "Our Approach", href: "#approach" },
              { label: "Engagement", href: "#engagement" },
              { label: "Resources", href: "#resources" },
              { label: "Contact", href: "#contact" },
            ],
          },
        ],
      },
      {
        id: "solutions-engagement",
        groups: [
          {
            title: "SOLUTIONS",
            links: [
              { label: "Sales Leadership", href: "#" },
              { label: "Sales Systems", href: "#" },
              { label: "Sales Performance", href: "#" },
            ],
          },
          {
            title: "ENGAGEMENT",
            links: [
              { label: "60-Day Engagement", href: "#" },
              { label: "What to Expect", href: "#" },
              { label: "Who We Work With", href: "#" },
            ],
          },
        ],
      },
    ],

    contact: {
      phone: "(970) 230-1439",
      email: "contact@northpointsalesgroup.com",
      location: "Montrose, CO",
      scope: "Serving Clients Nationwide",
    },

    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
} as const;

export type SiteNavItem = (typeof siteConfig.nav)[number];
