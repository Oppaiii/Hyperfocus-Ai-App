(function attachCoachPromptBuilder(globalScope) {
  const DEFAULT_COACH_RULES = [
    'Act as a wellness and accountability companion, not a therapist or medical professional.',
    'Keep guidance practical, calm, and focused on the next small action.',
    'Use only the local context provided by the app.',
    'Do not claim to know external content, private history, or synced memory.',
    'Encourage reflection without judgment or diagnosis.'
  ];

  function buildCoachPrompt({ todayFocus, goals, latestCoachReflection, recentInsights, coachRules } = {}) {
    const normalizedGoals = normalizeList(goals).map((goal) => ({
      title: normalizeText(goal.title, 'Untitled goal'),
      value: normalizeText(goal.value, 'No goal context saved yet.')
    }));
    const normalizedInsights = normalizeList(recentInsights).map((insight) => ({
      text: normalizeText(insight.text, 'Untitled insight')
    }));
    const normalizedRules = normalizeList(coachRules).map((rule) => normalizeText(rule, '')).filter(Boolean);
    const promptObject = {
      role: 'local-ai-coach-preview',
      purpose: 'Prepare context for a future AI coach without calling an AI service.',
      coachRules: normalizedRules.length > 0 ? normalizedRules : DEFAULT_COACH_RULES,
      userContext: {
        todayFocus: normalizeText(todayFocus, 'No focus set yet.'),
        selectedGoals: normalizedGoals,
        latestCoachReflection: normalizeText(
          latestCoachReflection && latestCoachReflection.text,
          'No coach reflection saved yet.'
        ),
        recentSavedInsights: normalizedInsights
      },
      requestedResponse: {
        format: 'short_check_in',
        include: ['focus review', 'reflection question', 'suggested next action', 'encouragement'],
        tone: 'clear, grounded, supportive'
      }
    };

    return {
      ...promptObject,
      previewText: formatPromptPreview(promptObject)
    };
  }

  function normalizeList(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeText(value, fallback) {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
  }

  function formatPromptPreview(promptObject) {
    const goals = promptObject.userContext.selectedGoals;
    const insights = promptObject.userContext.recentSavedInsights;

    return [
      'AI Coach Prompt Preview',
      '',
      'Rules:',
      ...promptObject.coachRules.map((rule) => `- ${rule}`),
      '',
      'Local context:',
      `- Today's focus: ${promptObject.userContext.todayFocus}`,
      `- Latest coach reflection: ${promptObject.userContext.latestCoachReflection}`,
      '- Goals / values:',
      ...(goals.length > 0
        ? goals.map((goal) => `  - ${goal.title}: ${goal.value}`)
        : ['  - No goals saved yet.']),
      '- Recent saved insights:',
      ...(insights.length > 0
        ? insights.map((insight) => `  - ${insight.text}`)
        : ['  - No insights saved yet.']),
      '',
      'Future response request:',
      `- Format: ${promptObject.requestedResponse.format}`,
      `- Include: ${promptObject.requestedResponse.include.join(', ')}`,
      `- Tone: ${promptObject.requestedResponse.tone}`
    ].join('\n');
  }

  globalScope.CoachPromptBuilder = {
    DEFAULT_COACH_RULES,
    buildCoachPrompt
  };
})(globalThis);
