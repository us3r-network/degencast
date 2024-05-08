export function getInstallPrompter() {
  // To save the event for later use.
  let deferredEvent:any;

  // Is the `BeforeInstallPromptEvent` supported which will let us
  // call it save and call the event manually when we want.
  const isSupported =
    typeof document !== 'undefined' &&
    window.hasOwnProperty('BeforeInstallPromptEvent');

  // Is the app already installed.
  let isInstalled =
    (typeof document !== 'undefined' && (navigator as any).standalone) ||
    (typeof document !== 'undefined' &&
      matchMedia('(display-mode: standalone)').matches);

  // If supported call this fn to prompt browser's install dialog.
  const showPrompt = () => {
    if (deferredEvent) {
      deferredEvent.prompt();
    }
  };

  // To save the event if `BeforeInstallPromptEvent` is supported.
  const saveEvent = (ev:any) => {
    ev.preventDefault();
    deferredEvent = ev;
  };

  if (isSupported) {
    window.addEventListener('beforeinstallprompt', saveEvent);
    window.addEventListener('onappinstalled', () => {
      localStorage.setItem('pwaInstalled', '1');
      isInstalled = true;
  });
  }

  return {
    showPrompt,
    isSupported,
    isInstalled,
  };
}