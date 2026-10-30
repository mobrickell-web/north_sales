export const adminAssessmentSeeds = {
  careerReadinessSections: [
    {
      title: "Self-awareness",
      questions: [
        "I can clearly name my top three strengths.",
        "I know which kinds of work give me energy.",
        "I regularly ask for feedback on my work.",
        "I understand how my values shape my career choices.",
      ],
    },
    {
      title: "Communication",
      questions: [
        "I communicate my ideas clearly to others.",
        "I listen carefully before responding.",
        "I adapt my communication style to my audience.",
        "I feel comfortable asking questions when something is unclear.",
      ],
    },
    {
      title: "Problem solving",
      questions: [
        "I break complex challenges into manageable steps.",
        "I consider multiple options before making a decision.",
        "I use feedback to improve my approach.",
        "I stay focused when a problem is difficult.",
      ],
    },
    {
      title: "Adaptability",
      questions: [
        "I adjust quickly when priorities change.",
        "I stay open to new ways of working.",
        "I can remain productive during uncertainty.",
        "I learn from setbacks and apply those lessons.",
      ],
    },
    {
      title: "Goal setting",
      questions: [
        "I set clear goals for my professional development.",
        "I break long-term goals into practical actions.",
        "I regularly review my progress.",
        "I ask for support when I need help reaching a goal.",
      ],
    },
  ],
} as const;
