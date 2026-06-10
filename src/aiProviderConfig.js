(function attachAiProviderConfig(globalScope) {
  const CONFIG = {
    liveProviderEnabled: false,
    activeProvider: 'local-mock-coach',
    futureProvider: {
      providerName: 'Not selected',
      apiKeyStorage: 'Not configured',
      model: 'Not selected',
      endpoint: 'Not configured'
    },
    safetyNote:
      'External AI calls are disabled. Do not collect or store provider secrets until explicit user consent and a live provider flow are implemented.'
  };

  function getConfig() {
    return {
      liveProviderEnabled: CONFIG.liveProviderEnabled,
      activeProvider: CONFIG.activeProvider,
      futureProvider: { ...CONFIG.futureProvider },
      safetyNote: CONFIG.safetyNote
    };
  }

  globalScope.AiProviderConfig = {
    getConfig
  };
})(globalThis);
