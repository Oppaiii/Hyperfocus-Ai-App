const screens = [
  {
    id: 'focus-feed',
    label: 'Home / Focus Feed',
    icon: '01',
    eyebrow: 'Focus Feed',
    title: 'A quieter feed for trusted signals.',
    copy:
      'The future home for curated insight from voices you trust, filtered through the goals and values you choose.',
    metrics: [
      ['0', 'Connected sources'],
      ['0', 'Active goals'],
      ['Draft', 'App phase']
    ],
    cards: [
      {
        title: 'Curated influence',
        body: 'A placeholder for updates from a small circle of mentors, authors, creators, and advisors.'
      },
      {
        title: 'Goal alignment',
        body: 'Future feed items can be connected to goals so attention stays pointed at what matters.'
      },
      {
        title: 'Low-distraction rhythm',
        body: 'No infinite scroll or external imports yet; this shell is intentionally calm and local.'
      }
    ]
  },
  {
    id: 'mentors',
    label: 'Mentors / Sources',
    icon: '02',
    eyebrow: 'Trusted voices',
    title: 'Choose the people worth listening to.',
    copy:
      'This screen will eventually hold a small, intentional list of sources. For now, it marks the place where those choices will live.',
    metrics: [
      ['Small', 'Source set'],
      ['Manual', 'Curation style'],
      ['Later', 'External imports']
    ],
    cards: [
      {
        title: 'Mentors',
        body: 'Reserve space for people whose thinking consistently supports your direction.'
      },
      {
        title: 'Creators',
        body: 'Track creators or writers without turning the app into another noisy feed.'
      },
      {
        title: 'Boundaries',
        body: 'Future controls can limit how many voices are active at once.'
      }
    ]
  },
  {
    id: 'goals',
    label: 'Goals / Values',
    icon: '03',
    eyebrow: 'Direction',
    title: 'Keep goals visible before inputs arrive.',
    copy:
      'A simple placeholder for personal goals, values, and focus themes that can later guide recommendations and reflection.',
    metrics: [
      ['3', 'Example lanes'],
      ['Values', 'First filter'],
      ['Local', 'Private by default']
    ],
    cards: [
      {
        title: 'Focus goals',
        body: 'Name the work, habits, or identity shifts that deserve protected attention.'
      },
      {
        title: 'Values',
        body: 'Define the principles that make a source or insight useful instead of merely interesting.'
      },
      {
        title: 'Review cadence',
        body: 'Later, the app can prompt lightweight check-ins without becoming task management software.'
      }
    ]
  },
  {
    id: 'saved-insights',
    label: 'Saved Insights',
    icon: '04',
    eyebrow: 'Library',
    title: 'Save what should shape the next decision.',
    copy:
      'This area will collect selected ideas, quotes, and reflections. Phase 1 only provides the surface.',
    metrics: [
      ['0', 'Saved notes'],
      ['0', 'Linked goals'],
      ['Soon', 'Search']
    ],
    cards: [
      {
        title: 'Insight capture',
        body: 'A future place to save the useful signal after the noise has been stripped away.'
      },
      {
        title: 'Personal context',
        body: 'Insights can later connect back to goals, values, and the trusted voice that inspired them.'
      },
      {
        title: 'Review later',
        body: 'The app can eventually resurface saved ideas when they are relevant.'
      }
    ]
  },
  {
    id: 'ai-coach',
    label: 'AI Coach',
    icon: '05',
    eyebrow: 'Future coach',
    title: 'AI coaching will come after the foundation.',
    copy:
      'No AI logic is implemented in this phase. This placeholder keeps the navigation ready for a future coach that understands your goals and sources.',
    metrics: [
      ['Off', 'AI status'],
      ['None', 'Model connections'],
      ['Later', 'Coaching flows']
    ],
    cards: [
      {
        title: 'Reflection prompts',
        body: 'Potential future prompts could help turn trusted input into grounded action.'
      },
      {
        title: 'Goal-aware guidance',
        body: 'The coach can eventually use selected goals and saved insights as context.'
      },
      {
        title: 'No external calls',
        body: 'This phase does not connect to AI providers or process private user data.'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '06',
    eyebrow: 'Preferences',
    title: 'Keep the app private, calm, and configurable.',
    copy:
      'A placeholder for future controls around privacy, appearance, source limits, and local data.',
    metrics: [
      ['Dark', 'Theme'],
      ['Local', 'Current data mode'],
      ['Minimal', 'Configuration']
    ],
    cards: [
      {
        title: 'Privacy defaults',
        body: 'Future settings can make storage, sync, and AI boundaries explicit.'
      },
      {
        title: 'Visual tone',
        body: 'Dark, focused, and modern without adding unnecessary UI complexity.'
      },
      {
        title: 'App limits',
        body: 'Later controls can reinforce the goal of fewer, better inputs.'
      }
    ]
  }
];

const storageKeys = {
  mentors: 'hyperfocus.profile.mentors',
  goals: 'hyperfocus.profile.goals',
  insights: 'hyperfocus.profile.insights',
  todayFocus: 'hyperfocus.profile.todayFocus'
};

const nav = document.querySelector('#main-nav');
const screen = document.querySelector('#screen');
let isClearDataPending = false;

function readItems(type) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys[type]) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveItems(type, items) {
  localStorage.setItem(storageKeys[type], JSON.stringify(items));
}

function readTodayFocus() {
  return localStorage.getItem(storageKeys.todayFocus) || '';
}

function saveTodayFocus(value) {
  localStorage.setItem(storageKeys.todayFocus, value);
}

function createItem(type, item) {
  const items = readItems(type);
  saveItems(type, [{ id: createId(), createdAt: new Date().toISOString(), ...item }, ...items]);
}

function updateItem(type, id, itemUpdate) {
  const items = readItems(type);
  saveItems(
    type,
    items.map((item) => (item.id === id ? { ...item, ...itemUpdate } : item))
  );
}

function deleteItem(type, id) {
  const items = readItems(type);
  saveItems(
    type,
    items.filter((item) => item.id !== id)
  );
}

function clearAllLocalData() {
  Object.values(storageKeys).forEach((key) => {
    localStorage.removeItem(key);
  });
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return entities[character];
  });
}

function getInitialScreenId() {
  const hashId = window.location.hash.replace('#', '');
  return screens.some((item) => item.id === hashId) ? hashId : screens[0].id;
}

function getMetrics(activeScreen) {
  const mentors = readItems('mentors');
  const goals = readItems('goals');
  const insights = readItems('insights');

  if (activeScreen.id === 'focus-feed') {
    return [
      [String(mentors.length), 'Saved sources'],
      [String(goals.length), 'Saved goals'],
      [String(insights.length), 'Saved insights']
    ];
  }

  if (activeScreen.id === 'mentors') {
    return [
      [String(mentors.length), 'Saved sources'],
      ['Manual', 'Curation style'],
      ['Local', 'Storage mode']
    ];
  }

  if (activeScreen.id === 'goals') {
    return [
      [String(goals.length), 'Saved goals'],
      ['Values', 'First filter'],
      ['Local', 'Private by default']
    ];
  }

  if (activeScreen.id === 'saved-insights') {
    return [
      [String(insights.length), 'Saved insights'],
      ['Manual', 'Capture mode'],
      ['Local', 'Storage mode']
    ];
  }

  return activeScreen.metrics;
}

function renderNav(activeId) {
  nav.innerHTML = screens
    .map(
      (item) => `
        <button class="nav-item ${item.id === activeId ? 'active' : ''}" type="button" data-screen="${item.id}">
          <span class="nav-icon" aria-hidden="true">${item.icon}</span>
          <span>${item.label}</span>
        </button>
      `
    )
    .join('');
}

function renderScreen(activeId) {
  const activeScreen = screens.find((item) => item.id === activeId) || screens[0];
  const metrics = getMetrics(activeScreen);

  screen.innerHTML = `
    <section class="screen" aria-labelledby="${activeScreen.id}-title">
      <div class="hero">
        <div>
          <p class="eyebrow">${activeScreen.eyebrow}</p>
          <h2 class="screen-title" id="${activeScreen.id}-title">${activeScreen.title}</h2>
          <p class="screen-copy">${activeScreen.copy}</p>
        </div>
        <div class="status-pill" aria-label="Phase 1 status">
          <span class="status-dot" aria-hidden="true"></span>
          Phase 1 shell
        </div>
      </div>

      <div class="metric-row" aria-label="Screen summary">
        ${metrics
          .map(
            ([value, label]) => `
              <div class="metric">
                <span class="metric-value">${value}</span>
                <span class="metric-label">${label}</span>
              </div>
            `
          )
          .join('')}
      </div>

      ${renderProfileSummary(activeScreen.id)}

      <div class="card-grid">
        ${activeScreen.cards
          .map(
            (card) => `
              <article class="card">
                <h3>${card.title}</h3>
                <p>${card.body}</p>
              </article>
            `
          )
          .join('')}
      </div>

      ${renderProfilePanel(activeScreen.id)}
    </section>
  `;
}

function renderProfileSummary(activeId) {
  if (activeId !== 'focus-feed') {
    return '';
  }

  const mentors = readItems('mentors');
  const goals = readItems('goals');

  return `
    <section class="focus-dashboard" aria-label="Focus Feed alignment snapshot">
      <div class="alignment-card">
        <div>
          <p class="eyebrow">Alignment snapshot</p>
          <h3>${getAlignmentTitle(mentors, goals)}</h3>
          <p class="profile-intro">${getAlignmentMessage(mentors, goals)}</p>
        </div>
      </div>

      ${renderTodayFocus()}

      ${renderHomeEmptyGuide(mentors, goals)}

      <div class="selected-grid">
        ${renderSelectedList('Selected mentors / sources', mentors, 'name', 'note', 'Add sources from Mentors / Sources to tune this feed.')}
        ${renderSelectedList('Selected goals / values', goals, 'title', 'value', 'Add goals from Goals / Values to give the feed direction.')}
      </div>

      ${renderRecentActivity()}

      <div>
        <p class="eyebrow">Local insight placeholders</p>
        <div class="insight-grid">
          ${renderInsightCards(mentors, goals)}
        </div>
      </div>

      ${renderInsightCaptureForm()}
    </section>
  `;
}

function getAlignmentTitle(mentors, goals) {
  if (mentors.length > 0 && goals.length > 0) {
    return 'Your local focus profile is ready for review.';
  }

  return 'Build a small profile to shape your focus feed.';
}

function getAlignmentMessage(mentors, goals) {
  if (mentors.length > 0 && goals.length > 0) {
    return `This static snapshot lines up ${mentors.length} trusted source${mentors.length === 1 ? '' : 's'} with ${goals.length} goal${goals.length === 1 ? '' : 's'} or value${goals.length === 1 ? '' : 's'}. No AI or external content is running yet.`;
  }

  if (mentors.length > 0) {
    return 'You have trusted voices saved. Add one goal or value next so the feed can show what those inputs should support.';
  }

  if (goals.length > 0) {
    return 'You have goals and values saved. Add one trusted source next so the feed can show who helps reinforce them.';
  }

  return 'Add a few trusted sources and goals to turn this Home screen into a simple local focus dashboard.';
}

function renderTodayFocus() {
  const todayFocus = readTodayFocus();

  return `
    <form class="today-focus" data-today-focus-form>
      <div>
        <p class="eyebrow">Today's focus</p>
        <h3>${todayFocus ? escapeHtml(todayFocus) : 'Set one short intention for this session.'}</h3>
        <p class="profile-intro">Keep the current focus visible while you review your local feed.</p>
      </div>

      <label class="field">
        <span>Focus statement</span>
        <input name="focus" type="text" maxlength="120" value="${escapeHtml(todayFocus)}" placeholder="Example: Protect one deep work block" required />
      </label>

      <button class="secondary-button" type="submit">${todayFocus ? 'Update focus' : 'Save focus'}</button>
    </form>
  `;
}

function renderHomeEmptyGuide(mentors, goals) {
  if (mentors.length > 0 || goals.length > 0) {
    return '';
  }

  return `
    <section class="home-empty-guide" aria-label="Fresh start guide">
      <div>
        <p class="eyebrow">Start here</p>
        <h3>Add one trusted source and one goal.</h3>
        <p class="profile-intro">A source gives the feed a voice to listen for. A goal gives it a direction to protect.</p>
      </div>

      <div class="guide-steps">
        <article>
          <span>1</span>
          <strong>Add a mentor or source</strong>
          <p>Choose someone whose judgment helps you stay focused.</p>
        </article>
        <article>
          <span>2</span>
          <strong>Add a goal or value</strong>
          <p>Name what your attention should support first.</p>
        </article>
      </div>
    </section>
  `;
}

function renderSelectedList(title, items, titleKey, bodyKey, emptyText) {
  return `
    <div class="selected-list">
      <h3>${title}</h3>
      ${
        items.length === 0
          ? `<p class="empty-state">${emptyText}</p>`
          : `<ul class="mini-list">
              ${items
                .map(
                  (item) => `
                    <li>
                      <strong>${escapeHtml(item[titleKey])}</strong>
                      <span>${escapeHtml(item[bodyKey])}</span>
                    </li>
                  `
                )
                .join('')}
            </ul>`
      }
    </div>
  `;
}

function renderRecentActivity() {
  const activities = getRecentActivities();

  return `
    <section class="recent-activity" aria-label="Recent local activity">
      <div>
        <p class="eyebrow">Recent activity</p>
        <h3>Latest local additions</h3>
      </div>

      ${
        activities.length === 0
          ? '<p class="empty-state">Recent additions will appear here after you add a source, goal, or saved insight.</p>'
          : `<div class="activity-list">
              ${activities
                .map(
                  (activity) => `
                    <article class="activity-item">
                      <span>${activity.type}</span>
                      <div>
                        <strong>${escapeHtml(activity.title)}</strong>
                        <p>${escapeHtml(activity.body)}</p>
                        <small>${formatActivityDate(activity.createdAt)}</small>
                      </div>
                    </article>
                  `
                )
                .join('')}
            </div>`
      }
    </section>
  `;
}

function getRecentActivities() {
  const mentors = readItems('mentors').map((mentor, index) => ({
    type: 'Source',
    title: mentor.name,
    body: mentor.note,
    createdAt: mentor.createdAt,
    fallbackOrder: index
  }));
  const goals = readItems('goals').map((goal, index) => ({
    type: 'Goal',
    title: goal.title,
    body: goal.value,
    createdAt: goal.createdAt,
    fallbackOrder: index + 100
  }));
  const insights = readItems('insights').map((insight, index) => ({
    type: 'Insight',
    title: 'Saved insight',
    body: insight.text,
    createdAt: insight.createdAt,
    fallbackOrder: index + 200
  }));

  return [...mentors, ...goals, ...insights]
    .sort((first, second) => {
      const firstTime = Date.parse(first.createdAt || '');
      const secondTime = Date.parse(second.createdAt || '');

      if (Number.isFinite(firstTime) && Number.isFinite(secondTime)) {
        return secondTime - firstTime;
      }

      if (Number.isFinite(firstTime)) {
        return -1;
      }

      if (Number.isFinite(secondTime)) {
        return 1;
      }

      return first.fallbackOrder - second.fallbackOrder;
    })
    .slice(0, 5);
}

function formatActivityDate(value) {
  if (!value) {
    return 'Saved locally';
  }

  return `Added ${new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`;
}

function renderInsightCards(mentors, goals) {
  const cards = buildInsightCards(mentors, goals);

  return cards
    .map(
      (card) => `
        <article class="insight-card">
          <span class="insight-tag">${card.tag}</span>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `
    )
    .join('');
}

function buildInsightCards(mentors, goals) {
  if (mentors.length === 0 && goals.length === 0) {
    return [
      {
        tag: 'Start',
        title: 'Add your first source',
        body: 'Choose one person whose thinking you want nearby when attention gets noisy.'
      },
      {
        tag: 'Direction',
        title: 'Add one goal or value',
        body: 'Name the outcome or principle that should guide what makes it into your feed.'
      },
      {
        tag: 'Local only',
        title: 'Your profile stays on this device',
        body: 'This snapshot is generated from local entries only, without AI or external services.'
      }
    ];
  }

  if (mentors.length > 0 && goals.length === 0) {
    return mentors.slice(0, 3).map((mentor) => ({
      tag: 'Source',
      title: mentor.name,
      body: `Saved as a trusted voice: ${mentor.note}`
    }));
  }

  if (goals.length > 0 && mentors.length === 0) {
    return goals.slice(0, 3).map((goal) => ({
      tag: 'Goal',
      title: goal.title,
      body: `Use future trusted inputs to reinforce this direction: ${goal.value}`
    }));
  }

  const cardCount = Math.min(4, mentors.length, goals.length);
  return Array.from({ length: cardCount }, (_, index) => {
    const mentor = mentors[index];
    const goal = goals[index];

    return {
      tag: 'Alignment',
      title: `${mentor.name} -> ${goal.title}`,
      body: `Keep this source in view when working on "${goal.title}" because: ${goal.value}`
    };
  });
}

function renderInsightCaptureForm() {
  return `
    <form class="insight-capture" data-insight-form>
      <div>
        <p class="eyebrow">Save a takeaway</p>
        <h3>Capture a short reflection from this focus snapshot.</h3>
        <p class="profile-intro">Saved insights stay local and appear in the Saved Insights screen.</p>
      </div>

      <label class="field">
        <span>Insight or note</span>
        <textarea name="text" maxlength="240" rows="3" placeholder="What do you want to remember or act on?" required></textarea>
      </label>

      <button class="primary-button" type="submit">Save insight</button>
    </form>
  `;
}

function renderProfilePanel(activeId) {
  if (activeId === 'mentors') {
    return renderMentorPanel();
  }

  if (activeId === 'goals') {
    return renderGoalPanel();
  }

  if (activeId === 'saved-insights') {
    return renderSavedInsightsPanel();
  }

  if (activeId === 'ai-coach') {
    return renderAiCoachPanel();
  }

  if (activeId === 'settings') {
    return renderSettingsPanel();
  }

  return '';
}

function renderMentorPanel() {
  const mentors = readItems('mentors');

  return `
    <section class="profile-panel" aria-labelledby="mentor-form-title">
      <form class="profile-form" data-profile-form="mentors">
        <div>
          <p class="eyebrow">Manual source</p>
          <h3 id="mentor-form-title">Add a mentor or source</h3>
          <p class="profile-intro">Start with a few people whose judgment helps you stay aligned.</p>
        </div>

        <label class="field">
          <span>Name</span>
          <input name="name" type="text" maxlength="80" placeholder="Example: Cal Newport" required />
        </label>

        <label class="field">
          <span>Why they matter</span>
          <textarea name="note" maxlength="180" rows="3" placeholder="What do they help you remember or practice?" required></textarea>
        </label>

        <button class="primary-button" type="submit">Add source</button>
      </form>

      ${renderItemList({
        title: 'Saved mentors and sources',
        emptyText: 'No trusted sources saved yet.',
        items: mentors,
        type: 'mentors',
        titleKey: 'name',
        bodyKey: 'note',
        titleLabel: 'Name',
        bodyLabel: 'Why they matter'
      })}
    </section>
  `;
}

function renderGoalPanel() {
  const goals = readItems('goals');

  return `
    <section class="profile-panel" aria-labelledby="goal-form-title">
      <form class="profile-form" data-profile-form="goals">
        <div>
          <p class="eyebrow">Personal direction</p>
          <h3 id="goal-form-title">Add a goal or value</h3>
          <p class="profile-intro">Capture the outcomes and principles your inputs should support.</p>
        </div>

        <label class="field">
          <span>Goal or value</span>
          <input name="title" type="text" maxlength="90" placeholder="Example: Protect deep work" required />
        </label>

        <label class="field">
          <span>What it means</span>
          <textarea name="value" maxlength="180" rows="3" placeholder="How should this shape your attention?" required></textarea>
        </label>

        <button class="primary-button" type="submit">Add goal</button>
      </form>

      ${renderItemList({
        title: 'Saved goals and values',
        emptyText: 'No goals or values saved yet.',
        items: goals,
        type: 'goals',
        titleKey: 'title',
        bodyKey: 'value',
        titleLabel: 'Goal or value',
        bodyLabel: 'What it means'
      })}
    </section>
  `;
}

function renderItemList({ title, emptyText, items, type, titleKey, bodyKey, titleLabel, bodyLabel }) {
  return `
    <div class="profile-list" aria-live="polite">
      <h3>${title}</h3>
      ${
        items.length === 0
          ? `<p class="empty-state">${emptyText}</p>`
          : items
              .map(
                (item) => `
                  <form class="profile-item edit-form" data-edit-form="${type}" data-item-id="${escapeHtml(item.id)}">
                    <label class="field compact-field">
                      <span>${titleLabel}</span>
                      <input name="${titleKey}" type="text" maxlength="90" value="${escapeHtml(item[titleKey])}" required />
                    </label>

                    <label class="field compact-field">
                      <span>${bodyLabel}</span>
                      <textarea name="${bodyKey}" maxlength="180" rows="3" required>${escapeHtml(item[bodyKey])}</textarea>
                    </label>

                    <div class="profile-actions">
                      <button class="secondary-button" type="submit">Save</button>
                      <button class="danger-button" type="button" data-delete-item="${type}" data-item-id="${escapeHtml(item.id)}">Delete</button>
                    </div>
                  </form>
                `
              )
              .join('')
      }
    </div>
  `;
}

function renderSavedInsightsPanel() {
  const insights = readItems('insights');

  return `
    <section class="saved-insights-panel" aria-labelledby="saved-insights-title">
      <div>
        <p class="eyebrow">Local notes</p>
        <h3 id="saved-insights-title">Saved insights</h3>
        <p class="profile-intro">Short reflections captured from the Focus Feed. Delete anything that no longer belongs.</p>
      </div>

      ${
        insights.length === 0
          ? '<p class="empty-state">No saved insights yet. Capture one from the Focus Feed when something feels worth remembering.</p>'
          : `<div class="saved-insight-list">
              ${insights
                .map(
                  (insight) => `
                    <article class="saved-insight">
                      <p>${escapeHtml(insight.text)}</p>
                      <span>${formatInsightDate(insight.createdAt)}</span>
                      <div class="profile-actions">
                        <button class="danger-button" type="button" data-delete-item="insights" data-item-id="${escapeHtml(insight.id)}">Delete</button>
                      </div>
                    </article>
                  `
                )
                .join('')}
            </div>`
      }
    </section>
  `;
}

function renderAiCoachPanel() {
  const todayFocus = readTodayFocus();
  const goals = readItems('goals');
  const recentGoal = goals[0];

  return `
    <section class="coach-panel" aria-labelledby="coach-check-in-title">
      <div class="coach-intro">
        <p class="eyebrow">Local coach shell</p>
        <h3 id="coach-check-in-title">A calm accountability check-in.</h3>
        <p class="profile-intro">This is a wellness and focus companion placeholder, not therapy or medical guidance. No AI is running yet.</p>
      </div>

      <div class="coach-grid">
        <article class="coach-card">
          <span class="insight-tag">Focus review</span>
          <h3>${todayFocus ? escapeHtml(todayFocus) : 'No focus set yet.'}</h3>
          <p>${todayFocus ? 'Use this as the anchor for your next block of attention.' : "Set Today's focus on Home so the future coach has a clear starting point."}</p>
        </article>

        <article class="coach-card">
          <span class="insight-tag">Reflection</span>
          <h3>What would make this easier to start?</h3>
          <p>Notice one small friction point, then lower the effort needed to begin.</p>
        </article>

        <article class="coach-card">
          <span class="insight-tag">Next action</span>
          <h3>${recentGoal ? `Take one step toward ${escapeHtml(recentGoal.title)}.` : 'Choose one small visible next step.'}</h3>
          <p>${recentGoal ? escapeHtml(recentGoal.value) : 'Keep it concrete enough to finish or make progress in a short session.'}</p>
        </article>

        <article class="coach-card encouragement-card">
          <span class="insight-tag">Encouragement</span>
          <h3>Progress can stay small and still count.</h3>
          <p>Protecting attention once today is a useful signal. The real coach can build from these local patterns later.</p>
        </article>
      </div>
    </section>
  `;
}

function formatInsightDate(value) {
  if (!value) {
    return 'Saved locally';
  }

  return `Saved ${new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`;
}

function renderSettingsPanel() {
  const mentors = readItems('mentors');
  const goals = readItems('goals');
  const insights = readItems('insights');
  const totalItems = mentors.length + goals.length + insights.length;

  return `
    <section class="settings-panel" aria-labelledby="local-data-title">
      <div>
        <p class="eyebrow">Local data</p>
        <h3 id="local-data-title">Reset local app state</h3>
        <p class="profile-intro">Clear saved mentors, goals, and insights from this device when you want to start fresh.</p>
      </div>

      <div class="settings-counts" aria-label="Local data counts">
        <span>${mentors.length} sources</span>
        <span>${goals.length} goals</span>
        <span>${insights.length} insights</span>
      </div>

      ${
        isClearDataPending
          ? `<div class="confirm-clear" role="group" aria-label="Confirm local data reset">
              <p>This will remove ${totalItems} local item${totalItems === 1 ? '' : 's'} from this app on this device.</p>
              <div class="profile-actions">
                <button class="danger-button" type="button" data-confirm-clear>Confirm clear all</button>
                <button class="secondary-button" type="button" data-cancel-clear>Cancel</button>
              </div>
            </div>`
          : '<button class="danger-button" type="button" data-request-clear>Clear all local data</button>'
      }
    </section>
  `;
}

function setActiveScreen(screenId) {
  if (screenId !== 'settings') {
    isClearDataPending = false;
  }

  renderNav(screenId);
  renderScreen(screenId);
  window.location.hash = screenId;
  screen.focus({ preventScroll: true });
}

nav.addEventListener('click', (event) => {
  const selected = event.target.closest('[data-screen]');

  if (!selected) {
    return;
  }

  setActiveScreen(selected.dataset.screen);
});

screen.addEventListener('submit', (event) => {
  const createForm = event.target.closest('[data-profile-form]');
  const editForm = event.target.closest('[data-edit-form]');
  const insightForm = event.target.closest('[data-insight-form]');
  const todayFocusForm = event.target.closest('[data-today-focus-form]');

  if (createForm) {
    event.preventDefault();
    handleCreateForm(createForm);
    return;
  }

  if (editForm) {
    event.preventDefault();
    handleEditForm(editForm);
    return;
  }

  if (insightForm) {
    event.preventDefault();
    handleInsightForm(insightForm);
    return;
  }

  if (todayFocusForm) {
    event.preventDefault();
    handleTodayFocusForm(todayFocusForm);
  }
});

screen.addEventListener('click', (event) => {
  const requestClearButton = event.target.closest('[data-request-clear]');
  const cancelClearButton = event.target.closest('[data-cancel-clear]');
  const confirmClearButton = event.target.closest('[data-confirm-clear]');
  const deleteButton = event.target.closest('[data-delete-item]');

  if (requestClearButton) {
    isClearDataPending = true;
    renderScreen('settings');
    return;
  }

  if (cancelClearButton) {
    isClearDataPending = false;
    renderScreen('settings');
    return;
  }

  if (confirmClearButton) {
    clearAllLocalData();
    isClearDataPending = false;
    renderScreen('settings');
    return;
  }

  if (!deleteButton) {
    return;
  }

  const type = deleteButton.dataset.deleteItem;
  const id = deleteButton.dataset.itemId;

  deleteItem(type, id);
  renderProfileType(type);
});

function handleCreateForm(form) {
  const formData = new FormData(form);
  const type = form.dataset.profileForm;

  if (type === 'mentors') {
    const name = String(formData.get('name') || '').trim();
    const note = String(formData.get('note') || '').trim();

    if (name && note) {
      createItem('mentors', { name, note });
      renderProfileType(type);
    }
  }

  if (type === 'goals') {
    const title = String(formData.get('title') || '').trim();
    const value = String(formData.get('value') || '').trim();

    if (title && value) {
      createItem('goals', { title, value });
      renderProfileType(type);
    }
  }
}

function handleEditForm(form) {
  const formData = new FormData(form);
  const type = form.dataset.editForm;
  const id = form.dataset.itemId;

  if (type === 'mentors') {
    const name = String(formData.get('name') || '').trim();
    const note = String(formData.get('note') || '').trim();

    if (name && note) {
      updateItem('mentors', id, { name, note });
      renderProfileType(type);
    }
  }

  if (type === 'goals') {
    const title = String(formData.get('title') || '').trim();
    const value = String(formData.get('value') || '').trim();

    if (title && value) {
      updateItem('goals', id, { title, value });
      renderProfileType(type);
    }
  }
}

function handleInsightForm(form) {
  const formData = new FormData(form);
  const text = String(formData.get('text') || '').trim();

  if (!text) {
    return;
  }

  createItem('insights', {
    text,
    createdAt: new Date().toISOString()
  });

  renderScreen('focus-feed');
}

function handleTodayFocusForm(form) {
  const formData = new FormData(form);
  const focus = String(formData.get('focus') || '').trim();

  if (!focus) {
    return;
  }

  saveTodayFocus(focus);
  renderScreen('focus-feed');
}

function renderProfileType(type) {
  if (type === 'mentors') {
    renderScreen('mentors');
    return;
  }

  if (type === 'insights') {
    renderScreen('saved-insights');
    return;
  }

  renderScreen('goals');
}

window.addEventListener('hashchange', () => {
  renderNav(getInitialScreenId());
  renderScreen(getInitialScreenId());
});

setActiveScreen(getInitialScreenId());
