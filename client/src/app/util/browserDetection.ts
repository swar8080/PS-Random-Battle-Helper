/**
 * @prettier
 */

export const IS_IE =
    typeof navigator !== "undefined" &&
    (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion));
