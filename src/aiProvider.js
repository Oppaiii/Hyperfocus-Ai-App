(function attachAiProvider(globalScope) {
  const MOCK_PROVIDER_NAME = 'local-mock-coach';

  function createMockCoachProvider() {
    return {
      name: MOCK_PROVIDER_NAME,
      mode: 'local-only',
      generateCoachReply
    };
  }

  function generateCoachReply(prompt) {
    const context = prompt && prompt.userContext ? prompt.userContext : {};
    const todayFocus = normalizeText(context.todayFocus, 'your current focus');
    const reflection = normalizeText(context.latestCoachReflection, 'No reflection has been saved yet.');
    const nextGoal = getFirstGoal(context.selectedGoals);
    const coachRules = Array.isArray(prompt && prompt.coachRules) ? prompt.coachRules : [];

    return {
      provider: MOCK_PROVIDER_NAME,
      mode: 'mock',
      replyText: [
        `Focus: ${todayFocus}`,
        `Reflection noted: ${reflection}`,
        `Next small action: ${nextGoal ? `take one visible step toward "${nextGoal.title}"` : 'choose one concrete next step you can start now'}.`,
        'Encouragement: small, honest progress is enough for this check-in.'
      ].join('\n'),
      usedPromptRole: prompt && prompt.role ? prompt.role : 'unknown',
      usedContext: {
        todayFocus,
        selectedGoals: Array.isArray(context.selectedGoals) ? context.selectedGoals : [],
        latestCoachReflection: reflection,
        recentSavedInsights: Array.isArray(context.recentSavedInsights) ? context.recentSavedInsights : [],
        coachRules
      }
    };
  }

  function getFirstGoal(goals) {
    return Array.isArray(goals) && goals.length > 0 ? goals[0] : null;
  }

  function normalizeText(value, fallback) {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
  }

  globalScope.AiProvider = {
    createMockCoachProvider
  };
})(globalThis);
