import { test, expect } from '@playwright/test';

test.describe('E2E - Transacciones de Custodia WORM (Día 30)', () => {
  const baseURL = process.env.PLATFORM_URL || 'http://localhost:3000';

  test('Producer A transfiere Lote WORM -> Producer B (Aceptación)', async ({ page }) => {
    // 1. Contexto Mockeado para independizarnos de la DB stateful en CI
    // Interceptamos la lista de assets ("active") para el Productor A
    await page.route('**/api/trpc/assets.list*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: [
               { id: 'LOTE-TEST-440', type: 'AnimalAsset', status: 'active', workspaceId: 'WS-A' }
            ]
          }
        })
      });
    });

    // Mock search workspaces B2B Combobox
    await page.route('**/api/trpc/workspaces.search*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: [
               { id: 'WS-B', name: 'Empacadora del Sur B', slug: 'empacadora-b' }
            ]
          }
        })
      });
    });

    // Mock creation endpoint TRPC
    await page.route('**/api/trpc/transfers.createOffer*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           result: {
              data: { success: true, message: 'Oferta de transferencia generada exitosamente. Activo bloqueado.' }
           }
        })
      });
    });

    // --- FLUJO PRODUCTOR A (Emisión) ---
    // Simulamos navegación a la página de Nueva Transferencia del Workspace A
    await page.goto(`${baseURL}/ops/WS-A/transfers/new`);
    await expect(page.locator('h1').filter({ hasText: 'Nueva Transferencia' })).toBeVisible();

    // Seleccionamos el Activo
    const assetSelect = page.locator('select');
    await assetSelect.waitFor();
    await assetSelect.selectOption('LOTE-TEST-440');

    // Buscamos Destino (Empacadora B)
    const searchInput = page.locator('input[placeholder="Escribe al menos 2 letras para buscar..."]');
    await searchInput.fill('Empacadora');
    
    const dropdownResult = page.locator('button', { hasText: 'Empacadora del Sur B' });
    await dropdownResult.waitFor();
    await dropdownResult.click();

    // Verificamos visualmente que el destino se trabó
    await expect(page.locator('div').filter({ hasText: 'Destino criptográfico fijado.' }).first()).toBeVisible();

    // Firmamos (Simulación de botón que gatilla createOffer)
    const signBtn = page.locator('button', { hasText: 'Firmar Lote y Transferir Custodia' });
    await signBtn.click();
    
    // Al finalizar mock route de form submit asume un alert o redireccion -> no mockeamos window.alert porque es dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Despachada Exitosamente');
      await dialog.accept();
    });

    // --- FLUJO RECEPTOR B (Aceptación / Bandeja de Entrada) ---
    // Mock incoming transfers inbox for Workspace B
    await page.route('**/api/trpc/transfers.listIncoming*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: [
               { 
                 id: 'offer-123', 
                 assetId: 'LOTE-TEST-440', 
                 status: 'pending', 
                 fromWorkspaceId: 'WS-A', 
                 toWorkspaceId: 'WS-B',
                 createdAt: new Date().toISOString()
               }
            ]
          }
        })
      });
    });

    // Mock outgoing transfers empty
    await page.route('**/api/trpc/transfers.listOutgoing*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: { data: [] } })
      });
    });

    // Mock acceptOffer endpoint
    await page.route('**/api/trpc/transfers.acceptOffer*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
           result: {
              data: { success: true, message: '¡Transferencia aceptada! El activo ahora está en tu Workspace.' }
           }
        })
      });
    });

    // Navegar a Inbox del WP-B
    await page.goto(`${baseURL}/ops/WS-B/transfers`);
    await expect(page.locator('h1').filter({ hasText: 'Transferencias de Custodia' })).toBeVisible();

    // Ver el Lote en Pending (Entrante)
    await expect(page.locator('div', { hasText: 'Pendiente' }).first()).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'LOTE' })).toBeVisible();
    
    // Clic en Revisar y Aceptar
    const acceptBtn = page.locator('button', { hasText: 'Revisar y Aceptar' });
    await acceptBtn.click();

    // Chequear Modal
    await expect(page.locator('h2').filter({ hasText: 'Validación de Custodia Criptográfica' })).toBeVisible();
    
    // Confirmar Final
    const finalSignBtn = page.locator('button', { hasText: 'Firmar Digitalmente y Aceptar Lote' });
    await finalSignBtn.click();

    // Verificamos que el Flow corre atómico sin crashes en UI. 
    // Fase B concluida en QA Automation.
  });
});
