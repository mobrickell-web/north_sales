export type AdminFindingStatus =
  "Completed" | "In review" | "In progress" | "Ongoing";

export type AdminFinding = {
  step: string;
  question: string;
  focus: string;
  priority: "High" | "Medium";
  owner: string;
  status: AdminFindingStatus;
  updated: string;
};

export type AdminOverviewWeek = {
  label: string;
  height: number;
  current?: boolean;
};

export const adminOverviewConfig = {
  navigation: {
    title: "Overview",
    privateAccess: "Private access",
    notificationsLabel: "Notifications",
    openNavigationLabel: "Open navigation",
    unnamedAdmin: "Admin",
    initialsFallback: "NP",
  },
  client: {
    eyebrow: "Client dashboard",
    name: "Summit Industrial",
    description:
      "Engagement progress, implementation priorities, and measurable results.",
    dateRangeStart: "2026-09-01",
    dateRangeEnd: "2026-11-05",
    printReport: "Print report",
    manageEngagement: "Manage engagement",
    moreActionsLabel: "More dashboard actions",
  },
  sampleNotice: {
    message:
      "Sample engagement. The contact details, dates, and results shown are illustrative.",
    action: "Set up your client →",
  },
  metrics: {
    kpis: {
      title: "Tracked KPIs Improving",
      value: "5 / 5",
      caption: "All 5 trending up",
      chartLabel: "KPI trend increasing",
      chartPath: "M3 32 19 26 31 29 45 18 58 22 70 11 81 15 92 5",
    },
    targets: {
      title: "Agreed Targets Reached",
      value: "0 / 5",
      day: "Day 35",
      caption: "of 60 · in progress",
    },
    actions: {
      title: "Open Implementation Actions",
      value: "3",
      link: "View action items",
    },
  },
  implementation: {
    title: "30–90 Day Sales Performance Implementation",
    status: "On track",
    currentDay: "Day 35",
    duration: "of 60 ·",
    progressPercent: "58%",
    progressDescription: "of engagement period",
    description:
      "Agreed scope, clear responsibilities, regular performance reviews.",
    currentWeekLabel: "Wk 5 · Day 35",
    startedLabel: "Started Sep 1, 2026",
    endsLabel: "Through Nov 5, 2026",
    legend: ["Completed", "Current week", "Planned"],
    chartScale: ["60", "45", "30", "15", "0"],
    weeks: [
      { label: "Wk 1", height: 22 },
      { label: "Wk 2", height: 45 },
      { label: "Wk 3", height: 68 },
      { label: "Wk 4", height: 90 },
      { label: "Wk 5", height: 112, current: true },
      { label: "Wk 6", height: 135 },
      { label: "Wk 7", height: 157 },
      { label: "Wk 8", height: 179 },
      { label: "Wk 9", height: 192 },
    ] satisfies AdminOverviewWeek[],
  },
  findings: {
    title: "Assessment & Implementation",
    searchPlaceholder: "Search findings",
    searchLabel: "Search findings",
    statusFilterLabel: "Filter by status",
    allStatusesValue: "All",
    moreActionsPrefix: "More actions for",
    statusOptions: ["All", "Completed", "In review", "In progress", "Ongoing"],
    columns: [
      "Step",
      "Question",
      "Focus",
      "Priority",
      "Owner",
      "Status",
      "Updated",
    ],
    actionsColumnLabel: "Actions",
    noResults: "No findings match your search.",
    rows: [
      {
        step: "01",
        question: "Where are we?",
        focus: "Baseline sales assessment",
        priority: "High",
        owner: "Michael Brickell",
        status: "Completed",
        updated: "2026-09-12",
      },
      {
        step: "02",
        question: "What did we find?",
        focus: "Gaps & key findings",
        priority: "High",
        owner: "Michael Brickell",
        status: "In review",
        updated: "2026-09-26",
      },
      {
        step: "03",
        question: "What are we doing about it?",
        focus: "Implementation plan",
        priority: "Medium",
        owner: "John Mathews",
        status: "In progress",
        updated: "2026-10-14",
      },
      {
        step: "04",
        question: "Who is responsible?",
        focus: "Owners & accountability",
        priority: "Medium",
        owner: "John Mathews",
        status: "In progress",
        updated: "2026-10-14",
      },
      {
        step: "05",
        question: "Are we getting results?",
        focus: "KPI tracking · 5 KPIs",
        priority: "High",
        owner: "Michael Brickell",
        status: "Ongoing",
        updated: "Due 2026-11-05",
      },
    ] satisfies AdminFinding[],
  },
  appointments: {
    title: "Existing appointment management",
    description: "(preserved from the previous dashboard)",
  },
} as const;
