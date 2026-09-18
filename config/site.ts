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
        popout: {
          paragraphs: [
            "Before recommending more salespeople, more leads, or more marketing spend, we first ask a more fundamental question:",
            "Is the organization getting everything it reasonably can from the sales resources it already has?",
            "Many established companies have significant revenue potential already sitting inside their existing sales operation — in conversion rates, prospecting effectiveness, sales messaging, follow-up, pipeline management, leadership, accountability, and individual salesperson performance.",
            "If those areas can be strengthened, even modestly, the financial impact can be substantial.",
            "For example, improving the productivity of an existing sales team by even a few percentage points may generate meaningful additional revenue without immediately adding payroll, increasing advertising expense, or expanding headcount.",
            "That is why we believe the first place to look for growth is often inside the existing sales organization.",
            "The business question is:",
            "How much additional revenue and contribution profit could your existing sales operation produce if it performed more effectively?",
          ],
        },
      },
      {
        id: "evaluate-organization",
        title: "Evaluate the Entire Sales Organization",
        description:
          "We look at the sales organization as an interconnected revenue-producing system rather than assuming the salespeople themselves are the problem.",
        icon: "/icons/data.svg",
        popout: {
          paragraphs: [
            "Sales performance is rarely the result of one isolated issue.",
            "A salesperson may appear to be underperforming when the actual problem is lead quality, weak messaging, poor onboarding, inconsistent follow-up, ineffective pipeline management, limited accountability, compensation structure, or lack of sales leadership.",
            "That is why we evaluate the sales organization as a complete revenue-producing system rather than automatically assuming the salespeople themselves are the problem.",
            "We look at how the different components work together and where breakdowns, inefficiencies, or missed opportunities may exist.",
            "This gives leadership a much clearer picture of what is actually affecting performance before money and resources are committed to fixing the wrong problem.",
            "The business question is:",
            "What is actually limiting sales performance, and where is the greatest opportunity for improvement?",
          ],
        },
      },
      {
        id: "focus-on-what-matters",
        title: "Focus on What Matters Most",
        description:
          "We concentrate on the specific areas most relevant to the organization's current objectives, challenges, and opportunities.",
        icon: "/icons/solution.svg",
        popout: {
          paragraphs: [
            "Most companies do not need to overhaul their entire sales organization.",
            "The real value comes from identifying the few areas that are having the greatest impact on results and concentrating attention there.",
            "For one company, that may be improving conversion rates. For another, it may be prospecting, lead quality, sales messaging, follow-up, pipeline management, leadership, or the performance of a small number of salespeople.",
            "By narrowing the focus, the company avoids unnecessary disruption and directs its time, money, and management attention toward the areas most likely to produce measurable improvement.",
            "Our goal is not to change everything.",
            "Our goal is to identify what matters most right now and address it effectively.",
            "The business question is:",
            "Which improvements are most likely to produce the greatest measurable return for the organization?",
          ],
        },
      },
      {
        id: "improve-revenue-profit",
        title: "Improve Revenue and Contribution Profit",
        description:
          "Our focus is on improvements that can produce meaningful financial impact, not change simply for the sake of change.",
        icon: "/icons/impact.svg",
        popout: {
          paragraphs: [
            "More revenue is valuable only if the additional business also makes financial sense.",
            "That is why we look beyond sales activity and top-line growth and focus on whether improvements are producing meaningful contribution profit — the amount remaining after the direct costs associated with generating and delivering the additional business.",
            "For example, if an improvement produces $500,000 in additional annual revenue, leadership also needs to understand what portion of that revenue contributes meaningfully to profit after direct costs.",
            "This allows the company to evaluate sales improvements as a business investment rather than simply celebrating higher activity, more appointments, or additional revenue.",
            "The objective is to create improvements that are financially meaningful and sustainable.",
            "The business question is:",
            "Are the changes producing enough additional revenue and contribution profit to justify the investment?",
          ],
        },
      },
      {
        id: "help-leadership-implement",
        title: "Help Leadership Implement Improvements",
        description:
          "We do more than identify opportunities. We help leadership implement the changes needed to capture them and measure whether they are producing results.",
        icon: "/icons/trust.svg",
        popout: {
          paragraphs: [
            "Identifying what needs to change is only valuable if those changes are actually implemented.",
            "North Point is not designed to simply deliver a report, make recommendations, and leave leadership to figure out the rest.",
            "We can work alongside the company as a fractional sales executive to help put the agreed-upon improvements into practice.",
            "That may include working directly with selected salespeople, improving presentations and messaging, strengthening prospecting and follow-up, addressing pipeline issues, improving accountability, coordinating outside vendors when needed, and helping leadership track results.",
            "The engagement can be narrowly focused on two or three salespeople or expanded to support the broader sales organization.",
            "The level of involvement depends on what the company actually needs.",
            "The business question is:",
            "Once we know what needs to improve, how do we make sure those improvements are actually implemented and producing results?",
          ],
        },
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
    contactHref: "/#contact",

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
              { label: "Home", href: "/#top" },
              { label: "Why choose us", href: "/#why-choose-us" },
              { label: "Results", href: "/#results" },

              { label: "How we work", href: "/#how-we-work" },
              { label: "Our 60 Day Focus", href: "/#our-60-day-focus" },
              { label: "Challenges", href: "/#challenges" },

              { label: "Solutions", href: "/#solutions" },
              { label: "FAQ's", href: "/#faqs" },
            ],
          },
        ],
      },
    ],

    contact: {
      phone: "(970) 250-1439",
      email: "contact@northpointsalesgroup.com",
      scope: "Serving Clients Nationwide",
    },

    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },

  privacyPolicy: {
    title: "Privacy Policy",
    badge: "Legal",
    hero: {
      image: {
        src: "/images/hero-image.svg",
        alt: "North Point Sales Group — Privacy Policy",
      },
      subtitle:
        "How we collect, use, disclose, and protect information when you interact with our website and services.",
    },
    intro: [
      'North Point Sales Group ("North Point," "we," "us," or "our") respects your privacy and is committed to handling personal information responsibly.',
      "This Privacy Policy explains how we may collect, use, disclose, and protect information when you visit NorthPointSalesGroup.com, contact us, request information, schedule a consultation, or otherwise interact with our website.",
    ],
    sections: [
      {
        id: "information-we-may-collect",
        number: "1",
        title: "Information We May Collect",
        blocks: [
          {
            type: "paragraph",
            text: "We may collect information that you voluntarily provide to us, including:",
          },
          {
            type: "list",
            items: [
              "Your name",
              "Company or organization name",
              "Job title",
              "Email address",
              "Telephone number",
              "Information you provide through contact forms, consultation requests, questionnaires, assessments, or other communications",
              "Information concerning your organization, sales operation, or business needs that you voluntarily provide",
            ],
          },
          {
            type: "paragraph",
            text: "We may also automatically receive certain technical information when you use our website, such as:",
          },
          {
            type: "list",
            items: [
              "Internet Protocol (IP) address",
              "Browser type",
              "Device type",
              "Operating system",
              "Pages visited",
              "Referring website",
              "Date and time of visits",
              "General website usage and interaction information",
            ],
          },
        ],
      },
      {
        id: "how-we-use-information",
        number: "2",
        title: "How We Use Information",
        blocks: [
          {
            type: "paragraph",
            text: "We may use information we collect to:",
          },
          {
            type: "list",
            items: [
              "Respond to inquiries and consultation requests",
              "Communicate with prospective and existing clients",
              "Evaluate whether North Point Sales Group's services may be appropriate for an organization",
              "Provide requested information about our services",
              "Schedule and conduct consultations",
              "Provide and improve our website and services",
              "Analyze website usage and performance",
              "Maintain the security and integrity of our website",
              "Maintain appropriate business records",
              "Comply with legal and regulatory requirements",
              "Protect our legal rights and the rights of others",
            ],
          },
          {
            type: "paragraph",
            text: "We may also use contact information to communicate with you about North Point Sales Group services that we reasonably believe may be relevant to your business. You may ask us to discontinue marketing communications at any time.",
          },
        ],
      },
      {
        id: "cookies-and-similar-technologies",
        number: "3",
        title: "Cookies and Similar Technologies",
        blocks: [
          {
            type: "paragraph",
            text: "Our website may use cookies, analytics technologies, or similar tools to help the website function properly, understand how visitors use the site, improve performance, and evaluate the effectiveness of our communications and marketing.",
          },
          {
            type: "paragraph",
            text: "You may be able to control cookies through your browser settings. Disabling certain cookies may affect the functionality of some portions of the website.",
          },
        ],
      },
      {
        id: "how-we-may-share-information",
        number: "4",
        title: "How We May Share Information",
        blocks: [
          {
            type: "paragraph",
            text: "We do not sell personal information in the ordinary meaning of the term.",
          },
          {
            type: "paragraph",
            text: "We may share information with service providers or contractors that assist us with business functions such as:",
          },
          {
            type: "list",
            items: [
              "Website hosting and maintenance",
              "Email and communications",
              "Scheduling",
              "Customer relationship management",
              "Website analytics",
              "Information technology and security",
              "Professional, accounting, or legal services",
            ],
          },
          {
            type: "paragraph",
            text: "These providers may receive information only as reasonably necessary to perform services on our behalf.",
          },
          {
            type: "paragraph",
            text: "We may also disclose information when we reasonably believe disclosure is necessary to:",
          },
          {
            type: "list",
            items: [
              "Comply with applicable law, regulation, subpoena, court order, or other legal process",
              "Protect the rights, property, or safety of North Point Sales Group, our clients, website users, or others",
              "Investigate suspected fraud, security incidents, or unlawful activity",
              "Facilitate a merger, acquisition, financing, restructuring, sale of assets, or similar business transaction",
            ],
          },
        ],
      },
      {
        id: "information-concerning-client-organizations",
        number: "5",
        title: "Information Concerning Client Organizations",
        blocks: [
          {
            type: "paragraph",
            text: "During consultations or engagements, prospective or existing clients may provide confidential or proprietary business information.",
          },
          {
            type: "paragraph",
            text: "Information provided as part of an actual consulting engagement may also be governed by the applicable engagement agreement, confidentiality agreement, nondisclosure agreement, or other written agreement between North Point Sales Group and the client.",
          },
          {
            type: "paragraph",
            text: "This Privacy Policy is not intended to replace the confidentiality provisions contained in those agreements.",
          },
        ],
      },
      {
        id: "data-security",
        number: "6",
        title: "Data Security",
        blocks: [
          {
            type: "paragraph",
            text: "We use reasonable administrative, technical, and organizational measures designed to protect information against unauthorized access, disclosure, alteration, misuse, or destruction.",
          },
          {
            type: "paragraph",
            text: "However, no website, electronic communication, or information-storage system can be guaranteed to be completely secure. Therefore, we cannot guarantee the absolute security of information transmitted through or stored in connection with the website.",
          },
        ],
      },
      {
        id: "data-retention",
        number: "7",
        title: "Data Retention",
        blocks: [
          {
            type: "paragraph",
            text: "We may retain personal information for as long as reasonably necessary for the purposes for which it was collected, including maintaining business records, responding to inquiries, providing services, resolving disputes, enforcing agreements, and complying with legal obligations.",
          },
        ],
      },
      {
        id: "your-privacy-rights",
        number: "8",
        title: "Your Privacy Rights",
        blocks: [
          {
            type: "paragraph",
            text: "Depending upon where you reside and applicable law, you may have certain rights concerning your personal information, which may include the right to:",
          },
          {
            type: "list",
            items: [
              "Request access to personal information we maintain about you",
              "Request correction of inaccurate information",
              "Request deletion of certain personal information",
              "Request a copy of certain personal information",
              "Opt out of certain uses or disclosures of personal information where required by law",
              "Withdraw consent where processing is based upon consent",
            ],
          },
          {
            type: "paragraph",
            text: "These rights are subject to applicable legal requirements, limitations, and exceptions.",
          },
          {
            type: "paragraph",
            text: "To submit a privacy-related request, contact us at:",
          },
          {
            type: "email",
            text: "contact@northpointsalesgroup.com",
          },
          {
            type: "paragraph",
            text: "We may need to verify your identity before processing certain requests.",
          },
        ],
      },
      {
        id: "third-party-websites-and-services",
        number: "9",
        title: "Third-Party Websites and Services",
        blocks: [
          {
            type: "paragraph",
            text: "Our website may contain links to third-party websites, platforms, resources, or services.",
          },
          {
            type: "paragraph",
            text: "North Point Sales Group does not control and is not responsible for the privacy practices, security, content, or policies of third parties. We encourage you to review the privacy policies of any third-party website or service you choose to use.",
          },
        ],
      },
      {
        id: "childrens-privacy",
        number: "10",
        title: "Children's Privacy",
        blocks: [
          {
            type: "paragraph",
            text: "North Point Sales Group's website and services are intended for businesses and business professionals and are not directed toward children under the age of 13.",
          },
          {
            type: "paragraph",
            text: "We do not knowingly seek to collect personal information from children under 13 through this website. If we become aware that such information has been provided to us, we may take reasonable steps to delete it.",
          },
        ],
      },
      {
        id: "changes-to-this-privacy-policy",
        number: "11",
        title: "Changes to This Privacy Policy",
        blocks: [
          {
            type: "paragraph",
            text: "We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or business operations.",
          },
          {
            type: "paragraph",
            text: "When changes are made, the revised policy will be posted on this page with an updated effective date.",
          },
          {
            type: "paragraph",
            text: "Your continued use of the website after a revised Privacy Policy is posted constitutes acknowledgment of the updated policy.",
          },
        ],
      },
      {
        id: "contact-us",
        number: "12",
        title: "Contact Us",
        blocks: [
          {
            type: "paragraph",
            text: "Questions concerning this Privacy Policy or our privacy practices may be directed to:",
          },
          {
            type: "contact",
            company: "North Point Sales Group",
            email: "contact@northpointsalesgroup.com",
            phone: "(970) 250-1439",
          },
        ],
      },
    ],
  },

  termsOfUse: {
    title: "Terms of Use",
    badge: "Legal",
    hero: {
      image: {
        src: "/images/hero-image.svg",
        alt: "North Point Sales Group — Terms of Use",
      },
      subtitle:
        "Terms governing your access to and use of the North Point Sales Group website and related materials.",
    },
    intro: [
      "Welcome to NorthPointSalesGroup.com.",
      'These Terms of Use ("Terms") govern your access to and use of the North Point Sales Group website and the information, materials, resources, and other content made available through the website.',
      "By accessing or using this website, you agree to these Terms. If you do not agree with these Terms, please do not use the website.",
    ],
    sections: [
      {
        id: "website-purpose",
        number: "1",
        title: "Website Purpose",
        blocks: [
          {
            type: "paragraph",
            text: "North Point Sales Group provides sales-performance consulting, advisory, implementation, coaching, and related business services to organizations.",
          },
          {
            type: "paragraph",
            text: "The information presented on this website is intended to provide general information about North Point Sales Group, our approach, our services, and sales-performance concepts.",
          },
          {
            type: "paragraph",
            text: "Website content does not constitute a consulting engagement or create a client-consultant, fiduciary, employment, partnership, joint venture, or other professional relationship.",
          },
        ],
      },
      {
        id: "consulting-engagements",
        number: "2",
        title: "Consulting Engagements",
        blocks: [
          {
            type: "paragraph",
            text: "Any consulting or advisory services provided by North Point Sales Group are subject to a separate written engagement agreement or other written agreement between North Point Sales Group and the client.",
          },
          {
            type: "paragraph",
            text: "If there is any conflict between these Terms of Use and a written client engagement agreement, the provisions of the applicable engagement agreement will control with respect to that engagement.",
          },
          {
            type: "paragraph",
            text: "Website descriptions of services, processes, timeframes, pricing, deliverables, or potential results are general in nature and may vary depending upon the scope and circumstances of a particular engagement.",
          },
        ],
      },
      {
        id: "no-guarantee-of-results",
        number: "3",
        title: "No Guarantee of Results",
        blocks: [
          {
            type: "paragraph",
            text: "North Point Sales Group works with organizations to identify opportunities to strengthen sales leadership, systems, processes, execution, accountability, and overall sales performance.",
          },
          {
            type: "paragraph",
            text: "Business and sales results depend upon numerous factors, many of which are outside the control of North Point Sales Group.",
          },
          {
            type: "paragraph",
            text: "Accordingly, North Point Sales Group does not guarantee any particular increase in revenue, profit, sales, conversion rates, productivity, market share, business valuation, or other financial or operational result.",
          },
          {
            type: "paragraph",
            text: "Any examples, illustrations, projections, calculations, percentages, or discussions of potential improvements appearing on the website are provided for informational and illustrative purposes only. They should not be interpreted as a representation, promise, warranty, or guarantee that any particular organization will achieve similar results.",
          },
        ],
      },
      {
        id: "no-financial-legal-tax-or-investment-advice",
        number: "4",
        title: "No Financial, Legal, Tax, or Investment Advice",
        blocks: [
          {
            type: "paragraph",
            text: "Information provided on this website is related primarily to business and sales performance.",
          },
          {
            type: "paragraph",
            text: "Nothing on this website should be interpreted as legal, accounting, tax, investment, securities, or other regulated professional advice.",
          },
          {
            type: "paragraph",
            text: "Organizations should consult qualified professionals regarding matters requiring specialized professional advice.",
          },
        ],
      },
      {
        id: "accuracy-of-website-information",
        number: "5",
        title: "Accuracy of Website Information",
        blocks: [
          {
            type: "paragraph",
            text: "We seek to provide useful and accurate information. However, business conditions, research, statistics, third-party information, services, pricing, and other information may change.",
          },
          {
            type: "paragraph",
            text: "North Point Sales Group does not warrant that all website information will always be complete, current, error-free, or applicable to every organization.",
          },
          {
            type: "paragraph",
            text: "We reserve the right to modify, update, correct, add, or remove website content at any time without prior notice.",
          },
        ],
      },
      {
        id: "intellectual-property",
        number: "6",
        title: "Intellectual Property",
        blocks: [
          {
            type: "paragraph",
            text: "Unless otherwise indicated, the website and its original content, including text, graphics, presentations, methodologies, concepts, design elements, videos, audio recordings, documents, logos, branding, and other materials, are owned by or licensed to North Point Sales Group and are protected by applicable intellectual-property laws.",
          },
          {
            type: "paragraph",
            text: "This includes proprietary North Point Sales Group terminology, methodologies, frameworks, and materials, including where applicable the Sales Performance Components™ and related materials.",
          },
          {
            type: "paragraph",
            text: "You may view and use publicly available website content for your own legitimate internal business evaluation and informational purposes.",
          },
          {
            type: "paragraph",
            text: "You may not, without prior written permission:",
          },
          {
            type: "list",
            items: [
              "Reproduce substantial portions of the website",
              "Republish or commercially distribute website materials",
              "Sell or sublicense website content",
              "Modify materials and present them as your own",
              "Copy proprietary methodologies, assessments, frameworks, training materials, presentations, or consulting materials",
              "Use North Point Sales Group branding in a manner suggesting authorization, sponsorship, endorsement, or affiliation without permission",
            ],
          },
          {
            type: "paragraph",
            text: "Nothing contained on this website grants any license or ownership interest in North Point Sales Group intellectual property except as expressly stated.",
          },
        ],
      },
      {
        id: "acceptable-use",
        number: "7",
        title: "Acceptable Use",
        blocks: [
          {
            type: "paragraph",
            text: "You agree not to use the website:",
          },
          {
            type: "list",
            items: [
              "For any unlawful or fraudulent purpose",
              "To attempt unauthorized access to the website, servers, databases, systems, or accounts",
              "To introduce viruses, malware, malicious code, or other harmful technology",
              "To interfere with the operation or security of the website",
              "To collect information from the website through unauthorized automated means",
              "To impersonate another person or organization",
              "To submit false, misleading, abusive, defamatory, or unlawful information",
              "In any manner that violates applicable law or the rights of North Point Sales Group or another party",
            ],
          },
        ],
      },
      {
        id: "third-party-information-and-links",
        number: "8",
        title: "Third-Party Information and Links",
        blocks: [
          {
            type: "paragraph",
            text: "The website may refer to third-party research, statistics, publications, companies, websites, tools, technologies, or other resources.",
          },
          {
            type: "paragraph",
            text: "Such references are provided for informational purposes and do not necessarily constitute an endorsement, sponsorship, partnership, or affiliation.",
          },
          {
            type: "paragraph",
            text: "North Point Sales Group is not responsible for the availability, accuracy, security, content, products, services, or practices of third-party websites or services.",
          },
          {
            type: "paragraph",
            text: "Your use of third-party websites and services is subject to the terms and policies established by those third parties.",
          },
        ],
      },
      {
        id: "testimonials-examples-and-case-information",
        number: "9",
        title: "Testimonials, Examples, and Case Information",
        blocks: [
          {
            type: "paragraph",
            text: "If testimonials, client experiences, examples, case studies, or performance information are presented on the website, they represent the experiences or circumstances described and should not be considered a guarantee that another organization will obtain the same or similar results.",
          },
          {
            type: "paragraph",
            text: "Individual business outcomes vary according to factors including organizational circumstances, market conditions, leadership decisions, execution, personnel, available resources, competitive conditions, and other factors.",
          },
        ],
      },
      {
        id: "website-availability",
        number: "10",
        title: "Website Availability",
        blocks: [
          {
            type: "paragraph",
            text: "We may modify, suspend, restrict, or discontinue any portion of the website at any time.",
          },
          {
            type: "paragraph",
            text: "We do not guarantee that the website will always be available, uninterrupted, secure, or free from technical errors.",
          },
        ],
      },
      {
        id: "disclaimer-of-warranties",
        number: "11",
        title: "Disclaimer of Warranties",
        blocks: [
          {
            type: "paragraph",
            text: 'To the fullest extent permitted by applicable law, this website and its content are provided on an "as is" and "as available" basis.',
          },
          {
            type: "paragraph",
            text: "North Point Sales Group disclaims warranties of any kind, whether express or implied, regarding the website or its content, including implied warranties of merchantability, fitness for a particular purpose, accuracy, non-infringement, or uninterrupted availability.",
          },
          {
            type: "paragraph",
            text: "Nothing in this provision limits any rights that cannot lawfully be waived or excluded.",
          },
        ],
      },
      {
        id: "limitation-of-liability",
        number: "12",
        title: "Limitation of Liability",
        blocks: [
          {
            type: "paragraph",
            text: "To the fullest extent permitted by applicable law, North Point Sales Group and its owners, officers, employees, contractors, representatives, affiliates, and agents will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or relating to your access to, use of, or inability to use this website or your reliance upon information presented on the website.",
          },
          {
            type: "paragraph",
            text: "This limitation applies regardless of the legal theory asserted and even if the possibility of such damages has been communicated.",
          },
          {
            type: "paragraph",
            text: "Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited.",
          },
        ],
      },
      {
        id: "indemnification",
        number: "13",
        title: "Indemnification",
        blocks: [
          {
            type: "paragraph",
            text: "To the extent permitted by applicable law, you agree to indemnify and hold harmless North Point Sales Group and its owners, officers, employees, contractors, representatives, affiliates, and agents from claims, damages, liabilities, costs, and expenses arising from your unlawful use of the website, your violation of these Terms, or your infringement of the rights of another party.",
          },
        ],
      },
      {
        id: "privacy",
        number: "14",
        title: "Privacy",
        blocks: [
          {
            type: "paragraph",
            text: "Your use of the website is also subject to our Privacy Policy.",
          },
          {
            type: "internalLink",
            before: "Please review the ",
            label: "Privacy Policy",
            href: "/privacy-policy",
            after:
              " for information concerning how we may collect, use, disclose, and protect information.",
          },
        ],
      },
      {
        id: "governing-law",
        number: "15",
        title: "Governing Law",
        blocks: [
          {
            type: "paragraph",
            text: "These Terms and your use of this website will be governed by the laws of the State of Colorado, without regard to conflict-of-law principles, except where applicable law requires otherwise.",
          },
          {
            type: "paragraph",
            text: "Any dispute relating specifically to use of this website will be subject to the jurisdiction of the appropriate courts located in Colorado, unless otherwise required by applicable law or agreed to in writing.",
          },
          {
            type: "paragraph",
            text: "Consulting engagements may be subject to separate governing-law and dispute-resolution provisions contained in the applicable client agreement.",
          },
        ],
      },
      {
        id: "changes-to-these-terms",
        number: "16",
        title: "Changes to These Terms",
        blocks: [
          {
            type: "paragraph",
            text: "North Point Sales Group may revise these Terms periodically.",
          },
          {
            type: "paragraph",
            text: "Changes become effective when the revised Terms are posted on the website with an updated effective date.",
          },
          {
            type: "paragraph",
            text: "Your continued use of the website following the posting of revised Terms constitutes acceptance of the revised Terms.",
          },
        ],
      },
      {
        id: "severability",
        number: "17",
        title: "Severability",
        blocks: [
          {
            type: "paragraph",
            text: "If any provision of these Terms is determined to be invalid, unlawful, or unenforceable, the remaining provisions will continue in full force and effect to the extent permitted by law.",
          },
        ],
      },
      {
        id: "entire-agreement-regarding-website-use",
        number: "18",
        title: "Entire Agreement Regarding Website Use",
        blocks: [
          {
            type: "paragraph",
            text: "These Terms, together with the Privacy Policy, constitute the agreement between you and North Point Sales Group concerning your use of this website.",
          },
          {
            type: "paragraph",
            text: "They do not replace or modify a separate written engagement agreement entered into between North Point Sales Group and a client.",
          },
        ],
      },
      {
        id: "contact-us",
        number: "19",
        title: "Contact Us",
        blocks: [
          {
            type: "paragraph",
            text: "Questions concerning these Terms may be directed to:",
          },
          {
            type: "contact",
            company: "North Point Sales Group",
            email: "contact@northpointsalesgroup.com",
            phone: "(970) 250-1439",
          },
        ],
      },
    ],
  },
} as const;

export type SiteNavItem = (typeof siteConfig.nav)[number];
