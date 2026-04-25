export function detectPlatform() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';

    const isAndroid = /Android/i.test(ua);
    if (isAndroid) return 'android';

    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    // iPadOS can report as Mac with touch points
    const isIPadOS = typeof navigator !== 'undefined'
        && navigator.platform === 'MacIntel'
        && typeof navigator.maxTouchPoints === 'number'
        && navigator.maxTouchPoints > 1;

    if (isIOS || isIPadOS) return 'ios';

    return 'other';
}

