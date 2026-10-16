(function () {
  var dark = false;
  try {
    var stored = localStorage.getItem('noema.theme');
    if (stored === 'dark' || stored === 'light') dark = stored === 'dark';
    else dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (dark) document.documentElement.classList.add('dark');
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
})();
