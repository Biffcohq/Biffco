/* eslint-env browser */
/* eslint-disable no-undef */
'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Registrar el Service Worker del Offline Engine (Día 32)
      const wb = new Workbox('/sw.js');
      
      wb.addEventListener('installed', event => {
        if (event.isUpdate) {
          console.log('Existe una nueva actualización del Carrier Offline App.');
        } else {
          console.log('El Motor Offline (Workbox) está listo.');
        }
      });

      wb.register().catch((error) => {
        console.error('El registro del Workbox offline engine falló:', error);
      });
    }
  }, []);

  return null;
}
