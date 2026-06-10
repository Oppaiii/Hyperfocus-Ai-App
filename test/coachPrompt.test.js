const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'coachPrompt.js'), 'utf8');
const sandbox = { globalThis: {} };

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: 'coachPrompt.js' });

const { CoachPromptBuilder } = sandbox.globalThis;

assert.ok(CoachPromptBuilder, 'CoachPromptBuilder should be exposed');
assert.equal(typeof CoachPromptBuilder.buildCoachPrompt, 'function');
assert.ok(Array.isArray(CoachPromptBuilder.DEFAULT_COACH_RULES));

const prompt = CoachPromptBuilder.buildCoachPrompt({
  todayFocus: 'Protect one deep work block',
  goals: [
    {
      title: 'Deep work',
      value: 'Make focused work the first priority'
    }
  ],
  latestCoachReflection: {
    text: 'I made progress after removing one distraction.'
  },
  recentInsights: [
    {
      text: 'Start with the smallest next action.'
    }
  ],
  coachRules: ['Keep the response short.', 'Use only local context.']
});

assert.equal(prompt.role, 'local-ai-coach-preview');
assert.equal(prompt.userContext.todayFocus, 'Protect one deep work block');
assert.deepEqual(JSON.parse(JSON.stringify(prompt.userContext.selectedGoals)), [
  {
    title: 'Deep work',
    value: 'Make focused work the first priority'
  }
]);
assert.equal(prompt.userContext.latestCoachReflection, 'I made progress after removing one distraction.');
assert.deepEqual(JSON.parse(JSON.stringify(prompt.userContext.recentSavedInsights)), [
  {
    text: 'Start with the smallest next action.'
  }
]);
assert.deepEqual(JSON.parse(JSON.stringify(prompt.coachRules)), [
  'Keep the response short.',
  'Use only local context.'
]);
assert.equal(prompt.requestedResponse.format, 'short_check_in');
assert.match(prompt.previewText, /Protect one deep work block/);
assert.match(prompt.previewText, /Deep work: Make focused work the first priority/);
assert.match(prompt.previewText, /I made progress after removing one distraction\./);
assert.match(prompt.previewText, /Start with the smallest next action\./);
assert.match(prompt.previewText, /Keep the response short\./);

console.log('coachPrompt smoke test passed');
