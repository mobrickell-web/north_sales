export const siteConfig = {
  name: "North Point Sales Group",
  shortName: "North Point",
  description:
    "Sales organization consulting that drives stronger teams and better business results.",
  url: process.env.SITE_URL || "http://localhost:3000",
  cta: {
    label: "Schedule a Consultation",
    labelLines: ["Schedule a", "Consultation"] as const,
    href: "#cta",
  },
  nav: [
    { href: "#top", label: "Home" },
    { href: "#why-choose-us", label: "Why Choose Us" },
    { href: "#results", label: "Results" },

    { label: "HOW WE WORK", href: "#how-we-work" },
    { label: "OUR 60 DAY FOCUS", href: "#our-60-day-focus" },
    { label: "CHALLENGES", href: "#challenges" },

    { href: "#solutions", label: "Solutions" },
    { href: "#faqs", label: "FAQ's" },
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
    title: "WHY EXECUTIVE TEAMS ENGAGE NORTH POINT SALES GROUP?",
    pillars: [
      {
        id: "strengthen-performance",
        title: "Strengthen Existing Sales Performance",
        description:
          "We help established, growth-oriented organizations improve the performance of their existing sales operation before adding more people, marketing, or unnecessary spending.",
        icon: "/icons/deliver.svg",
      },
      {
        id: "evaluate-organization",
        title: "Evaluate the Entire Sales Organization",
        description:
          "We look at the sales organization as an interconnected revenue-producing system rather than assuming the salespeople themselves are the problem.",
        icon: "/icons/data.svg",
      },
      {
        id: "focus-on-what-matters",
        title: "Focus on What Matters Most",
        description:
          "We concentrate on the specific areas most relevant to the organization's current objectives, challenges, and opportunities.",
        icon: "/icons/solution.svg",
      },
      {
        id: "improve-revenue-profit",
        title: "Improve Revenue and Contribution Profit",
        description:
          "Our focus is on improvements that can produce meaningful financial impact, not change simply for the sake of change.",
        icon: "/icons/impact.svg",
      },
      {
        id: "help-leadership-implement",
        title: "Help Leadership Implement Improvements",
        description:
          "We do more than identify opportunities. We help leadership implement the changes needed to capture them and measure whether they are producing results.",
        icon: "/icons/trust.svg",
      },
    ],
    // Modal content for the "MORE" CTA
    modal: {
      title: "OUR APPROACH",
      pillars: [
        {
          id: "diagnose-before-prescribe",
          title: "Diagnose Before We Prescribe",
          description:
            "We first determine what is working, what may be restricting performance, and where meaningful opportunities for improvement exist.",
          icon: "/icons/user.svg",
        },
        {
          id: "focus-financial-impact",
          title: "Focus Where Financial Impact Matters Most",
          description:
            "If an area of the sales organization is performing well, we leave it alone. We focus on areas where improvement is most likely to produce a meaningful business return.",
          icon: "/icons/calendar.svg",
        },
        {
          id: "implementation-not-just-recommendations",
          title: "Implementation, Not Just Recommendations",
          description:
            "We do more than provide reports and recommendations. We work with leadership to help put agreed-upon improvements into practice and evaluate the results.",
          icon: "/icons/globe.svg",
        },
        {
          id: "objective-outside-perspective",
          title: "Objective Outside Perspective",
          description:
            "Because we are not part of the existing internal structure, we can evaluate sales performance objectively while working collaboratively with leadership and the sales organization.",
          icon: "/icons/shield-lock.svg",
        },
        {
          id: "long-term-resource",
          title: "A Long-Term Resource When Needed",
          description:
            "Our objective is not simply to complete an engagement and disappear. When appropriate, we want to remain a trusted sales-performance resource leadership can call upon as future needs and opportunities arise.",
          icon: "/icons/target.svg",
        },
      ],
    },
  },
  //steps section
  salesEngagement: {
    badge: "Our 60 Day Focus",
    title: "Our 60-Day FOCUS",
    subtitle:
      "A focused, results-oriented 6-step, 60-day engagement process designed to identify the areas most likely to improve sales performance and help leadership implement the changes needed to produce measurable results.",
    steps: [
      {
        stepNumber: 1,
        title: "Discover",
        description:
          "We gain a deep understanding of your business, goals, challenges, and current sales performance.",
        icon: "search", // Lucide Search icon
        popout: {
          title: "Sales Strategy and Planning",
          description:
            "We help leadership clarify sales priorities, identify the strongest opportunities for growth, and create a practical plan for improving performance. This may include market focus, sales objectives, resource allocation, prospecting priorities, and the activities most likely to produce measurable results.",
        },
      },
      {
        stepNumber: 2,
        title: "Assess",
        description:
          "We assess people, processes, pipeline, tools, and metrics to identify gaps and the biggest opportunities.",
        icon: "clipboard-list", // Lucide ClipboardList icon
        popout: {
          title: "Sales Organization Design",
          description:
            "We evaluate whether the current sales structure supports the company's goals. This can include roles and responsibilities, management structure, territories, account assignments, appointment-setting support, communication, and how effectively the team works together.",
        },
      },
      {
        stepNumber: 3,
        title: "Design",
        description:
          "We develop a customised strategy, systems, and action plan aligned with your objectives.",
        icon: "workflow", // Lucide LayoutGrid or Workflow icon
        popout: {
          title: "Go-to-Market Optimization",
          description:
            "We examine how the organization identifies, reaches, and converts prospective customers. This may include target markets, lead generation, prospecting methods, sales messaging, value propositions, presentations, follow-up, and the overall path from initial contact to completed sale.",
        },
      },
      {
        stepNumber: 4,
        title: "Implement",
        description:
          "We work alongside your team to implement priorities and build momentum quickly.",
        icon: "settings", // Lucide Settings icon
        popout: {
          title: "Sales Talent Assessment and Development",
          description:
            "We help identify individual strengths, performance gaps, and opportunities for improvement across the sales team. Development may include coaching, training, prospecting, presentations, objection handling, follow-up, closing, time management, and other skills directly connected to sales productivity.",
        },
      },
      {
        stepNumber: 5,
        title: "Optimize",
        description:
          "We refine processes, reinforce accountability, and improve performance using data and feedback.",
        icon: "bar-chart-3", // Lucide BarChart3 icon
        popout: {
          title: "Sales Performance Management",
          description:
            "We help leadership establish clear expectations, meaningful performance measures, and consistent accountability. This may include sales activity, pipeline movement, conversion rates, CRM utilization, follow-up, forecasting, individual performance, and the results being produced.",
        },
      },
      {
        stepNumber: 6,
        title: "Sustain",
        description:
          "We establish systems and habits that ensure lasting improvement and long-term results.",
        icon: "check", // Lucide Check icon
        popout: {
          title: "Leadership Coaching and Enablement",
          description:
            "Strong sales performance requires effective leadership. We work with sales leaders to strengthen communication, accountability, coaching, decision-making, performance management, and their ability to help salespeople consistently perform at a higher level.",
        },
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
    badge: "HOW WE WORK",
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
        "Focused evaluation of the Sales Performance Components™ most relevant to your organization",
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
      feeDetermined: {
        title: "How is our fee determined?",
        intro: "Our fee is based on the scope of the engagement, including:",
        bullets: [
          {
            id: "number-of-salespeople",
            label:
              "The number of salespeople or account representatives involved",
            popout: {
              title:
                "The Number of Salespeople or Account Representatives Involved",
              description:
                "The number of people included directly affects the amount of evaluation, coaching, communication, performance tracking, and follow-through required throughout the engagement.",
            },
          },
          {
            id: "sales-performance-components",
            label: "The Sales Performance Components™ being addressed",
            popout: {
              title: "The Sales Performance Components™ Being Addressed",
              description:
                "Some engagements may focus on one specific area, while others require attention across several Sales Performance Components™. The broader the scope, the more resources and implementation support may be required.",
            },
          },
          {
            id: "leadership-involvement",
            label: "The level of leadership involvement required",
            popout: {
              title: "The Level of Leadership Involvement Required",
              description:
                "Some engagements require limited management participation, while others involve ongoing collaboration with senior leadership, sales management, or other key decision-makers.",
            },
          },
          {
            id: "implementation-coaching",
            label:
              "The amount of implementation, coaching, and follow-through needed",
            popout: {
              title:
                "The Amount of Implementation, Coaching, and Follow-Through Needed",
              description:
                "Fees reflect not only what needs to be evaluated, but also the level of hands-on implementation, coaching, accountability, and follow-through required to help produce measurable improvement.",
            },
          },
          {
            id: "complexity-duration",
            label: "The overall complexity and duration of the engagement",
            popout: {
              title: "The Overall Complexity and Duration of the Engagement",
              description:
                "Engagements vary in complexity depending on the organization, sales structure, objectives, challenges, and length of the assignment. These factors are considered when determining the final scope and fee.",
            },
          },
        ],
        footer:
          "Smaller 30-day engagements may begin at $5,000, while broader 60-day Sales Performance Engagements are priced according to scope and typically begin at $50,000.",
      },
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
      {
        question: "What is your typical engagement and investment?",
        answer: [
          "Every engagement is customized based on your organization's size, objectives, and implementation requirements.",
          "Our Executive Sales Performance Implementation engagements typically begin at $50,000, with larger organizations and more complex engagements quoted accordingly.",
          "Our objective is to create measurable business value that significantly exceeds your investment.",
        ],
      },
      {
        question:
          "Can North Point work with just a few of our Sales or Account Representatives?",
        answer: [
          "Yes. In some cases, we can begin with a smaller 30-day engagement focused on a limited number of Sales or Account Representatives.",
          "Typical 30-day pricing is:",
          {
            bullets: [
              "1 representative: $5,000",
              "2–3 representatives: $7,500",
              "4–5 representatives: $12,500",
            ],
          },
          "Once the scope expands beyond five representatives, we typically move from a limited pilot into a broader 60-day Sales Performance Engagement, with pricing based on the size of the team and the areas being addressed.",
        ],
      },
      {
        question: "How long does a typical engagement last?",
        answer: [
          "Our standard engagement is 60 days.",
          "This structured engagement allows us to evaluate your sales organization, develop a customized Executive Implementation Plan, and work alongside your leadership team to implement practical improvements that continue producing value long after the engagement has concluded.",
        ],
      },
      {
        question: "How do you work with our leadership team?",
        answer: [
          "We work directly with executive leadership throughout the engagement.",
          "Our role is not simply to provide recommendations, but to help implement them.",
          "Our implementation philosophy is best described as:",
          "Done With You. Done For You.",
          "We collaborate with your leadership team to strengthen sales leadership, improve accountability, implement better systems, and improve overall sales performance.",
        ],
      },
      {
        question: "Is the engagement conducted remotely?",
        answer: [
          "Yes.",
          "The vast majority of our engagements are conducted remotely using secure video conferencing and collaborative technologies.",
          "This allows us to work efficiently with organizations throughout the United States while minimizing disruption to your business.",
        ],
      },
      {
        question: "Will you travel to our location if necessary?",
        answer: [
          "Yes.",
          "Although most engagements can be successfully completed remotely, there are situations where an on-site visit may provide additional value.",
          "If both parties agree that travel would benefit the engagement, on-site visits can be arranged.",
          "Travel expenses and any applicable on-site facilitation fees are discussed and approved in advance.",
        ],
      },
      {
        question: "What kind of results can we expect?",
        answer: [
          "Every organization is different.",
          "While no consulting firm can ethically guarantee specific financial outcomes, our objective is to identify and implement opportunities that strengthen leadership, improve execution, increase accountability, improve sales performance, and position your organization for sustainable revenue growth.",
        ],
      },
      {
        question: "Who do you typically work with?",
        answer: [
          "We primarily work with:",
          {
            bullets: [
              "Owners",
              "CEOs",
              "Presidents",
              "Executive Leadership Teams",
              "Chief Revenue Officers",
              "Vice Presidents of Sales",
              "Sales Directors",
            ],
          },
          "Organizations typically have an existing sales organization or are committed to building one.",
        ],
      },
      {
        question: "What industries do you serve?",
        answer: [
          "Our methodology applies across many industries where professional sales organizations play a critical role in business growth.",
          "Rather than specializing in one specific industry, we specialize in improving the performance of sales organizations.",
        ],
      },
      {
        question: "What makes North Point Sales Group different?",
        answer: [
          "Many consulting firms provide recommendations.",
          "Many training companies provide education.",
          "North Point Sales Group focuses on implementation.",
          "We partner with executive leadership to help put practical improvements into action, creating stronger leadership, better systems, improved accountability, and measurable organizational performance.",
        ],
      },
      {
        question: "Who is your ideal client?",
        answer: [
          "North Point Sales Group is best suited for organizations that:",
          {
            bullets: [
              "Are established, growth-oriented businesses with an active sales operation",
              "Have an existing sales organization",
              "Have sufficient scale for sales-performance improvements to create meaningful financial impact",
              "View sales performance as a strategic business priority",
              "Are committed to implementing meaningful organizational improvements",
              "Value executive-level collaboration and long-term business growth",
            ],
          },
        ],
      },
      {
        question: "How is the engagement billed?",
        answer: [
          "Our standard investment schedule is straightforward.",
          {
            bullets: [
              "$25,000 is due upon execution of the engagement agreement to begin the Executive Discovery and Assessment phase.",
              "The remaining $25,000 is due following presentation and executive approval of the customized Executive Implementation Plan, typically during Weeks Three or Four, prior to implementation.",
            ],
          },
          "This structure allows executive leadership to review and approve the strategic implementation plan before Phase Two begins.",
        ],
      },
      {
        question: "What happens after the 60-day engagement?",
        answer: [
          "Many organizations continue implementing the systems, processes, and leadership improvements established during the engagement.",
          "Others choose to retain North Point Sales Group for ongoing executive advisory services, quarterly business reviews, leadership coaching, or future organizational initiatives.",
          "Continuing advisory services are always optional and customized to your organization's needs.",
        ],
      },
      {
        question: "How do we get started?",
        answer: [
          "The first step is to request a confidential Executive Consultation.",
          "During this conversation, we'll learn about your organization, discuss your objectives, answer your questions, and determine whether North Point Sales Group is the right fit for your business.",
          "If we believe we can create significant value, we'll outline the recommended next steps. If we don't, we'll tell you that as well.",
          "We believe the right partnerships begin with honesty, transparency, and a shared commitment to achieving meaningful business results.",
        ],
      },
    ],
  },
  results: {
    badge: "Results",
    title: "Proven Results Across Organizations of All Sizes",
    intro: "Our clients achieve sustainable revenue growth through:",
    checkmark: "/icons/checkmark.svg",
    bullets: [
      {
        id: "sales-strategy-planning",
        label: "Sales strategy and planning",
        popout: {
          title: "Sales Strategy and Planning",
          description:
            "We help leadership clarify sales priorities, identify the strongest opportunities for growth, and create a practical plan for improving performance. This may include market focus, sales objectives, resource allocation, prospecting priorities, and the activities most likely to produce measurable results.",
        },
      },
      {
        id: "sales-organization-design",
        label: "Sales organization design",
        popout: {
          title: "Sales Organization Design",
          description:
            "We evaluate whether the current sales structure supports the company's goals. This can include roles and responsibilities, management structure, territories, account assignments, appointment-setting support, communication, and how effectively the team works together.",
        },
      },
      {
        id: "go-to-market-optimization",
        label: "Go-to-market optimization",
        popout: {
          title: "Go-to-Market Optimization",
          description:
            "We examine how the organization identifies, reaches, and converts prospective customers. This may include target markets, lead generation, prospecting methods, sales messaging, value propositions, presentations, follow-up, and the overall path from initial contact to completed sale.",
        },
      },
      {
        id: "sales-talent-assessment",
        label: "Sales talent assessment and development",
        popout: {
          title: "Sales Talent Assessment and Development",
          description:
            "We help identify individual strengths, performance gaps, and opportunities for improvement across the sales team. Development may include coaching, training, prospecting, presentations, objection handling, follow-up, closing, time management, and other skills directly connected to sales productivity.",
        },
      },
      {
        id: "sales-performance-management",
        label: "Sales performance management",
        popout: {
          title: "Sales Performance Management",
          description:
            "We help leadership establish clear expectations, meaningful performance measures, and consistent accountability. This may include sales activity, pipeline movement, conversion rates, CRM utilization, follow-up, forecasting, individual performance, and the results being produced.",
        },
      },
      {
        id: "leadership-coaching",
        label: "Leadership coaching and enablement",
        popout: {
          title: "Leadership Coaching and Enablement",
          description:
            "Strong sales performance requires effective leadership. We work with sales leaders to strengthen communication, accountability, coaching, decision-making, performance management, and their ability to help salespeople consistently perform at a higher level.",
        },
      },
    ],
    tagline: "Building High-Performing Sales Organizations That Win",
    stats: [
      {
        value: "79%",
        description:
          "of executives say achieving their company’s goals requires improving the productivity of their existing sales team.",
        source: "TextExpander",
        sourceInfo: {
          title: "TextExpander",
          description: [
            "TextExpander is a business productivity software company that provides tools designed to help individuals and organizations improve efficiency, consistency, and communication across their teams.",
            "Its research and business content frequently addresses workplace productivity, employee efficiency, communication, and how organizations can make better use of their existing workforce.",
          ],
        },
        popout: {
          title: "Improving Existing Sales Productivity",
          description:
            "A large majority of executives recognize that achieving company growth objectives depends on improving the productivity of the sales team already in place. This supports a core North Point principle: before adding more salespeople, more marketing, or more spending, leadership should first determine whether greater performance can be achieved from the existing sales organization.",
        },
      },
      {
        value: "70%",
        description:
          "of sales reps’ time is spent on activities other than selling.",
        source: "Salesforce, State of Sales",
        sourceInfo: {
          title: "Salesforce — State of Sales",
          description: [
            "Salesforce is one of the world's leading customer relationship management and business software companies, providing sales, marketing, customer service, analytics, and related technologies to organizations around the world.",
            "Salesforce's State of Sales research examines trends affecting sales organizations, sales representatives, sales operations, technology, productivity, and revenue growth. Its reports are based on surveys and research involving sales professionals, representatives, and leaders across multiple industries and geographic markets.",
          ],
        },
        popout: {
          title: "TIME SPENT ON NON-SELLING ACTIVITIES",
          description: `Sales professionals must still handle essential responsibilities such as CRM updates, follow-up, preparation, and internal communication.

The opportunity is to make those activities more efficient so more time can be directed toward productive selling activity.

North Point may help improve sales productivity by:
• Simplifying CRM entry and workflows so reps spend less time on administration
• Reducing duplicate reporting and unnecessary meetings to protect selling time
• Standardizing follow-up processes so opportunities move forward more consistently
• Improving lead prioritization so reps focus on the highest-potential opportunities
• Organizing prospecting and selling time to increase productive sales activity
• Automating routine administrative tasks where appropriate to free up rep capacity
• Using appointment setters or support resources when advantageous so salespeople can spend more time selling`,
        },
      },
      {
        value: "47%",
        description: "average quota attainment across B2B sales organizations.",
        source: "Forrester",
        sourceInfo: {
          title: "Forrester",
          description: [
            "Forrester Research is a global independent research and advisory firm founded in 1983. The company provides research, analysis, consulting, and strategic guidance to business leaders in areas including sales, marketing, technology, customer experience, product development, and revenue growth.",
            "Forrester has conducted business and technology research for more than 40 years and serves organizations throughout North America, Europe, and the Asia-Pacific region. Its research incorporates proprietary data, quantitative and qualitative analysis, and structured research methodologies. Forrester Research, Inc. is publicly traded on Nasdaq under the ticker FORR.",
          ],
        },
        popout: {
          title: "Average B2B Quota Attainment",
          description:
            "When average quota attainment is below 50%, the issue may extend beyond the individual salesperson. Sales leadership, lead quality, prospecting, messaging, pipeline management, CRM utilization, training, accountability, compensation, and other factors can all influence performance. North Point evaluates the areas most relevant to the organization to determine where targeted improvements may produce stronger results.",
        },
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
              { label: "Why choose us", href: "#why-choose-us" },
              { label: "Results", href: "#results" },

              { label: "How we work", href: "#how-we-work" },
              { label: "Our 60 Day Focus", href: "#our-60-day-focus" },
              { label: "Challenges", href: "#challenges" },

              { label: "Solutions", href: "#solutions" },
              { label: "FAQ's", href: "#faqs" },
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
              { label: "Resources", href: "#faqs" },
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
      phone: "(970) 250-1439",
      email: "contact@northpointsalesgroup.com",
      location: "CO",
      scope: "Serving Clients Nationwide",
    },

    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Use", href: "#" },
    ],
  },
} as const;

export type SiteNavItem = (typeof siteConfig.nav)[number];
