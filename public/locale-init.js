(function () {
  var KEY = 'noema.locale';

  function normalize(pathname) {
    if (!pathname || pathname === '/') return '/';
    return pathname.replace(/\/$/, '') || '/';
  }

  function strip(pathname) {
    var path = normalize(pathname);
    if (path === '/en' || path === '/zh') return '/';
    if (path.indexOf('/en/') === 0 || path.indexOf('/zh/') === 0) return path.slice(3);
    return path;
  }

  function pathLocale(pathname) {
    var path = normalize(pathname);
    if (path === '/en' || path.indexOf('/en/') === 0) return 'en';
    return 'zh';
  }

  function localePath(locale, path) {
    if (locale === 'zh') return path;
    return path === '/' ? '/en' : '/en' + path;
  }

  function isLocale(value) {
    return value === 'en' || value === 'zh';
  }

  function readPreference() {
    try {
      var stored = localStorage.getItem(KEY);
      if (isLocale(stored)) return stored;
    } catch (error) {}
    return null;
  }

  document.addEventListener(
    'click',
    function (event) {
      var node = event.target;
      if (!(node instanceof Element)) return;
      var link = node.closest('[data-locale-switch]');
      if (!link) return;
      var locale = link.getAttribute('data-locale');
      if (!isLocale(locale)) return;
      try {
        localStorage.setItem(KEY, locale);
      } catch (error) {}
    },
    true,
  );

  var path = normalize(location.pathname);
  var rest = strip(path);
  var preference = readPreference();
  var current = pathLocale(path);
  var dest = null;
  if (path === '/zh' || path.indexOf('/zh/') === 0) {
    dest = localePath(isLocale(preference) ? preference : 'zh', rest);
  } else if (isLocale(preference)) {
    dest = localePath(preference, rest);
    if (dest === localePath(current, rest)) dest = null;
  } else if (current === 'en') {
    try {
      localStorage.setItem(KEY, 'en');
    } catch (error) {}
  }
  if (dest && dest !== path) {
    location.replace(dest + location.search + location.hash);
  }
})();
