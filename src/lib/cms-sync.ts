export const CMS_UPDATE_EVENT = 'agsws-cms-updated';
export const CMS_UPDATE_KEY = 'agsws_cms_last_updated';

export function notifyCMSContentUpdated() {
  const timestamp = String(Date.now());

  try {
    localStorage.setItem(CMS_UPDATE_KEY, timestamp);
  } catch {
    // Ignore localStorage errors in private browsing contexts.
  }

  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: { timestamp } }));
}