// HTML templates for each view, inlined at build time.
import home from './home.html?raw';
import userDashboard from './user-dashboard.html?raw';
import createTask from './create-task.html?raw';
import doerDashboard from './doer-dashboard.html?raw';
import mediaCapture from './media-capture.html?raw';
import adminDashboard from './admin-dashboard.html?raw';
import loginForm from './login-form.html?raw';
import registerForm from './register-form.html?raw';
import fullDashboard from './full-dashboard.html?raw';

const templates = {
  'tmpl-home': home,
  'tmpl-user-dashboard': userDashboard,
  'tmpl-create-task': createTask,
  'tmpl-doer-dashboard': doerDashboard,
  'tmpl-media-capture': mediaCapture,
  'tmpl-admin-dashboard': adminDashboard,
  'tmpl-login-form': loginForm,
  'tmpl-register-form': registerForm,
  'tmpl-full-dashboard': fullDashboard,
};

export function getTemplate(id) {
  const html = templates[id];
  if (!html) return null;
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  return tpl;
}
