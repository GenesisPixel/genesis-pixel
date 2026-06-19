const fs = require('fs');
const file = 'src/components/Navbar.astro';
let content = fs.readFileSync(file, 'utf8');

// 1. Array
const navItemsRegex = /const navItems = \[[\s\S]*?\];/;
const newNavItems = `const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/aprender', label: 'Aprender' },
  { href: '/keyframes/que-son', label: 'Keyframes' },
  { href: '/transform/que-es', label: 'Transform' },
  { href: '/threejs', label: 'three.js' },
  { 
    label: 'Más Capítulos', 
    isDropdown: true,
    children: [
      { href: '/transitions/que-son', label: 'Transitions' },
      { href: '/interactions/que-son', label: 'Interactions' }
    ]
  },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/recursos', label: 'Recursos' },
];`;
content = content.replace(navItemsRegex, newNavItems);

// 2. CSS
const dropdownCss = `
  .nav-dropdown-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
  }

  .nav-dropdown-btn {
    position: relative;
    padding: 6px 14px;
    padding-left: 31px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--dm-light-300);
    text-decoration: none;
    border-radius: 9999px;
    transition: color 0.3s ease;
    white-space: nowrap;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    background: transparent;
    border: none;
    font-family: inherit;
  }

  .nav-dropdown-btn:hover,
  .nav-dropdown-btn.active {
    color: white;
  }

  .nav-dropdown-menu {
    position: absolute;
    top: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%) translateY(-10px) scale(0.95);
    background: rgba(28, 28, 30, 0.95);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    min-width: 140px;
    z-index: 50;
    transform-origin: top center;
  }

  .nav-dropdown-wrapper:hover .nav-dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0) scale(1);
  }

  .nav-dropdown-menu a {
    padding: 10px 16px !important;
    font-size: 0.85rem !important;
    border-radius: 8px !important;
    white-space: nowrap;
    justify-content: flex-start;
  }
  .nav-dropdown-menu a.active {
    background: rgba(255,255,255,0.1);
  }
  .nav-dropdown-menu a:hover {
    background: rgba(255,255,255,0.1);
  }
</style>`;
content = content.replace('</style>', dropdownCss);

// 3. Replace nav-links map
// We will locate exactly the part between `</svg>\n      </div>` and `</div>\n\n    <div class="nav-actions">`
const startNavLinks = '</svg>\n      </div>\n';
const endNavLinks = '    </div>\n\n    <div class="nav-actions">';

const navLinksMapStr = `{navItems.map((item) => (
        item.isDropdown ? (
          <div class="nav-dropdown-wrapper">
            <button class="nav-dropdown-btn" data-nav-item data-dropdown-btn>
              {item.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:2px; transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="nav-dropdown-menu">
              {item.children.map((child) => (
                <a href={child.href} data-nav-child>
                  {child.label}
                  {child.label === 'Transitions' && (
                    <span style="position: absolute; top: -5px; right: -8px; background: #a855f7; color: white; font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">Intermedio</span>
                  )}
                  {child.label === 'Interactions' && (
                    <span style="position: absolute; top: -5px; right: -8px; background: #f59e0b; color: var(--color-bg); font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">UI/UX</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <a href={item.href} data-nav-item>
            {item.label}
            {item.label === 'three.js' && (
              <span class="badge-nuevo" style="position: absolute; top: -5px; right: -8px; background: #FC5D7D; color: white; font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; font-family: var(--font-afronaut, system-ui, sans-serif);">Nuevo</span>
            )}
            {item.label === 'Keyframes' && (
              <span style="position: absolute; top: -5px; right: -8px; background: #9FA6FF; color: var(--color-bg); font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">Principiante</span>
            )}
            {item.label === 'Transform' && (
              <span style="position: absolute; top: -5px; right: -8px; background: #57B0FB; color: var(--color-bg); font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">Avanzado</span>
            )}
          </a>
        )
      ))}
`;

const i1 = content.indexOf(startNavLinks);
const i2 = content.indexOf(endNavLinks, i1);
if(i1 !== -1 && i2 !== -1) {
  content = content.substring(0, i1 + startNavLinks.length) + '      ' + navLinksMapStr + content.substring(i2);
}

// 4. Replace mobile map
const startMobile = '<div class="mobile-menu-inner">\n';
const endMobile = '  </div>\n</div>\n\n<script>';

const mobileMapStr = `    {navItems.map((item) => (
      item.isDropdown ? (
        <div class="mobile-dropdown-group" style="display:flex; flex-direction:column; gap:8px; margin-bottom:8px;">
          <div style="padding: 14px 16px; font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase;">{item.label}</div>
          {item.children.map((child) => (
            <a href={child.href} data-mobile-child>
              <svg class="nav-stars-icon" fill="none" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
                <path d="m30.5729 109.394c3.0469 3.046 9.1992 3.808 13.9453-.469 1.582-1.406 4.8633-4.922 11.1328-11.1916 29.9414-30.3516 49.688-50.2735 53.906-46.4649 3.399 2.9883-6.972 17.6367-16.8162 31.2305-18.457 25.723-33.164 43.535-22.2656 54.434 8.7305 8.73 22.3242-.059 43.2418-18.399 11.778-10.371 20.625-18.7498 23.204-16.113 1.933 1.875-1.055 6.855-5.45 14.473-5.683 9.726-12.773 20.156-5.976 26.953 4.687 4.629 13.769 2.636 24.961-8.321 1.992-1.992 2.461-4.218.879-5.8-1.524-1.465-3.633-1.231-5.215.234-8.145 7.969-13.477 10.488-14.824 9.082-1.582-1.523 1.289-6.738 7.265-17.227 7.559-13.242 11.602-21.562 5.215-27.773-8.555-8.3203-18.691.5859-37.441 17.051-17.6371 15.527-22.7934 18.047-25.0199 15.879-2.9883-3.047 1.582-8.438 21.3279-36.0355 18.457-25.8398 29.18-41.9531 19.16-51.6211-13.652-13.3008-31.2301-2.8125-79.3942 44.8242-6.3867 6.3281-9.9023 9.668-11.3086 11.1914-4.5117 4.98-3.5742 11.016-.5273 14.063z" fill="white"/>
              </svg>
              {child.label}
              {child.label === 'Transitions' && (
                <span style="position: absolute; top: -5px; right: -8px; background: #a855f7; color: white; font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">Intermedio</span>
              )}
              {child.label === 'Interactions' && (
                <span style="position: absolute; top: -5px; right: -8px; background: #f59e0b; color: var(--color-bg); font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">UI/UX</span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <a href={item.href}>
          <svg class="nav-stars-icon" fill="none" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
            <path d="m30.5729 109.394c3.0469 3.046 9.1992 3.808 13.9453-.469 1.582-1.406 4.8633-4.922 11.1328-11.1916 29.9414-30.3516 49.688-50.2735 53.906-46.4649 3.399 2.9883-6.972 17.6367-16.8162 31.2305-18.457 25.723-33.164 43.535-22.2656 54.434 8.7305 8.73 22.3242-.059 43.2418-18.399 11.778-10.371 20.625-18.7498 23.204-16.113 1.933 1.875-1.055 6.855-5.45 14.473-5.683 9.726-12.773 20.156-5.976 26.953 4.687 4.629 13.769 2.636 24.961-8.321 1.992-1.992 2.461-4.218.879-5.8-1.524-1.465-3.633-1.231-5.215.234-8.145 7.969-13.477 10.488-14.824 9.082-1.582-1.523 1.289-6.738 7.265-17.227 7.559-13.242 11.602-21.562 5.215-27.773-8.555-8.3203-18.691.5859-37.441 17.051-17.6371 15.527-22.7934 18.047-25.0199 15.879-2.9883-3.047 1.582-8.438 21.3279-36.0355 18.457-25.8398 29.18-41.9531 19.16-51.6211-13.652-13.3008-31.2301-2.8125-79.3942 44.8242-6.3867 6.3281-9.9023 9.668-11.3086 11.1914-4.5117 4.98-3.5742 11.016-.5273 14.063z" fill="white"/>
          </svg>
            {item.label}
            {item.label === 'three.js' && (
              <span class="badge-nuevo" style="position: absolute; top: -5px; right: -8px; background: #FC5D7D; color: white; font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; font-family: var(--font-afronaut, system-ui, sans-serif);">Nuevo</span>
            )}
            {item.label === 'Keyframes' && (
              <span style="position: absolute; top: -5px; right: -8px; background: #9FA6FF; color: var(--color-bg); font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">Principiante</span>
            )}
            {item.label === 'Transform' && (
              <span style="position: absolute; top: -5px; right: -8px; background: #57B0FB; color: var(--color-bg); font-size: 10px; padding: 1px 4px; border-radius: 0; font-weight: 100; transform: rotate(10deg); font-family: var(--font-afronaut, system-ui, sans-serif);">Avanzado</span>
            )}
        </a>
      )
    ))}
`;

const m1 = content.indexOf(startMobile);
const m2 = content.indexOf(endMobile, m1);
if(m1 !== -1 && m2 !== -1) {
  content = content.substring(0, m1 + startMobile.length) + mobileMapStr + content.substring(m2);
}

// 5. Update JS logic
const oldScript = `// Update active links based on the current URL (since navbar is persisted)
    const currentPath = window.location.pathname;
    navLinks?.querySelectorAll('a[data-nav-item]').forEach((link) => {
      const href = link.getAttribute('href');
      const isActive =
        href === currentPath ||
        (href === '/keyframes/que-son' && currentPath.startsWith('/keyframes/')) ||
        (href === '/transitions/que-son' && currentPath.startsWith('/transitions/')) ||
        (href === '/interactions/que-son' && currentPath.startsWith('/interactions/')) ||
        (href === '/transform/que-es' && currentPath.startsWith('/transform/'));
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    mobileMenu?.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      const isActive =
        href === currentPath ||
        (href === '/keyframes/que-son' && currentPath.startsWith('/keyframes/')) ||
        (href === '/transitions/que-son' && currentPath.startsWith('/transitions/')) ||
        (href === '/interactions/que-son' && currentPath.startsWith('/interactions/')) ||
        (href === '/transform/que-es' && currentPath.startsWith('/transform/'));
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    function updateIndicator() {
      const activeLink = navLinks?.querySelector('a.active') as HTMLElement;
      if (!activeLink || !indicator || !navLinks) return;

      const linksRect = navLinks.getBoundingClientRect();
      const activeRect = activeLink.getBoundingClientRect();

      indicator.style.left = \`\${activeRect.left - linksRect.left}px\`;
      indicator.style.width = \`\${activeRect.width}px\`;
      indicator.classList.add('visible');
    }

    function handleHover(e: Event) {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'A' || !indicator || !navLinks) return;

      const linksRect = navLinks.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      indicator.style.left = \`\${targetRect.left - linksRect.left}px\`;
      indicator.style.width = \`\${targetRect.width}px\`;
      indicator.classList.add('visible');
    }`;

const newScript = `// Update active links based on the current URL (since navbar is persisted)
    const currentPath = window.location.pathname;
    
    // Check main nav items and dropdown button
    let dropdownActive = false;
    navLinks?.querySelectorAll('[data-nav-item]').forEach((link) => {
      if (link.hasAttribute('data-dropdown-btn')) {
        return;
      }
      const href = link.getAttribute('href');
      const isActive =
        href === currentPath ||
        (href === '/keyframes/que-son' && currentPath.startsWith('/keyframes/')) ||
        (href === '/transform/que-es' && currentPath.startsWith('/transform/'));
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Check dropdown children
    navLinks?.querySelectorAll('[data-nav-child]').forEach((link) => {
      const href = link.getAttribute('href');
      const isActive =
        href === currentPath ||
        (href === '/transitions/que-son' && currentPath.startsWith('/transitions/')) ||
        (href === '/interactions/que-son' && currentPath.startsWith('/interactions/'));
      if (isActive) {
        link.classList.add('active');
        dropdownActive = true;
      } else {
        link.classList.remove('active');
      }
    });

    // Set dropdown button active state
    const dropdownBtn = navLinks?.querySelector('[data-dropdown-btn]');
    if (dropdownBtn) {
      if (dropdownActive) dropdownBtn.classList.add('active');
      else dropdownBtn.classList.remove('active');
    }

    mobileMenu?.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      const isActive =
        href === currentPath ||
        (href === '/keyframes/que-son' && currentPath.startsWith('/keyframes/')) ||
        (href === '/transitions/que-son' && currentPath.startsWith('/transitions/')) ||
        (href === '/interactions/que-son' && currentPath.startsWith('/interactions/')) ||
        (href === '/transform/que-es' && currentPath.startsWith('/transform/'));
      if (isActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    function updateIndicator() {
      // The active link can be an <a> or a <button> (data-nav-item)
      const activeLink = navLinks?.querySelector('[data-nav-item].active') as HTMLElement;
      if (!activeLink || !indicator || !navLinks) {
         if (indicator) indicator.classList.remove('visible');
         return;
      }

      const linksRect = navLinks.getBoundingClientRect();
      const activeRect = activeLink.getBoundingClientRect();

      indicator.style.left = \`\${activeRect.left - linksRect.left}px\`;
      indicator.style.width = \`\${activeRect.width}px\`;
      indicator.classList.add('visible');
    }

    function handleHover(e: Event) {
      // We want to highlight the indicator for <a> or <button> that has data-nav-item
      const target = (e.target as HTMLElement).closest('[data-nav-item]') as HTMLElement;
      if (!target || !indicator || !navLinks) return;

      const linksRect = navLinks.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      indicator.style.left = \`\${targetRect.left - linksRect.left}px\`;
      indicator.style.width = \`\${targetRect.width}px\`;
      indicator.classList.add('visible');
    }`;
    
content = content.replace(oldScript, newScript);

fs.writeFileSync(file, content);
console.log('Navbar successfully rewritten safely.');
