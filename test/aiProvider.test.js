const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'aiProvider.js'), 'utf8');
const sandbox = { globalThis: {} };

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: 'aiProvider.js' });

const { AiProvider } = sandbox.globalThis;

assert.ok(AiProvider, 'AiProvider should be exposed');
assert.equal(typeof AiProvider.createMockCoachProvider, 'function');

const provider = AiProvider.createMockCoachProvider();

assert.equal(provider.name, 'local-mock-coach');
assert.equal(provider.mode, 'local-only');
assert.equal(typeof provider.generateCoachReply, 'function');

const reply = provider.generateCoachReply({
  role: 'local-ai-coach-preview',
  coachRules: ['Keep the response short.', 'Use only local context.'],
  userContext: {
    todayFocus: 'Protect one deep work block',
    selectedGoals: [
      {
        title: 'Deep work',
        value: 'Make focused work the first priority'
      }
    ],
    latestCoachReflection: 'I made progress after removing one distraction.',
    recentSavedInsights: [
      {
        text: 'Start with the smallest next action.'
      }
    ]
  }
});

assert.equal(reply.provider, 'local-mock-coach');
assert.equal(reply.mode, 'mock');
assert.equal(reply.usedPromptRole, 'local-ai-coach-preview');
assert.equal(reply.usedContext.todayFocus, 'Protect one deep work block');
assert.deepEqual(JSON.parse(JSON.stringify(reply.usedContext.selectedGoals)), [
  {
    title: 'Deep work',
    value: 'Make focused work the first priority'
  }
]);
assert.equal(reply.usedContext.latestCoachReflection, 'I made progress after removing one distraction.');
assert.deepEqual(JSON.parse(JSON.stringify(reply.usedContext.recentSavedInsights)), [
  {
    text: 'Start with the smallest next action.'
  }
]);
assert.deepEqual(JSON.parse(JSON.stringify(reply.usedContext.coachRules)), [
  'Keep the response short.',
  'Use only local context.'
]);
assert.match(reply.replyText, /Protect one deep work block/);
assert.match(reply.replyText, /I made progress after removing one distraction\./);
assert.match(reply.replyText, /Deep work/);

console.log('aiProvider smoke test passed');
