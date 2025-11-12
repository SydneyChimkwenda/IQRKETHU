'use client';

export type ModuleType = 'kethu-groups' | 'kethu-consults' | 'kethu-mentors';

export const MODULE_NAMES: Record<ModuleType, string> = {
  'kethu-groups': 'KETHU GROUPS',
  'kethu-consults': 'KETHU CONSULTS',
  'kethu-mentors': 'KETHU MENTORS',
};

const MODULE_STORAGE_KEY = 'kethu_selected_module';

export function getSelectedModule(): ModuleType | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(MODULE_STORAGE_KEY);
  return (stored as ModuleType) || null;
}

export function setSelectedModule(module: ModuleType): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MODULE_STORAGE_KEY, module);
  }
}

export function getModuleName(): string {
  const selectedModule = getSelectedModule();
  return selectedModule ? MODULE_NAMES[selectedModule] : 'KETHU GROUPS';
}


