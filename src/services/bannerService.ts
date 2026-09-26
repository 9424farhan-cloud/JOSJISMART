import { StoreSettings } from '../types';
import { storageService } from './storageService';
import { authService } from './authService';

export const bannerService = {
  getSettings(): StoreSettings {
    return storageService.getSettings();
  },

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    authService.verifyAdminPermission();

    const current = storageService.getSettings();
    const updated: StoreSettings = {
      ...current,
      ...updates,
    };

    storageService.saveSettings(updated);
    return updated;
  },
};
