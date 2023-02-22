export interface SettingsStorage {
  eolSeen?: boolean; // If the user has cleared the EOL notification
  unlockEST?: number; // When was the current unlock established at
  unlockEXP?: number; // When will the current unlock expire at
  unlockDuration?: number; // How long is each unlock's lifespan
}

export type SettingsState = SettingsStorage & {
  initialDataPulled: boolean; // On load, have we pulled all the saved settings data and added it back to redux?
  initialAppLoad: boolean; // Should we treat the app as if it were freshly opened?
};
