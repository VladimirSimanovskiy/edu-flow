export type FeatureId = 'highlight' | 'substitution' | 'hover-link';

export interface FeatureRegistryEntry {
  id: FeatureId;
  enabledByDefault: boolean;
}


