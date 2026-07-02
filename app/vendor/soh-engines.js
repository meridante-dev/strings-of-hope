/* Exposes vendored ESM engines as globals for the classic-script app. */
import { PitchDetector } from './pitchy.js';
window.SOH_PitchDetector = PitchDetector;
window.dispatchEvent(new Event('soh-pitchy-ready'));
