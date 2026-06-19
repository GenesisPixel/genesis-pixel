const fs = require('fs');
const file = 'src/components/Navbar.astro';
let content = fs.readFileSync(file, 'utf8');

const newMobileMenu = `<div class="mobile-menu-inner">
    {navItems.map((item) => (
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
  </div>`;

// Find everything from <div class="mobile-menu-inner"> down to the closing </div> of mobile-menu-inner
content = content.replace(/<div class="mobile-menu-inner">[\s\S]*?<\/div>\s*<\/div>\s*<script>/, newMobileMenu + '\n</div>\n\n<script>');

fs.writeFileSync(file, content);
console.log('Mobile menu inner fixed');
