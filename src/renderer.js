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
  goals: 'hyperfocus.profile.goals'
};

const nav = document.querySelector('#main-nav');
const screen = document.querySelector('#screen');

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

function createItem(type, item) {
  const items = readItems(type);
  saveItems(type, [{ id: createId(), ...item }, ...items]);
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

  if (activeScreen.id === 'focus-feed') {
    return [
      [String(mentors.length), 'Saved sources'],
      [String(goals.length), 'Saved goals'],
      ['Local', 'Profile mode']
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

  if (mentors.length === 0 && goals.length === 0) {
    return `
      <section class="profile-summary" aria-label="Focus profile summary">
        <p class="eyebrow">Focus profile</p>
        <h3>Add your first trusted source and goal to start shaping the feed.</h3>
        <p class="profile-intro">Use Mentors / Sources and Goals / Values to build a small local profile. Nothing leaves this app.</p>
      </section>
    `;
  }

  return `
    <section class="profile-summary" aria-label="Focus profile summary">
      <p class="eyebrow">Focus profile</p>
      <div class="summary-columns">
        ${renderMiniList('Trusted sources', mentors, 'name', 'note')}
        ${renderMiniList('Goals and values', goals, 'title', 'value')}
      </div>
    </section>
  `;
}

function renderMiniList(title, items, titleKey, bodyKey) {
  const preview = items.slice(0, 3);

  return `
    <div>
      <h3>${title}</h3>
      ${
        preview.length === 0
          ? '<p class="profile-intro">Nothing added yet.</p>'
          : `<ul class="mini-list">
              ${preview
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

function renderProfilePanel(activeId) {
  if (activeId === 'mentors') {
    return renderMentorPanel();
  }

  if (activeId === 'goals') {
    return renderGoalPanel();
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

function setActiveScreen(screenId) {
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

  if (createForm) {
    event.preventDefault();
    handleCreateForm(createForm);
    return;
  }

  if (editForm) {
    event.preventDefault();
    handleEditForm(editForm);
  }
});

screen.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-delete-item]');

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

function renderProfileType(type) {
  renderScreen(type === 'mentors' ? 'mentors' : 'goals');
}

window.addEventListener('hashchange', () => {
  renderNav(getInitialScreenId());
  renderScreen(getInitialScreenId());
});

setActiveScreen(getInitialScreenId());
