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

const nav = document.querySelector('#main-nav');
const screen = document.querySelector('#screen');

function getInitialScreenId() {
  const hashId = window.location.hash.replace('#', '');
  return screens.some((item) => item.id === hashId) ? hashId : screens[0].id;
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
        ${activeScreen.metrics
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
    </section>
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

window.addEventListener('hashchange', () => {
  renderNav(getInitialScreenId());
  renderScreen(getInitialScreenId());
});

setActiveScreen(getInitialScreenId());
