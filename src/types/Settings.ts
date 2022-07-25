export interface SettingsStorage {
  unlockEST?: number; // When was the current unlock established at
  unlockEXP?: number; // When will the current unlock expire at
  unlockDuration?: number; // How long is each unlock's lifespan
}

export type SettingsState = SettingsStorage & {
  initialDataPulled: boolean; // On load, have we pulled all the saved settings data and added it back to redux?
};
