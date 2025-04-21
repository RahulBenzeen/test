import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;

if ('serviceWorker' in navigator) {
  wb = new Workbox('/sw.js');
  
  wb.addEventListener('controlling', () => {
    window.location.reload();
  });

  wb.register();
}

export const unregister = () => {
  if (wb) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
};