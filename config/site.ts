/** Static content: investment tier pop-outs, component KPIs, pillar theme KPIs (Section 4 & 7). */

/** Section 7 — investment tier pop-out content (replaces prior copy). */

const sharedSequenceHint =
  "Click to view the general day-by-day work sequence.";

const salesTeamPerformancePopout = {
  title: "SALES TEAM PERFORMANCE ENGAGEMENT",
  fee: "Professional Fee: Beginning at $7,500\nEngagement Period: 30 Days",
  intro:
    "This engagement focuses on improving the performance of your existing sales team. We work directly with sales leadership and selected salespeople to identify performance gaps, improve execution, and strengthen accountability.",
  includedHeading: "WHAT IS INCLUDED",
  expandableIncluded: true,
  groups: [
    {
      title: "1. Sales Team and Performance Assessment",
      items: [
        "Review the current sales-team structure, roles, responsibilities, and expectations.",
        "Review available sales-performance data and individual KPIs.",
        "Evaluate prospecting, qualification, presentations, follow-up, pipeline management, and closing practices.",
        "Identify individual and team performance gaps affecting sales results.",
        "Establish available starting baselines for measuring improvement.",
      ],
    },
    {
      title: "2. Sales Process Review",
      items: [
        "Review the sales process from lead receipt through closed sale.",
        "Identify breakdowns, inefficiencies, and missed opportunities.",
        "Evaluate how consistently salespeople follow the established process.",
        "Identify practical changes that could improve execution during the engagement.",
      ],
    },
    {
      title: "3. Individual Sales Performance Coaching",
      items: [
        "Provide direct one-on-one coaching with up to three selected salespeople.",
        "Address the specific performance issues identified during assessment.",
        "Work on prospecting, qualification, presentations, objection handling, follow-up, pipeline management, and closing, as applicable.",
        "Review available recorded sales conversations or conduct practice calls where appropriate.",
        "Provide practical direction and accountability throughout the engagement.",
        "Evaluate progress against each salesperson's starting baseline and appropriate KPIs.",
      ],
    },
    {
      title: "4. Sales Leadership Sessions",
      items: [
        "Work directly with sales leadership throughout the 30-day engagement.",
        "Review individual and team performance observations.",
        "Clarify expectations for sales activity, pipeline management, and results.",
        "Address management practices affecting sales execution.",
        "Help leadership reinforce coaching and follow through on agreed improvements.",
        "Identify whether the owner or executive needs additional sales management support and recommend next steps for establishing ongoing leadership.",
      ],
    },
    {
      title: "5. Performance Improvement Plan",
      items: [
        "Summarize the primary performance issues identified.",
        "Document coaching and improvement work completed.",
        "Review progress against established KPIs, where measurable during the engagement.",
        "Recommend continued development priorities for the salespeople coached.",
        "Establish leadership actions for maintaining expectations and accountability.",
        "Identify additional coaching, process work, or support that may be needed.",
      ],
    },
  ],
  deliverableHeading: "ENGAGEMENT DELIVERABLES",
  deliverableIntro: "At the conclusion of the engagement, leadership receives:",
  deliverableItems: [
    "A summary of performance findings and work completed.",
    "Individual recommendations for the salespeople directly coached.",
    "Progress against established KPIs, where measurable.",
    "A practical plan for continued sales-team improvement.",
    "Recommendations for maintaining coaching and accountability.",
  ],
  parametersHeading: "ENGAGEMENT PARAMETERS",
  parametersParagraphs: [
    "The starting fee covers a focused 30-day engagement, including one-on-one work with up to three selected salespeople. Companies with larger sales teams may participate by selecting representatives for direct coaching.",
    "Additional coaching, a broader scope, or work beyond the initial 30 days can be arranged separately. Any additional fees are agreed upon in advance.",
  ],
  upgradeHeading: "UPGRADE CREDIT",
  upgradeParagraphs: [
    "If you move directly into a Full Sales Performance Implementation, the professional fee paid for this engagement will be credited toward the implementation fee.",
  ],
  sequenceInNestedPopup: true,
  sequenceHeading: "30-DAY SALES TEAM PERFORMANCE ENGAGEMENT WORK SEQUENCE",
  sequenceLinkHint: sharedSequenceHint,
} as const;

const focusedSalesPerformancePopout = {
  title: "30-DAY FOCUSED SALES PERFORMANCE ENGAGEMENT",
  fee: "Investment: $9,500\nEngagement Period: 30 Days",
  intro:
    "This engagement includes everything provided in our $7,500 Sales Team Performance Engagement, together with a broader examination of the organization's sales operations, leadership, systems, and opportunities for improvement.",
  includedHeading: "WHAT THE ENGAGEMENT INCLUDES",
  expandableIncluded: false,
  groups: [
    {
      title: "",
      numbered: true,
      items: [
        "Executive discovery and identification of organizational priorities.",
        "Individual assessment and coaching of up to three sales or account representatives.",
        "Evaluation of sales presentations, objection handling, follow-up practices, and closing techniques.",
        "Sales manager participation, coaching, and reinforcement of representative improvements.",
        "Broader review of sales processes, CRM utilization, and pipeline management.",
        "Evaluation of lead generation, qualification, and conversion practices.",
        "Review of selected sales performance measurements and KPIs.",
        "Identification of sales leadership and accountability improvements.",
        "Prioritized recommendations and an implementation roadmap.",
        "Final management review of findings, recommended actions, and next steps.",
      ],
    },
  ],
  deliverableHeading: "ENGAGEMENT DELIVERABLES",
  deliverableIntro:
    "Leadership receives an executive presentation and implementation roadmap covering:",
  deliverableItems: [
    "Sales-performance findings.",
    "The most significant improvement opportunities.",
    "Recommended priorities and actions.",
    "Proposed responsibilities and implementation sequence.",
    "Required resources and potential outside support.",
    "Recommended KPIs and available starting baselines.",
  ],
  parametersHeading: "ENGAGEMENT PARAMETERS",
  parametersParagraphs: [
    "The starting fee covers a focused 30-day assessment, analysis, executive recommendations, and implementation roadmap. A substantially broader scope or deeper analysis may require an adjusted fee, agreed upon in advance.",
    "The engagement is designed to be completed within 30 days, subject to timely client participation and access to necessary information.",
    "Broader organizational implementation beyond the agreed engagement scope is not included.",
    "Third-party expenses—including software, advertising, website development, and specialized technical services—are separate and require client approval.",
  ],
  differencesHeading: "HOW THIS DIFFERS FROM THE $7,500 ENGAGEMENT",
  differencesParagraphs: [
    "The $7,500 engagement focuses on direct improvement of selected salespeople's execution. This engagement includes that work and examines the broader sales operation, leadership, systems, and opportunities for improvement, then establishes the priorities and roadmap for implementation.",
  ],
  upgradeHeading: "UPGRADE CREDIT",
  upgradeParagraphs: [
    "If you move directly into a Full Sales Performance Implementation, the professional fee paid for this engagement will be credited toward the implementation fee.",
  ],
  sequenceInNestedPopup: true,
  sequenceHeading: "30-DAY WORK SEQUENCE",
  sequenceLinkHint: sharedSequenceHint,
} as const;

const fullSalesPerformancePopout = {
  title: "FULL SALES PERFORMANCE IMPLEMENTATION",
  fee: "Professional Fee: $50,000–$150,000+\nImplementation Period: 30–90 Days",
  intro:
    "This engagement combines assessment with hands-on implementation across the areas of your sales organization requiring improvement.\n\nWe work directly with leadership and sales personnel to identify opportunities, implement agreed-upon changes, establish KPIs and accountability, and refine the approach as results become available.",
  includedHeading: "WHAT IS INCLUDED",
  expandableIncluded: true,
  groups: [
    {
      title: "1. Executive Discovery and Leadership Assessment",
      items: [
        "Discuss sales objectives, challenges, expectations, and current performance.",
        "Review sales leadership responsibilities and management practices.",
        "Identify leadership concerns and organizational constraints affecting results.",
        "Review how expectations are communicated and commitments are followed through.",
        "Establish the initial areas requiring examination.",
      ],
    },
    {
      title: "2. Sales Team and Individual Performance Assessment",
      items: [
        "Review sales-team structure, roles, responsibilities, and expectations.",
        "Review available individual and team performance data.",
        "Assess prospecting, qualification, presentations, follow-up, pipeline management, and closing practices.",
        "Identify skill gaps, inconsistent execution, and barriers to productivity.",
        "Identify effective practices that should be maintained or reinforced.",
        "Establish available starting baselines for measuring progress.",
      ],
    },
    {
      title: "3. Sales Process and Operations Review",
      items: [
        "Review the sales process from prospecting or lead receipt through closed sale and account development.",
        "Examine sales procedures, responsibilities, and handoffs.",
        "Review CRM utilization, reporting, pipeline management, and forecasting.",
        "Identify process breakdowns, inefficiencies, and missed opportunities.",
        "Examine existing KPIs and accountability practices.",
        "Review compensation, incentives, recruiting, onboarding, training, and customer retention where relevant.",
      ],
      outro:
        "Areas presenting greater potential impact receive greater attention.",
    },
    {
      title: "4. Lead Generation and Sales Conversion",
      intro: "Where applicable:",
      items: [
        "Review leads generated through website activity, advertising, social media, referrals, outbound prospecting, and other sources.",
        "Improve lead assignment, response, qualification, and follow-up procedures.",
        "Address breakdowns between lead generation and sales execution.",
        "Improve how opportunities move from inquiry to qualified opportunity and customer.",
        "Establish appropriate KPIs for lead quality, response, conversion, and sales results.",
        "Coordinate approved changes requiring outside marketing or technical specialists.",
      ],
    },
    {
      title: "5. Findings, Priorities, and Implementation Roadmap",
      items: [
        "Identify what is working and should be maintained.",
        "Identify where opportunities are being lost.",
        "Establish the performance issues requiring priority attention.",
        "Agree with leadership on recommended changes.",
        "Define the implementation sequence and responsibilities.",
        "Identify required resources and outside specialists.",
        "Establish appropriate KPIs and available starting baselines.",
        "Clarify which activities fall within the agreed engagement scope.",
      ],
    },
    {
      title: "6. Sales Performance Implementation",
      intro: "Depending on the agreed scope:",
      items: [
        "Improve prospecting and lead-development practices.",
        "Strengthen qualification, sales presentations, objection handling, follow-up, and closing.",
        "Provide direct coaching to selected salespeople.",
        "Strengthen sales leadership, coaching, and performance management.",
        "Improve sales processes, responsibilities, assignments, and workflows.",
        "Strengthen pipeline management and forecasting.",
        "Improve CRM procedures, usage expectations, and reporting.",
        "Establish structured sales meetings and accountability procedures.",
        "Improve compensation, recruiting, onboarding, training, or customer development practices where required.",
        "Coordinate implementation across affected areas.",
      ],
    },
    {
      title: "7. Establishing or Transitioning Sales Leadership",
      intro:
        "When needed, we help define the sales leadership role, recruit and evaluate candidates, and onboard and train a new sales manager. We can also help transition day-to-day sales leadership responsibilities from the owner or an existing manager to the designated sales leader.",
      outro:
        "These services are included when specified in the agreed engagement scope.",
    },
    {
      title: "8. AI Sales Integration",
      intro: "Where appropriate:",
      items: [
        "Evaluate whether AI could improve productivity, reduce administrative work, or create additional sales opportunities.",
        "Examine potential applications in lead generation, lead qualification, CRM efficiency, follow-up, forecasting, and performance monitoring.",
        "Review compatibility with existing systems and available data.",
        "Evaluate potential financial benefits against implementation and ongoing costs.",
        "Help identify suitable technology providers and qualified specialists.",
        "Coordinate and oversee approved implementation within the agreed scope.",
        "Establish appropriate KPIs for evaluating effectiveness.",
      ],
      outro:
        "Third-party software and technical implementation expenses are separately identified and require client approval. Work outside the agreed engagement scope is quoted separately.",
    },
    {
      title: "9. KPI Measurement and Accountability",
      items: [
        "Establish KPIs relevant to the agreed improvement priorities.",
        "Document available starting baselines.",
        "Clarify performance expectations and responsibilities.",
        "Establish reporting dashboards and review procedures as appropriate.",
        "Compare results with baselines and agreed objectives.",
        "Investigate performance gaps, inconsistent records, and missed commitments.",
        "Adjust activities and priorities as evidence becomes available.",
      ],
    },
    {
      title: "10. Implementation Support and Reinforcement",
      items: [
        "Work with leadership and sales personnel throughout the implementation period.",
        "Address obstacles affecting progress.",
        "Review whether new procedures are being followed.",
        "Reinforce coaching, expectations, and accountability.",
        "Refine changes that are not producing the expected improvement.",
        "Establish internal ownership of implemented practices.",
        "Recommend next steps for maintaining progress after the engagement.",
      ],
    },
  ],
  deliverableHeading: "ENGAGEMENT DELIVERABLES",
  deliverableIntro: "Leadership receives:",
  deliverableItems: [
    "Sales-performance findings and agreed improvement priorities.",
    "An implementation roadmap with responsibilities and required resources.",
    "Agreed-upon improvements put into operation.",
    "KPI reporting showing progress against established baselines, where measurable.",
    "A closing review of work completed, results observed, remaining priorities, and recommended next steps.",
  ],
  implementationPeriodHeading: "IMPLEMENTATION PERIOD",
  implementationPeriodParagraphs: [
    "Approximately 30 Days\nFocused changes that can be implemented within a concentrated period, with limited complexity and a defined number of priorities.",
    "Approximately 60–90 Days\nBroader implementation involving multiple performance areas, teams, management levels, locations, or systems, with additional time for coaching, measurement, and refinement.\n\nSome revenue results may take longer to become evident, depending on the company's sales cycle.",
  ],
  parametersHeading: "HOW THE PROFESSIONAL FEE IS DETERMINED",
  parametersParagraphs: [
    "The $50,000–$150,000+ fee reflects:",
    "Number of salespeople and managers involved.\nNumber of locations, divisions, markets, or sales channels.\nNumber and depth of performance areas requiring improvement.\nComplexity of existing processes and systems.\nAmount of individual coaching and implementation required.\nMeasurement and reporting requirements.\nEngagement duration and NORTH POINT SALES GROUP resources needed.",
    "A higher fee does not automatically require a longer engagement. Scope, professional fee, and implementation period are established before work begins.",
  ],
  differencesHeading: "HOW THIS DIFFERS FROM THE OTHER ENGAGEMENTS",
  differencesParagraphs: [
    "Sales Team Performance — Beginning at $7,500: Direct improvement of selected salespeople's execution within a focused 30-day engagement.",
    "30-Day Focused Sales Performance — Beginning at $9,500: Broader assessment, executive recommendations, and an implementation roadmap.",
    "Full Sales Performance Implementation — $50,000–$150,000+: Assessment and hands-on implementation across the agreed areas, with coaching, KPI measurement, accountability, and refinement.",
  ],
  upgradeHeading: "UPGRADE CREDIT",
  upgradeParagraphs: [
    "If you move directly from either introductory engagement into Full Sales Performance Implementation, the professional fee paid for that engagement will be credited toward the implementation fee.",
  ],
  thirdPartyHeading: "THIRD-PARTY COSTS AND ADDITIONAL SERVICES",
  thirdPartyParagraphs: [
    "Third-party expenses—including software, advertising, website development, and specialized technical services—are separate from our professional fee and require client approval.",
    "Services beyond the agreed scope or implementation period can be arranged separately.",
  ],
  sequenceInNestedPopup: true,
  sequenceHeading: "30–90 DAY WORK SEQUENCE",
  sequenceLinkHint: sharedSequenceHint,
} as const;

export const componentKpisIntro = [
  "Below are example KPIs for this component. Not every KPI needs to be actively monitored for every client.",
  "For each selected KPI, we will establish your current baseline, target, and reporting schedule.",
] as const;

export const salesComponentKpis = {
  1: [
    {
      title: "Sales Target Attainment",
      detail:
        "Measures actual sales against the established sales target. Divide actual sales by the target and multiply by 100. Track this for the team and individual salespeople.",
    },
    {
      title: "Salespeople Meeting Target",
      detail:
        "Measures the percentage of salespeople reaching their individual sales targets. This helps show whether results are broadly supported or depend heavily on a few people.",
    },
    {
      title: "Coaching Sessions Completed",
      detail:
        "Measures the percentage of scheduled individual coaching sessions that actually occur. Count sessions that include a performance discussion, specific guidance, and agreed next steps.",
    },
    {
      title: "Coaching Actions Completed",
      detail:
        "Measures the percentage of actions agreed upon during coaching that are completed by their deadlines. This helps determine whether coaching produces follow-through.",
    },
    {
      title: "Performance Reviews Completed",
      detail:
        "Measures the percentage of scheduled individual performance reviews completed on time. Reviews should compare actual performance with expectations and identify needed action.",
    },
    {
      title: "Sales Meetings Completed",
      detail:
        "Measures the percentage of planned sales meetings held as scheduled. Review meeting quality separately to determine whether those meetings support decisions and execution.",
    },
    {
      title: "Management Response Time",
      detail:
        "Measures the average time a sales manager takes to respond to a request requiring management support. Define the types of requests and when the response clock starts and stops.",
    },
    {
      title: "Management Commitments Completed",
      detail:
        "Measures the percentage of management commitments completed by their agreed deadlines. Examples include resolving pricing questions, arranging support, or removing obstacles affecting sales.",
    },
    {
      title: "Sales Team Turnover",
      detail:
        "Measures salespeople leaving during a period as a percentage of average sales headcount. Review voluntary departures and company-initiated departures separately to understand the causes.",
    },
    {
      title: "Improvement Plan Results",
      detail:
        "Measures the percentage of salespeople on formal improvement plans who reach the agreed performance standard by the deadline. Evaluate results against the specific expectations documented in each plan.",
    },
  ],
  2: [
    {
      title: "Sales Process Compliance",
      detail:
        "Measures the percentage of reviewed opportunities that follow the required sales process. Check whether necessary steps were completed before an opportunity moved forward.",
    },
    {
      title: "Average Sales-Cycle Length",
      detail:
        "Measures the average number of days from an agreed starting point to a completed sale. Use the same starting point consistently, such as the date an opportunity becomes qualified.",
    },
    {
      title: "Stage Conversion Rate",
      detail:
        "Measures the percentage of opportunities moving from one sales stage to the next. Review each transition separately to identify where opportunities are being lost.",
    },
    {
      title: "On-Time Follow-Up",
      detail:
        "Measures the percentage of scheduled follow-ups completed by their due dates. This helps identify whether opportunities receive attention when promised.",
    },
    {
      title: "Lead Assignment Time",
      detail:
        "Measures the average time between receiving a lead and assigning it to the responsible salesperson. Delays can leave interested prospects waiting without a clear owner.",
    },
    {
      title: "Sales Handoff Accuracy",
      detail:
        "Measures the percentage of transfers between people or departments that include all required information. Examples include handing a lead to sales or a completed sale to service.",
    },
    {
      title: "Proposal Turnaround Time",
      detail:
        "Measures the average time between receiving the information needed for a proposal and delivering it to the prospect. Review avoidable approval and preparation delays.",
    },
    {
      title: "Pricing Approval Time",
      detail:
        "Measures the average time required to approve pricing or discount requests. This helps identify whether internal decisions are delaying otherwise active opportunities.",
    },
    {
      title: "Sales Order Accuracy",
      detail:
        "Measures the percentage of submitted sales orders requiring no correction. Errors may involve pricing, product selection, quantities, customer details, or agreed terms.",
    },
    {
      title: "Selling Time",
      detail:
        "Measures the percentage of salespeople’s working time spent on defined selling activities. Agree on which activities count, then examine administrative work that reduces selling capacity.",
    },
  ],
  3: [
    {
      title: "Sales Revenue",
      detail:
        "Measures the sales revenue credited to a salesperson or team during the reporting period. Use a consistent basis, such as booked sales or recognized revenue.",
    },
    {
      title: "Sales Target Attainment",
      detail:
        "Measures actual sales as a percentage of the established target. This shows how close each salesperson or team is to meeting expectations.",
    },
    {
      title: "Salespeople Meeting Target",
      detail:
        "Measures the percentage of salespeople who achieve their assigned targets. It helps distinguish consistent team performance from results concentrated among a few top producers.",
    },
    {
      title: "Opportunity Win Rate",
      detail:
        "Measures the percentage of decided opportunities that become sales. Divide opportunities won by opportunities won plus opportunities lost, and multiply by 100.",
    },
    {
      title: "Average Sale Value",
      detail:
        "Measures the average value of completed sales. Divide total sales value by the number of sales completed during the same period.",
    },
    {
      title: "Profit Contribution",
      detail:
        "Measures sales revenue remaining after the costs included in the company’s agreed contribution calculation. Use a consistent cost definition to avoid overstating performance.",
    },
    {
      title: "Sales Revenue per Salesperson",
      detail:
        "Measures team sales revenue divided by average sales headcount during the period. This provides a broad view of sales productivity.",
    },
    {
      title: "Sales Completed",
      detail:
        "Measures the number of completed sales during the reporting period. Review alongside sale value and profit contribution so volume alone does not determine success.",
    },
    {
      title: "New Customers Acquired",
      detail:
        "Measures the number of first-time customers won during the period. Define when a prospect officially becomes a customer, such as upon an accepted order or signed contract.",
    },
    {
      title: "Sales Target Consistency",
      detail:
        "Measures the percentage of reporting periods in which a salesperson or team meets the sales target. This helps evaluate the reliability of performance over time.",
    },
  ],
  4: [
    {
      title: "Prospecting Activity Completed",
      detail:
        "Measures the number of prospecting activities completed, such as calls, emails, or other approved outreach. Review alongside resulting conversations and opportunities to evaluate effectiveness.",
    },
    {
      title: "Prospect Contact Rate",
      detail:
        "Measures the percentage of outreach attempts that produce a conversation with an intended contact. Define which contacts and types of conversations qualify.",
    },
    {
      title: "Decision-Maker Conversations",
      detail:
        "Measures the number of conversations with people who can authorize or meaningfully influence a purchase. This helps distinguish productive contact from general activity.",
    },
    {
      title: "Qualified Leads Generated",
      detail:
        "Measures the number of leads meeting the company’s agreed qualification requirements. Those requirements should reflect fit and a credible potential need.",
    },
    {
      title: "Lead Qualification Rate",
      detail:
        "Measures the percentage of reviewed leads that meet the qualification requirements. This helps evaluate whether prospecting reaches suitable companies and contacts.",
    },
    {
      title: "Appointments Scheduled",
      detail:
        "Measures the number of sales appointments arranged with prospective customers. Count appointments that meet the company’s minimum requirements for a useful sales discussion.",
    },
    {
      title: "Conversation-to-Appointment Rate",
      detail:
        "Measures the percentage of prospect conversations that result in a scheduled appointment. This can help evaluate targeting, opening statements, and the relevance of the offer.",
    },
    {
      title: "Appointment Attendance Rate",
      detail:
        "Measures the percentage of appointments due to occur that actually take place. Track cancellations and no-shows separately to understand why meetings are missed.",
    },
    {
      title: "Lead-to-Opportunity Conversion",
      detail:
        "Measures the percentage of leads that become qualified sales opportunities. Use clear requirements for when a lead has progressed far enough to enter the pipeline.",
    },
    {
      title: "New Lead Response Time",
      detail:
        "Measures the time between receiving a new inquiry and making the first meaningful response. Review whether delays are affecting the ability to engage interested prospects.",
    },
  ],
  5: [
    {
      title: "Presentations Completed",
      detail:
        "Measures the number of sales presentations delivered to prospective customers. Define what qualifies as a presentation so routine conversations are not counted inconsistently.",
    },
    {
      title: "Decision-Maker Participation",
      detail:
        "Measures the percentage of presentations attended by a person with purchasing authority. This helps identify whether presentations are reaching the people needed to advance a decision.",
    },
    {
      title: "Presentation Quality Score",
      detail:
        "Measures presentation performance against an agreed scoring checklist. Review areas such as preparation, questioning, explanation of value, objection handling, and requests for a next step.",
    },
    {
      title: "Needs Confirmation Rate",
      detail:
        "Measures the percentage of reviewed presentations in which the salesperson confirms the prospect’s needs and priorities. Use call recordings or documented reviews to verify completion.",
    },
    {
      title: "Agreed Next-Step Rate",
      detail:
        "Measures the percentage of presentations ending with a specific next action accepted by the prospect. A useful next step identifies what will happen, who is responsible, and when.",
    },
    {
      title: "Presentation-to-Proposal Conversion",
      detail:
        "Measures the percentage of presentations that lead to a proposal. Review whether proposals represent real buying interest and appropriate qualification.",
    },
    {
      title: "Presentation-to-Sale Conversion",
      detail:
        "Measures the percentage of presentations that eventually produce a sale. Follow the same group of presentations through a defined period so the comparison is meaningful.",
    },
    {
      title: "Proposal-to-Sale Conversion",
      detail:
        "Measures the percentage of decided proposals that result in sales. Review unsuccessful proposals to identify issues involving value, fit, pricing, authority, or timing.",
    },
    {
      title: "Objection Resolution Rate",
      detail:
        "Measures the percentage of documented objections that prospects confirm have been satisfactorily addressed. An answered objection should not be considered resolved solely because the salesperson provided a response.",
    },
    {
      title: "Presentation-to-Decision Time",
      detail:
        "Measures the average time from a presentation to a recorded buying decision. Review lengthy delays to identify unclear next steps, missing decision-makers, or unresolved concerns.",
    },
  ],
  6: [
    {
      title: "Qualified Pipeline Value",
      detail:
        "Measures the total potential sales value of open opportunities meeting the qualification requirements. Remove opportunities that no longer represent credible potential business.",
    },
    {
      title: "Pipeline Coverage",
      detail:
        "Compares qualified pipeline value expected to close during a period with the remaining sales target for that period. Divide pipeline value by the remaining target to express coverage as a multiple.",
    },
    {
      title: "Opportunity Win Rate",
      detail:
        "Measures opportunities won as a percentage of all opportunities decided during the period. Review by salesperson, opportunity source, or customer type when useful.",
    },
    {
      title: "Stage Conversion Rate",
      detail:
        "Measures the percentage of opportunities progressing between pipeline stages. It helps locate points where deals repeatedly stop advancing.",
    },
    {
      title: "Time in Stage",
      detail:
        "Measures how long opportunities remain in each pipeline stage. Compare actual time with reasonable expectations for that type of sale.",
    },
    {
      title: "Stalled Opportunities",
      detail:
        "Measures the percentage of open opportunities without meaningful progress beyond an agreed time limit. Define progress as a substantive customer action or confirmed development.",
    },
    {
      title: "Documented Next Steps",
      detail:
        "Measures the percentage of open opportunities with a specific next action, responsible person, and due date. This supports active opportunity management.",
    },
    {
      title: "Overdue Opportunity Follow-Up",
      detail:
        "Measures the percentage of open opportunities with follow-up past its due date. Review whether overdue work reflects missed activity, poor scheduling, or incomplete records.",
    },
    {
      title: "Closing-Date Changes",
      detail:
        "Measures the percentage of opportunities whose expected closing dates are pushed beyond the original reporting period. Repeated changes can indicate weak qualification or unrealistic forecasting.",
    },
    {
      title: "Forecast Accuracy",
      detail:
        "Measures the difference between forecasted and actual sales for the same period. Show the amount and whether the forecast was too high or too low; use a consistent method for percentage comparisons.",
    },
  ],
  7: [
    {
      title: "Required Information Completion",
      detail:
        "Measures the percentage of reviewed CRM records containing all required information. Required fields should support sales execution, reporting, or customer service.",
    },
    {
      title: "CRM Data Accuracy",
      detail:
        "Measures the percentage of reviewed entries verified as correct. Compare CRM information with appropriate source records, communications, or confirmed customer details.",
    },
    {
      title: "Activity Recording Compliance",
      detail:
        "Measures the percentage of required sales activities entered into the CRM. Verify against available activity records to distinguish unrecorded work from work that was never completed.",
    },
    {
      title: "Timely Activity Recording",
      detail:
        "Measures the percentage of activities entered within the company’s required timeframe. Prompt recording helps keep follow-up and reporting current.",
    },
    {
      title: "Opportunity Update Compliance",
      detail:
        "Measures the percentage of open opportunities reviewed and updated on schedule. Updates should reflect current customer information and actual progress.",
    },
    {
      title: "Documented Next Steps",
      detail:
        "Measures the percentage of open opportunities containing a specific next action and due date. This makes it easier to see what should happen next.",
    },
    {
      title: "Overdue CRM Tasks",
      detail:
        "Measures the percentage of CRM tasks past their due dates. Review whether tasks were missed, completed without being recorded, or left open unnecessarily.",
    },
    {
      title: "Duplicate Records",
      detail:
        "Measures the percentage of reviewed records identified as duplicates. Duplicate customer, contact, or opportunity records can distort reports and create conflicting follow-up.",
    },
    {
      title: "Sales Stage Accuracy",
      detail:
        "Measures the percentage of reviewed opportunities assigned to the correct sales stage. Check whether the evidence required for that stage is present.",
    },
    {
      title: "CRM Usage Compliance",
      detail:
        "Measures the percentage of salespeople completing their required CRM responsibilities during the period. Evaluate meaningful required actions rather than logins alone.",
    },
  ],
  8: [
    {
      title: "KPI Definition Completion",
      detail:
        "Measures the percentage of selected KPIs with a documented definition and calculation. Each should specify what is counted, what is excluded, and the reporting period.",
    },
    {
      title: "Baseline Completion",
      detail:
        "Measures the percentage of selected KPIs with a verified starting result. Identify the period used and any limitations affecting the baseline.",
    },
    {
      title: "Target Completion",
      detail:
        "Measures the percentage of selected KPIs with a documented target and deadline. Targets should relate to the improvement the organization is trying to achieve.",
    },
    {
      title: "Reporting Ownership Assigned",
      detail:
        "Measures the percentage of selected KPIs with a named person responsible for producing the report. Clear ownership reduces missing or inconsistent reporting.",
    },
    {
      title: "On-Time KPI Reporting",
      detail:
        "Measures the percentage of required KPI reports delivered by their deadlines. Timely reporting supports decisions while there is still time to act.",
    },
    {
      title: "Reporting Accuracy",
      detail:
        "Measures the percentage of reviewed reported figures verified as correct. Check source information, calculations, and reporting-period consistency.",
    },
    {
      title: "Data Availability",
      detail:
        "Measures the percentage of selected KPIs that can be calculated from available information. Missing information may require changes to recording practices or systems.",
    },
    {
      title: "Performance Reviews Completed",
      detail:
        "Measures the percentage of scheduled KPI review meetings actually completed. Reviews should identify relevant changes and determine whether action is needed.",
    },
    {
      title: "Corrective Actions Assigned",
      detail:
        "Measures the percentage of performance issues requiring action that receive a documented action, owner, and deadline. Agree on what constitutes an issue requiring intervention.",
    },
    {
      title: "Corrective Actions Completed",
      detail:
        "Measures the percentage of corrective actions completed by their deadlines. Review subsequent KPI results separately to determine whether those actions worked.",
    },
  ],
  9: [
    {
      title: "Sales Compensation as a Percentage of Revenue",
      detail:
        "Measures total sales compensation divided by sales revenue, multiplied by 100. Define consistently whether compensation includes salary, commissions, bonuses, and benefits.",
    },
    {
      title: "Sales Compensation as a Percentage of Gross Profit",
      detail:
        "Measures sales compensation relative to gross profit generated. This helps evaluate compensation costs in relation to the profit available to support them.",
    },
    {
      title: "Profit Contribution After Sales Compensation",
      detail:
        "Measures the contribution remaining after deducting sales compensation and other costs included in the agreed calculation. Avoid deducting the same expense twice.",
    },
    {
      title: "Incentive Qualification Rate",
      detail:
        "Measures the percentage of eligible salespeople meeting the requirements for an incentive. Review whether the requirements encourage the intended performance.",
    },
    {
      title: "Incentive-Linked Sales",
      detail:
        "Measures sales generated from products, services, or activities specifically covered by an incentive. An increase alone does not establish that the incentive caused it.",
    },
    {
      title: "Minimum Profit Compliance",
      detail:
        "Measures the percentage of incentive-eligible sales meeting the company’s minimum profit requirements. This helps identify whether incentives reward sales that deliver acceptable financial value.",
    },
    {
      title: "Discounting on Incentive-Eligible Sales",
      detail:
        "Measures discounts on sales covered by an incentive, using a consistent comparison with standard pricing. Review whether discounting is reducing the value of the additional sales.",
    },
    {
      title: "Compensation Calculation Accuracy",
      detail:
        "Measures the percentage of reviewed commission and bonus calculations requiring no correction. Errors can affect trust, administration, and compensation expense.",
    },
    {
      title: "On-Time Incentive Payments",
      detail:
        "Measures the percentage of incentive payments made by their scheduled dates. Use the payment schedule communicated to the sales team.",
    },
    {
      title: "Compensation Disputes",
      detail:
        "Measures the number of compensation disputes relative to payments or statements issued. Review recurring causes such as unclear rules, incorrect credit, or calculation errors.",
    },
  ],
  10: [
    {
      title: "Time to Fill a Sales Position",
      detail:
        "Measures the number of days from approval to recruit until an accepted offer. Review delays in sourcing, interviewing, evaluation, or offer approval.",
    },
    {
      title: "Qualified Applicant Rate",
      detail:
        "Measures the percentage of reviewed applicants meeting the position’s documented requirements. This helps evaluate whether recruiting reaches suitable candidates.",
    },
    {
      title: "Offer Acceptance Rate",
      detail:
        "Measures the percentage of formal job offers accepted. Review declined offers for issues involving compensation, role expectations, timing, or the hiring process.",
    },
    {
      title: "Cost per Hire",
      detail:
        "Measures defined recruiting costs divided by the number of hires. Apply the same cost categories consistently when comparing periods or recruiting sources.",
    },
    {
      title: "Onboarding Completion",
      detail:
        "Measures the percentage of new hires completing required onboarding steps on schedule. Completion should include demonstrated readiness where appropriate.",
    },
    {
      title: "Time to Sales Readiness",
      detail:
        "Measures the time required for a new salesperson to demonstrate the minimum skills and knowledge needed to sell independently. Use an agreed assessment standard.",
    },
    {
      title: "Time to First Sale",
      detail:
        "Measures the number of days from a salesperson’s start date to their first completed sale. Interpret results in light of the normal sales cycle and opportunities provided.",
    },
    {
      title: "Time to Expected Productivity",
      detail:
        "Measures how long new salespeople take to reach the company’s defined productivity standard. Establish that standard before comparing hires.",
    },
    {
      title: "New-Hire Target Attainment",
      detail:
        "Measures actual results against the adjusted targets established for new salespeople. Use expectations appropriate to their stage of onboarding.",
    },
    {
      title: "90-Day New-Hire Retention",
      detail:
        "Measures the percentage of new hires still employed after 90 days. Review departures individually to understand selection, onboarding, management, or role-fit problems.",
    },
  ],
  11: [
    {
      title: "Customer Retention Rate",
      detail:
        "Measures the percentage of customers present at the beginning of a period who remain customers at the end. Exclude newly acquired customers from this calculation.",
    },
    {
      title: "Customer Loss Rate",
      detail:
        "Measures the percentage of customers present at the beginning of a period who are lost during that period. Define what counts as a lost customer for the business.",
    },
    {
      title: "Renewal Rate",
      detail:
        "Measures the percentage of contracts or subscriptions due for renewal that are renewed. Review reasons for nonrenewal to identify preventable losses.",
    },
    {
      title: "Repeat Purchase Rate",
      detail:
        "Measures the percentage of customers in a defined group who make another purchase within a specified period. Select a period appropriate to the normal buying cycle.",
    },
    {
      title: "Existing-Customer Revenue Growth",
      detail:
        "Measures the change in revenue from the same group of existing customers across comparable periods. This helps distinguish account development from new-customer acquisition.",
    },
    {
      title: "Average Revenue per Customer",
      detail:
        "Measures customer revenue divided by the number of customers included in the reporting period. Review whether changes reflect larger purchases, pricing, or changes in the customer mix.",
    },
    {
      title: "Additional Product or Service Adoption",
      detail:
        "Measures the percentage of eligible existing customers purchasing an additional product or service. Define eligibility so the measure reflects relevant opportunities.",
    },
    {
      title: "Account Expansion Conversion",
      detail:
        "Measures the percentage of decided opportunities to expand existing accounts that result in additional sales. Track these opportunities separately from new-customer sales.",
    },
    {
      title: "Customer Review Meetings Completed",
      detail:
        "Measures the percentage of planned customer review meetings completed. These meetings can help identify changing needs, service concerns, and development opportunities.",
    },
    {
      title: "Customer Issue Resolution Time",
      detail:
        "Measures the average time from a customer issue being reported to its confirmed resolution. Review issues affecting retention or future sales with the responsible service team.",
    },
  ],
  12: [
    {
      title: "Training Completion",
      detail:
        "Measures the percentage of assigned salespeople completing required training by the deadline. Completion records show participation; demonstrated ability should be measured separately.",
    },
    {
      title: "Knowledge Assessment Results",
      detail:
        "Measures performance on assessments covering the material taught. Compare results before and after training when practical to identify learning progress.",
    },
    {
      title: "Demonstrated Skill Proficiency",
      detail:
        "Measures the percentage of participants meeting an agreed standard in practice calls, role-playing, or demonstrations. Use a consistent scoring checklist.",
    },
    {
      title: "Skills Applied in Sales Conversations",
      detail:
        "Measures the percentage of reviewed actual sales conversations showing correct use of the skills taught. This helps determine whether learning transfers into daily work.",
    },
    {
      title: "Time to Skill Proficiency",
      detail:
        "Measures how long participants take to meet the required skill standard. This helps identify who needs additional practice or coaching.",
    },
    {
      title: "Skill Retention",
      detail:
        "Measures the percentage of participants still meeting the skill standard at a later review. Establish the review interval in advance.",
    },
    {
      title: "Sales Conversion Improvement",
      detail:
        "Measures the change in sales conversion following training. Compare equivalent periods and consider other changes that may also influence results.",
    },
    {
      title: "Average Sale Value Improvement",
      detail:
        "Measures the change in average sale value following relevant training. Review alongside discounting and profit contribution to understand the financial effect.",
    },
    {
      title: "Sales-Cycle Improvement",
      detail:
        "Measures the change in average sales-cycle length following training. Compare similar opportunities and check that faster decisions are accompanied by acceptable sales results.",
    },
    {
      title: "Sales Productivity Improvement",
      detail:
        "Measures the change in sales output per salesperson or selling hour following training. Define the output measure and consider other factors that may have affected performance.",
    },
  ],
} as const;

export type SalesComponentKpi = {
  readonly title: string;
  readonly detail: string;
};

export function getSalesComponentKpis(
  componentNum: number,
): readonly SalesComponentKpi[] | undefined {
  if (!(componentNum in salesComponentKpis)) return undefined;
  return salesComponentKpis[componentNum as keyof typeof salesComponentKpis];
}

export const pillarKpisFootnote =
  "For implementation: Each selected KPI should have a clear definition, calculation, information source, target, review schedule, and person responsible for monitoring it." as const;

export type PillarThemeKpi = {
  readonly title: string;
  readonly detail: string;
};

export const pillarThemeKpis = {
  "sales-performance": {
    "Increase Productivity": [
      {
        title: "Revenue per salesperson",
        detail:
          "Sales revenue generated by each salesperson during a defined period.",
      },
      {
        title: "Qualified opportunities per salesperson",
        detail:
          "Number of opportunities each salesperson develops that meet agreed qualification requirements.",
      },
      {
        title: "Number of closed sales per salesperson",
        detail:
          "Number of sales each salesperson closes during a defined period.",
      },
    ],
    "Improve Consistency": [
      {
        title: "Sales target achievement rate",
        detail: "Percentage of salespeople meeting their sales targets.",
      },
      {
        title: "Periods meeting sales targets",
        detail:
          "Percentage of weeks, months, or quarters in which agreed sales targets are achieved.",
      },
      {
        title: "On-time follow-up rate",
        detail:
          "Percentage of required prospect and client follow-ups completed by their deadlines.",
      },
    ],
    "Shorten Sales Cycles": [
      {
        title: "Average sales cycle length",
        detail:
          "Average number of days from a defined starting point, such as qualification, to a completed sale.",
      },
      {
        title: "Average time in each sales stage",
        detail: "Average number of days opportunities remain in each stage.",
      },
      {
        title: "Stalled opportunity rate",
        detail:
          "Percentage of open opportunities exceeding an agreed time limit without meaningful progress.",
      },
    ],
    "Improve Forecasting": [
      {
        title: "Revenue forecast accuracy",
        detail:
          "How closely forecasted revenue matches actual revenue for the same period.",
      },
      {
        title: "Expected closing date accuracy",
        detail:
          "Percentage of opportunities expected to close in a period that actually close during that period.",
      },
      {
        title: "Forecast slippage rate",
        detail:
          "Percentage of forecasted opportunities moved to a later period.",
      },
    ],
    "Increase Profitability": [
      {
        title: "Gross profit margin on sales",
        detail:
          "Percentage of sales revenue remaining after the direct costs of delivering the product or service.",
      },
      {
        title: "Average discount rate",
        detail: "Average percentage reduction from standard pricing.",
      },
      {
        title: "Gross profit per salesperson",
        detail:
          "Gross profit generated by each salesperson during a defined period.",
      },
    ],
    "Create Sustainable Growth": [
      {
        title: "Revenue growth rate",
        detail:
          "Percentage increase in revenue compared with a previous comparable period.",
      },
      {
        title: "Client retention rate",
        detail:
          "Percentage of existing clients retained during a defined period.",
      },
      {
        title: "Revenue growth from existing clients",
        detail:
          "Increase in revenue from additional purchases, upgrades, or expanded services among existing clients.",
      },
      {
        title: "New client revenue",
        detail: "Revenue generated from newly acquired clients.",
      },
    ],
    "AI Sales Integration": [
      {
        title: "Sales time saved",
        detail:
          "Hours saved on tasks such as prospect research, data entry, and follow-up preparation through AI assistance.",
      },
      {
        title: "AI-assisted lead qualification rate",
        detail:
          "Percentage of AI-identified prospects that meet the company's agreed qualification requirements.",
      },
      {
        title: "AI-assisted outreach response rate",
        detail:
          "Percentage of AI-assisted prospecting communications that receive a response.",
      },
      {
        title: "AI-assisted follow-up completion rate",
        detail:
          "Percentage of follow-ups supported by AI reminders or scheduling that are completed on time.",
      },
      {
        title: "AI-assisted opportunity win rate",
        detail:
          "Percentage of closed opportunities supported by AI that result in a sale.",
      },
    ],
  },
  "sales-systems": {
    "Sales Process": [
      {
        title: "Sales stage conversion rate",
        detail:
          "Percentage of opportunities moving from one stage to the next.",
      },
      {
        title: "Sales process compliance rate",
        detail:
          "Percentage of reviewed opportunities with required sales steps completed and documented.",
      },
      {
        title: "Qualified opportunity win rate",
        detail:
          "Percentage of closed, qualified opportunities that result in a sale.",
      },
    ],
    "CRM Optimization": [
      {
        title: "Required information completion rate",
        detail:
          "Percentage of active records containing all required information.",
      },
      {
        title: "Activity recording compliance rate",
        detail:
          "Percentage of verified sales activities recorded within the required timeframe.",
      },
      {
        title: "CRM record accuracy rate",
        detail:
          "Percentage of reviewed records that accurately reflect verified prospect, client, and opportunity information.",
      },
    ],
    "Pipeline Management": [
      {
        title: "Pipeline coverage",
        detail:
          "Value of qualified open opportunities relative to the remaining sales target for the same period.",
      },
      {
        title: "Opportunities with confirmed next steps",
        detail:
          "Percentage of open opportunities with a documented next action, responsible person, and due date.",
      },
      {
        title: "Stalled opportunity rate",
        detail:
          "Percentage of open opportunities exceeding agreed limits for inactivity or time in a stage.",
      },
    ],
    Forecasting: [
      {
        title: "Revenue forecast accuracy",
        detail: "How closely forecasted revenue matches actual revenue.",
      },
      {
        title: "Forecast update compliance rate",
        detail:
          "Percentage of required forecast updates completed by the deadline.",
      },
      {
        title: "Forecast data completeness",
        detail:
          "Percentage of forecasted opportunities containing required information, such as value, stage, expected closing date, and next step.",
      },
    ],
    "Performance Dashboards": [
      {
        title: "KPI data accuracy rate",
        detail:
          "Percentage of reviewed dashboard measurements that match their source information.",
      },
      {
        title: "Dashboard update timeliness",
        detail: "Percentage of scheduled data updates completed on time.",
      },
      {
        title: "KPI review completion rate",
        detail:
          "Percentage of scheduled management reviews in which assigned KPIs are reviewed and follow-up actions documented.",
      },
    ],
    "Sales Meetings": [
      {
        title: "Meeting action completion rate",
        detail:
          "Percentage of assigned meeting actions completed by their deadlines.",
      },
      {
        title: "Opportunity review completion rate",
        detail:
          "Percentage of opportunities scheduled for discussion that receive a documented review.",
      },
      {
        title: "Overdue issue resolution time",
        detail:
          "Average time required to resolve sales issues that have passed their agreed deadlines.",
      },
    ],
    "Accountability Systems": [
      {
        title: "Commitment completion rate",
        detail:
          "Percentage of agreed commitments completed by their deadlines.",
      },
      {
        title: "Corrective action completion rate",
        detail: "Percentage of required corrective actions completed on time.",
      },
      {
        title: "Repeated missed commitment rate",
        detail:
          "Percentage of commitments missed repeatedly by the same individual during a defined period.",
      },
    ],
  },
  "sales-leadership": {
    "Develop Stronger Sales Leaders": [
      {
        title: "Team sales target attainment",
        detail:
          "Actual team sales expressed as a percentage of the team's target.",
      },
      {
        title: "Management action completion rate",
        detail:
          "Percentage of agreed leadership actions completed by their deadlines.",
      },
      {
        title: "Salesperson improvement rate",
        detail:
          "Percentage of salespeople meeting their individual KPI improvement targets during a defined period.",
      },
    ],
    "Improve Accountability": [
      {
        title: "Individual sales target achievement rate",
        detail:
          "Percentage of salespeople meeting their assigned sales targets.",
      },
      {
        title: "Performance review completion rate",
        detail:
          "Percentage of scheduled individual performance reviews completed and documented.",
      },
      {
        title: "Performance improvement action completion rate",
        detail:
          "Percentage of agreed improvement actions completed by their deadlines.",
      },
    ],
    "Improve Coaching": [
      {
        title: "Coaching completion rate",
        detail: "Percentage of planned coaching sessions completed.",
      },
      {
        title: "Coaching action completion rate",
        detail:
          "Percentage of agreed practice or improvement activities completed by their deadlines.",
      },
      {
        title: "Post-coaching KPI improvement",
        detail:
          "Change in the specific KPI addressed through coaching, such as appointment conversion, proposal conversion, or win rate.",
      },
    ],
    "Create High-Performing Teams": [
      {
        title: "Team sales target attainment",
        detail:
          "Actual team sales expressed as a percentage of the team's target.",
      },
      {
        title: "Percentage of salespeople meeting targets",
        detail: "How broadly sales success is distributed across the team.",
      },
      {
        title: "New salesperson ramp-up time",
        detail:
          "Average time required for a new salesperson to reach an agreed level of productivity.",
      },
      {
        title: "Team qualified opportunity win rate",
        detail:
          "Percentage of the team's closed, qualified opportunities that result in sales.",
      },
    ],
  },
} as const;

export const aiIntegrationKpisNote =
  "Compare results with performance before AI was introduced, where practical, to evaluate whether it is contributing to improvement.";

export type PillarId = keyof typeof pillarThemeKpis;

export function getPillarThemeKpis(
  pillarId: string,
  themeLabel: string,
): readonly PillarThemeKpi[] | undefined {
  if (!(pillarId in pillarThemeKpis)) return undefined;
  const pillar = pillarThemeKpis[pillarId as PillarId];
  if (!(themeLabel in pillar)) return undefined;
  return pillar[themeLabel as keyof typeof pillar];
}

type PillarThemeLabel = {
  [P in PillarId]: keyof (typeof pillarThemeKpis)[P];
}[PillarId];

const pillarThemeKpiMeasurePhrases = {
  "Increase Productivity": "productivity",
  "Improve Consistency": "consistency",
  "Shorten Sales Cycles": "sales cycle efficiency",
  "Improve Forecasting": "forecasting",
  "Increase Profitability": "profitability",
  "Create Sustainable Growth": "sustainable growth",
  "AI Sales Integration": "AI-assisted sales performance",
  "Sales Process": "sales process performance",
  "CRM Optimization": "CRM utilization",
  "Pipeline Management": "pipeline management",
  Forecasting: "forecasting",
  "Performance Dashboards": "performance visibility",
  "Sales Meetings": "sales meeting effectiveness",
  "Accountability Systems": "accountability",
  "Develop Stronger Sales Leaders": "sales leadership effectiveness",
  "Improve Accountability": "accountability",
  "Improve Coaching": "coaching effectiveness",
  "Create High-Performing Teams": "team performance",
} as const satisfies Record<PillarThemeLabel, string>;

export const pillarKpisIntroSelectionNote =
  "We select KPIs based on the company's priorities, available information, and areas needing improvement. Some KPIs may support more than one area." as const;

export function getPillarThemeKpisOpeningLine(themeLabel: string): string {
  const measure =
    themeLabel in pillarThemeKpiMeasurePhrases
      ? pillarThemeKpiMeasurePhrases[
          themeLabel as keyof typeof pillarThemeKpiMeasurePhrases
        ]
      : themeLabel.toLowerCase();
  return `Below are examples of KPIs we may use to measure ${measure}.`;
}

export const siteConfig = {
  name: "NORTH POINT SALES GROUP",
  shortName: "NORTH POINT SALES GROUP",
  description:
    "Sales organization consulting that drives stronger teams and better business results.",
  url: process.env.SITE_URL || "http://localhost:3000",
  cta: {
    label: "Schedule a Consultation",
    labelLines: ["Schedule a", "Consultation"] as const,
    href: "#cta",
  },
  appointmentForm: {
    title: "Schedule a Meeting",
    subtitle:
      "Select a date and time for your meeting with NORTH POINT SALES GROUP.",
    submitLabel: "Schedule Meeting",
    successTitle: "Meeting Request Received",
    successMessage:
      "Thank you. We have received your meeting request and will confirm shortly.",
    appointmentTypes: [
      "Initial Consultation",
      "Sales Performance Discussion",
      "Sales Performance Review",
      "Follow-Up Meeting",
    ],
    durations: ["30 minutes", "45 minutes", "60 minutes"],
    timeSlots: [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
    ],
    timezones: [
      "Eastern Time (ET) — US East Coast",
      "Central Time (CT) — US Central",
      "Mountain Time (MT) — US Mountain",
      "Mountain Time (MT) — Arizona (no daylight saving)",
      "Pacific Time (PT) — US West Coast",
      "Alaska Time (AKT) — Alaska",
      "Hawaii-Aleutian Time (HAT) — Aleutian Islands, Alaska",
      "Hawaii Time (HT) — Hawaii",
      "Atlantic Time (AST) — Puerto Rico & US Virgin Islands",
      "Chamorro Time (ChST) — Guam & Northern Mariana Islands",
      "Samoa Time (SST) — American Samoa",
    ],
  },
  nav: [
    { href: "#top", label: "Home" },
    { href: "#about-us", label: "About Us" },
    { href: "#why-choose-us", label: "Why Us" },
    { href: "#results", label: "Results" },

    { label: "HOW WE WORK", href: "#how-we-work" },
    { label: "30-90 DAY FOCUS", href: "#30-90-focus" },
    { label: "CHALLENGES", href: "#challenges" },
    { label: "INVESTMENT", href: "#investment" },

    // { href: "#solutions", label: "Solutions" },
    { href: "#faqs", label: "FAQs" },
  ],
  navMore: {
    label: "MORE",
    links: [
      { label: "Careers", href: "/careers" },
      { label: "EXECUTIVE INSIGHTS", href: "/blogs" },
    ],
  },
  hero: {
    titleLine1: "Stronger Sales Organization",
    titleLine2: "Better Bottom-Line Results.",
    eyebrow: "Driving Revenue Growth Through Sales Organization Excellence",
    body: "We transform underperforming B2B sales organizations into high-performing revenue engines—unlocking untapped sales capacity with the potential to generate millions of dollars in additional revenue.",
    primaryCta: {
      label: "Schedule a Consultation",
      href: "#cta",
    },
    secondaryCta: {
      label: "Watch How We Can Help",
      href: "#video",
    },
    image: {
      src: "/images/hero-image.svg",
      alt: "Sales leaders collaborating in a boardroom overlooking the city",
    },
  },
  aboutUs: {
    title: "ABOUT US",
    heading: "EXPERIENCE BEHIND NORTH POINT SALES GROUP",
    openingParagraphs: [
      "NORTH POINT SALES GROUP is an executive-level sales performance consulting and implementation firm. We help established businesses strengthen their existing sales organizations through practical improvements in sales performance, sales systems, and sales leadership.",
      "We work directly with owners and executive teams to identify where revenue may be left on the table, implement needed improvements, and establish accountability for measurable progress.",
    ],
    tagline:
      "EXPERIENCE THAT SPANS FRONTLINE SALES THROUGH EXECUTIVE LEADERSHIP.",
    experienceParagraphs: [
      "The foundation of NORTH POINT SALES GROUP is our founder’s more than 40 years of direct sales, training, management, and business ownership experience. That background includes selling as a top-producing representative, training and managing salespeople, and working with businesses ranging from small operations to organizations generating more than $250 million in annual sales.",
    ],
    experienceHighlights: [
      {
        value: "40+ YEARS",
        description:
          "Of direct sales, training, management, and business ownership experience.",
      },
      {
        value: "$250M+",
        description:
          "Experience with organizations generating more than $250 million in annual sales.",
      },
      {
        value: "5%–25%+",
        description:
          "Potential annual sales revenue improvement, depending on the organization and opportunities identified.",
      },
    ],
    experienceExpandable: {
      heading: "MORE ABOUT OUR EXPERIENCE",
      paragraphs: [
        "Our experience includes frontline sales performance, sales training, sales management, business ownership, and direct involvement with sales organizations across a wide range of industries and company sizes.",
        "It's a fact that across organizations of different sizes, recurring challenges often emerge:",
        "Recognizing these patterns helps us identify underlying problems and determine where practical improvements can produce meaningful results.",
        "We examine how your sales organization actually operates, including sales presentations, customer interactions, follow-up practices, pipeline activity, and leadership effectiveness.",
        "Our objective is to identify what may be restricting performance, implement needed improvements, and establish accountability for measurable progress.",
      ],
      challenges: [
        {
          label: "Unclear sales expectations",
          title: "UNCLEAR SALES EXPECTATIONS",
          intro:
            "Salespeople cannot consistently meet performance expectations that have not been clearly established, communicated, and measured.",
          commonProblems: [
            "Unclear individual sales targets and responsibilities.",
            "Inconsistent expectations for prospecting and follow-up.",
            "Salespeople unsure which activities deserve priority.",
            "Different performance standards across the sales team.",
            "Limited understanding of how individual activities contribute to company revenue.",
            "Expectations communicated without consistent follow-through.",
          ],
          howWeAddress:
            "We examine how sales expectations are established, communicated, measured, and reinforced. Where needed, we help implement clearer performance standards, measurable objectives, and practical accountability procedures.",
        },
        {
          label: "Inconsistent prospecting",
          title: "INCONSISTENT PROSPECTING",
          intro:
            "Even capable salespeople can struggle to produce consistent results when prospecting activities are irregular, poorly targeted, or inadequately managed.",
          commonProblems: [
            "Insufficient outreach to qualified prospects.",
            "Spending excessive time pursuing unlikely buyers.",
            "Inconsistent prospecting schedules and activity levels.",
            "Failure to identify appropriate decision-makers.",
            "Weak initial conversations that fail to generate interest.",
            "Overdependence on referrals or incoming leads.",
          ],
          howWeAddress:
            "We evaluate prospecting methods, lead quality, activity levels, and conversion effectiveness. We identify opportunities to improve targeting, prospect engagement, and the consistency of qualified opportunities entering the sales pipeline.",
        },
        {
          label: "Ineffective sales presentations",
          title: "INEFFECTIVE SALES PRESENTATIONS",
          intro:
            "A salesperson may understand the product or service yet struggle to communicate its value, create urgency, overcome objections, or recognize when a prospect is ready to make a decision.",
          commonProblems: [
            "Focusing on product features rather than customer benefits and financial value.",
            "Failing to uncover the prospect's actual needs and priorities.",
            "Talking too much and listening too little.",
            "Weak responses to objections about price, timing, or competition.",
            "Not recognizing buying signals or knowing when to ask for the sale.",
            "Continuing to present after the prospect is ready to make a decision.",
            "Failing to establish a clear next step when an immediate decision is not appropriate.",
          ],
          howWeAddress:
            "We evaluate actual sales conversations, presentations, objection handling, and closing techniques. Through direct observation, individual coaching, and practical adjustments, we help salespeople communicate value more effectively and move qualified opportunities toward decisions.",
        },
        {
          label: "Missed follow-up opportunities",
          title: "MISSED FOLLOW-UP OPPORTUNITIES",
          intro:
            "Revenue opportunities are frequently lost not because a prospect lacks interest, but because follow-up is delayed, inconsistent, poorly executed, or abandoned prematurely.",
          commonProblems: [
            "Delayed responses to prospect inquiries.",
            "Failure to follow up after presentations or proposals.",
            "No clearly scheduled next step in the sales process.",
            "Repeated follow-up without providing additional value.",
            "Prospects disappearing from the pipeline without explanation.",
            "Failure to reconnect with previously interested prospects.",
          ],
          howWeAddress:
            "We examine follow-up practices, response times, pipeline activity, and CRM records. We help establish structured follow-up procedures, clear responsibilities, and measurable standards that reduce overlooked opportunities.",
        },
        {
          label: "Inadequate sales coaching",
          title: "INADEQUATE SALES COACHING",
          intro:
            "Sales meetings and occasional training sessions do not necessarily address the individual weaknesses preventing salespeople from reaching their potential.",
          commonProblems: [
            "Coaching focused on sales numbers rather than the behaviors producing those numbers.",
            "Applying identical training to salespeople with different performance needs.",
            "Limited observation of actual sales conversations.",
            "Managers telling salespeople what to improve without demonstrating how.",
            "Failure to practice presentations, objection handling, and closing.",
            "Little follow-through to determine whether coaching produces improvement.",
          ],
          howWeAddress:
            "We evaluate individual performance, identify specific development needs, and provide practical coaching based on actual selling situations. We also help sales leaders establish coaching practices that support measurable and sustained improvement.",
        },
        {
          label: "Weak accountability",
          title: "WEAK ACCOUNTABILITY",
          intro:
            "Even well-designed sales processes and performance standards lose effectiveness when expectations are not consistently monitored, reinforced, and followed through.",
          commonProblems: [
            "Sales activity and results not reviewed consistently.",
            "CRM information that is incomplete or outdated.",
            "Missed commitments without appropriate follow-up.",
            "Performance problems identified too late for corrective action.",
            "Sales meetings that produce discussions but few completed actions.",
            "Improvements introduced but gradually abandoned.",
          ],
          howWeAddress:
            "We examine performance measurement, management practices, reporting procedures, and follow-through. We help establish clear responsibilities, meaningful KPIs, regular performance reviews, and accountability practices that keep improvements in place.",
        },
      ],
    },
    sections: [
      {
        heading: "OUR APPROACH AT A GLANCE",
        tagline:
          "PRACTICAL IMPROVEMENTS. HANDS-ON IMPLEMENTATION. CLEAR ACCOUNTABILITY.",
        paragraphs: [
          "We assess how your salespeople, systems, and leadership work together, identify where performance can improve, and work alongside your team to implement practical changes. Clear responsibilities, relevant KPIs, and regular progress reviews help sustain improvements.",
          "We are best suited for established businesses with an existing sales force, where stronger sales performance can create meaningful financial value and leadership is committed to putting improvements into practice.",
        ],
        expandableSections: [
          {
            heading: "SALES LEADERSHIP SUPPORT",
            paragraphs: [
              "When additional sales leadership is needed, we can provide fractional leadership support or help recruit, onboard, and develop a sales manager.",
              "This may include supporting an owner who currently manages the sales force, strengthening existing management, or helping establish dedicated sales leadership. Responsibilities are determined by the engagement’s scope.",
            ],
          },
          {
            heading: "A PRACTICAL STARTING POINT",
            paragraphs: [
              "For companies that prefer a focused starting point, we offer two 30-day options:",
            ],
            options: [
              {
                title: "Sales Team Performance Engagement — $7,500",
                href: "#investment-option-1",
                description:
                  "Direct work with up to three selected sales or account representatives, including assessment, coaching, process review, baseline KPIs, weekly updates, and a final summary. Companies with larger teams may begin with selected representatives and expand the scope when needed.",
              },
              {
                title: "30-Day Focused Sales Performance — $9,500",
                href: "#investment-option-2",
                description:
                  "Includes everything in our $7,500 Sales Team Performance Engagement, plus executive discovery, a broader sales organization assessment, leadership and systems review, and a prioritized implementation roadmap.",
              },
            ],
            closingParagraphs: [
              "These engagements provide substantive work with defined objectives and deliverables. They also allow you to experience how we work before deciding whether broader implementation makes sense.",
              "If you proceed to full implementation, your initial engagement fee is credited toward that investment.",
              {
                linkLine: {
                  before: "Organizations ready for ",
                  href: "#investment-option-3",
                  label: "comprehensive implementation",
                  after:
                    " can begin with the broader engagement. We recommend the starting point that fits your needs, priorities, and readiness to move forward.",
                },
              },
            ],
          },
          {
            heading: "CLEAR SCOPE. STRAIGHTFORWARD COSTS.",
            paragraphs: [
              "Responsibilities, deliverables, duration, and fees are established before work begins. Any third-party costs are identified separately. We focus the engagement on work that serves your objectives.",
            ],
          },
        ],
      },
    ],
    closingStatement:
      "Our objective is to leave your sales organization better equipped to perform—and keep performing.",
    founder: {
      buttonLabel: "MEET THE FOUNDER & CEO",
      name: "Michael O. Brickell",
      role: "Founder & CEO | NORTH POINT SALES GROUP",
      paragraphs: [
        "Michael O. Brickell brings a distinctive combination of frontline sales success, executive leadership, and entrepreneurial experience developed through decades of work in sales, management, and business ownership. His background includes working directly with companies generating between **$1 million and $250 million in annual revenue**.",
        "Beginning his career in frontline sales, Michael consistently ranked among the top-performing representatives in the organizations he served. He expanded into sales training and corporate management before establishing and operating businesses in lead generation and advertising.",
        "He later built two online educational directory businesses from the ground up, directing their development, search engine optimization, digital lead generation, and marketing. He **negotiated the sale of both businesses** to established corporations, including a publicly traded company.",
        "Having worked as a frontline salesperson, sales manager, executive, and founder, Michael understands how sales execution, operational systems, and profitability connect. His experience provides the judgment to understand why a sales organization performs as it does, determine what needs improvement, and know how to implement those changes.",
        "Michael founded NORTH POINT SALES GROUP to apply that experience through practical consulting and hands-on implementation. His experience and practical understanding of sales mechanics form the DNA of NORTH POINT SALES GROUP—shaping its methodology, implementation standards, and approach to improving **sales performance, systems, and leadership**.",
      ],
    },
  },

  whyChooseUs: {
    badge: "Why Choose Us",
    title: "WHY EXECUTIVE TEAMS ENGAGE NORTH POINT SALES GROUP",
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
            {
              text: "Is the organization getting everything it reasonably can from the sales resources it already has.",
              bold: true,
            },
            "Many established companies have significant revenue potential already sitting inside their existing sales operation — in conversion rates, prospecting effectiveness, sales messaging, follow-up, pipeline management, leadership, accountability, and individual salesperson performance.",
            "If those areas can be strengthened, even modestly, the financial impact can be substantial.",
            "For example, improving the productivity of an existing sales team by even a few percentage points may generate meaningful additional revenue without immediately adding payroll, increasing advertising expense, or expanding headcount.",
            {
              text: "That is why we start by looking for growth within the existing sales organization.",
              bold: true,
            },
            {
              text: "The objective is to identify and strengthen the areas of the existing sales operation with the greatest potential to produce additional revenue and contribution profit.",
              bold: true,
            },
          ],
        },
      },
      {
        id: "evaluate-organization",
        title: "Begin With Sales Team Performance",
        description:
          "We evaluate your salespeople’s skills, execution, productivity, and results, then examine the leadership, processes, and systems affecting performance to identify needed improvements.",
        icon: "/icons/data.svg",
        popout: {
          paragraphs: [
            "Sales performance is rarely the result of one isolated issue.",
            "A salesperson may appear to be underperforming when the actual problem is lead quality, weak messaging, poor onboarding, inconsistent follow-up, ineffective pipeline management, limited accountability, compensation structure, or lack of sales leadership.",
            "That is why we evaluate the sales organization as a complete revenue-producing system rather than automatically assuming the salespeople themselves are the problem.",
            "We look at how the different components work together and where breakdowns, inefficiencies, or missed opportunities may exist.",
            "This gives leadership a much clearer picture of what is actually affecting performance before money and resources are committed to fixing the wrong problem.",
            {
              text: "The objective is to identify what is actually limiting sales performance and where the greatest opportunities for improvement exist.",
              bold: true,
            },
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
            {
              text: "For one company, that may be improving conversion rates. For another, it may be prospecting, lead quality, sales messaging, follow-up, pipeline management, leadership, or the performance of a small number of salespeople.",
              bold: true,
            },
            "By narrowing the focus, the company avoids unnecessary disruption and directs its time, money, and management attention toward the areas most likely to produce measurable improvement.",
            "Our goal is not to change everything.",
            {
              text: "Our goal is to identify what matters most right now and address it effectively.",
              bold: true,
            },
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
            {
              text: "Every improvement should ultimately be evaluated by the additional revenue and contribution profit it can produce relative to the investment required.",
              bold: true,
            },
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
            {
              text: "NORTH POINT SALES GROUP is not designed to simply deliver a report, make recommendations, and leave leadership to figure out the rest.",
              bold: true,
            },
            "Depending on the scope and complexity of the engagement, we can provide a Sales Performance Implementation Specialist, a Fractional VP of Sales, or both, to work alongside your leadership team and help put agreed-upon improvements into practice.",
            "That may include working directly with selected salespeople, improving presentations and messaging, strengthening prospecting and follow-up, addressing pipeline issues, improving accountability, coordinating outside vendors when needed, and helping leadership track results.",
            "The engagement can be narrowly focused on two or three salespeople or expanded to support the broader sales organization.",
            "The level of involvement depends on what the company actually needs.",
            {
              text: "The objective is to turn identified improvements into practical changes that are implemented, measured, and sustained.",
              bold: true,
            },
          ],
        },
      },
    ],
    // Modal content for the "MORE" CTA
    modal: {
      title: "OUR APPROACH IN DETAIL",
      pillars: [
        {
          id: "diagnose-before-prescribe",
          title: "Begin With Sales Team Performance",
          description:
            "We first determine what is working, what may be restricting performance, and where meaningful opportunities for improvement exist.",
          icon: "/icons/data.svg",
          popout: {
            title: "Begin With Sales Team Performance",
            paragraphs: [
              "We begin by evaluating the performance of your existing salespeople—their skills, execution, productivity, and results.",
              "That evaluation helps identify what is working, where performance is being restricted, and which supporting factors need closer examination.",
              "Depending on what we find, that may include reviewing:",
              "The objective is to determine what is influencing sales team performance and focus on the improvements most likely to strengthen results.",
            ],
            list: [
              "Sales leadership",
              "Prospecting and lead generation",
              "Sales process",
              "Messaging and presentations",
              "Follow-up and pipeline management",
              "CRM utilization",
              "Training and coaching",
              "Accountability",
              "Compensation and incentives",
              "Recruiting and onboarding",
              "Conversion performance",
              "Customer retention and expansion",
            ],
            nextStep:
              "We establish the recommended priorities and next steps based on our findings. The depth of evaluation and the work performed depend on the engagement selected.",
          },
        },
        {
          id: "focus-financial-impact",
          title: "Focus Where Financial Impact Matters Most",
          description:
            "If an area of the sales organization is performing well, we leave it alone. We focus on areas where improvement is most likely to produce a meaningful business return.",
          icon: "/icons/impact.svg",
          popout: {
            title: "Improve What Can Produce a Meaningful Business Return",
            paragraphs: [
              "Not every weakness deserves the same level of attention.",
              "If an area of the sales organization is already performing well, there may be little reason to change it simply for the sake of change.",
              "Instead, we focus on the areas where improvement is most likely to affect revenue, productivity, profitability, conversion, or long-term sales performance.",
              "That may mean prioritizing:",
              "The objective is to direct time, management attention, and resources toward improvements that have a legitimate business case behind them.",
            ],
            list: [
              "A weak stage of the sales process",
              "Low conversion performance",
              "Poor pipeline discipline",
              "Ineffective lead follow-up",
              "Underdeveloped salespeople",
              "Leadership bottlenecks",
              "Missed opportunities within existing accounts",
              "Recruiting or retention problems",
              "Inefficient sales activity",
              "Gaps in accountability or execution",
            ],
            nextStep:
              "We help leadership prioritize opportunities based on potential impact so resources are directed toward the areas most likely to produce measurable value.",
          },
        },
        {
          id: "implementation-not-just-recommendations",
          title: "Implementation, Not Just Recommendations",
          description:
            "We do more than provide reports and recommendations. We work with leadership to help put agreed-upon improvements into practice and evaluate the results.",
          icon: "/icons/deliver.svg",
          popout: {
            title: "Help Put the Improvements Into Practice",
            paragraphs: [
              "Identifying a problem is only the beginning.",
              "Many consulting engagements end with a report, presentation, or list of recommendations that leadership is then expected to implement internally.",
              "Our approach is different.",
              "Once priorities are agreed upon, we can work directly with leadership and the sales organization to help implement the changes.",
              "Depending on the engagement, that may include:",
              "We also evaluate progress so leadership can see whether the changes being implemented are producing the intended results.",
            ],
            list: [
              "Coaching salespeople",
              "Refining sales presentations",
              "Improving prospecting approaches",
              "Strengthening follow-up",
              "Developing accountability systems",
              "Improving pipeline management",
              "Supporting sales leadership",
              "Modifying processes",
              "Improving onboarding or training",
              "Establishing performance standards",
              "Coordinating specialized outside resources when appropriate",
            ],
            nextStep:
              "Once the priorities are established, we help translate them into specific actions, responsibilities, and implementation steps rather than leaving leadership with recommendations alone.",
          },
        },
        {
          id: "objective-outside-perspective",
          title: "Objective Outside Perspective",
          description:
            "Because we are not part of the existing internal structure, we can evaluate sales performance objectively while working collaboratively with leadership and the sales organization.",
          icon: "/icons/insights.svg",
          popout: {
            title: "Evaluate Performance Without Internal Bias or Politics",
            paragraphs: [
              "People inside an organization naturally view the sales operation through the lens of their own responsibilities, experiences, relationships, and priorities.",
              "That can sometimes make it difficult to determine objectively where performance opportunities or limitations actually exist.",
              "An outside perspective can help leadership examine the organization without being tied to existing assumptions, historical decisions, or internal structures.",
              "We can evaluate areas such as:",
              "Our role is not to assign blame or undermine existing leadership.",
              "It is to provide an objective perspective while working collaboratively with the people responsible for producing results.",
            ],
            list: [
              "Whether expectations are realistic and clearly communicated",
              "Whether salespeople have the tools and support they need",
              "Whether management practices are helping or limiting performance",
              "Whether existing processes are producing the desired results",
              "Whether resources are being used effectively",
              "Whether opportunities are being overlooked",
              "Whether leadership and the sales team are aligned",
            ],
            nextStep:
              "We provide leadership with an independent view of the sales organization and help separate assumptions from the issues and opportunities that can be supported by actual performance information.",
          },
        },
        {
          id: "long-term-resource",
          title: "A Long-Term Resource When Needed",
          description:
            "Our objective is not simply to complete an engagement and disappear. When appropriate, we want to remain a trusted sales-performance resource leadership can call upon as future needs and opportunities arise.",
          icon: "/icons/sustainable.svg",
          popout: {
            title: "Sales Performance Support Beyond the Initial Engagement",
            paragraphs: [
              "Sales organizations continue to evolve.",
              "New salespeople are hired. Markets change. Leadership changes. New competitors appear. Growth creates new operational demands. Strategies that worked previously may eventually need to be adjusted.",
              "For that reason, our relationship does not necessarily have to end when the initial engagement is completed.",
              "NORTH POINT SALES GROUP can remain available as a sales-performance resource when future needs arise.",
              "That may include:",
              "Some organizations may need us again quickly. Others may not need additional assistance for months or longer.",
              "The objective is simply to give leadership access to an experienced outside resource when sales-related needs or opportunities arise.",
            ],
            list: [
              "Leadership guidance",
              "Sales team development",
              "Fractional VP of Sales support",
              "Recruiting and onboarding assistance",
              "Sales process reviews",
              "Performance troubleshooting",
              "Expansion planning",
              "Coaching or training",
              "New market or territory support",
              "Evaluation of emerging sales challenges",
            ],
            nextStep:
              "After the initial engagement, NORTH POINT SALES GROUP can remain available as an ongoing resource so leadership has someone familiar with the organization to call when new sales challenges, opportunities, or growth initiatives develop.",
          },
        },
      ],
      twelveAdvantages: {
        linkLabel: "12 Advantages of Working With Us",
        buttonLabel:
          "12 ADVANTAGES OF OUR APPROACH TO SALES PERFORMANCE IMPROVEMENT",
        title: "12 ADVANTAGES OF OUR APPROACH TO SALES PERFORMANCE IMPROVEMENT",
        intro: [
          "Before investing more money in additional salespeople, new technology, or another training program, consider how much additional revenue your existing sales organization may be capable of producing.",
          "At NORTH POINT SALES GROUP, we help established companies identify opportunities for improvement, strengthen sales execution, improve management systems, and increase productivity through practical, measurable improvements.",
          "Our approach is built around three priorities: financial discipline, practical implementation, and sustainable organizational performance.",
        ],
        pillars: [
          {
            title: "I. FINANCIAL ADVANTAGES",
            advantages: [
              {
                number: 1,
                title: "OPTIMIZE YOUR EXISTING SALES FORCE FIRST",
                paragraphs: [
                  "Before recommending additional hiring, technology, or other major expenditures, we examine opportunities to improve performance using the salespeople, leadership, and resources you already have.",
                ],
                bullets: [
                  "Identify untapped revenue opportunities within your existing sales organization.",
                  "Improve the productivity of current sales representatives.",
                  "Address performance weaknesses before expanding payroll.",
                  "Help generate greater value from resources already in place.",
                ],
                advantage:
                  "THE ADVANTAGE: Potentially increase revenue and productivity without proportionately increasing operating expenses.",
              },
              {
                number: 2,
                title: "START WITH AN AFFORDABLE, FOCUSED ENGAGEMENT",
                paragraphs: [
                  "Our focused engagements start at $7,500, allowing companies to address specific sales-performance needs without immediately committing to a comprehensive organizational implementation.",
                ],
                bullets: [
                  "Begin with a clearly defined scope of work.",
                  "Concentrate on selected sales representatives or priority performance issues.",
                  "Evaluate our approach before considering broader implementation.",
                  "Expand the engagement only when additional work is justified.",
                ],
                advantage:
                  "THE ADVANTAGE: A lower initial financial commitment with the flexibility to pursue additional improvements when appropriate.",
              },
              {
                number: 3,
                title: "CLEAR, TRANSPARENT INVESTMENT OPTIONS",
                paragraphs: [
                  "We publish our investment structure so prospective clients can understand the general financial commitment before entering detailed discussions.",
                ],
                bullets: [
                  "Focused engagements beginning at $7,500 and $9,500.",
                  "Comprehensive executive implementations ranging from $50,000 to $150,000+.",
                  "Clearly defined deliverables appropriate to the selected engagement.",
                  "Investment recommendations based on organizational needs, scope, and complexity.",
                  "Executive review and approval of implementation plans where applicable.",
                ],
                advantage:
                  "THE ADVANTAGE: Greater financial transparency and control over the scope and cost of the engagement.",
              },
              {
                number: 4,
                title: "SHORT, DEFINED ENGAGEMENT PERIODS",
                paragraphs: [
                  "Our engagements generally range from 30 to 90 days, depending on the scope of work. We emphasize timely assessment, practical implementation, and measurable progress rather than unnecessarily extended consulting arrangements.",
                ],
                bullets: [
                  "Clearly established engagement objectives.",
                  "Defined implementation schedules.",
                  "Prioritized improvement opportunities.",
                  "Regular progress reviews.",
                  "No automatic requirement for ongoing consulting services.",
                ],
                advantage:
                  "THE ADVANTAGE: Concentrated improvement efforts with defined timelines and limited long-term financial exposure.",
              },
            ],
          },
          {
            title: "II. PRACTICAL IMPLEMENTATION ADVANTAGES",
            advantages: [
              {
                number: 5,
                title:
                  "FOCUS ON WHAT NEEDS IMPROVEMENT — NOT WHAT ALREADY WORKS",
                paragraphs: [
                  "Not every sales organization needs a complete transformation. Many companies already have effective salespeople, processes, and leadership practices that should remain in place. Targeted improvements can often provide greater value than unnecessary organizational changes.",
                ],
                bullets: [
                  "Identify specific weaknesses affecting productivity and revenue.",
                  "Preserve existing practices that consistently produce results.",
                  "Avoid unnecessary restructuring or system replacements.",
                  "Prioritize improvements according to their potential business impact.",
                  "Recommend only services and changes that address identified needs.",
                ],
                advantage:
                  "THE ADVANTAGE: Targeted improvements without the cost and disruption of unnecessary organizational changes.",
              },
              {
                number: 6,
                title: "IMPLEMENTATION, NOT JUST RECOMMENDATIONS",
                paragraphs: [
                  "Identifying problems is only the beginning. We work directly with your salespeople and leadership to help put practical solutions into operation.",
                ],
                bullets: [
                  "Evaluate sales execution and identify performance gaps.",
                  "Improve prospecting, presentations, closing, and follow-up practices.",
                  "Strengthen sales processes and management procedures.",
                  "Establish performance expectations and accountability.",
                  "Help implement improvements rather than simply recommending them.",
                ],
                afterBulletsLink: {
                  before:
                    "The level of implementation support depends on the selected ",
                  href: "#investment",
                  label: "engagement",
                  after: ".",
                },
                advantage:
                  "THE ADVANTAGE: Direct assistance in turning identified opportunities into operational improvements.",
              },
              {
                number: 7,
                title: "INDIVIDUAL SALES REPRESENTATIVE DEVELOPMENT",
                paragraphs: [
                  "Sales organizations often have significant differences in productivity among representatives. We work directly with selected salespeople to identify individual performance gaps and strengthen the skills and behaviors affecting their results.",
                ],
                bullets: [
                  "Evaluate individual sales conversations, presentations, and follow-up practices.",
                  "Identify weaknesses in prospecting, qualification, objection handling, and closing.",
                  "Provide individualized coaching and practical sales guidance.",
                  "Use recorded conversations, role-playing, and remote coaching sessions where appropriate.",
                  "Measure individual progress against established performance baselines.",
                  "Extend successful improvements to additional sales representatives when appropriate.",
                ],
                advantage:
                  "THE ADVANTAGE: Improve individual productivity while developing practices that can benefit the entire sales organization.",
              },
              {
                number: 8,
                title: "PRACTICAL TECHNOLOGY AND AI INTEGRATION",
                paragraphs: [
                  "Technology should make your sales organization more productive, not introduce unnecessary costs or complexity. We examine how existing systems can be improved and where AI may provide practical value.",
                ],
                bullets: [
                  "Lead Generation: Identify prospective companies and organize them according to established business criteria.",
                  "Lead Qualification: Research, filter, score, and prioritize potential sales opportunities.",
                  "CRM Efficiency: Reduce repetitive data entry, improve information accuracy, and streamline sales workflows.",
                  "Sales Follow-Up: Support scheduling, reminders, and personalized communications to reduce missed opportunities.",
                  "Sales Forecasting: Analyze pipeline information and identify patterns that may improve forecasting accuracy.",
                  "Performance Monitoring: Identify potential sales and operational problems through KPI analysis, CRM activity reviews, and automated alerts.",
                ],
                closing:
                  "We evaluate technology and AI opportunities according to their practicality, implementation requirements, and potential financial benefit.",
                advantage:
                  "THE ADVANTAGE: Improve operational efficiency and sales productivity while avoiding unnecessary technology investments.",
              },
            ],
          },
          {
            title: "III. SUSTAINABLE ORGANIZATIONAL IMPROVEMENTS",
            advantages: [
              {
                number: 9,
                title: "MEASURABLE PERFORMANCE IMPROVEMENT",
                paragraphs: [
                  "Improvement must be measured to determine whether it is working. We help establish clear performance baselines, relevant KPIs, and practical reporting procedures.",
                ],
                bullets: [
                  "Establish starting performance measurements.",
                  "Track prospecting activity, conversion rates, closing performance, and other relevant KPIs.",
                  "Compare individual and organizational results against established baselines.",
                  "Identify performance trends and problems requiring management attention.",
                  "Develop reporting procedures that provide leadership with meaningful performance visibility.",
                  "Adjust improvement initiatives based on measurable findings.",
                ],
                advantage:
                  "THE ADVANTAGE: Greater visibility into sales performance and a practical way to evaluate progress, accountability, and results.",
              },
              {
                number: 10,
                title: "STRENGTHEN EXISTING SALES LEADERSHIP",
                paragraphs: [
                  "Sustainable sales performance depends on effective leadership, consistent coaching, clear expectations, and accountability. We work collaboratively with existing sales managers to strengthen these capabilities.",
                ],
                bullets: [
                  "Clarify leadership roles, responsibilities, and expectations.",
                  "Improve individual sales coaching and performance management.",
                  "Establish consistent accountability and follow-through.",
                  "Strengthen sales meetings and communication practices.",
                  "Help managers identify and address performance problems earlier.",
                  "Develop procedures that support continuous improvement after our engagement.",
                ],
                advantage:
                  "THE ADVANTAGE: Stronger internal leadership and management practices that help sustain performance improvements without ongoing outside supervision.",
              },
              {
                number: 11,
                title: "MINIMAL DISRUPTION AND NO REQUIRED ONGOING CONTRACTS",
                paragraphs: [
                  "Our approach is designed to work within your existing organization, minimizing unnecessary disruption to daily sales operations.",
                  "Much of our work can be conducted remotely through video meetings, recorded sales conversations, CRM reviews, and direct interaction with salespeople and management.",
                ],
                bullets: [
                  "Conduct assessments and coaching remotely when practical.",
                  "Reduce unnecessary travel expenses and scheduling complications.",
                  "Work around existing sales responsibilities and operational priorities.",
                  "Introduce improvements without unnecessarily interrupting productive activities.",
                  "Establish processes your organization can continue managing independently.",
                  "Make additional advisory or implementation assistance optional after completion.",
                ],
                advantage:
                  "THE ADVANTAGE: Practical implementation with limited operational disruption and no required long-term consulting dependency.",
              },
              {
                number: 12,
                title: "FINANCIALLY DISCIPLINED, LONG-TERM VALUE",
                paragraphs: [
                  "Our objective is not to create an ongoing need for our services. It is to help your company improve its ability to generate revenue, manage performance, and sustain results using its own people and resources.",
                ],
                bullets: [
                  "Increase productivity and improve sales execution.",
                  "Strengthen existing management systems and accountability.",
                  "Improve conversion rates and reduce avoidable lost opportunities.",
                  "Identify opportunities to improve profitability and operating efficiency.",
                  "Establish repeatable processes that support consistent performance.",
                  "Create a stronger foundation for sustainable revenue growth.",
                  "Provide additional assistance only when your organization determines it is needed.",
                ],
                advantage:
                  "THE ADVANTAGE: An investment in organizational capabilities intended to continue delivering value long after our engagement is completed.",
              },
            ],
          },
        ],
        bottomLine: {
          title: "THE BOTTOM LINE",
          headline:
            "BEFORE YOU INVEST MORE MONEY GROWING YOUR SALES FORCE, DETERMINE HOW MUCH MORE YOUR EXISTING SALES ORGANIZATION COULD PRODUCE.",
          paragraphs: [
            "At NORTH POINT SALES GROUP, we know that meaningful sales-performance improvement requires practical implementation, measurable results, financial discipline, and a clear understanding of what each organization actually needs.",
            "We also know that improving sales performance does not necessarily require hiring more salespeople, purchasing additional technology, replacing existing systems, or committing to lengthy consulting contracts.",
            "We focus on identifying what needs attention, implementing meaningful improvements, establishing measurable performance standards, and equipping your organization to sustain stronger results.",
            "Our objective is straightforward: Help your existing sales organization perform better, produce more, and become more profitable — without spending more than necessary.",
          ],
        },
        cta: {
          title: "LET'S DISCUSS YOUR SALES ORGANIZATION.",
          paragraphs: [
            "There is no cost for an initial conversation. Let's determine where improvement could make the greatest difference in your business.",
          ],
        },
      },
    },
  },
  //steps section
  salesEngagement: {
    badge: "30-90 DAY FOCUS",
    title: "OUR 30-90 DAY IMPLEMENTATION PROCESS",
    subtitle: [
      "30 days for focused implementation when the work can be completed efficiently within a concentrated timeframe.",
      "60 days for broader implementation requiring additional coaching, measurement, refinement, or follow-through.",
      "90 days for larger or more complex sales organizations requiring more extensive implementation across multiple areas.",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Discover",
        description:
          "We gain a deep understanding of your business, goals, challenges, and current sales performance.",
        icon: "search", // Lucide Search icon
        popout: {
          title: "Understand the Business Before Making Recommendations",
          paragraphs: [
            "Every engagement begins with understanding the organization as it operates today.",
            "We learn about your business model, sales objectives, leadership priorities, customers, sales structure, current challenges, and the results you are trying to achieve.",
            "This may include understanding:",
            "This discovery process gives us the context necessary to evaluate the sales organization intelligently rather than beginning with assumptions.",
          ],
          list: [
            "How revenue is currently generated",
            "How prospects enter the sales pipeline",
            "How the sales team is structured",
            "How salespeople are managed and supported",
            "Current sales goals and performance expectations",
            "Where leadership believes opportunities may exist",
            "What has already been tried",
            "What appears to be working well",
            "Where performance may be inconsistent or difficult to manage",
          ],
          nextStep:
            "Once we understand the business and leadership's objectives, we can determine which areas of the sales organization warrant closer examination.",
        },
      },
      {
        stepNumber: 2,
        title: "Assess",
        description:
          "We assess people, processes, pipeline, tools, and metrics to identify gaps and the biggest opportunities.",
        icon: "clipboard-list", // Lucide ClipboardList icon
        popout: {
          title: "Identify the Areas Most Likely to Affect Performance",
          paragraphs: [
            "We assess the parts of the sales organization most relevant to the company's objectives and current performance.",
            "Depending on the engagement, this can include:",
            "The purpose is not to find problems everywhere.",
            "If something is working well, we leave it alone. Our focus is identifying the gaps, bottlenecks, and opportunities where improvement could produce meaningful business value.",
          ],
          list: [
            "Salespeople and individual performance",
            "Sales leadership",
            "Prospecting and lead generation",
            "Lead qualification",
            "Sales process",
            "Messaging and presentations",
            "Pipeline management",
            "Follow-up",
            "Closing effectiveness",
            "Recruiting and onboarding",
            "Training and coaching",
            "Accountability systems",
            "Technology and sales tools",
            "Performance metrics and reporting",
          ],
          nextStep:
            "We prioritize the findings so leadership knows which opportunities deserve attention first and which areas require little or no change.",
        },
      },
      {
        stepNumber: 3,
        title: "Design",
        description:
          "We develop a customised strategy, systems, and action plan aligned with your objectives.",
        icon: "workflow", // Lucide LayoutGrid or Workflow icon
        popout: {
          title: "Develop a Practical Plan Based on What We Find",
          paragraphs: [
            "Once priorities have been identified, we design an approach specifically around the needs of the organization.",
            "There is no standard solution that every client is expected to adopt.",
            "Depending on what the assessment reveals, the plan may address:",
            "The objective is to create a focused implementation plan that addresses the highest-value opportunities without introducing unnecessary complexity.",
          ],
          list: [
            "Sales strategy",
            "Sales structure and responsibilities",
            "Prospecting",
            "Lead management",
            "Sales presentations and messaging",
            "Follow-up systems",
            "Pipeline management",
            "Coaching and development",
            "Recruiting or onboarding",
            "Performance expectations",
            "Accountability",
            "Leadership practices",
            "Reporting and measurement",
          ],
          nextStep:
            "Leadership receives a defined set of priorities, actions, responsibilities, and performance objectives that can move directly into implementation.",
        },
      },
      {
        stepNumber: 4,
        title: "Implement",
        description:
          "We work alongside your team to implement priorities and build momentum quickly.",
        icon: "settings", // Lucide Settings icon
        popout: {
          title: "Turn the Plan Into Action",
          paragraphs: [
            "Recommendations only matter when they are put into practice.",
            "NORTH POINT SALES GROUP works alongside leadership and the sales organization to help implement the agreed-upon priorities rather than simply delivering a report and leaving the company to execute on its own.",
            "Implementation may involve:",
            "Responsibilities are clearly defined so leadership can see what is being done, who is responsible, and what progress is being made.",
          ],
          list: [
            "Working directly with sales leadership",
            "Coaching individual salespeople",
            "Improving sales conversations and presentations",
            "Strengthening prospecting and follow-up",
            "Establishing or refining sales processes",
            "Improving pipeline management",
            "Introducing accountability systems",
            "Helping implement performance expectations",
            "Supporting recruiting or onboarding improvements",
            "Coordinating appropriate outside specialists when needed",
          ],
          nextStep:
            "We move from recommendations to execution, concentrating first on the changes most likely to produce measurable improvement.",
        },
      },
      {
        stepNumber: 5,
        title: "Optimize",
        description:
          "We refine processes, reinforce accountability, and improve performance using data and feedback.",
        icon: "bar-chart-3", // Lucide BarChart3 icon
        popout: {
          title: "Measure What Is Working and Improve What Is Not",
          paragraphs: [
            "Implementation is rarely a one-time event.",
            "Once changes are underway, we evaluate how they are performing in the real sales environment.",
            "We can review:",
            "Where something is working, we reinforce it.",
            "Where results indicate an adjustment is needed, we refine the approach based on actual performance rather than theory.",
          ],
          list: [
            "Sales activity",
            "Pipeline movement",
            "Conversion performance",
            "Individual salesperson performance",
            "Lead response and follow-up",
            "Coaching effectiveness",
            "Accountability",
            "Adoption of new processes",
            "Management effectiveness",
            "Progress toward agreed-upon objectives",
          ],
          nextStep:
            "We use performance information and feedback to strengthen successful changes, correct what is not working, and continue improving execution.",
        },
      },
      {
        stepNumber: 6,
        title: "Sustain",
        description:
          "We establish systems and habits that ensure lasting improvement and long-term results.",
        icon: "check", // Lucide Check icon
        popout: {
          title: "Make Improvement Part of the Sales Organization",
          paragraphs: [
            "The objective is not to create permanent dependence on NORTH POINT SALES GROUP.",
            "Where possible, we help leadership establish the systems, expectations, management practices, and habits necessary for improvements to continue after the initial engagement.",
            "That can include:",
            "The goal is to leave the organization stronger and better equipped to maintain the improvements that have been implemented.",
            "NORTH POINT SALES GROUP can also remain available as a long-term resource when new challenges, opportunities, or growth initiatives arise.",
          ],
          list: [
            "Clear sales processes",
            "Defined performance expectations",
            "Management routines",
            "Coaching practices",
            "Pipeline disciplines",
            "Accountability systems",
            "Reporting and measurement",
            "Training resources",
            "Leadership responsibilities",
            "Ongoing performance reviews",
          ],
          nextStep:
            "We help transition successful improvements into normal operating practices so the organization can sustain performance while retaining access to NORTH POINT SALES GROUP when additional support is needed.",
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
          {
            label: "Understand your business, goals, and challenges",
            popout: {
              title: "Understand Your Business, Goals, and Challenges",
              paragraphs: [
                "Before recommending changes, we first develop a clear understanding of how your business operates, what leadership is trying to accomplish, and where sales performance may be falling short of its potential.",
                "This can include reviewing your current sales structure, leadership approach, sales team, lead sources, sales process, messaging, pipeline activity, accountability systems, conversion performance, and other factors that influence revenue production.",
                "The objective is not to assume a problem exists in any particular area. It is to understand the organization as it operates today and determine where closer examination may be warranted.",
              ],
            },
          },
          {
            label: "Assess current state and identify opportunities",
            popout: {
              title: "Assess Current State and Identify Opportunities",
              paragraphs: [
                "Once we understand the organization, we evaluate the areas most relevant to improving sales performance.",
                "We look for opportunities such as:",
                "The result is a clearer picture of what is working, what may need improvement, and which opportunities are most worthy of leadership's attention.",
              ],
              list: [
                "Underperforming stages of the sales process",
                "Inconsistent sales execution",
                "Gaps in leadership or accountability",
                "Weak or unclear sales messaging",
                "Lead-generation or follow-up inefficiencies",
                "Training and development needs",
                "Pipeline management issues",
                "Structural or role-related problems",
                "Opportunities to improve conversion or productivity",
                "Additional revenue potential within the existing organization",
              ],
            },
          },
        ],
      },
      {
        id: "design-align",
        stepNumber: "2.",
        title: "DESIGN & ALIGN",
        icon: "target",
        bullets: [
          {
            label: "Define winning strategy and operating model",
            popout: {
              title: "Define the Strategy and Operating Model",
              paragraphs: [
                "Once the most important opportunities have been identified, we help leadership determine what should change and how those changes should be implemented.",
                "Rather than introducing unnecessary complexity, the objective is to develop a practical approach focused on the areas most likely to improve sales performance.",
                "Depending on the engagement, this may include changes to:",
                "The strategy is designed around the realities of your organization rather than forcing your company into a predetermined sales model.",
              ],
              list: [
                "Sales strategy",
                "Sales process",
                "Lead generation and qualification",
                "Sales presentations and messaging",
                "Pipeline management",
                "Recruiting and onboarding",
                "Training and coaching",
                "Performance expectations",
                "Management systems",
                "Accountability and reporting",
              ],
            },
          },
          {
            label: "Align structure, roles, and processes for success",
            popout: {
              title: "Align Structure, Roles, and Processes for Success",
              paragraphs: [
                "Strong sales performance requires more than good individual salespeople. Leadership, structure, roles, systems, expectations, and processes must work together.",
                "We help determine whether the people responsible for generating, managing, and supporting revenue are properly aligned with the company's objectives.",
                "That may involve clarifying responsibilities, strengthening management processes, improving communication, establishing performance expectations, modifying workflows, or helping leadership determine where additional resources or expertise may be needed.",
                "The goal is to create an operating structure that makes successful execution easier, clearer, and more consistent.",
              ],
            },
          },
        ],
      },
      {
        id: "implement-grow",
        stepNumber: "3.",
        title: "IMPLEMENT & GROW",
        icon: "trending-up",
        bullets: [
          {
            label: "Execute with focus and accountability",
            popout: {
              title: "Execute With Focus and Accountability",
              paragraphs: [
                "Recommendations have limited value unless they are actually implemented.",
                "NORTH POINT SALES GROUP is designed to move beyond analysis and help leadership put agreed-upon improvements into operation.",
                "Depending on the engagement, implementation may include:",
                "Progress is reviewed throughout the engagement so leadership can see what is being implemented, who is responsible, and whether the changes are producing the intended results.",
              ],
              list: [
                "Working directly with sales leadership",
                "Coaching or developing salespeople",
                "Refining sales presentations and messaging",
                "Improving prospecting and follow-up",
                "Strengthening pipeline management",
                "Establishing accountability systems",
                "Improving sales meetings and management practices",
                "Implementing new processes or performance standards",
                "Coordinating with appropriate outside specialists when needed",
              ],
            },
          },
          {
            label: "Enable your team and drive continuous improvement",
            popout: {
              title: "Enable Your Team and Drive Continuous Improvement",
              paragraphs: [
                "The objective is not to create permanent dependence on an outside consulting firm.",
                "Where possible, we help strengthen the capabilities of your existing leadership and sales organization so improvements can continue after the initial engagement.",
                "As results emerge, additional opportunities may also become visible. NORTH POINT SALES GROUP can remain available as a long-term sales performance resource when leadership needs additional guidance, implementation support, specialized expertise, or fractional sales leadership.",
                "The ultimate objective is a stronger, more capable sales organization that can continue improving performance as the business grows.",
              ],
            },
          },
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
          {
            label: "Increase Productivity",
            popout: {
              title: "Increase Productivity",
              paragraphs: [
                "Improve how effectively your sales organization uses its available time, talent, opportunities, and resources. We identify where productive selling time is being lost and make practical changes that allow the existing sales organization to produce more.",
              ],
            },
          },
          {
            label: "Improve Consistency",
            popout: {
              title: "Improve Consistency",
              paragraphs: [
                "Create greater consistency in how salespeople prospect, qualify, present, follow up, manage opportunities, and move prospects through the sales process. The objective is a sales organization that performs reliably rather than depending on individual habits or exceptional performers.",
              ],
            },
          },
          {
            label: "Shorten Sales Cycles",
            popout: {
              title: "Shorten Sales Cycles",
              paragraphs: [
                "Identify what is unnecessarily slowing opportunities from initial contact to closed business. We address bottlenecks in the sales process, improve movement through the pipeline, and help salespeople advance qualified opportunities more efficiently.",
              ],
            },
          },
          {
            label: "Improve Forecasting",
            popout: {
              title: "Improve Forecasting",
              paragraphs: [
                "Establish a clearer, more reliable view of what is actually happening in the sales pipeline. We examine opportunity quality, pipeline stages, sales activity, conversion patterns, and forecasting practices so leadership can make decisions based on meaningful sales information.",
              ],
            },
          },
          {
            label: "Increase Profitability",
            popout: {
              title: "Increase Profitability",
              paragraphs: [
                "Focus sales improvement on profitable growth—not simply more revenue. We identify opportunities to improve sales productivity, conversion, customer value, pricing discipline, and other factors that can increase the profit contribution generated by the sales organization.",
              ],
            },
          },
          {
            label: "Create Sustainable Growth",
            popout: {
              title: "Create Sustainable Growth",
              paragraphs: [
                "Build improvements into the sales organization so results are not dependent on a temporary push or a few individual performers. The objective is a stronger sales operation with the processes, leadership, accountability, measurement, and capabilities needed to continue improving and support future growth.",
              ],
            },
          },
          {
            label: "AI Sales Integration",
            sharedDialog: "aiSalesIntegration",
          },
        ],
      },
      {
        id: "sales-systems",
        title: "SALES SYSTEMS",
        icon: "settings",
        bullets: [
          {
            label: "Sales Process",
            popout: {
              title: "Sales Process",
              paragraphs: [
                "Examine how prospects move from initial contact through qualification, presentation, follow-up, and closing. We identify unnecessary steps, gaps, inconsistencies, and bottlenecks, then establish a more effective process for the organization.",
              ],
            },
          },
          {
            label: "CRM Optimization",
            popout: {
              title: "CRM Optimization",
              paragraphs: [
                "Evaluate whether the CRM is actually supporting the sales organization or simply functioning as a database. We improve how information is entered, organized, managed, and used so salespeople and leadership have the information they need to manage opportunities and performance effectively.",
              ],
            },
          },
          {
            label: "Pipeline Management",
            popout: {
              title: "Pipeline Management",
              paragraphs: [
                "Establish a disciplined approach to managing opportunities throughout the sales cycle. We examine pipeline quality, opportunity movement, follow-up, stalled opportunities, and conversion rates so salespeople and leadership know what is real, what needs attention, and what needs to happen next.",
              ],
            },
          },
          {
            label: "Forecasting",
            popout: {
              title: "Forecasting",
              paragraphs: [
                "Improve the accuracy and usefulness of sales forecasts by establishing consistent criteria for evaluating opportunities and projecting results. Leadership should be able to distinguish between legitimate opportunities and pipeline activity that is unlikely to produce revenue.",
              ],
            },
          },
          {
            label: "Performance Dashboards",
            popout: {
              title: "Performance Dashboards",
              paragraphs: [
                "Create simple, useful visibility into the numbers that matter. Dashboards can provide leadership with a clear view of sales activity, pipeline performance, conversion, revenue, and other key indicators without burying decision-makers in unnecessary data.",
              ],
            },
          },
          {
            label: "Sales Meetings",
            popout: {
              title: "Sales Meetings",
              paragraphs: [
                "Make sales meetings more productive, focused, and accountable. We examine meeting frequency, structure, content, participation, and follow-through so meetings are used to manage the business, address obstacles, develop people, and move opportunities forward—not simply review numbers.",
              ],
            },
          },
          {
            label: "Accountability Systems",
            popout: {
              title: "Accountability Systems",
              paragraphs: [
                "Establish clear expectations for sales performance, activity, follow-through, and results. Accountability should be measurable and consistent, giving salespeople a clear understanding of what is expected and giving leadership the information needed to address issues promptly.",
              ],
            },
          },
        ],
      },
      {
        id: "sales-leadership",
        title: "SALES LEADERSHIP",
        icon: "users",
        bullets: [
          {
            label: "Develop Stronger Sales Leaders",
            popout: {
              title: "Develop Stronger Sales Leaders",
              paragraphs: [
                "Strengthen the ability of sales leaders to direct performance, develop people, manage the pipeline, make sound decisions, and consistently move the sales organization toward its objectives. The focus is on practical leadership effectiveness—not simply management responsibilities.",
              ],
            },
          },
          {
            label: "Improve Accountability",
            popout: {
              title: "Improve Accountability",
              paragraphs: [
                "Create clear expectations for sales performance, activity, execution, and results, with consistent follow-through. Effective accountability gives salespeople clarity about what is expected and gives leaders a practical way to address performance issues before they become larger problems.",
              ],
            },
          },
          {
            label: "Improve Coaching",
            popout: {
              title: "Improve Coaching",
              paragraphs: [
                "Strengthen the quality and consistency of sales coaching. We examine how managers coach their people, what they coach, how often they coach, and whether coaching is producing measurable improvement in sales performance.",
              ],
            },
          },
          {
            label: "Create High-Performing Teams",
            popout: {
              title: "Create High-Performing Teams",
              paragraphs: [
                "Build a sales environment in which people understand their roles, expectations, objectives, and responsibilities—and have the leadership, systems, and support necessary to perform at a high level. The objective is to create a team that performs consistently rather than relying on a few individual stars.",
              ],
            },
          },
          {
            label: "Sales Leadership & Implementation Support",
            sharedDialog: "salesLeadershipImplementationSupport",
          },
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
          {
            title: "Leadership Roles and Responsibilities",
            detail:
              "We examine whether sales leadership responsibilities are clearly defined and understood. This includes who sets direction, manages performance, coaches salespeople and resolves problems. Clear ownership helps prevent gaps, duplicated effort and inconsistent direction.",
          },
          {
            title: "Communication of Expectations",
            detail:
              "We review how leaders communicate sales targets, activity expectations, priorities and performance standards. We determine whether salespeople understand what is expected, how success is measured and when expectations change.",
          },
          {
            title: "Coaching and Performance Management",
            detail:
              "We examine how managers identify performance gaps, provide coaching and follow through on agreed improvements. We assess whether coaching addresses specific needs and produces measurable progress from each salesperson's starting baseline.",
          },
          {
            title: "Accountability Standards",
            detail:
              "We review whether commitments, responsibilities and performance standards are consistently followed through. This includes how missed expectations are addressed, what support is provided and whether corrective actions lead to improvement.",
          },
          {
            title: "Sales Meeting Effectiveness",
            detail:
              "We examine whether sales meetings help the team make decisions, resolve obstacles and advance opportunities. We review their purpose, frequency and follow-through to determine whether they justify the time invested.",
          },
          {
            title: "Decision-Making Authority",
            detail:
              "We review who can approve pricing, discounts, account assignments and other sales decisions. We examine whether authority is clear and whether unnecessary approval delays are slowing opportunities or limiting managers' effectiveness.",
          },
          {
            title: "Manager-to-Salesperson Ratios",
            detail:
              "We assess whether each manager has sufficient capacity to coach, supervise and support the salespeople they oversee. The appropriate ratio depends on team experience, sales complexity and the manager's other responsibilities.",
          },
          {
            title: "Leadership Visibility into Pipeline and Activity",
            detail:
              "We examine whether leaders have an accurate, current view of sales activity, opportunity progress and pipeline quality. We assess whether the available information helps them identify stalled opportunities, provide timely support and make informed forecasts.",
          },
          {
            title:
              "Alignment Between Leadership Priorities and Company Objectives",
            detail:
              "We review whether sales leadership priorities support the company's revenue, profitability, customer retention and growth objectives. This includes whether targets, incentives and daily decisions direct the team toward the outcomes the company actually needs.",
          },
          {
            title:
              "Whether Managers Are Spending Their Time Where It Creates the Greatest Value",
            detail:
              "We examine how managers divide their time among coaching, planning, customer involvement, administration and problem-solving. We identify whether routine demands are crowding out the leadership activities most likely to improve team performance.",
          },
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
          {
            title: "Prospecting Procedures",
            detail:
              "We examine how the team identifies, researches and contacts potential customers. We assess whether prospecting follows a clear, repeatable approach that directs effort toward suitable prospects and supports a consistent flow of sales opportunities.",
          },
          {
            title: "Lead Handling",
            detail:
              "We review how incoming leads are received, assigned and contacted. This includes response times, ownership and tracking to determine whether leads receive timely attention and remain accounted for throughout the sales process.",
          },
          {
            title: "Qualification Standards",
            detail:
              "We examine how salespeople determine whether a prospect represents a realistic business opportunity. We review how customer needs, purchasing authority, budget and timing are established so the team can prioritize opportunities with a reasonable likelihood of progressing.",
          },
          {
            title: "Sales Stages",
            detail:
              "We review whether the sales process has clearly defined stages and specific requirements for advancing between them. This helps determine whether opportunities are progressing based on actual customer commitments and completed actions.",
          },
          {
            title: "Follow-Up Procedures",
            detail:
              "We examine how follow-up is scheduled, carried out and documented. We assess whether each contact has a clear purpose and next step, helping the team maintain momentum without allowing opportunities to become neglected.",
          },
          {
            title: "Proposal and Quotation Processes",
            detail:
              "We review how proposals and quotations are prepared, approved, delivered and followed up. We examine whether they accurately address customer needs, communicate value and reach the customer promptly enough to support the buying decision.",
          },
          {
            title: "Closing Procedures",
            detail:
              "We examine how salespeople confirm readiness to proceed, address remaining concerns and secure the customer's commitment. We review whether agreements, approvals and required paperwork are completed efficiently and accurately.",
          },
          {
            title: "Handoff to Operations or Customer Service",
            detail:
              "We review how customer information, commitments and requirements are transferred after a sale. We assess whether the receiving team has what it needs to deliver as promised and whether responsibility for the transition is clear.",
          },
          {
            title: "Account Development Procedures",
            detail:
              "We examine how the organization identifies additional opportunities within existing customer accounts. This includes reviewing customer needs, maintaining contact and coordinating appropriate renewals, repeat purchases or expanded services.",
          },
          {
            title: "Documentation and Consistency",
            detail:
              "We review whether essential sales procedures and customer information are documented, accessible and consistently used. We assess whether the team has enough structure to work reliably, support new employees and maintain continuity when responsibilities change.",
          },
          {
            title: "Bottlenecks or Unnecessary Steps",
            detail:
              "We examine where sales activity slows because of delays, repeated work, unclear responsibilities or unnecessary approvals. We determine which steps protect quality and which could be simplified to improve efficiency and customer responsiveness.",
          },
          {
            title: "Areas Where Sales Opportunities May Be Getting Lost",
            detail:
              "We examine where prospects disengage, opportunities stall or potential sales leave the process without a clear explanation. We look for recurring patterns to determine whether the losses reflect customer decisions or preventable gaps in the sales process.",
          },
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
          {
            title: "Individual Production",
            detail:
              "We examine each salesperson's results against established targets and their current performance baseline. We consider revenue, profitability and new or existing account sales, along with differences in assignments and available opportunities.",
          },
          {
            title: "Team Production",
            detail:
              "We review the team's combined results to determine whether the sales organization is meeting its objectives. We examine how individual contributions affect overall production and whether results depend too heavily on a small number of salespeople.",
          },
          {
            title: "Productivity Levels",
            detail:
              "We examine the sales results generated relative to the time and resources invested. This helps identify whether administrative demands, inefficient processes or misplaced effort are limiting the team's capacity to produce more sales.",
          },
          {
            title: "Activity Levels",
            detail:
              "We review the volume and quality of prospecting, customer conversations, meetings, proposals and follow-up. We establish the current activity baseline and assess whether those activities are sufficient and appropriately directed to support sales objectives.",
          },
          {
            title: "Conversion Performance",
            detail:
              "We examine how effectively salespeople move opportunities from one sales stage to the next and ultimately into completed sales. We compare current conversion rates with prior results and comparable opportunities to identify where progress may be breaking down.",
          },
          {
            title: "Skill Differences",
            detail:
              "We assess differences in prospecting, discovery, presentation, objection handling, negotiation and closing skills. We identify where specific coaching or support could help individual salespeople improve their results.",
          },
          {
            title: "Territory or Account Performance",
            detail:
              "We review results across assigned territories and customer accounts, considering their potential, maturity and coverage requirements. This helps distinguish performance issues from differences in opportunity, workload or account assignments.",
          },
          {
            title: "Performance Expectations",
            detail:
              "We examine whether production targets, activity standards and other expectations are clear, understood and supported by available resources. We assess whether salespeople know both the results required and the responsibilities involved in achieving them.",
          },
          {
            title: "Consistency Among Representatives",
            detail:
              "We review how consistently salespeople produce results over time and follow established sales practices. We consider differences in experience and assignments to identify avoidable variation and opportunities for more dependable team performance.",
          },
          {
            title: "Top-Performer Practices",
            detail:
              "We examine the approaches used by consistently successful salespeople to understand what contributes to their results. We assess which practices can be adapted and shared across the team, accounting for differences in customers, territories and selling styles.",
          },
          {
            title: "Underperformance Patterns",
            detail:
              "We look for recurring shortfalls in activity, conversion, production or account development. We examine when and where those patterns occur to determine whether they reflect individual skill gaps, process problems, limited opportunities or other constraints.",
          },
          {
            title: "Management Response to Performance Issues",
            detail:
              "We review how managers identify, discuss and address performance shortfalls. We assess whether their response includes clear expectations, appropriate support, agreed actions and follow-up against the salesperson's starting baseline.",
          },
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
          {
            title: "Target Market Definition",
            detail:
              "We examine whether the organization has clearly defined the types of companies and decision-makers it is best positioned to serve. This includes customer needs, industry, company size and other characteristics that help focus prospecting on suitable opportunities.",
          },
          {
            title: "Prospect Identification",
            detail:
              "We review how potential customers are found, researched and selected for contact. We assess whether prospect information is accurate, current and relevant enough to help salespeople reach the appropriate people with a clear reason for contacting them.",
          },
          {
            title: "Lead Sources",
            detail:
              "We examine where leads originate and which sources produce qualified opportunities and completed sales. We consider lead quality, volume and cost to determine where the organization's time and investment are producing the strongest results.",
          },
          {
            title: "Outbound Prospecting",
            detail:
              "We review how the team initiates contact through calls, emails and other outreach. We assess whether targeting, messaging and follow-through work together to generate meaningful conversations with potential customers.",
          },
          {
            title: "Inbound Lead Handling",
            detail:
              "We examine how inquiries are received, assigned, qualified and answered. We assess whether response times and follow-up procedures help convert customer interest into a meaningful sales conversation.",
          },
          {
            title: "Appointment Setting",
            detail:
              "We review how initial interest is converted into scheduled sales conversations. We examine appointment quality, attendance and next steps to determine whether meetings involve suitable prospects and create opportunities to advance a sale.",
          },
          {
            title: "Initial Messaging",
            detail:
              "We examine whether the first contact clearly explains why the prospect should consider a conversation. We assess whether the message addresses a relevant business need, communicates potential value and gives the prospect a straightforward next step.",
          },
          {
            title: "Qualification Criteria",
            detail:
              "We review how the team determines whether a prospect has a relevant need, purchasing authority, financial capacity and a realistic timeframe. We assess whether qualification helps prioritize promising opportunities while allowing suitable prospects time to develop.",
          },
          {
            title: "Follow-Up Frequency",
            detail:
              "We examine how often prospects are contacted and how that timing reflects their interest, circumstances and buying process. We assess whether follow-up maintains momentum and whether promising opportunities are being lost through gaps in contact.",
          },
          {
            title: "Lead Nurturing",
            detail:
              "We review how the organization maintains contact with suitable prospects who are not yet ready to buy. We assess whether ongoing communication provides relevant value and helps identify when the prospect is ready for a more direct sales conversation.",
          },
          {
            title: "Referral Development",
            detail:
              "We examine how the organization earns and develops introductions from customers, business relationships and other referral sources. We assess whether there is a consistent approach to requesting appropriate introductions and following through on referred opportunities.",
          },
          {
            title: "Prospecting Productivity",
            detail:
              "We review the qualified opportunities generated relative to the time, effort and cost invested in prospecting. We establish the current baseline and identify where better targeting, contact methods or follow-up could improve results.",
          },
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
          {
            title: "Opening the Sales Conversation",
            detail:
              "We examine how salespeople establish relevance, explain the purpose of the conversation and engage the prospect. We assess whether the opening creates a clear reason to continue and sets appropriate expectations for the discussion.",
          },
          {
            title: "Discovery Questions",
            detail:
              "We review the questions salespeople use to understand the prospect's situation, priorities and decision process. We assess whether those questions uncover useful information and support a focused business conversation.",
          },
          {
            title: "Needs Identification",
            detail:
              "We examine how salespeople confirm the customer's needs and distinguish primary concerns from secondary preferences. We assess whether the proposed solution addresses what matters most and whether the customer agrees with that understanding.",
          },
          {
            title: "Value Proposition",
            detail:
              "We review how clearly the team explains the business value of the offering. We assess whether salespeople connect its benefits to the customer's specific priorities and provide credible reasons to consider the investment.",
          },
          {
            title: "Differentiation",
            detail:
              "We examine how salespeople explain the meaningful differences between their offering and available alternatives. We assess whether those differences matter to the customer and are supported by specific, credible information.",
          },
          {
            title: "Presentation Structure",
            detail:
              "We review how the presentation moves from understanding the customer's situation to explaining the solution and discussing a decision. We assess whether the sequence is clear, focused and adaptable to the conversation.",
          },
          {
            title: "Product or Service Positioning",
            detail:
              "We examine how the offering is presented in relation to the customer's needs, expectations and available options. We assess whether its purpose, scope and suitability are clear enough for the customer to evaluate.",
          },
          {
            title: "Financial Justification",
            detail:
              "We review how salespeople explain the investment in relation to potential financial benefits, costs or savings. We assess whether calculations use reasonable assumptions and clearly distinguish supported figures from estimates.",
          },
          {
            title: "Handling Objections",
            detail:
              "We examine how salespeople clarify and respond to concerns about price, timing, suitability and other decision factors. We assess whether responses address the actual concern and help the customer determine whether to proceed.",
          },
          {
            title: "Competitive Comparisons",
            detail:
              "We review how the team compares its offering with competitors and other options, including keeping the current approach. We assess whether comparisons are accurate, relevant and focused on the factors that matter to the customer.",
          },
          {
            title: "Proposal Presentation",
            detail:
              "We examine how salespeople walk customers through the recommended solution, scope, pricing and terms. We assess whether the proposal reinforces the agreed needs and gives the customer a clear basis for making a decision.",
          },
          {
            title: "Closing Conversations",
            detail:
              "We review how salespeople confirm that key questions have been answered and ask for a decision. We assess whether they recognize readiness to proceed, address remaining concerns and make the commitment process clear.",
          },
          {
            title: "Next-Step Agreements",
            detail:
              "We examine whether sales conversations end with an agreed action, a responsible person and a timeframe. We assess whether those agreements maintain progress and prevent opportunities from drifting without a clear direction.",
          },
          {
            title: "Consistency of Messaging Across the Team",
            detail:
              "We review whether salespeople communicate the organization's value, capabilities, pricing and commitments accurately and consistently. We assess whether the team shares a clear core message while adapting the conversation to each customer.",
          },
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
          {
            title: "Pipeline Stages",
            detail:
              "We examine whether the pipeline's stages reflect the customer's actual buying process. We assess whether they give the team a useful structure for managing opportunities and give leadership a clear view of progress toward a sale.",
          },
          {
            title: "Opportunity Qualification",
            detail:
              "We review the requirements for accepting an opportunity into the pipeline. We assess whether there is sufficient evidence of customer need, purchasing ability and a realistic decision process to justify continued sales effort.",
          },
          {
            title: "Stage Definitions",
            detail:
              "We examine whether each stage has clear entry and completion requirements. We assess whether salespeople categorize opportunities consistently and advance them based on evidence of progress.",
          },
          {
            title: "Deal Progression",
            detail:
              "We review how opportunities move through the pipeline and what actions support that movement. We assess whether progress reflects meaningful customer involvement, resolved questions and agreed commitments.",
          },
          {
            title: "Probability Assumptions",
            detail:
              "We examine how the likelihood of winning an opportunity is estimated. We assess whether those estimates reflect historical conversion results and the circumstances of the deal, and whether they are updated as new information becomes available.",
          },
          {
            title: "Forecast Accuracy",
            detail:
              "We compare forecast revenue with actual results to establish the current accuracy baseline. We examine recurring differences to determine whether qualification, timing, deal values or probability assumptions need improvement.",
          },
          {
            title: "Pipeline Coverage",
            detail:
              "We review the value of qualified opportunities available to support the sales target for a defined period. We assess whether coverage is sufficient based on actual win rates, expected closing dates and the time required to develop additional opportunities.",
          },
          {
            title: "Sales Cycle Length",
            detail:
              "We examine how long opportunities take to move from a defined starting point to a completed sale. We establish the current baseline and review differences by customer type, deal size or offering to identify avoidable delays.",
          },
          {
            title: "Stalled Opportunities",
            detail:
              "We review opportunities that have stopped making meaningful progress. We examine the reasons, confirm whether customer interest remains active and determine what action is needed to advance, defer or close out the opportunity.",
          },
          {
            title: "Follow-Up Discipline",
            detail:
              "We examine whether agreed follow-up actions are completed on time and recorded accurately. We assess whether each active opportunity has a clear next step, an accountable salesperson and a realistic date for action.",
          },
          {
            title: "Opportunity Aging",
            detail:
              "We review how long open opportunities have remained in the pipeline and in each stage. We compare that time with typical sales patterns to identify deals that require attention or may no longer belong in the active pipeline.",
          },
          {
            title: "Closing-Date Accuracy",
            detail:
              "We examine whether expected closing dates are supported by the customer's decision process and remaining requirements. We review repeated date changes to identify unrealistic assumptions or unresolved obstacles affecting the forecast.",
          },
          {
            title: "Lost-Deal Analysis",
            detail:
              "We review why opportunities were lost, including decisions to postpone purchasing or keep the current approach. We look for recurring patterns in qualification, value, pricing, competition and execution that could inform future improvements.",
          },
          {
            title: "Management Pipeline Reviews",
            detail:
              "We examine how managers review pipeline quality, deal progress and forecast reliability with the team. We assess whether those discussions lead to useful decisions, specific actions and follow-through on opportunities that need attention.",
          },
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
          {
            title: "CRM Adoption",
            detail:
              "We examine how consistently salespeople and managers use the CRM in their daily work. We identify where limited use reflects unclear expectations, insufficient training or practical difficulties that prevent the system from supporting the team.",
          },
          {
            title: "Data Accuracy",
            detail:
              "We review whether customer details, opportunity values, sales stages and other essential information are accurate and current. We assess whether missing or outdated information is affecting follow-up, reporting or management decisions.",
          },
          {
            title: "Opportunity Tracking",
            detail:
              "We examine how sales opportunities are recorded, assigned and updated. We assess whether each record clearly shows the current situation, responsible salesperson, remaining requirements and next action.",
          },
          {
            title: "Contact Management",
            detail:
              "We review how customer and prospect contacts are organized and maintained. We assess whether the team can readily identify decision-makers, understand their roles and access relevant communication history.",
          },
          {
            title: "Activity Documentation",
            detail:
              "We examine how calls, meetings, emails and other meaningful sales activities are recorded. We assess whether documentation provides enough context for effective follow-through and continuity without creating excessive administrative work.",
          },
          {
            title: "Follow-Up Reminders",
            detail:
              "We review how reminders and task assignments help salespeople complete agreed actions. We assess whether they are timely, useful and connected to clear responsibilities so important follow-up is less likely to be missed.",
          },
          {
            title: "Reporting",
            detail:
              "We examine whether CRM reports provide accurate, relevant information about sales activity and results. We assess whether reports help leaders identify performance gaps, monitor progress and make decisions without unnecessary complexity.",
          },
          {
            title: "Pipeline Visibility",
            detail:
              "We review whether the CRM gives salespeople and leaders a clear view of active opportunities, their status and outstanding actions. We assess whether that visibility helps identify stalled deals, coverage gaps and opportunities requiring support.",
          },
          {
            title: "Sales Forecasting",
            detail:
              "We examine how CRM information is used to estimate future sales revenue. We assess whether deal values, probabilities and expected closing dates are maintained well enough to support realistic forecasts.",
          },
          {
            title: "Management Usage",
            detail:
              "We review how managers use the CRM to prepare for coaching, conduct pipeline reviews and monitor commitments. We assess whether the system supports timely decisions and follow-through as part of their regular management responsibilities.",
          },
          {
            title: "Duplicate or Unnecessary Data Entry",
            detail:
              "We examine where employees repeatedly enter the same information or complete fields with little practical value. We identify opportunities to simplify data entry while preserving the information needed for sales execution and management.",
          },
          {
            title: "Automation Opportunities",
            detail:
              "We review repetitive tasks that could be handled through appropriate CRM automation, such as reminders, lead assignments and routine updates. We assess where automation could save time and improve consistency while maintaining clear ownership and appropriate customer communication.",
          },
          {
            title: "Integration with Other Systems",
            detail:
              "We examine how the CRM exchanges information with email, marketing, quoting, accounting and other relevant systems. We assess whether disconnected information or unreliable transfers are creating extra work, errors or gaps in visibility.",
          },
          {
            title: "Whether the CRM Reflects the Actual Sales Process",
            detail:
              "We review whether CRM stages, fields and workflows match how the organization actually sells. We assess whether the setup guides useful action, captures meaningful progress and accommodates the requirements of the business.",
          },
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
          {
            title: "Revenue",
            detail:
              "We review sales revenue for a defined period and compare it with the starting baseline, targets and prior results. We examine trends by salesperson, customer or offering to understand what is driving growth or limiting production.",
          },
          {
            title: "Gross Profit",
            detail:
              "We examine sales revenue after subtracting the direct costs of the products or services sold. We review both gross profit dollars and gross margin percentage to determine whether increased sales are producing sufficient financial value.",
          },
          {
            title: "New Accounts",
            detail:
              "We review the number and value of new customer accounts secured during a defined period. We assess whether new-account production is supporting growth and attracting the types of customers the organization intends to serve.",
          },
          {
            title: "Existing-Account Growth",
            detail:
              "We examine increases in sales from established customers through repeat purchases, expanded services or additional product sales. We compare results with the starting baseline and consider purchasing patterns to identify meaningful account development.",
          },
          {
            title: "Average Transaction Value",
            detail:
              "We review average revenue per completed sale, calculated by dividing sales revenue by the number of transactions in the same period. We examine whether changes reflect pricing, product mix, discounting or the team's ability to address broader customer needs.",
          },
          {
            title: "Sales Activity",
            detail:
              "We examine the volume and quality of calls, customer conversations, meetings, proposals and follow-up. We establish the current activity baseline and assess which activities contribute to qualified opportunities and completed sales.",
          },
          {
            title: "Appointment Generation",
            detail:
              "We review how many qualified sales appointments are scheduled and how many actually take place. We assess whether appointment volume, attendance and quality are sufficient to support the organization's sales objectives.",
          },
          {
            title: "Conversion Rates",
            detail:
              "We examine the percentage of prospects or opportunities that advance between clearly defined sales stages. We establish baseline rates for each relevant transition to identify where the organization is progressing effectively and where potential sales are being lost.",
          },
          {
            title: "Proposal-to-Close Ratios",
            detail:
              "We review the percentage of proposals that result in completed sales, using a defined group of proposals and allowing for the normal decision period. We examine whether qualification, proposal quality, pricing or follow-through is affecting results.",
          },
          {
            title: "Sales Cycle Length",
            detail:
              "We measure the time from a clearly defined starting point, such as opportunity qualification, to a completed sale. We compare results with the starting baseline and examine where delays occur, accounting for differences in deal size and complexity.",
          },
          {
            title: "Pipeline Coverage",
            detail:
              "We compare the value of qualified opportunities expected to close within a defined period with the sales target for that period. We assess whether coverage is sufficient based on actual win rates and realistic closing dates.",
          },
          {
            title: "Customer Retention",
            detail:
              "We review the percentage of existing customers who continue doing business with the organization over a defined period. We establish what counts as an active or retained customer and examine losses, renewals and repeat-purchase patterns to identify retention opportunities.",
          },
          {
            title: "Forecast Accuracy",
            detail:
              "We compare the sales forecast recorded at a defined point with the actual results for the forecast period. We establish an accuracy baseline and examine recurring differences in deal value, timing and expected outcomes.",
          },
          {
            title: "Individual and Team Productivity",
            detail:
              "We examine sales output relative to the time and resources invested by individual salespeople and the team. We compare results with the starting baseline, considering differences in responsibilities and opportunities, to identify where better use of existing capacity could improve performance.",
          },
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
          {
            title: "Base Salary and Commission Structure",
            detail:
              "We examine how fixed pay and performance-based earnings work together. We assess whether the balance supports the role's responsibilities, motivates sales production and remains financially practical for the organization.",
          },
          {
            title: "Straight Commission Structures",
            detail:
              "We review arrangements in which earnings depend entirely on sales results. We assess whether earning opportunities, sales cycles and responsibilities make the structure workable and whether it rewards the outcomes the organization needs.",
          },
          {
            title: "Commission Percentages",
            detail:
              "We examine commission rates and the amounts on which they are calculated, such as revenue, collected revenue or gross profit. We assess whether payouts provide meaningful motivation while supporting company profitability.",
          },
          {
            title: "Accelerators",
            detail:
              "We review increased commission rates that apply after defined performance levels are reached. We assess whether they encourage additional production and whether the qualifying rules and financial impact are clearly understood.",
          },
          {
            title: "Bonuses",
            detail:
              "We examine additional payments tied to specific achievements, milestones or business objectives. We assess whether the requirements are clear, the rewards are meaningful and the program encourages results that justify its cost.",
          },
          {
            title: "Gross-Margin Incentives",
            detail:
              "We review incentives tied to gross profit dollars or gross margin percentage. We assess whether they encourage profitable selling and appropriate pricing, considering how much control salespeople have over prices and direct costs.",
          },
          {
            title: "New-Account Incentives",
            detail:
              "We examine rewards for acquiring new customers. We assess whether they encourage accounts with suitable revenue potential, profitability and long-term value, and whether the requirements for earning the incentive are clear.",
          },
          {
            title: "Existing-Account Incentives",
            detail:
              "We review how salespeople are rewarded for retaining and developing established customers. We assess whether incentives support repeat business, renewals and account expansion while distinguishing ongoing sales effort from routine orders.",
          },
          {
            title: "Team Incentives",
            detail:
              "We examine rewards based on shared sales objectives or collective results. We assess whether they encourage useful cooperation, recognize contributions fairly and maintain clear individual responsibilities.",
          },
          {
            title: "Quotas",
            detail:
              "We review sales targets used to determine expected performance and incentive eligibility. We assess whether quotas reflect territory potential, available opportunities, sales cycles and company objectives, and whether salespeople understand how they are established.",
          },
          {
            title: "Thresholds",
            detail:
              "We examine minimum performance requirements that must be met before particular commissions or incentives apply. We assess whether those requirements are attainable, clearly explained and structured to maintain motivation throughout the performance period.",
          },
          {
            title: "Commission Timing",
            detail:
              "We review when commissions are earned and paid, including whether payment depends on an order, delivery or customer payment. We assess whether timing and adjustments for cancellations, returns or unpaid invoices are clearly defined and consistently applied.",
          },
          {
            title: "Territory Considerations",
            detail:
              "We examine how territory size, customer potential, account maturity and workload affect earning opportunities. We assess whether compensation and quotas reasonably account for those differences and whether credit for shared accounts is clearly assigned.",
          },
          {
            title: "Incentive Clarity",
            detail:
              "We review whether salespeople can readily understand how their earnings are calculated and what actions affect their compensation. We assess whether written terms, examples and earnings statements provide clear answers and reduce avoidable disputes.",
          },
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
          {
            title: "Position Requirements",
            detail:
              "We examine whether the role's responsibilities, required skills and expected results are clearly defined. We assess whether those requirements reflect the actual work and provide a practical foundation for recruiting and evaluating candidates.",
          },
          {
            title: "Ideal Candidate Profile",
            detail:
              "We review the experience, abilities and working approach most likely to support success in the role. We assess whether the profile reflects the organization's customers, sales process and management environment.",
          },
          {
            title: "Recruiting Sources",
            detail:
              "We examine where candidates are being found and which sources produce suitable applicants and successful hires. We assess whether recruiting efforts reach the right talent and justify the time and cost invested.",
          },
          {
            title: "Job Advertisements",
            detail:
              "We review whether job advertisements clearly explain the opportunity, responsibilities, compensation structure and essential qualifications. We assess whether the wording attracts suitable candidates and sets accurate expectations about the position.",
          },
          {
            title: "Screening Procedures",
            detail:
              "We examine how applicants are reviewed before advancing to interviews. We assess whether screening consistently identifies relevant qualifications, confirms essential requirements and gives promising candidates appropriate consideration.",
          },
          {
            title: "Interview Process",
            detail:
              "We review how interviews explore a candidate's experience, judgment and ability to perform the work. We assess whether questions and evaluation standards provide a consistent basis for comparing candidates.",
          },
          {
            title: "Sales Assessments",
            detail:
              "We examine how practical exercises, role-play or other assessments are used to evaluate sales ability. We assess whether they reflect the actual role and provide useful evidence of skills such as discovery, presentation, objection handling and closing.",
          },
          {
            title: "Reference Checks",
            detail:
              "We review how references are used to confirm relevant experience, responsibilities and past performance. We assess whether the information gathered helps clarify important questions about the candidate's suitability for the role.",
          },
          {
            title: "Compensation Communication",
            detail:
              "We examine how compensation, earning opportunities and payment conditions are explained during hiring. We assess whether candidates understand the structure, performance requirements and assumptions behind any stated income potential.",
          },
          {
            title: "New-Hire Orientation",
            detail:
              "We review how new salespeople are introduced to the organization, their responsibilities and the people who support their work. We assess whether they receive the information, access and direction needed to begin effectively.",
          },
          {
            title: "Product and Service Knowledge",
            detail:
              "We examine how new hires learn the offering's purpose, capabilities, limitations and customer value. We assess whether they can explain it accurately, recognize suitable applications and know when to seek additional support.",
          },
          {
            title: "Sales-Process Training",
            detail:
              "We review how new salespeople learn the organization's approach to prospecting, qualification, presentation, follow-up and closing. We assess whether training includes practical application and clear standards for moving opportunities forward.",
          },
          {
            title: "CRM Training",
            detail:
              "We examine how new hires learn to manage contacts, document activity, update opportunities and schedule follow-up in the CRM. We assess whether they can use the system correctly and efficiently in their daily work.",
          },
          {
            title: "Initial Performance Expectations",
            detail:
              "We review the activity, learning and production expectations established for a new salesperson's early weeks. We assess whether those expectations are clear, realistic and supported by appropriate coaching, resources and opportunities.",
          },
          {
            title: "30-, 60- and 90-Day Productivity Milestones",
            detail:
              "We examine the checkpoints used to evaluate progress during the first three months. We assess whether milestones reflect the normal sales cycle and provide measurable evidence of learning, effective activity, pipeline development and sales production as appropriate.",
          },
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
          {
            title: "Customer Retention",
            detail:
              "We examine how consistently customers continue doing business with the organization. We review repeat purchases, renewals and customer losses to identify what supports lasting relationships and where preventable losses may be occurring.",
          },
          {
            title: "Account Communication",
            detail:
              "We review how the organization maintains contact with existing customers. We assess whether communication is timely, relevant and sufficient to understand changing needs, address concerns and maintain a productive business relationship.",
          },
          {
            title: "Account Reviews",
            detail:
              "We examine how customer accounts are periodically reviewed for satisfaction, results and future needs. We assess whether these conversations lead to specific actions that strengthen the relationship and identify appropriate opportunities for additional business.",
          },
          {
            title: "Renewal Processes",
            detail:
              "We review how upcoming renewals are identified, prepared for and managed. We assess whether responsibilities, timing and customer discussions provide enough notice to address concerns and support continued business.",
          },
          {
            title: "Cross-Selling",
            detail:
              "We examine how salespeople identify complementary products or services that could benefit existing customers. We assess whether recommendations address a relevant need and whether the team consistently recognizes suitable opportunities.",
          },
          {
            title: "Upselling",
            detail:
              "We review opportunities to increase the scope, capacity or level of a product or service the customer already uses. We assess whether the additional investment is justified by the customer's needs and the value provided.",
          },
          {
            title: "Additional-Location Opportunities",
            detail:
              "We examine whether existing customer relationships could extend to other branches, offices or operating locations. We review purchasing arrangements, decision-making authority and location-specific needs to determine where expansion may be appropriate.",
          },
          {
            title: "Additional-Product or Service Opportunities",
            detail:
              "We review customer needs that the organization could address through offerings the account is not currently purchasing. We assess whether customers understand the available options and whether relevant needs are being overlooked.",
          },
          {
            title: "Referral Generation",
            detail:
              "We examine how satisfied customers are invited to make appropriate introductions to other potential customers. We assess whether referral requests are well timed, clearly framed and followed through in a way that respects the existing relationship.",
          },
          {
            title: "Dormant-Account Reactivation",
            detail:
              "We review accounts that previously purchased but have become inactive. We examine why business stopped, whether needs or circumstances have changed and whether there is a practical opportunity to reestablish the relationship.",
          },
          {
            title: "Customer Concentration",
            detail:
              "We examine how much revenue and gross profit depend on a small number of customers. We assess the potential effect of losing a major account and whether account development and new-customer efforts provide a reasonable balance.",
          },
          {
            title: "At-Risk Accounts",
            detail:
              "We review signs that a customer relationship may be weakening, such as declining purchases, unresolved concerns or reduced engagement. We assess whether those signals are recognized early and followed by appropriate action.",
          },
          {
            title: "Account Ownership",
            detail:
              "We examine whether responsibility for each customer relationship is clearly assigned. We assess whether sales, service and management understand their roles and coordinate effectively so customer needs and development opportunities receive attention.",
          },
          {
            title: "Customer Lifetime Value",
            detail:
              "We review the estimated financial contribution a customer generates over the course of the relationship. We consider revenue, gross profit, service costs and retention patterns to help the organization make informed decisions about acquiring, supporting and developing accounts.",
          },
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
          {
            title: "Prospecting Skills",
            detail:
              "We examine the team's ability to identify suitable prospects, initiate contact and generate meaningful sales conversations. We assess where targeted practice and coaching could improve the quality and productivity of outreach.",
          },
          {
            title: "Discovery",
            detail:
              "We review how salespeople use questions and listening to understand the customer's situation, priorities and decision process. We assess whether they gather enough relevant information to guide the conversation and recommend an appropriate solution.",
          },
          {
            title: "Qualification",
            detail:
              "We examine the team's ability to determine whether an opportunity warrants further sales effort. We assess how effectively salespeople establish customer need, purchasing authority, financial capacity and timing.",
          },
          {
            title: "Presentation Skills",
            detail:
              "We review how clearly and confidently salespeople organize and deliver their presentations. We assess their ability to engage the customer, adapt to the discussion and explain the offering in terms the customer understands.",
          },
          {
            title: "Value Communication",
            detail:
              "We examine how salespeople connect the offering's benefits to the customer's specific business needs. We assess whether they can explain the expected value credibly and support it with relevant examples, evidence or reasonable calculations.",
          },
          {
            title: "Objection Handling",
            detail:
              "We review how salespeople uncover the concern behind an objection and respond to it. We assess whether they clarify the issue, provide a relevant answer and confirm whether the concern has been resolved.",
          },
          {
            title: "Negotiation",
            detail:
              "We examine how salespeople discuss pricing, terms, scope and other conditions of an agreement. We assess whether they protect profitability, understand customer priorities and exchange concessions thoughtfully within their authority.",
          },
          {
            title: "Closing",
            detail:
              "We review the team's ability to recognize buying readiness, resolve remaining questions and ask for a commitment. We assess whether salespeople guide customers through a clear decision process and accurately confirm the agreed terms.",
          },
          {
            title: "Account Development",
            detail:
              "We examine how salespeople maintain customer relationships and identify additional needs. We assess their ability to conduct useful account conversations, recognize growth opportunities and recommend appropriate next steps.",
          },
          {
            title: "CRM Usage",
            detail:
              "We review whether salespeople have the practical skills to manage contacts, update opportunities, document activity and organize follow-up. We assess where training could improve accuracy, consistency and efficient use of the system.",
          },
          {
            title: "Pipeline Management",
            detail:
              "We examine the team's ability to qualify, prioritize and advance opportunities through the pipeline. We assess whether salespeople maintain realistic stages and closing dates, recognize stalled deals and plan useful next actions.",
          },
          {
            title: "Sales Management Skills",
            detail:
              "We review managers' ability to set expectations, interpret performance information and direct team effort. We assess development needs in planning, accountability, performance discussions and the effective use of management time.",
          },
          {
            title: "Coaching",
            detail:
              "We examine managers' ability to identify specific skill gaps, demonstrate effective approaches and guide practice. We assess whether coaching includes clear improvement goals and follow-up against each salesperson's starting baseline.",
          },
          {
            title: "Product Knowledge",
            detail:
              "We review whether the team understands the offering's capabilities, applications, limitations and customer benefits. We assess whether salespeople can answer relevant questions accurately and recognize when specialist support is needed.",
          },
          {
            title: "Industry Knowledge",
            detail:
              "We examine how well salespeople understand their customers' operating environment, terminology and business priorities. We assess whether that knowledge helps them ask relevant questions, recognize needs and hold credible business conversations.",
          },
          {
            title: "Continuing Development",
            detail:
              "We review how skills and knowledge are strengthened after initial training. We assess whether ongoing coaching, practice and learning address changing needs and produce measurable improvements in day-to-day performance.",
          },
        ],
        note: "Depending on the organization and the issue being addressed, only the areas most relevant to performance may require review. Training recommendations are based on identified needs. If training is not necessary, we do not recommend it.",
        objective:
          "The objective is targeted development that improves execution—not training for the sake of training.",
      },
    ],

    salesLeadershipImplementationSupport: {
      title: "SALES LEADERSHIP & IMPLEMENTATION SUPPORT",
      headline:
        "FLEXIBLE RESPONSIBILITIES. DEFINED ENGAGEMENTS. PRACTICAL RESULTS.",
      intro: [
        "NORTH POINT SALES GROUP tailors its professional support to each client's needs.",
        "Depending on the engagement:",
      ],
      engagementOptions: [
        {
          title: "Sales Performance Implementation Specialists",
          description:
            "Work with existing management to implement focused sales performance improvements.",
        },
        {
          title: "Fractional VPs of Sales",
          description:
            "Provide executive leadership, oversee organizational improvements, or combine leadership with hands-on implementation.",
        },
        {
          title: "Combined Support",
          description:
            "Both professionals may work together when additional expertise and resources are needed.",
        },
      ],
      closing: [
        "Responsibilities, objectives, duration, and fees are established according to the engagement's scope.",
        "Our objective is to provide the right expertise, implement practical improvements, and help sustain stronger sales performance without unnecessary costs or permanent overhead.",
      ],
      roles: [
        {
          title: "SALES PERFORMANCE IMPLEMENTATION SPECIALIST",
          headline: "Focused, Hands-On Sales Performance Improvement",
          intro: [
            "Our Sales Performance Implementation Specialists work directly with existing sales leadership and salespeople to identify performance gaps and implement practical operational improvements.",
            "These professionals are particularly appropriate when an organization has existing management in place but needs additional expertise and direct assistance improving sales execution, systems, productivity, and accountability.",
            "Areas of responsibility may include:",
          ],
          responsibilities: [
            {
              title: "Individual Salesperson Coaching",
              description:
                "Work directly with selected salespeople to strengthen sales presentations, objection handling, closing techniques, and overall sales effectiveness.",
            },
            {
              title: "Sales Process Improvement",
              description:
                "Evaluate and improve prospecting, lead qualification, presentations, follow-up, and closing procedures.",
            },
            {
              title: "CRM Optimization",
              description:
                "Improve CRM utilization, data accuracy, activity tracking, reporting practices, and management visibility.",
            },
            {
              title: "Pipeline Management",
              description:
                "Help salespeople and management improve opportunity tracking, pipeline progression, and follow-up consistency.",
            },
            {
              title: "KPI Development and Monitoring",
              description:
                "Establish meaningful performance measurements and assist management in reviewing activity, productivity, and results.",
            },
            {
              title: "Performance Accountability",
              description:
                "Help establish clear expectations, responsibilities, management reporting, and consistent follow-through.",
            },
            {
              title: "Sales Management Support",
              description:
                "Assist existing managers with coaching practices, performance reviews, and implementation of agreed-upon improvements.",
            },
            {
              title: "Sales Systems Implementation",
              description:
                "Help establish and improve practical sales processes, reporting systems, dashboards, and management procedures.",
            },
            {
              title: "Sales Team Productivity",
              description:
                "Identify operational inefficiencies and opportunities to improve salesperson productivity and effectiveness.",
            },
            {
              title: "Implementation Follow-Through",
              description:
                "Work alongside management to help ensure that agreed-upon improvements are implemented and incorporated into ongoing operations.",
            },
          ],
          objective:
            "The objective is to strengthen the performance of your existing sales organization without requiring additional executive management when it is not necessary.",
        },
        {
          title: "FRACTIONAL VP OF SALES",
          headline:
            "Executive-Level Sales Leadership Without the Commitment of a Permanent Full-Time Executive",
          intro: [
            "For organizations requiring more extensive leadership involvement, NORTH POINT SALES GROUP can provide Fractional VP of Sales services tailored to specific organizational responsibilities and objectives.",
            "A Fractional VP of Sales may assume selected executive-level sales management responsibilities for an agreed-upon period, direct organizational performance improvements, or provide a combination of leadership and hands-on implementation.",
            "Areas of responsibility may include:",
          ],
          responsibilities: [
            {
              title: "Executive Sales Leadership",
              description:
                "Assume specific sales leadership responsibilities and provide direction to the sales organization.",
            },
            {
              title: "Sales Strategy Development",
              description:
                "Work with executive management to establish sales priorities, growth strategies, performance objectives, and execution plans.",
            },
            {
              title: "Sales Management Oversight",
              description:
                "Help direct existing sales managers, strengthen management practices, and improve overall leadership effectiveness.",
            },
            {
              title: "Sales Organization Evaluation",
              description:
                "Examine sales operations, management responsibilities, organizational structure, and performance obstacles.",
            },
            {
              title: "Sales Team Performance Management",
              description:
                "Establish clear performance expectations, monitor progress, and strengthen organizational accountability.",
            },
            {
              title: "Sales Process and Operational Improvements",
              description:
                "Direct improvements to sales processes, pipeline management, CRM utilization, and reporting systems.",
            },
            {
              title: "Leadership Development",
              description:
                "Coach and guide existing sales managers to improve their management, communication, coaching, and accountability capabilities.",
            },
            {
              title: "Sales Performance Implementation",
              description:
                "Personally direct or participate in implementing significant sales performance and operational improvements.",
            },
            {
              title: "Implementation Specialist Oversight",
              description:
                "Supervise Sales Performance Implementation Specialists and coordinate their activities with executive management when appropriate.",
            },
            {
              title: "Temporary Executive Leadership",
              description:
                "Provide defined executive sales leadership support during periods of growth, management transition, restructuring, or operational improvement.",
            },
          ],
          objective:
            "The objective is to provide experienced executive-level sales leadership where it can make a meaningful difference, without requiring the organization to create an unnecessary permanent executive position.",
        },
      ],
      establishingSalesLeadership: {
        title: "ESTABLISHING SALES LEADERSHIP",
        intro:
          "When an owner or executive is managing the sales team alongside other responsibilities, we help determine what ongoing sales leadership the organization needs.",
        scopeIntro: "Depending on the agreed scope, we may:",
        items: [
          "Define the sales manager’s role, responsibilities, and performance expectations.",
          "Assess whether an existing employee can be developed for the position.",
          "Help recruit, interview, and select a new sales manager when needed.",
          "Onboard and coach the selected manager in the company’s sales process, CRM, KPIs, coaching practices, and accountability procedures.",
          "Establish a transition plan so the owner can transfer day-to-day sales management responsibilities.",
          "Provide temporary fractional sales leadership during the transition when appropriate.",
        ],
        objective:
          "Our objective is to leave the organization with clear sales leadership responsibilities and someone equipped to carry them out.",
        scopeNote:
          "Scope note: Recruiting, manager development, and transition support are defined in the engagement agreement. Additional support can be arranged if hiring or onboarding extends beyond the initial engagement period.",
      },
    },
  },

  challenges: {
    badge: "CHALLENGES",
    subheading: "IS YOUR SALES ORGANIZATION",
    title: "Performing at Its Full Potential?",
    intro:
      "Sales growth can be restricted by individual skills and execution, as well as the leadership, processes, systems, and accountability supporting the sales team. We begin with the salespeople’s performance, then determine what is influencing their results and what needs to improve.",
    highlightText: "That's where NORTH POINT SALES GROUP can help.",
    sectionTitle: "6 COMMON CHALLENGES WE HELP SOLVE",
    items: [
      {
        id: "inconsistent-revenue",
        title: "INCONSISTENT REVENUE",
        desc: "Unpredictable results and lack of a steady sales pipeline.",
        icon: "/icons/p6.svg",
        popout: {
          title: "Unpredictable Results and Lack of a Steady Sales Pipeline",
          paragraphs: [
            "When revenue fluctuates significantly from month to month, leadership can struggle to forecast accurately, plan confidently, and make sound growth decisions.",
            "Inconsistent revenue can result from several different issues, including:",
            "The goal is to determine what is creating the inconsistency and strengthen the areas that can produce a more dependable sales pipeline and more predictable revenue performance.",
          ],
          list: [
            "Uneven lead flow",
            "Weak prospecting activity",
            "Inconsistent follow-up",
            "Poor pipeline management",
            "Low conversion rates",
            "Overdependence on a small number of customers",
            "Salespeople operating without clear activity expectations",
            "Lack of visibility into where future revenue will come from",
          ],
          nextStep:
            "We help you identify where revenue inconsistency begins, prioritize the issues having the greatest impact, and develop a practical plan to create stronger pipeline visibility and more predictable sales performance.",
        },
      },
      {
        id: "underperforming-teams",
        title: "UNDERPERFORMING SALES TEAMS",
        desc: "Teams lack the skills, coaching, and accountability to win.",
        icon: "/icons/p7.svg",
        popout: {
          title: "Teams Lack the Skills, Coaching, and Accountability to Win",
          paragraphs: [
            "An underperforming sales team does not necessarily mean the wrong people are in place.",
            "Performance problems can come from weak training, unclear expectations, ineffective management, poor sales messaging, inconsistent coaching, lack of accountability, or a sales process that makes success unnecessarily difficult.",
            "We evaluate areas such as:",
            "The objective is to identify what is limiting performance and help salespeople become more confident, consistent, proficient, and productive.",
          ],
          list: [
            "Prospecting effectiveness",
            "Sales conversations and presentations",
            "Objection handling",
            "Follow-up",
            "Closing effectiveness",
            "Product and market knowledge",
            "Activity levels",
            "Pipeline discipline",
            "Coaching and development",
            "Individual accountability",
          ],
          nextStep:
            "We assess what is holding the team back, determine whether the primary need is skill development, coaching, management, accountability, or process improvement, and build a focused plan to improve performance.",
        },
      },
      {
        id: "lack-of-process",
        title: "LACK OF PROCESS & ACCOUNTABILITY",
        desc: "No repeatable sales process or system to drive performance.",
        icon: "/icons/p8.svg",
        popout: {
          title: "No Repeatable Sales Process or System to Drive Performance",
          paragraphs: [
            "When every salesperson approaches the job differently, results often become difficult to manage, measure, and improve.",
            "A strong sales organization needs a practical process that creates consistency without preventing experienced salespeople from using good judgment.",
            "That can include clearly defined expectations around:",
            "We help determine where structure is missing, where existing processes may be ineffective, and what systems can be strengthened to make performance more measurable and repeatable.",
          ],
          list: [
            "Prospecting",
            "Lead qualification",
            "Initial sales conversations",
            "Needs discovery",
            "Presentations",
            "Proposals",
            "Follow-up",
            "Pipeline management",
            "Closing",
            "Customer handoff",
            "Reporting and accountability",
          ],
          nextStep:
            "We help establish a practical, repeatable sales process with clear expectations, measurable activity, and accountability—giving leadership greater visibility and the team a clearer path to execution.",
        },
      },
      {
        id: "recruiting-talent",
        title: "DIFFICULTY RECRUITING & RETAINING TOP TALENT",
        desc: "Struggling to attract, develop, and keep the right people.",
        icon: "/icons/p9.svg",
        popout: {
          title: "Struggling to Attract, Develop, and Keep the Right People",
          paragraphs: [
            "Recruiting salespeople is only part of the challenge. Organizations also need to determine who is most likely to succeed, bring new hires up to speed quickly, develop their capabilities, and retain strong performers.",
            "Problems can occur when there is:",
            "We can help leadership evaluate the complete talent cycle—from recruiting and selection through onboarding, development, performance management, and retention.",
            "The objective is to build a stronger sales organization by improving both who enters the organization and how those individuals are developed once they arrive.",
          ],
          list: [
            "No clearly defined candidate profile",
            "Inconsistent interviewing or selection",
            "Weak onboarding",
            "Insufficient early-stage training",
            "Unclear performance expectations",
            "Limited coaching or development",
            "Compensation misalignment",
            "Poor management communication",
            "Lack of advancement opportunities",
            "Excessive turnover among productive salespeople",
          ],
          nextStep:
            "We help you identify where the talent process is breaking down and strengthen the systems used to attract, select, onboard, develop, and retain salespeople who fit the needs of your organization.",
        },
      },
      {
        id: "leaders-overwhelmed",
        title: "SALES LEADERS OVERWHELMED",
        desc: "Leaders are stretched thin and lack the tools for scale.",
        icon: "/icons/p10.svg",
        popout: {
          title: "Leaders Are Stretched Thin and Lack the Tools for Scale",
          paragraphs: [
            "Sales leaders are often responsible for far more than managing sales performance.",
            "They may be recruiting, interviewing, training, coaching, forecasting, solving customer problems, attending executive meetings, reviewing pipelines, supporting major accounts, and handling day-to-day operational issues.",
            "As responsibilities accumulate, important sales-management activities can become inconsistent or reactive.",
            "Common symptoms include:",
            "NORTH POINT SALES GROUP can help identify where leadership is overloaded, where management systems can be strengthened, and where additional support—including fractional sales leadership—may improve execution.",
            "The objective is to give leadership greater control over the sales organization without simply adding more complexity.",
          ],
          list: [
            "Limited time for coaching",
            "Inconsistent accountability",
            "Poor pipeline visibility",
            "Delayed hiring",
            "Weak follow-through",
            "Too much time spent solving individual salesperson problems",
            "Insufficient performance analysis",
            "Strategic priorities being displaced by daily emergencies",
          ],
          nextStep:
            "We help determine where leadership capacity is being consumed, what responsibilities or systems need to change, and whether additional sales leadership support can create greater focus, accountability, and scalability.",
        },
      },
      {
        id: "slow-growth",
        title: "SLOW GROWTH & MISSED TARGETS",
        desc: "Growth stalls and opportunities are left on the table.",
        icon: "/icons/Group 147.svg",
        popout: {
          title: "Growth Stalls and Opportunities Are Left on the Table",
          paragraphs: [
            "When an organization repeatedly misses sales targets or growth begins to slow, the cause may not be obvious.",
            "The issue could be market-related, but it may also involve sales execution, lead generation, management, staffing, messaging, conversion, customer concentration, pipeline development, or a combination of several factors.",
            "We look beyond the revenue number itself to understand what is influencing it.",
            "That can include evaluating:",
            "The objective is to determine where additional performance potential may exist and help leadership implement the improvements necessary to capture it.",
          ],
          list: [
            "Sales activity",
            "Lead volume and quality",
            "Conversion performance",
            "Pipeline movement",
            "Average transaction value",
            "Customer retention and expansion",
            "Sales team productivity",
            "Territory or account coverage",
            "Sales leadership",
            "Competitive positioning",
            "Opportunities within existing accounts",
          ],
          nextStep:
            "We help isolate the factors limiting growth, identify the opportunities with the greatest potential impact, and establish clear priorities for improving sales performance and moving the business toward its growth objectives.",
        },
      },
    ],
    investment: {
      badge: "INVESTMENT",
      title: "INVESTMENT",
      subtitle: "WHAT THE ENGAGEMENT INCLUDES",
      tiers: [
        {
          title: "Sales Team Performance Engagement — Beginning at $7,500",
          description:
            "Focused specifically on improving the performance of the existing sales team.",
          popout: {
            ...salesTeamPerformancePopout,
            sequenceInNestedPopup: true,
            sequenceHeading:
              "30-DAY SALES TEAM PERFORMANCE ENGAGEMENT WORK SEQUENCE",
            sequenceGroups: [
              {
                title: "INTRODUCTION",
                intro:
                  "The 30-Day Sales Team Performance Engagement is a focused, hands-on engagement designed to identify the factors affecting sales-team performance and begin making practical improvements within the existing sales organization.\n\nNORTH POINT SALES GROUP does not approach the 30 days as a predetermined checklist. We first determine where the greatest opportunities exist, then direct our time and effort toward those areas.\n\nThe engagement moves through four general phases: discovery and assessment, individual and team performance review, direct performance improvement, and results review with recommended next steps.\n\nThe client remains actively involved throughout the engagement by providing access to leadership, sales personnel, relevant sales information, and existing processes and systems. Management participation is important because improvements need to be understood, supported, and reinforced internally.",
              },
              {
                title: "CLIENT PARTICIPATION",
                intro: "The client is expected to:",
                items: [
                  "Provide access to appropriate sales leadership and selected sales representatives.",
                  "Provide available sales-performance information, reports, metrics, and relevant sales materials.",
                  "Explain current sales processes, expectations, management practices, and areas of concern.",
                  "Make selected sales representatives available for scheduled one-on-one work.",
                  "Participate in periodic discussions regarding findings and progress.",
                  "Provide appropriate access to systems or information necessary to evaluate sales performance.",
                  "Review and support recommended changes that fall within the company's responsibility.",
                ],
                outro:
                  "NORTH POINT SALES GROUP handles the assessment and performance-improvement work. The client provides the access, information, participation, and internal support necessary for that work to be effective.",
              },
              {
                title: "DAYS 1–5 — DISCOVERY & INITIAL ASSESSMENT",
                intro:
                  "NORTH POINT SALES GROUP begins by understanding the sales team, its responsibilities, current expectations, and existing performance.\nWork may include:",
                items: [
                  "Meeting with sales leadership.",
                  "Reviewing sales roles, responsibilities, and expectations.",
                  "Reviewing available sales-performance information and individual metrics.",
                  "Examining the current sales process.",
                  "Identifying initial strengths, weaknesses, and performance concerns.",
                  "Selecting up to three representatives for direct one-on-one work.",
                ],
                outro:
                  "Objective: Establish where the most significant individual and team performance issues appear to exist.",
              },
              {
                title: "DAYS 6–12 — INDIVIDUAL & TEAM PERFORMANCE REVIEW",
                intro:
                  "NORTH POINT SALES GROUP works directly with the selected representatives and examines how they are actually performing within the sales process.\nWork may include:",
                items: [
                  "Reviewing prospecting and lead-development activity.",
                  "Examining qualification and opportunity development.",
                  "Reviewing sales conversations and presentations.",
                  "Examining follow-up and pipeline management.",
                  "Identifying individual performance gaps and missed opportunities.",
                  "Working with sales leadership to understand management and accountability practices affecting performance.",
                ],
                outro:
                  "Objective: Determine what is limiting individual and team performance and where practical improvement can be made.",
              },
              {
                title: "DAYS 13–22 — DIRECT PERFORMANCE IMPROVEMENT",
                intro:
                  "The focus shifts from identifying issues to working directly on them.\nWork may include:",
                items: [
                  "One-on-one performance work with up to three selected representatives.",
                  "Improving prospecting and lead-development practices.",
                  "Strengthening sales conversations and presentations.",
                  "Improving follow-up and opportunity management.",
                  "Addressing specific individual performance issues.",
                  "Reinforcing the company's sales process and expectations.",
                  "Establishing practical performance standards and accountability where appropriate.",
                  "Working with sales leadership on how improvements should be managed and reinforced.",
                ],
                outro:
                  "Objective: Begin implementing practical changes rather than simply providing recommendations.",
              },
              {
                title: "DAYS 23–30 — RESULTS REVIEW & NEXT-STEP PLAN",
                intro:
                  "The final phase evaluates what has been learned and accomplished during the engagement and establishes the appropriate next level of action.\nWork may include:",
                items: [
                  "Reviewing changes in individual and team performance.",
                  "Identifying improvements achieved during the engagement.",
                  "Identifying issues requiring additional attention.",
                  "Reviewing performance expectations and accountability.",
                  "Determining whether additional representatives or sales-performance areas should be addressed.",
                  "Presenting leadership with a clear summary of findings, actions taken, and recommended next steps.",
                ],
              },
              {
                title: "FINAL DELIVERABLE",
                intro:
                  "At the conclusion of the 30-day engagement, NORTH POINT SALES GROUP provides an Executive Sales Team Performance Summary documenting:",
                items: [
                  "What was examined.",
                  "What was found.",
                  "The primary performance issues identified.",
                  "Work completed with the selected representatives.",
                  "Improvements initiated during the engagement.",
                  "Issues that remain unresolved or require additional attention.",
                  "Recommended next steps.",
                  "Whether additional individual representatives, sales-performance areas, or implementation support should be considered.",
                ],
                outro:
                  "The purpose of the final deliverable is to give leadership a clear, practical picture of where the team stands, what NORTH POINT SALES GROUP found, what was done about it, and what should happen next.",
              },
              {
                title: "IMPORTANT",
                intro:
                  "This is not a rigid day-by-day checklist. The engagement is deliberately structured to allow NORTH POINT SALES GROUP to allocate its time where it can have the greatest impact. If an issue requires greater attention, more time will be devoted to it. If an area is not contributing significantly to the performance problem, it will not receive unnecessary attention.\n\nThe $7,500 engagement includes direct one-on-one work with up to three selected representatives. If additional representatives require individual performance work, or if the scope expands beyond the original 30-day engagement, the engagement and investment will be adjusted accordingly.",
              },
            ],
          },
        },
        {
          title:
            "30-Day Focused Sales Performance Engagement — Beginning at $9,500",
          description:
            "Includes direct assessment and coaching of up to three sales or account representatives, plus a broader review of sales leadership, systems, processes, and organizational performance, with executive findings and a prioritized implementation roadmap.",
          popout: {
            ...focusedSalesPerformancePopout,
            sequenceInNestedPopup: true,
            sequenceHeading: "30-DAY WORK SEQUENCE",
            sequenceIntro:
              "The 30-day engagement follows a structured process designed to move from discovery to analysis, then to prioritized recommendations and an implementation roadmap. The sequence is not a rigid checklist. NORTH POINT SALES GROUP examines the relevant areas of the sales operation and allocates its attention based on what the evidence reveals. Areas with greater potential impact receive greater attention, while areas that do not appear to be significant performance constraints are not unnecessarily pursued.",
            sequenceGroups: [
              {
                title: "DAYS 1–5 — EXECUTIVE DISCOVERY",
                items: [
                  "Meet with company leadership to understand sales objectives, challenges, expectations, and concerns.",
                  "Review the existing sales organization and operating environment.",
                  "Gather relevant sales data, reports, processes, and supporting information.",
                  "Establish the initial areas requiring examination.",
                ],
                outro: "Output: Initial discovery findings and areas of focus.",
              },
              {
                title: "DAYS 6–12 — SALES OPERATION REVIEW",
                intro:
                  "Examine the relevant components of the sales operation, including:",
                items: [
                  "Sales leadership",
                  "Systems and processes",
                  "Team performance",
                  "Prospecting and lead development",
                  "Sales presentations",
                  "Pipeline management",
                  "CRM utilization",
                  "Performance measurement",
                  "Compensation and incentives",
                  "Recruiting and onboarding",
                  "Customer retention and development",
                  "Sales training",
                ],
                outro:
                  "The depth of review in each area is determined by its relevance to the company's sales-performance opportunities. Output: Sales operation findings and identified performance issues.",
              },
              {
                title: "DAYS 13–17 — LEAD GENERATION & CONVERSION REVIEW",
                intro: "Where applicable, examine:",
                items: [
                  "Lead sources",
                  "Prospecting activity",
                  "Lead handling",
                  "Sales calls and presentations",
                  "Follow-up",
                  "Pipeline movement",
                  "Conversion points",
                ],
                outro:
                  "The objective is to determine whether opportunities are being effectively generated, handled, advanced, and converted into sales. Output: Lead-generation and sales-conversion findings.",
              },
              {
                title: "DAYS 18–22 — ANALYSIS & PRIORITIZATION",
                items: [
                  "Connect findings across the sales operation.",
                  "Determine which issues appear to have the greatest impact on performance.",
                  "Separate primary issues from secondary issues.",
                  "Identify opportunities that should be addressed immediately.",
                  "Identify areas that should not be prioritized at this stage.",
                ],
                outro:
                  "Output: Prioritized findings and performance opportunities.",
              },
              {
                title: "DAYS 23–26 — EXECUTIVE RECOMMENDATIONS",
                intro:
                  "Develop recommendations based on the findings, including:",
                items: [
                  "What should be done.",
                  "Why it should be done.",
                  "Who should be responsible.",
                  "What resources may be required.",
                  "What should be addressed internally.",
                  "Where outside expertise may be appropriate.",
                  "How results should be measured.",
                ],
                outro: "Output: Executive recommendations.",
              },
              {
                title:
                  "DAYS 27–30 — EXECUTIVE PRESENTATION & IMPLEMENTATION ROADMAP",
                items: [
                  "Present the findings and priorities to company leadership.",
                  "Review the recommended actions and sequence.",
                  "Establish responsibilities and required resources.",
                  "Define recommended performance measurements.",
                  "Identify the capabilities and resources required for implementation.",
                  "Present the recommended path forward.",
                ],
                outro:
                  "Final Deliverable: Executive Findings, Recommendations & Implementation Roadmap.",
              },
              {
                title: "THE RESULT",
                intro:
                  "At the end of the 30 days, company leadership has a clear understanding of:",
                items: [
                  "Where sales-performance opportunities exist.",
                  "What is contributing to those opportunities.",
                  "Which issues should be addressed first.",
                  "What actions are recommended.",
                  "What resources may be required.",
                  "How implementation should proceed.",
                  "How future performance should be measured.",
                ],
              },
            ],
          },
        },
        {
          title: "Full Sales Performance Implementation — $50,000–$150,000+",
          description:
            "Comprehensive diagnosis and implementation across the areas of the sales operation that require attention.\n\nProfessional implementation fees are based on the agreed scope of work. Any additional third-party services or expenses require prior written client approval and are separately invoiced, with payment required before those services begin.",
          popout: {
            ...fullSalesPerformancePopout,
            sequenceInNestedPopup: true,
            sequenceHeading: "30–90 DAY WORK SEQUENCE",
            sequenceIntro:
              "The Full Sales Performance Implementation follows a structured process that moves from discovery and diagnosis to implementation, measurement, adjustment, and performance stabilization.\n\nThe sequence is not a rigid checklist. The amount of time devoted to each phase depends on what NORTH POINT SALES GROUP finds and the depth of implementation required. A focused implementation may be completed in approximately 30-60 days, while broader or more complex implementations may continue through 60-90 days.",
            sequenceGroups: [
              {
                title: "DAYS 1–5 — EXECUTIVE DISCOVERY & INITIAL ASSESSMENT",
                intro:
                  "NORTH POINT SALES GROUP begins by establishing an understanding of the company's sales organization, objectives, current performance, and areas of concern.\nWork may include:",
                items: [
                  "Executive discussions with company leadership.",
                  "Review of sales objectives and current performance.",
                  "Review of sales organization, roles, and responsibilities.",
                  "Review of available sales data and performance information.",
                  "Initial review of sales processes, systems, and management practices.",
                  "Identification of areas requiring deeper examination.",
                ],
                outro:
                  "Objective: Establish where the most significant sales-performance opportunities appear to exist.",
              },
              {
                title: "DAYS 6–12 — SALES PERFORMANCE DIAGNOSIS",
                intro:
                  "NORTH POINT SALES GROUP conducts a deeper examination of the areas identified during discovery.\nWork may include:",
                items: [
                  "Sales leadership and management.",
                  "Sales-team and individual performance.",
                  "Prospecting and lead development.",
                  "Sales presentations and conversations.",
                  "Pipeline management and follow-up.",
                  "CRM utilization and reporting.",
                  "Performance measurement and accountability.",
                  "Lead generation and sales conversion.",
                  "Other relevant sales-performance components.",
                ],
                outro:
                  "The review is evidence-driven rather than a checklist. Areas with greater potential impact receive greater attention.\n\nObjective: Determine what is affecting sales performance, where opportunities are being lost, and which issues should be addressed first.",
              },
              {
                title:
                  "DAYS 13–17 — FINDINGS, PRIORITIES & IMPLEMENTATION PLAN",
                intro:
                  "NORTH POINT SALES GROUP connects the findings and establishes the implementation priorities.\nWork may include:",
                items: [
                  "Identifying the highest-impact issues.",
                  "Separating primary issues from secondary issues.",
                  "Determining what should be addressed first.",
                  "Establishing recommended changes.",
                  "Identifying who is responsible for each action.",
                  "Determining internal resources and outside capabilities required.",
                  "Establishing appropriate performance measures.",
                  "Developing the implementation sequence.",
                ],
                outro:
                  "Objective: Establish a practical plan for moving from diagnosis into implementation.",
              },
              {
                title: "DAYS 18–30 — INITIAL IMPLEMENTATION",
                intro:
                  "NORTH POINT SALES GROUP begins putting the highest-priority recommendations into operation.\nWork may include:",
                items: [
                  "Implementing changes to sales processes and procedures.",
                  "Improving prospecting and lead-development practices.",
                  "Strengthening sales presentations and conversations.",
                  "Improving pipeline management and follow-up.",
                  "Improving CRM utilization and reporting.",
                  "Establishing or strengthening performance standards.",
                  "Addressing individual and team performance issues.",
                  "Strengthening sales management and accountability.",
                  "Working directly with leadership and sales personnel.",
                ],
                outro:
                  "Objective: Begin producing measurable improvement rather than stopping at recommendations.",
              },
              {
                title:
                  "DAYS 31–45 — EXTENDED IMPLEMENTATION & PERFORMANCE ADJUSTMENT",
                intro:
                  "Used when the depth or complexity of the implementation warrants additional time.\nNORTH POINT SALES GROUP continues implementation and begins evaluating how the changes are working in actual operation.\nWork may include:",
                items: [
                  "Completing additional recommended changes.",
                  "Working with additional salespeople, managers, or operating groups.",
                  "Monitoring adoption of new processes and practices.",
                  "Reviewing early performance results.",
                  "Identifying resistance, gaps, or unintended problems.",
                  "Making necessary adjustments.",
                  "Reinforcing new expectations and accountability.",
                  "Addressing additional issues uncovered during implementation.",
                ],
                outro:
                  "Objective: Ensure that implemented changes are functioning effectively in the real sales environment.",
              },
              {
                title:
                  "DAYS 46–90 — MEASUREMENT, REFINEMENT & PERFORMANCE STABILIZATION",
                intro:
                  "For engagements extending beyond 45 days, this final phase focuses on measuring results, refining the implementation, and establishing a sustainable operating approach.\nWork may include:",
                items: [
                  "Reviewing performance against established measures.",
                  "Determining what improvements are occurring.",
                  "Identifying areas that are not producing the expected results.",
                  "Making final adjustments to processes, practices, or accountability.",
                  "Reinforcing management and sales-team expectations.",
                  "Establishing procedures for continued internal monitoring.",
                  "Identifying remaining opportunities requiring future attention.",
                  "Reviewing results and next steps with executive leadership.",
                ],
                outro:
                  "Objective: Move the organization from implementation toward a sustainable system for maintaining and continuing sales-performance improvement.",
              },
              {
                title: "CLIENT PARTICIPATION THROUGHOUT THE 30–90 DAYS",
                intro:
                  "The client remains an active participant throughout the engagement.\nLeadership and designated personnel are expected to provide:",
                items: [
                  "Access to appropriate people and information.",
                  "Timely access to sales data, systems, and relevant materials.",
                  "Availability for scheduled meetings and working sessions.",
                  "Participation in decisions requiring company approval.",
                  "Internal resources necessary to implement agreed-upon changes.",
                  "Support for new processes, standards, and accountability measures.",
                ],
                outro:
                  "NORTH POINT SALES GROUP provides the outside expertise, assessment, implementation support, and performance-management process. The client's role is to provide the access, information, decisions, and internal support necessary to put the changes into operation.",
              },
              {
                title: "FINAL DELIVERABLE",
                intro:
                  "At the conclusion of the engagement, NORTH POINT SALES GROUP provides an Executive Sales Performance Implementation Summary documenting:",
                items: [
                  "What was examined.",
                  "What was found.",
                  "The highest-priority performance issues identified.",
                  "Changes implemented.",
                  "Performance improvements identified during the engagement.",
                  "Remaining issues or opportunities.",
                  "Performance measures established.",
                  "Recommended actions for continued internal management and improvement.",
                ],
                outro:
                  "The final deliverable gives executive leadership a clear record of where the organization started, what NORTH POINT SALES GROUP found, what was changed, what results were observed, and what should happen next.",
              },
              {
                title: "IMPORTANT",
                intro:
                  "The scope, professional fee, and implementation period are determined by the size and complexity of the sales organization and the number, complexity, and depth of the changes required. Professional fees are based on the scope and depth of the work, while the implementation period reflects the time reasonably required to complete that work. A higher professional fee does not necessarily require a longer implementation period.",
              },
            ],
          },
        },
      ],
    },
    modal: {
      title: "WHAT COULD EVEN A SMALL, CONSERVATIVE IMPROVEMENT BE WORTH?",
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
    title: "Why NORTH POINT SALES GROUP?",
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
          "A recommendation has little value if it never becomes part of the way the business operates. NORTH POINT SALES GROUP does not simply identify opportunities and hand over a report. We help leadership put the agreed-upon improvements into practice, monitor how they are working, and make adjustments where necessary.",
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
    badge: "FAQs",
    title: "Resources & Insights",
    questions: [
      {
        question: "What is your typical engagement and investment?",
        answer: [
          "Our engagements are customized based on the scope of the sales-performance issues, the areas requiring attention, the size and complexity of the sales organization, and the level of implementation support required.",
          "NORTH POINT SALES GROUP offers engagements ranging from focused 30-day sales-performance engagements beginning at $7,500 and $9,500 to comprehensive Full Sales Performance Implementation engagements ranging from $50,000 to $150,000+.",
          "Full Sales Performance Implementation engagements typically run 30 to 90 days, depending on the size and complexity of the sales organization, the scope of work, and the depth of implementation required.",
          "For comprehensive implementations, the investment is determined by the actual scope of work—not simply the size of the company. The greater the number of performance areas involved, organizational complexity, level of hands-on implementation, and duration of NPSG involvement, the greater the investment.",
          {
            linkLine: {
              before:
                "For details on each engagement and investment level, see ",
              href: "#investment",
              label: "Section 6 — Investment",
              after: ".",
            },
          },
          "The objective is to identify and implement the changes with the greatest potential to improve sales performance and create measurable business value that justifies the investment.",
        ],
      },
      {
        question:
          "Can NORTH POINT SALES GROUP work with just a few of our Sales or Account Representatives?",
        answer: [
          "Yes. NORTH POINT SALES GROUP can work directly with a limited number of Sales or Account Representatives when the company wants to address specific individual or team performance issues without undertaking a broader sales-performance implementation.",
          "Our $7,500 Sales Team Performance Engagement is a 30-day engagement that can apply to a sales team of any size and includes direct one-on-one work with up to three selected representatives.",
          "Our $9,500 Focused Sales Performance Engagement includes the same direct assessment and coaching of up to three representatives, along with a broader evaluation of the sales organization and a prioritized improvement plan.",
          "If the company wants direct one-on-one work with more than three representatives, the engagement scope and investment are expanded accordingly. The additional investment is based on the number of representatives requiring individual attention, the areas being addressed, and the level of NPSG involvement required.",
          "This allows a company to begin with a focused engagement involving up to three representatives and expand the work when additional individual performance support is warranted.",
          {
            linkLine: {
              before:
                "For details on the available engagement and investment levels, see ",
              href: "#investment",
              label: "Section 6 — Investment",
              after: ".",
            },
          },
        ],
      },
      {
        question: "How long does a typical engagement last?",
        answer: [
          "Our 30–90 Day Implementation Process",
          "Most Full Sales Performance Implementation engagements are completed within 30–90 days.",
          "The appropriate duration depends on the size and complexity of the sales organization, the areas being addressed, and the depth of implementation required.",
          "Duration and professional fees are determined independently. A larger investment does not necessarily require a longer engagement.",
          // "For example, a substantial $100,000 implementation may sometimes be effectively completed within 30 days, while another engagement may require 45–60 days because of the implementation and follow-through involved.",
        ],
      },
      {
        question: "How do you work with our leadership team?",
        answer: [
          "We work directly with executive leadership throughout the engagement.",
          "Our role is not simply to provide recommendations, but to help implement them.",
          "Our implementation philosophy is best described as:",
          "Done With You. Done For You.",
          "We collaborate with your leadership team to strengthen sales leadership, improve accountability, implement better systems, strengthen team morale, and improve overall sales performance.",
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
          "Our methodology applies across many industries where professional sales organizations play a critical role in business growth. Rather than specializing in one industry, we specialize in improving sales performance through stronger people, systems, and leadership.",
        ],
      },
      {
        question: "What makes NORTH POINT SALES GROUP different?",
        answer: [
          "Many consulting firms provide recommendations.",
          "Many training companies provide education.",
          "NORTH POINT SALES GROUP focuses on implementation.",
          "We partner with executive leadership to help put practical improvements into action, creating stronger leadership, better systems, improved accountability, and measurable organizational performance.",
        ],
      },
      {
        question: "Who is your ideal client?",
        answer: [
          "NORTH POINT SALES GROUP is best suited for organizations that:",
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
          // "Our standard investment schedule is straightforward.",
          {
            bullets: [
              "For a 30-day engagement, 50% is due when the engagement begins and the remaining 50% is due approximately halfway through the engagement.",
              "For a 60-day engagement, one-third is due at the beginning, one-third at approximately Day 30, and the final one-third is due near completion.",
              "For a 90-day engagement, one-third is due at the beginning, one-third at approximately Day 30, and the final one-third at approximately Day 60.",
            ],
          },
          "Professional engagement fees and additional third-party expenses are invoiced separately. All additional third-party services or expenses must be approved by the client in writing before billing. Payment for these expenses is required before the additional services begin.",
          // "These are quick but vital. Please see if they can change them now. I appreciate it.",
        ],
      },
      {
        question: "What happens after the implementation engagement?",
        answer: [
          "Many organizations continue implementing the systems, processes, and leadership improvements established during the engagement.",
          "Others choose to retain NORTH POINT SALES GROUP for ongoing executive advisory services, quarterly business reviews, leadership coaching, or future organizational initiatives.",
          "Continuing advisory services are always optional and customized to your organization's needs.",
        ],
      },
      {
        question: "How do we get started?",
        answer: [
          "The first step is to request a confidential Executive Consultation.",
          "During this conversation, we'll learn about your organization, discuss your objectives, answer your questions, and determine whether NORTH POINT SALES GROUP is the right fit for your business.",
          "If we believe we can create significant value, we'll outline the recommended next steps. If we don't, we'll tell you that as well.",
          "We believe the right partnerships begin with honesty, transparency, and a shared commitment to achieving meaningful business results.",
        ],
      },
    ],
  },
  results: {
    badge: "Results",
    title: "SALES PERFORMANCE IMPROVEMENTS THAT MATTER",
    intro:
      "We help established organizations improve sales execution and pursue measurable business results, including:",
    checkmark: "/icons/checkmark.svg",
    bullets: [
      {
        id: "sales-team-productivity",
        label: "Greater productivity from the existing sales team.",
        popout: {
          title: "GREATER SALES TEAM PRODUCTIVITY",
          paragraphs: [
            "Help salespeople spend more time on activities that advance qualified opportunities and develop customer relationships.",
            "We examine how time is spent, identify unnecessary administrative work, and address gaps in preparation, prioritization, and execution.",
          ],
          measuresHeading: "Possible measures include:",
          measures: [
            "Time spent on selling activities.",
            "Qualified appointments or presentations completed.",
            "Sales revenue per representative.",
            "Progress against each representative’s starting baseline.",
          ],
        },
      },
      {
        id: "prospecting-follow-up",
        label: "More consistent prospecting and follow-up.",
        popout: {
          title: "MORE CONSISTENT PROSPECTING AND FOLLOW-UP",
          paragraphs: [
            "Establish practical routines for identifying prospects, initiating conversations, and completing agreed next steps.",
            "We help clarify who is responsible, when follow-up should occur, and how activity should be recorded so opportunities receive consistent attention.",
          ],
          measuresHeading: "Possible measures include:",
          measures: [
            "New qualified opportunities generated.",
            "Response time to incoming leads.",
            "Follow-ups completed on schedule.",
            "Opportunities with a documented next step and date.",
          ],
        },
      },
      {
        id: "sales-conversion",
        label: "Improved conversion of qualified opportunities into customers.",
        popout: {
          title: "IMPROVED SALES CONVERSION",
          paragraphs: [
            "Help salespeople move qualified opportunities toward informed buying decisions through better preparation, presentations, objection handling, and follow-through.",
            "We examine where opportunities stall or are lost and provide focused coaching and process improvements.",
          ],
          measuresHeading: "Possible measures include:",
          measures: [
            "Percentage of qualified opportunities won.",
            "Conversion rates between sales stages.",
            "Proposal-to-sale conversion rate.",
            "Average time from qualification to a buying decision.",
          ],
        },
      },
      {
        id: "pipeline-forecasting",
        label: "More accurate pipeline information and sales forecasting.",
        popout: {
          title: "MORE RELIABLE PIPELINE AND FORECASTING",
          paragraphs: [
            "Give leadership a clearer picture of active opportunities, expected sales, and areas requiring attention.",
            "We help establish clear sales stages, improve CRM information, and review whether opportunity values, expected closing dates, and next steps reflect actual circumstances.",
          ],
          measuresHeading: "Possible measures include:",
          measures: [
            "Difference between forecasted and actual sales.",
            "Percentage of opportunities with current, complete information.",
            "Opportunities remaining in a stage beyond established expectations.",
            "Frequency of expected closing dates being postponed.",
          ],
        },
      },
      {
        id: "sales-management",
        label: "Stronger coaching, accountability, and management visibility.",
        popout: {
          title: "STRONGER SALES MANAGEMENT",
          paragraphs: [
            "Help sales managers identify performance gaps, provide useful coaching, and follow through on clear expectations.",
            "We strengthen performance reviews, sales meetings, and reporting so managers can see where support or corrective action is needed.",
          ],
          measuresHeading: "Possible measures include:",
          measures: [
            "Completion of scheduled coaching sessions.",
            "Follow-through on agreed actions.",
            "Improvement in the skills or behaviors being coached.",
            "Individual and team progress against established performance standards.",
          ],
        },
      },
      {
        id: "revenue-contribution-profit",
        label: "Increased revenue and contribution profit.",
        popout: {
          title: "INCREASED REVENUE AND CONTRIBUTION PROFIT",
          paragraphs: [
            "Focus improvements on opportunities that can generate additional sales while accounting for the costs required to produce them.",
            "We examine whether stronger execution, improved conversion, account development, and appropriate pricing are translating into financial value.",
            "Contribution profit is the revenue remaining after subtracting the variable costs associated with those sales. We agree with the client on which costs are included so comparisons remain consistent.",
          ],
          measuresHeading: "Possible measures include:",
          measures: [
            "Sales revenue compared with the starting baseline.",
            "Revenue from existing customer growth.",
            "Contribution profit in dollars and as a percentage of revenue.",
            "Discount levels and their effect on contribution profit.",
          ],
        },
      },
    ],
    measuring: {
      title: "MEASURING THE IMPROVEMENT",
      paragraphs: [
        "We establish relevant baseline KPIs, agree on improvement priorities, and track progress throughout the engagement. This helps leadership see what is changing, where progress is occurring, and what still requires attention.",
        "Specific results depend on the organization’s starting point, engagement scope, and implementation of agreed improvements.",
      ],
    },
    popoutNote:
      "Measures are selected according to the engagement’s scope and available data. Specific financial results are not guaranteed.",
    tagline: "WHY SALES PERFORMANCE DESERVES ATTENTION",
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
            "A large majority of executives recognize that achieving company growth objectives depends on improving the productivity of the sales team already in place. This supports a core NORTH POINT SALES GROUP principle: before adding more salespeople, more marketing, or more spending, leadership should first determine whether greater performance can be achieved from the existing sales organization.",
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

NORTH POINT SALES GROUP may help improve sales productivity by:
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
            "When average quota attainment is below 50%, the issue may extend beyond the individual salesperson. Sales leadership, lead quality, prospecting, messaging, pipeline management, CRM utilization, training, accountability, compensation, and other factors can all influence performance. NORTH POINT SALES GROUP evaluates the areas most relevant to the organization to determine where targeted improvements may produce stronger results.",
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
              { label: "About Us", href: "/#about-us" },
              { label: "Why Us", href: "/#why-choose-us" },
              { label: "Results", href: "/#results" },

              { label: "How We Work", href: "/#how-we-work" },
              { label: "30-90 DAY Focus", href: "/#30-90-focus" },
              { label: "Challenges", href: "/#challenges" },
              { label: "Investment", href: "/#investment" },

              // { label: "Solutions", href: "/#solutions" },
              { label: "FAQs", href: "/#faqs" },

              { label: "Careers", href: "/careers" },
              { label: "EXECUTIVE INSIGHTS", href: "/blogs" },
              {
                label: "Sales Alignment Assessment",
                href: "/sales-alignment-assessment",
              },
            ],
          },
        ],
      },
    ],

    contact: {
      phone: "800-696-6971",
      email: "contact@northpointsalesgroup.com",
      scope: "Serving Clients Nationwide",
    },

    testimonialsNote: {
      title: "Testimonials",
      paragraphs: [
        "We actually don't ask our clients for testimonials. The companies we work with are established organizations, and we consider the work we do with them to be confidential.",
        "If a company brings in NORTH POINT SALES GROUP to further strengthen its sales performance, increase productivity, improve its systems, or pursue additional growth, that's a strategic business decision. There is no particular advantage in announcing those initiatives to competitors.",
        "For the same reason, we don't believe our clients should be expected to publicly identify themselves or discuss the work we're doing together simply to help us market our company.",
        "We respect that privacy. What we do for a client is their business, and we keep it that way.",
      ],
    },

    remoteWork: {
      linkLabel: "Remote Services",
      title: "Remote Sales Performance Services",
      subtitle:
        "Practical Implementation. Nationwide Delivery. Measurable Improvements.",
      intro: [
        "NORTH POINT SALES GROUP provides remote sales performance implementation services for organizations with inside sales teams, outside sales representatives, or a combination of both.",
        "Whether your salespeople work by telephone, conduct virtual presentations, or travel to meet customers in person, much of the coaching, management support, systems improvement, and performance development can be accomplished remotely.",
        "Our approach allows us to work directly with sales representatives and leadership throughout the United States while minimizing travel expenses, disruption, and unnecessary overhead.",
      ],
      examplesHeading: "Examples of What We Can Implement Remotely",
      items: [
        {
          title: "Individual Sales Coaching & Development",
          description:
            "Work directly with inside and outside sales representatives to improve selling skills, presentations, objection handling, negotiations, follow-up, and closing effectiveness.",
        },
        {
          title: "Sales Leadership & Management Support",
          description:
            "Help owners, executives, and sales managers strengthen leadership, coaching, performance management, and accountability practices.",
        },
        {
          title: "Outside Sales & Territory Performance",
          description:
            "Help field sales representatives improve account planning, customer visit preparation, territory management, opportunity development, and post-visit follow-up without interrupting their normal travel schedules.",
        },
        {
          title: "Sales Systems & CRM Optimization",
          description:
            "Improve sales processes, CRM utilization, pipeline visibility, forecasting, and workflows to help salespeople and management operate more effectively.",
        },
        {
          title: "KPI Development & Accountability",
          description:
            "Establish practical performance measurements, review individual and team results, identify performance gaps, and implement corrective improvements.",
        },
        {
          title: "Sales Presentations & Customer Communications",
          description:
            "Review recorded sales conversations when available, conduct virtual role-playing, strengthen sales presentations, and help representatives prepare for important customer meetings and negotiations.",
        },
        {
          title: "Sales Meetings & Team Coordination",
          description:
            "Improve the structure and effectiveness of sales meetings, management reviews, coaching sessions, and communication between geographically dispersed salespeople.",
        },
        {
          title: "Sales Organization Assessment & Improvement",
          description:
            "Evaluate salespeople, leadership, processes, systems, and operating practices to identify opportunities and implement improvements throughout the sales organization.",
        },
        {
          title: "Ongoing Performance Monitoring & Refinement",
          description:
            "Review performance results, track implementation progress, provide feedback, and refine improvements to help establish sustainable sales practices.",
        },
      ],
      outsideSales: {
        heading: "How We Work With Outside Sales Representatives",
        paragraphs: [
          "Outside sales representatives can continue visiting customers, developing accounts, and conducting face-to-face sales meetings while receiving remote coaching and implementation support.",
          "For example, we can help representatives prepare for important customer visits, review the results afterward, strengthen follow-up strategies, address sales challenges, and improve territory productivity.",
          "When direct observation or on-site involvement would provide additional value, arrangements can be discussed according to the engagement's needs.",
        ],
      },
      bottomLine: {
        heading: "The Bottom Line",
        emphasis: "Remote Implementation Does Not Mean Limited Involvement.",
        paragraphs: [
          "Our objective is to help improve sales performance through direct, practical involvement with your salespeople and leadership—regardless of whether your representatives work inside an office, remotely, or in the field.",
          "We focus on the improvements your organization actually needs, establish measurable expectations, and help implement changes designed to produce lasting results.",
        ],
        tagline:
          "Remote Implementation. Clear Accountability. Practical Results.",
      },
    },

    salesKpiGuide: {
      title: "Sales KPI Guide",
      intro: [
        "Each KPI pop-out explains what it measures, why it matters, and how NORTH POINT SALES GROUP uses it to evaluate potential opportunities for improved sales performance.",
        "All KPIs should be evaluated against an established baseline. Not every KPI needs to be actively monitored for every client.",
      ],
      categories: [
        {
          title: "Activity Metrics",
          summary:
            "The volume, consistency, and effectiveness of sales activities that contribute to developing new business and moving existing opportunities forward.",
          kpis: [
            {
              title: "Total Prospecting Activity",
              measures:
                "The total number of outbound activities conducted to identify and engage potential customers, including calls, emails, networking contacts, and other prospecting efforts.",
              matters:
                "Helps determine whether sufficient prospecting activity is taking place to support the organization's sales objectives.",
              evaluate:
                "Activity volume, consistency, prospect quality, and resulting opportunities.",
            },
            {
              title: "Qualified Follow-Up Activity",
              measures:
                "The number of meaningful follow-up actions conducted with qualified prospects or existing sales opportunities.",
              matters:
                "Consistent, timely follow-up can prevent valuable opportunities from being overlooked or delayed.",
              evaluate:
                "Follow-up frequency, timing, quality, and resulting progression through the sales process.",
            },
            {
              title: "New Opportunities Created",
              measures:
                "The number of new potential sales opportunities entered into the organization's pipeline during a defined period.",
              matters:
                "Indicates whether sales activities are generating sufficient new business opportunities to support future revenue.",
              evaluate:
                "Opportunity volume, qualification standards, sources, and potential value.",
            },
            {
              title: "Calls Made",
              measures:
                "The number of outbound sales calls completed by individual salespeople or the entire sales team.",
              matters:
                "Provides visibility into telephone prospecting and follow-up activity.",
              evaluate:
                "Call volume, connection rates, conversation quality, and opportunities generated.",
            },
            {
              title: "Emails Sent",
              measures:
                "The number of sales-related emails sent to prospects and existing opportunities.",
              matters:
                "Helps evaluate email outreach as part of the organization's overall sales development process.",
              evaluate:
                "Email volume, relevance, response rates, and resulting sales conversations.",
            },
            {
              title: "Meetings Scheduled",
              measures:
                "The number of prospect meetings, discovery conversations, presentations, and other sales-related appointments scheduled.",
              matters:
                "Indicates how effectively initial sales activities are creating opportunities for meaningful customer engagement.",
              evaluate:
                "Appointment volume, prospect qualification, attendance rates, and resulting pipeline advancement.",
            },
            {
              title: "Proposals Submitted",
              measures:
                "The number of formal sales proposals, quotations, or commercial offers presented to prospective customers.",
              matters:
                "Helps evaluate the organization's ability to advance qualified opportunities toward purchasing decisions.",
              evaluate:
                "Proposal volume, qualification, decision timelines, and conversion into completed sales.",
            },
            {
              title: "Demos or Presentations",
              measures:
                "The number of product demonstrations or sales presentations conducted with prospective customers.",
              matters:
                "Helps determine how effectively salespeople are engaging prospects and communicating the organization's value.",
              evaluate:
                "Presentation effectiveness, customer engagement, objections, and advancement to the next sales stage.",
            },
            {
              title: "Average Follow-Ups per Opportunity",
              measures:
                "The average number of follow-up contacts made for each sales opportunity during a defined period.",
              matters:
                "Helps identify whether opportunities are receiving appropriate attention without unnecessary or unproductive contact.",
              evaluate:
                "Follow-up frequency, timing, quality, and its relationship to sales conversion.",
            },
          ],
        },
        {
          title: "Pipeline Metrics",
          summary:
            "The structure, quality, movement, and potential value of sales opportunities throughout the organization's sales process.",
          kpis: [
            {
              title: "Total Opportunities",
              measures:
                "The total number of open sales opportunities within the organization's pipeline.",
              matters:
                "Provides an overview of current potential business and future sales production.",
              evaluate:
                "Opportunity volume, distribution, aging, and overall pipeline quality.",
            },
            {
              title: "Qualified Opportunities",
              measures:
                "The number of opportunities that meet the organization's established qualification criteria.",
              matters:
                "Helps distinguish realistic sales opportunities from contacts that are unlikely to become customers.",
              evaluate:
                "Qualification consistency, customer requirements, purchasing authority, and potential purchasing timelines.",
            },
            {
              title: "Pipeline Value (Total)",
              measures:
                "The combined estimated revenue value of all open sales opportunities.",
              matters:
                "Provides visibility into the potential future sales represented by the existing pipeline.",
              evaluate:
                "Total value, opportunity quality, probability of closing, and potential contribution to future revenue.",
            },
            {
              title: "Pipeline by Stage",
              measures:
                "How opportunities are distributed across the organization's defined sales stages, from initial qualification through closing.",
              matters:
                "Helps identify where opportunities accumulate, stall, or move successfully toward completed sales.",
              evaluate:
                "Stage distribution, bottlenecks, progression patterns, and consistency of sales processes.",
            },
            {
              title: "Stage Progression Rate",
              measures:
                "The percentage of opportunities advancing from a particular sales stage to the next within a defined period.",
              matters:
                "Helps determine how effectively sales opportunities are moving through the sales process.",
              evaluate:
                "Progression rates, delays, obstacles, and opportunities to improve advancement.",
            },
            {
              title: "Pipeline Stage Compliance",
              measures:
                "How consistently salespeople follow the organization's established requirements for each pipeline stage.",
              matters:
                "Improves pipeline reliability, management visibility, and the consistency of sales activities.",
              evaluate:
                "Proper stage classification, required information, CRM accuracy, and adherence to established procedures.",
            },
            {
              title: "Opportunities with Next Step",
              measures:
                "The percentage of active sales opportunities that have a clearly defined next action or agreed follow-up commitment.",
              matters:
                "Opportunities without defined next steps are more likely to lose momentum or remain inactive.",
              evaluate:
                "Next-step documentation, assigned responsibility, scheduled dates, and completion.",
            },
            {
              title: "Average Days in Stage",
              measures:
                "The average amount of time opportunities remain within each stage of the sales pipeline.",
              matters:
                "Helps identify delays that may unnecessarily extend the sales cycle.",
              evaluate:
                "Stage duration, causes of delays, and opportunities to improve progression.",
            },
            {
              title: "Pipeline Velocity",
              measures:
                "The estimated rate at which qualified opportunities move through the sales process and generate revenue.",
              matters:
                "Helps determine how effectively the organization converts its pipeline into sales over time.",
              evaluate:
                "Opportunity volume, deal value, win rates, and sales cycle length.",
            },
            {
              title: "Pipeline Coverage Ratio",
              measures:
                "How the value of the sales pipeline compares against a defined future sales target.",
              matters:
                "Helps determine whether sufficient potential business exists to support anticipated sales production.",
              evaluate:
                "Pipeline value, revenue targets, historical win rates, and the amount of qualified pipeline required.",
            },
          ],
        },
        {
          title: "Conversion Metrics",
          summary:
            "How effectively the organization's sales activities and opportunities turn into qualified prospects, proposals, and completed sales.",
          kpis: [
            {
              title: "Prospect to Opportunity Rate",
              measures:
                "The percentage of prospects who become qualified sales opportunities.",
              matters:
                "Indicates how effectively the organization identifies and develops prospects with legitimate purchasing potential.",
              evaluate:
                "Prospect quality, qualification procedures, sales conversations, and conversion rates.",
            },
            {
              title: "Opportunity to Proposal Rate",
              measures:
                "The percentage of qualified opportunities that advance to a formal proposal or quotation.",
              matters:
                "Helps determine how effectively salespeople move potential customers toward a purchasing decision.",
              evaluate:
                "Discovery effectiveness, qualification, presentations, objections, and proposal readiness.",
            },
            {
              title: "Proposal to Close Rate",
              measures:
                "The percentage of proposals that result in completed sales.",
              matters:
                "Identifies how effectively the organization converts formal offers into revenue.",
              evaluate:
                "Proposal quality, pricing, competitive positioning, customer objections, and closing practices.",
            },
            {
              title: "Overall Win Rate",
              measures:
                "The percentage of closed sales opportunities that result in successful sales rather than losses.",
              matters:
                "Provides a broad indication of the organization's ability to convert qualified opportunities into customers.",
              evaluate:
                "Win rates by salesperson, opportunity type, market, product, and sales process.",
            },
            {
              title: "Loss Rate (and Reasons)",
              measures:
                "The percentage of closed opportunities that are lost and identifies the primary reasons those opportunities were unsuccessful.",
              matters:
                "Reveals patterns that may be preventing additional sales.",
              evaluate:
                "Pricing concerns, competitive losses, customer objections, qualification problems, timing, and sales execution.",
            },
            {
              title: "Average Sales Cycle Length",
              measures:
                "The average time required to move an opportunity from a defined starting point to a completed sale.",
              matters:
                "Helps identify unnecessary delays that can reduce sales productivity and postpone revenue.",
              evaluate:
                "Sales cycle duration, stage delays, follow-up practices, and opportunities to shorten the process.",
            },
            {
              title: "Days to Next Follow-Up",
              measures:
                "The time between a sales activity and the next scheduled follow-up with a prospect or customer.",
              matters:
                "Helps determine whether sales opportunities are receiving timely attention.",
              evaluate:
                "Follow-up intervals, customer expectations, scheduling consistency, and unnecessary delays.",
            },
            {
              title: "Stage-to-Stage Conversion Rates",
              measures:
                "The percentage of opportunities successfully advancing from one defined pipeline stage to another.",
              matters:
                "Identifies where the organization converts opportunities effectively and where potential sales are being lost.",
              evaluate:
                "Conversion patterns, stage-specific obstacles, process effectiveness, and improvement opportunities.",
            },
            {
              title: "Cost per Opportunity",
              measures:
                "The average sales and marketing cost required to generate a qualified sales opportunity.",
              matters:
                "Helps determine whether the organization's business development activities are producing opportunities economically.",
              evaluate:
                "Acquisition costs, prospecting productivity, lead sources, and opportunity quality.",
            },
            {
              title: "ROI on Sales Activity",
              measures:
                "The financial return generated by defined sales activities relative to their associated costs.",
              matters:
                "Helps determine whether sales resources are being used effectively and profitably.",
              evaluate:
                "Sales activity costs, attributable revenue, profit contribution, and overall financial return.",
            },
          ],
        },
        {
          title: "Revenue Metrics",
          summary:
            "The financial results generated by the sales organization, including revenue production, growth, forecasting, and contribution from different parts of the business.",
          kpis: [
            {
              title: "New Revenue (Booked Sales)",
              measures:
                "The value of new sales commitments secured during a defined period.",
              matters:
                "Provides a direct indication of sales production and newly secured business.",
              evaluate:
                "Booked sales, production trends, sales targets, and expected financial contribution.",
            },
            {
              title: "Average Deal Size",
              measures:
                "The average revenue value of completed sales transactions.",
              matters:
                "Helps determine whether the organization is maximizing the potential value of its sales opportunities.",
              evaluate:
                "Deal value, product mix, pricing, cross-selling, upselling, and profitability.",
            },
            {
              title: "Total Pipeline Value",
              measures:
                "The combined estimated revenue value of all open sales opportunities.",
              matters:
                "Helps management evaluate the potential future revenue available within the existing sales pipeline.",
              evaluate:
                "Pipeline value, probability of closing, opportunity quality, and alignment with revenue objectives.",
            },
            {
              title: "Revenue by Product/Service",
              measures:
                "Revenue generated by individual products, services, or product categories.",
              matters:
                "Helps identify which offerings contribute most effectively to the organization's sales production.",
              evaluate:
                "Revenue concentration, sales trends, product demand, and profit contribution.",
            },
            {
              title: "Revenue by Market/Region",
              measures:
                "Revenue generated from specific geographic territories, industries, customer segments, or markets.",
              matters:
                "Helps identify stronger-performing markets and potential opportunities for expansion or improvement.",
              evaluate:
                "Market performance, territory productivity, customer demand, and growth potential.",
            },
            {
              title: "Revenue by Salesperson",
              measures:
                "The revenue generated by each member of the sales organization.",
              matters:
                "Helps management understand individual production and identify opportunities to improve sales performance.",
              evaluate:
                "Revenue contribution, assigned opportunities, territory differences, production trends, and individual improvement needs.",
            },
            {
              title: "Revenue Growth Rate",
              measures:
                "The percentage increase or decrease in revenue over a defined period compared with an appropriate earlier period.",
              matters:
                "Provides a direct measurement of whether the organization is expanding or contracting its sales production.",
              evaluate:
                "Growth trends, seasonal effects, changes in customer demand, and contributing sales activities.",
            },
            {
              title: "Forecasted Revenue",
              measures:
                "The estimated revenue expected to be generated during a future period.",
              matters:
                "Supports management planning, resource allocation, and informed financial decisions.",
              evaluate:
                "Pipeline quality, opportunity probabilities, anticipated closing dates, and historical forecasting accuracy.",
            },
            {
              title: "Actual vs. Forecasted Revenue",
              measures:
                "How actual revenue generated during a period compares with the revenue originally forecasted for that same period.",
              matters:
                "Helps determine how accurately the organization predicts sales production.",
              evaluate:
                "Forecast variances, underlying causes, pipeline reliability, and opportunities to improve forecasting.",
            },
            {
              title: "Recurring Revenue (If Applicable)",
              measures:
                "Revenue generated through ongoing contracts, subscriptions, repeat service agreements, or other recurring customer arrangements.",
              matters:
                "Provides insight into the stability and predictability of revenue where recurring business is part of the company's model.",
              evaluate:
                "Recurring revenue trends, customer renewals, retention, expansion opportunities, and revenue concentration.",
            },
          ],
        },
        {
          title: "Team Performance Metrics",
          summary:
            "Individual and collective sales productivity, effectiveness, development, and the organization's ability to maintain a productive sales team.",
          kpis: [
            {
              title: "Activity per Salesperson",
              measures:
                "The volume of defined sales activities completed by each salesperson during a specified period.",
              matters:
                "Helps identify differences in activity levels, work patterns, and productivity across the sales team.",
              evaluate:
                "Activity consistency, effectiveness, workload, and resulting sales opportunities.",
            },
            {
              title: "Opportunities per Salesperson",
              measures:
                "The number of active or newly generated sales opportunities assigned to individual salespeople.",
              matters:
                "Helps evaluate opportunity distribution, workload, and potential production capacity.",
              evaluate:
                "Opportunity volume, quality, assignment balance, and conversion results.",
            },
            {
              title: "Win Rate per Salesperson",
              measures:
                "The percentage of closed sales opportunities successfully won by each salesperson.",
              matters:
                "Helps identify individual strengths and opportunities for improvement in sales execution.",
              evaluate:
                "Win rates, opportunity quality, customer objections, closing practices, and coaching opportunities.",
            },
            {
              title: "Average Deal Size per Salesperson",
              measures:
                "The average revenue value of completed sales generated by individual salespeople.",
              matters:
                "Helps determine whether salespeople are effectively developing the financial potential of their opportunities.",
              evaluate:
                "Deal values, sales approaches, pricing consistency, product mix, and account development.",
            },
            {
              title: "Revenue per Salesperson",
              measures:
                "The total revenue produced by individual salespeople during a defined period.",
              matters:
                "Provides a direct measurement of individual sales production.",
              evaluate:
                "Revenue trends, opportunity availability, territory conditions, individual performance, and improvement potential.",
            },
            {
              title: "Quota Attainment",
              measures:
                "The percentage of an established sales target achieved by each salesperson or the entire team.",
              matters:
                "Helps determine whether sales production is meeting organizational expectations.",
              evaluate:
                "Target achievement, quota realism, individual performance, and factors affecting results.",
            },
            {
              title: "Ramp Time for New Hires",
              measures:
                "The time required for newly hired salespeople to reach a defined level of expected productivity.",
              matters:
                "Helps evaluate the effectiveness of recruiting, onboarding, training, and early performance support.",
              evaluate:
                "Time to productivity, onboarding procedures, development milestones, and management support.",
            },
            {
              title: "Sales Cycle Length by Salesperson",
              measures:
                "The average time individual salespeople require to move an opportunity through the sales process to completion.",
              matters:
                "Helps identify differences in sales efficiency and potential opportunities to shorten purchasing timelines.",
              evaluate:
                "Individual sales cycles, opportunity complexity, follow-up effectiveness, and process adherence.",
            },
            {
              title: "Team Productivity Index",
              measures:
                "A combined performance measurement that evaluates sales production relative to selected activities, resources, and expected performance standards.",
              matters:
                "Provides management with a broader indication of how efficiently the sales team converts its resources into measurable results.",
              evaluate:
                "Selected productivity indicators, established baselines, individual contributions, and overall team performance.",
              note: "The specific calculation is established for each client based on its business model and sales objectives.",
            },
            {
              title: "Retention Rate (Sales Team)",
              measures:
                "The percentage of sales employees who remain with the organization during a defined period.",
              matters:
                "Helps evaluate workforce stability and the organization's ability to retain experienced sales personnel.",
              evaluate:
                "Employee retention trends, turnover patterns, management practices, compensation structures, and development opportunities.",
            },
          ],
        },
      ],
    },

    aiSalesIntegration: {
      linkLabel: "AI Sales Integration",
      title: "AI Sales Opportunities",
      headline:
        "Could Artificial Intelligence Help Your Existing Sales Organization Produce More?",
      intro: [
        "Artificial intelligence is creating opportunities for businesses to increase sales productivity, identify more qualified prospects, reduce time-consuming administrative work, and improve the effectiveness of their existing sales operations.",
        "At NORTH POINT SALES GROUP, we evaluate where AI could provide a practical, measurable advantage.",
        "Potential applications include:",
      ],
      applications: [
        {
          title: "Lead Generation",
          description:
            "Use AI to help find prospective companies from available business information and organize them by industry, location, company size, and likely fit for your services.",
        },
        {
          title: "Lead Qualification",
          description:
            "Use AI to research prospects and compare them against your ideal customer criteria, helping salespeople prioritize the most promising opportunities.",
        },
        {
          title: "CRM Efficiency",
          description:
            "Use AI to help enter and update CRM information, flag missing or inconsistent records, and reduce repetitive administrative work so salespeople have more time to sell.",
        },
        {
          title: "Sales Follow-Up",
          description:
            "Use AI to help schedule follow-up activities, create reminders, and draft personalized messages based on previous interactions, helping salespeople stay consistent and reduce missed opportunities.",
        },
        {
          title: "Sales Forecasting",
          description:
            "Use AI to examine current opportunities, past sales results, and deal progress to help estimate which sales may close and when, while flagging stalled deals or other risks that could affect the forecast.",
        },
        {
          title: "Performance Monitoring",
          description:
            "Use AI to review CRM data and sales KPIs, flag potential problems—such as declining conversion rates, stalled opportunities, or missing follow-up records—and alert the appropriate person. By examining related measurements together, AI can help identify possible causes for your team to investigate.",
        },
      ],
      approach: {
        title: "Our Approach",
        paragraphs: [
          "We don't recommend AI simply because the technology is available.",
          "We first evaluate your existing sales organization to determine whether incorporating AI could improve performance, reduce unnecessary work, or create additional revenue opportunities.",
          "Where appropriate, we help identify suitable technology providers and work with qualified specialists to coordinate and oversee approved implementations.",
          "Solutions are selected according to your organization's actual requirements, existing technology, and available budget.",
        ],
      },
      cost: {
        title: "What Does It Cost?",
        paragraphs: [
          "AI solutions range from relatively inexpensive monthly software subscriptions to more sophisticated systems requiring specialized integration.",
          "We evaluate potential financial benefits against implementation and ongoing costs before recommending a solution.",
          "Third-party software, technology, and technical implementation expenses are separately identified and subject to client approval.",
        ],
      },
      partOfApproach: {
        title: "Part of Our Sales Performance Approach",
        paragraphs: [
          "AI opportunities may be evaluated during any of our three sales performance engagements.",
          "Where implementation falls outside the agreed engagement scope, additional NORTH POINT SALES GROUP services can be arranged separately.",
          "Our objective remains the same: Improve the performance of the sales organization you already have, using practical solutions that justify their investment.",
        ],
      },
    },

    socialMediaNote: {
      title: "OUR APPROACH TO SOCIAL MEDIA",
      paragraphs: [
        "NORTH POINT SALES GROUP is structured to work with a limited number of clients at any given time, allowing us to devote the attention, resources, and expertise necessary to make a meaningful difference in their sales performance.",
        "Our business development approach emphasizes carefully selected relationships and direct engagement with business owners and senior executives rather than broad-based marketing or social media outreach.",
        "While we recognize the value of professional networking platforms such as LinkedIn, given our business model and approach to client engagements, maintaining a LinkedIn company page is not part of our current business development strategy.",
        "Our approach is intentionally focused, relationship-driven, and consistent with the highly personalized nature of the services we provide.",
      ],
    },

    copyrightNotice:
      "Except as permitted by applicable law, no part of this website's copyrighted content—including articles, written materials, graphics, and downloadable resources—may be reproduced, republished, distributed, or adapted without prior written permission from NORTH POINT SALES GROUP.",

    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },

  careers: {
    title: "Careers",
    badge: "Careers",
    hero: {
      image: {
        src: "/images/hero-image.svg",
        alt: "NORTH POINT SALES GROUP — Careers",
      },
      subtitle: "Build Your Career With NORTH POINT SALES GROUP",
    },
    notice: {
      title: "NOTE: All positions are remote. No travel is required.",
      text: "That applies to all four positions, including the Sales Performance Implementation Specialist and Fractional VP of Sales.",
    },
    intro: [
      "NORTH POINT SALES GROUP is a professional sales-performance organization focused on helping established B2B companies capture untapped sales capacity and improve sales results.",
      "We are looking for experienced professionals who can operate at a high level, take responsibility for results, and work directly with business owners and senior executives.",
      "Our compensation structure is performance-based, with significant earning potential for people who produce results.",
    ],
    roles: [
      {
        id: "executive-account-development-specialist",
        number: "1",
        title: "Executive Account Development Specialist",
        income: "Potential Annual Income: $50,000–$80,000",
        blocks: [
          {
            type: "paragraph",
            text: "NORTH POINT SALES GROUP is seeking experienced Executive Account Development Specialists to initiate conversations with business owners, CEOs, presidents, and senior sales executives.",
          },
          {
            type: "paragraph",
            text: "This is not a high-volume telemarketing position and it is not traditional appointment setting. Your responsibility is to identify qualified organizations, initiate professional executive-level conversations, establish relevance, and secure qualified appointments.",
          },
          {
            type: "heading",
            text: "What You Will Do",
          },
          {
            type: "list",
            items: [
              "Identify and contact qualified B2B organizations.",
              "Conduct professional outbound conversations with senior decision makers.",
              "Introduce NORTH POINT SALES GROUP and explain the business reason for the conversation.",
              "Determine whether there is sufficient potential to justify an executive discussion.",
              "Schedule qualified appointments.",
              "Conduct appropriate follow-up with prospects.",
              "Maintain accurate prospect and appointment information in the CRM.",
              "Represent NORTH POINT SALES GROUP professionally in every interaction.",
            ],
          },
          {
            type: "heading",
            text: "What We Are Looking For",
          },
          {
            type: "list",
            items: [
              "Proven B2B sales, business-development, or executive appointment-setting experience.",
              "Strong verbal communication skills.",
              "Comfortable speaking with senior decision makers.",
              "Ability to communicate business value naturally rather than simply reading a script.",
              "Good judgment in determining whether a prospect is qualified.",
              "Persistent without being pushy.",
              "Self-directed, organized, and accountable.",
            ],
          },
          {
            type: "heading",
            text: "LEAD STRUCTURE",
          },
          {
            type: "paragraph",
            text: "NORTH POINT SALES GROUP provides targeted prospect lists for this position. Executive Account Development Specialists are responsible for contacting those prospects through outbound calling and developing qualified opportunities.These are cold prospects rather than warm leads",
          },
          {
            type: "heading",
            text: "Compensation",
          },
          {
            type: "paragraph",
            text: "Performance-based compensation with potential annual income of approximately $50,000–$80,000, based on qualified appointments, closed business, and production.",
          },
        ],
      },
      {
        id: "sales-performance-implementation-specialist",
        number: "2",
        title: "Sales Performance Implementation Specialist",
        income: "Potential Annual Income: $100,000–$250,000",
        blocks: [
          {
            type: "paragraph",
            text: "NORTH POINT SALES GROUP is seeking experienced Sales Performance Implementation Specialists to work directly with clients during sales-performance implementation engagements.",
          },
          {
            type: "paragraph",
            text: "This is not traditional sales training. The role involves helping established B2B sales organizations identify performance opportunities, implement improvements, and increase sales effectiveness.",
          },
          {
            type: "heading",
            text: "What You Will Do",
          },
          {
            type: "list",
            items: [
              "Participate in initial assessments of client sales organizations.",
              "Evaluate existing processes, systems, pipeline management, CRM usage, forecasting, accountability, and team performance.",
              "Identify areas where sales performance can be improved.",
              "Develop practical recommendations based on each organization’s situation.",
              "Assist in implementing those recommendations with client leadership.",
              "Work closely with managers and salespeople to support execution.",
              "Monitor progress and results during the engagement.",
              "Help establish performance standards and accountability.",
              "Communicate findings and recommendations to client leadership.",
              "Maintain professional relationships with client teams throughout the engagement.",
            ],
          },
          {
            type: "heading",
            text: "What We Are Looking For",
          },
          {
            type: "list",
            items: [
              "Significant experience in sales, management, consulting, operations, or business development.",
              "A clear understanding of how successful B2B sales organizations operate.",
              "Ability to identify performance opportunities without assuming salespeople are at fault.",
              "Strong analytical and problem-solving ability.",
              "Excellent communication and professional presentation skills.",
              "Comfortable working with executives, owners, and sales leaders.",
              "Practical judgment based on real business experience.",
              "Ability to work independently while following the company’s methodology.",
              "Strong follow-up discipline and attention to detail.",
            ],
          },
          {
            type: "heading",
            text: "Lead Generation",
          },
          {
            type: "paragraph",
            text: "Qualified warm leads are provided. The Implementation Specialist is not expected to build a prospecting operation. The primary responsibility is client assessment, implementation, relationship management, and results.",
          },
          {
            type: "heading",
            text: "Compensation",
          },
          {
            type: "paragraph",
            text: "Performance-based compensation with potential annual income of approximately $100,000–$250,000, depending on the volume and scope of client engagements.",
          },
        ],
      },
      {
        id: "fractional-vp-of-sales",
        number: "3",
        title: "Fractional VP of Sales",
        income: "Potential Annual Income: $100,000–$300,000+",
        blocks: [
          {
            type: "paragraph",
            text: "NORTH POINT SALES GROUP is seeking experienced senior sales executives who can serve as Fractional VPs of Sales for selected client organizations.",
          },
          {
            type: "paragraph",
            text: "This is a senior-level position for an accomplished sales executive who can work directly with ownership and executive leadership and help drive meaningful sales-performance improvements.",
          },
          {
            type: "heading",
            text: "What You Will Do",
          },
          {
            type: "list",
            items: [
              "Work directly with CEOs, presidents, owners, and executive leadership teams.",
              "Provide fractional senior sales leadership for selected client organizations.",
              "Assess leadership, processes, pipeline management, forecasting, accountability, and team performance.",
              "Establish clear priorities and performance expectations.",
              "Guide implementation of sales-performance improvements.",
              "Strengthen sales management and accountability.",
              "Establish measurable standards for pipeline, activity, forecasting, and results.",
              "Guide managers and sales teams toward consistent execution.",
              "Monitor results and adjust priorities as needed.",
              "Represent NORTH POINT SALES GROUP professionally with every client.",
            ],
          },
          {
            type: "heading",
            text: "What We Are Looking For",
          },
          {
            type: "list",
            items: [
              "Significant senior-level B2B sales leadership experience.",
              "Experience leading sales organizations or sales teams.",
              "Strong understanding of sales strategy, execution, forecasting, pipeline management, and performance management.",
              "Professional communication with executives and business owners.",
              "Ability to work directly with ownership and executive leadership.",
              "A practical, results-oriented approach to sales improvement.",
              "Ability to quickly understand an unfamiliar organization and its sales environment.",
              "Strong judgment, discretion, and credibility with senior clients.",
              "Ability to operate independently within a defined methodology.",
            ],
          },
          {
            type: "heading",
            text: "Lead Generation",
          },
          {
            type: "paragraph",
            text: "Qualified warm leads are provided. The Fractional VP is primarily responsible for senior-level client leadership and implementation rather than cold prospecting.",
          },
          {
            type: "heading",
            text: "Compensation",
          },
          {
            type: "paragraph",
            text: "Performance-based compensation with potential annual income of approximately $100,000–$300,000+, depending on the number, scope, and value of client engagements.",
          },
        ],
      },
      {
        id: "regional-sales-manager",
        number: "4",
        title: "Regional Sales Manager",
        income: "Potential Annual Income: $100,000–$175,000+",
        blocks: [
          {
            type: "paragraph",
            text: "NORTH POINT SALES GROUP is seeking experienced Regional Sales Managers to develop and manage sales activity within an assigned geographic territory.",
          },
          {
            type: "paragraph",
            text: "This is a revenue-producing management position responsible for building a regional business-development operation, managing Executive Account Development Specialists, monitoring performance, and helping ensure the region produces qualified opportunities and revenue.",
          },
          {
            type: "heading",
            text: "What You Will Do",
          },
          {
            type: "list",
            items: [
              "Develop and manage sales activity within an assigned geographic territory.",
              "Recruit, develop, and manage Executive Account Development Specialists.",
              "Establish territory priorities and performance expectations.",
              "Monitor appointments, opportunities, activity levels, and revenue results.",
              "Coach and hold team members accountable for activity and results.",
              "Maintain accurate performance reporting for the region.",
              "Review CRM data and sales metrics on a regular basis.",
              "Identify areas for improvement and take corrective action.",
              "Coordinate with senior leadership regarding regional performance.",
              "Build professional relationships with business owners and executives within the territory.",
              "Expand the region’s sales activity and overall performance.",
            ],
          },
          {
            type: "heading",
            text: "What We Are Looking For",
          },
          {
            type: "list",
            items: [
              "Proven B2B sales and management experience.",
              "Experience recruiting, managing, coaching, and holding a sales team accountable.",
              "Strong business-development and pipeline-generation skills.",
              "Ability to communicate professionally with owners and executives.",
              "A track record of measurable results.",
              "Strong organizational and leadership skills.",
              "Ability to work independently and manage a territory effectively.",
              "Experience managing sales performance within a geographic region is preferred.",
            ],
          },
          {
            type: "heading",
            text: "Lead Generation",
          },
          {
            type: "paragraph",
            text: "Qualified warm leads are provided to support the regional sales operation. The Regional Sales Manager is responsible for developing those opportunities, building the regional team, and producing results throughout the assigned territory.",
          },
          {
            type: "heading",
            text: "Compensation",
          },
          {
            type: "paragraph",
            text: "Performance-based compensation with potential annual income of approximately $100,000–$175,000+, based on regional production and results.",
          },
        ],
      },
    ],
    closing: {
      id: "a-different-kind-of-sales-career",
      title: "A Different Kind of Sales Career",
      paragraphs: [
        "NORTH POINT SALES GROUP is not looking for people who simply want a job.",
        "We are looking for experienced sales professionals and sales leaders who understand performance, accept accountability, and want their income to reflect the value they produce.",
        "Experienced professionals. Performance-based compensation. Significant earning potential.",
      ],
    },
    apply: {
      title: "How to Apply",
      text: "Please email your resume and cover letter to",
      email: "careers@northpointsalesgroup.com",
    },
  },

  privacyPolicy: {
    title: "Privacy Policy",
    badge: "Legal",
    hero: {
      image: {
        src: "/images/hero-image.svg",
        alt: "NORTH POINT SALES GROUP — Privacy Policy",
      },
      subtitle:
        "How we collect, use, disclose, and protect information when you interact with our website and services.",
    },
    intro: [
      'NORTH POINT SALES GROUP ("we," "us," or "our") respects your privacy and is committed to handling personal information responsibly.',
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
              "Evaluate whether NORTH POINT SALES GROUP's services may be appropriate for an organization",
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
            text: "We may also use contact information to communicate with you about NORTH POINT SALES GROUP services that we reasonably believe may be relevant to your business. You may ask us to discontinue marketing communications at any time.",
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
              "Protect the rights, property, or safety of NORTH POINT SALES GROUP, our clients, website users, or others",
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
            text: "Information provided as part of an actual consulting engagement may also be governed by the applicable engagement agreement, confidentiality agreement, nondisclosure agreement, or other written agreement between NORTH POINT SALES GROUP and the client.",
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
            text: "NORTH POINT SALES GROUP does not control and is not responsible for the privacy practices, security, content, or policies of third parties. We encourage you to review the privacy policies of any third-party website or service you choose to use.",
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
            text: "NORTH POINT SALES GROUP's website and services are intended for businesses and business professionals and are not directed toward children under the age of 13.",
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
            company: "NORTH POINT SALES GROUP",
            email: "contact@northpointsalesgroup.com",
            phone: "800-696-6971",
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
        alt: "NORTH POINT SALES GROUP — Terms of Use",
      },
      subtitle:
        "Terms governing your access to and use of the NORTH POINT SALES GROUP website and related materials.",
    },
    intro: [
      "Welcome to NorthPointSalesGroup.com.",
      'These Terms of Use ("Terms") govern your access to and use of the NORTH POINT SALES GROUP website and the information, materials, resources, and other content made available through the website.',
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
            text: "NORTH POINT SALES GROUP provides sales-performance consulting, advisory, implementation, coaching, and related business services to organizations.",
          },
          {
            type: "paragraph",
            text: "The information presented on this website is intended to provide general information about NORTH POINT SALES GROUP, our approach, our services, and sales-performance concepts.",
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
            text: "Any consulting or advisory services provided by NORTH POINT SALES GROUP are subject to a separate written engagement agreement or other written agreement between NORTH POINT SALES GROUP and the client.",
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
            text: "NORTH POINT SALES GROUP works with organizations to identify opportunities to strengthen sales leadership, systems, processes, execution, accountability, and overall sales performance.",
          },
          {
            type: "paragraph",
            text: "Business and sales results depend upon numerous factors, many of which are outside the control of NORTH POINT SALES GROUP.",
          },
          {
            type: "paragraph",
            text: "Accordingly, NORTH POINT SALES GROUP does not guarantee any particular increase in revenue, profit, sales, conversion rates, productivity, market share, business valuation, or other financial or operational result.",
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
            text: "NORTH POINT SALES GROUP does not warrant that all website information will always be complete, current, error-free, or applicable to every organization.",
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
            text: "Unless otherwise indicated, the website and its original content, including text, graphics, presentations, methodologies, concepts, design elements, videos, audio recordings, documents, logos, branding, and other materials, are owned by or licensed to NORTH POINT SALES GROUP and are protected by applicable intellectual-property laws.",
          },
          {
            type: "paragraph",
            text: "This includes proprietary NORTH POINT SALES GROUP terminology, methodologies, frameworks, and materials, including where applicable the Sales Performance Components™ and related materials.",
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
              "Use NORTH POINT SALES GROUP branding in a manner suggesting authorization, sponsorship, endorsement, or affiliation without permission",
            ],
          },
          {
            type: "paragraph",
            text: "Nothing contained on this website grants any license or ownership interest in NORTH POINT SALES GROUP intellectual property except as expressly stated.",
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
              "In any manner that violates applicable law or the rights of NORTH POINT SALES GROUP or another party",
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
            text: "NORTH POINT SALES GROUP is not responsible for the availability, accuracy, security, content, products, services, or practices of third-party websites or services.",
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
            text: "NORTH POINT SALES GROUP disclaims warranties of any kind, whether express or implied, regarding the website or its content, including implied warranties of merchantability, fitness for a particular purpose, accuracy, non-infringement, or uninterrupted availability.",
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
            text: "To the fullest extent permitted by applicable law, NORTH POINT SALES GROUP and its owners, officers, employees, contractors, representatives, affiliates, and agents will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or relating to your access to, use of, or inability to use this website or your reliance upon information presented on the website.",
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
            text: "To the extent permitted by applicable law, you agree to indemnify and hold harmless NORTH POINT SALES GROUP and its owners, officers, employees, contractors, representatives, affiliates, and agents from claims, damages, liabilities, costs, and expenses arising from your unlawful use of the website, your violation of these Terms, or your infringement of the rights of another party.",
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
            text: "NORTH POINT SALES GROUP may revise these Terms periodically.",
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
            text: "These Terms, together with the Privacy Policy, constitute the agreement between you and NORTH POINT SALES GROUP concerning your use of this website.",
          },
          {
            type: "paragraph",
            text: "They do not replace or modify a separate written engagement agreement entered into between NORTH POINT SALES GROUP and a client.",
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
            company: "NORTH POINT SALES GROUP",
            email: "contact@northpointsalesgroup.com",
            phone: "800-696-6971",
          },
        ],
      },
    ],
  },

  salesAlignmentAssessment: {
    title: "Sales Alignment Assessment",
    description:
      "Rate 10 statements about sales performance, systems, and leadership. See an overall score, three pillar ratings, and the areas that could benefit from closer review.",
    canonical: "/sales-alignment-assessment",
    badge: "Free Sales Alignment Assessment",
    headlineLine1: "How well is your sales",
    headlineLine2: "organization",
    headlineHighlight: "aligned",
    headlineMark: "?",
    intro:
      "Get an immediate profile of your sales performance, systems, and leadership—and identify areas that could benefit from better alignment.",
    meta: ["10 statements", "2–3 minutes", "Instant results"],
    form: {
      title: "Rate your organization as it stands today.",
      scaleLow: "1",
      scaleLowLabel: "Completely disagree",
      scaleHigh: "10",
      scaleHighLabel: "Completely agree",
      progress: "{answered} of {total} answered",
      guidance:
        "Base your answers on current performance. Accurate responses make your results more useful.",
      legend:
        "Rate {title} from 1, completely disagree, to 10, completely agree",
    },
    scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    pillars: [
      {
        number: "01",
        title: "Sales Performance",
        description: "The execution and results of your salespeople.",
        questions: [
          {
            id: "sales-target-achievement",
            title: "Sales Target Achievement",
            prompt:
              "Our salespeople consistently meet their individual sales targets.",
          },
          {
            id: "sales-execution",
            title: "Sales Execution",
            prompt:
              "Our salespeople effectively communicate value, handle objections, and move opportunities toward a decision.",
          },
          {
            id: "prospect-follow-up",
            title: "Prospect Follow-Up",
            prompt:
              "Our salespeople consistently follow up with qualified prospects within established timeframes.",
          },
        ],
      },
      {
        number: "02",
        title: "Sales Systems",
        description: "The processes and information supporting your team.",
        questions: [
          {
            id: "sales-process",
            title: "Sales Process",
            prompt:
              "Our sales team consistently follows a clearly defined sales process.",
          },
          {
            id: "lead-quality",
            title: "Lead Quality",
            prompt:
              "Our lead generation efforts consistently produce opportunities that fit our target customer.",
          },
          {
            id: "crm-accuracy",
            title: "CRM Accuracy",
            prompt:
              "Our CRM accurately reflects the status and next steps of each sales opportunity.",
          },
          {
            id: "performance-visibility",
            title: "Performance Visibility",
            prompt:
              "Our KPI dashboard makes performance problems visible early enough to take action.",
          },
        ],
      },
      {
        number: "03",
        title: "Sales Leadership",
        description: "The coaching and accountability that sustain progress.",
        questions: [
          {
            id: "individual-coaching",
            title: "Individual Coaching",
            prompt:
              "Our sales leaders regularly coach representatives based on their individual performance needs.",
          },
          {
            id: "accountability",
            title: "Accountability",
            prompt:
              "Our sales leaders hold team members accountable for clear expectations, agreed actions, and results.",
          },
          {
            id: "sustaining-improvements",
            title: "Sustaining Improvements",
            prompt:
              "Our sales leaders verify that agreed improvements remain in use over time.",
          },
        ],
      },
    ],
    nextStep: {
      eyebrow: "Your next step",
      title: "View Your FREE Sales Alignment Results",
      subtitle:
        "Enter your first name and email to view your personalized Sales Alignment Assessment results and identify areas where your sales organization may benefit from improvement.",
      incomplete: "Please rate all 10 statements before submitting.",
      firstNameLabel: "First name",
      emailLabel: "Email",
      privacy: "We respect your privacy. No spam, ever.",
      privacyLinkLabel: "View our privacy policy.",
      privacyHref: "/privacy-policy",
      button: "View My Results",
      note: "Free. Immediate. No account required.",
      missingDetails: "Please enter your first name and email to continue.",
    },
    results: {
      eyebrow: "Your results",
      overallScoreLabel: "YOUR SALES ALIGNMENT SCORE",
      overallScoreSuffix: "/100",
      pillarScoreSuffix: "/10",
      statementScoresTitle: "Your statement scores",
      areasTitle: "AREAS FOR CLOSER REVIEW",
      areasSameRating:
        "All areas received the same rating; no area ranked below the others.",
      relativeReviewNote:
        "These are relative areas for closer review based on your other responses—not a diagnosed performance problem.",
      disclaimer:
        "Based on your assessment of your organization’s current performance. These results identify areas for discussion and closer review; they do not independently verify performance or predict revenue growth.",
      scheduleLabel: "Schedule a Consultation",
      scheduleHref: "/#cta",
      resetLabel: "Start over",
    },
    closing: {
      eyebrow: "Better alignment. Clearer direction.",
      line1: "Understand where to look.",
      line2: "Then measure what matters.",
      disclaimer:
        "This self-assessment reflects your responses. It does not independently verify performance or predict results.",
    },
  },
} as const;

export type SiteNavItem = (typeof siteConfig.nav)[number];
