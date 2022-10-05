export interface SettingsStorage {
  unlockEST?: number; // When was the current unlock established at
  unlockEXP?: number; // When will the current unlock expire at
  unlockDuration?: number; // How long is each unlock's lifespan
  customGRPCApi?: string; // User may set a customGRPCApi value in advanced settings
  locked?: boolean; // Is the wallet currently locked
}

export type SettingsState = SettingsStorage & {
  initialDataPulled: boolean; // On load, have we pulled all the saved settings data and added it back to redux?
  initialAppLoad: boolean; // Should we treat the app as if it were freshly opened?
};
