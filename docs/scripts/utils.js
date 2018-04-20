/*
 *  Colorlod. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/colorlod/
 */

/* eslint-disable no-magic-numbers, require-jsdoc */

const CONTRAST_LIGHT_ITEM_THRESHOLD = 3;

/**
 * Parses an rgb(R, G, B) string and returns a color value.
 * @param {string} value The value to parse.
 * @returns {Object} An RGB color object parsed from the given string.
 */
export function parseComputedRGBColor(value) {
    // First remove all spaces
    const rgbString = value.replace(/\s/g, "");
    // Check for an rgb(R, G, B) string and convert it to the red-green-blue integer components
    const rgb = /rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(rgbString);
    // Return an RGB Color object, or null if the conversion fails
    return rgb ? {red: Number(rgb[1]), green: Number(rgb[2]), blue: Number(rgb[3])} : null;
}

/**
 * Calculates the contrast between the given color and white, using the algorithm provided by the WCAG v2 in
 * {@link http://www.w3.org/TR/WCAG20/#contrast-ratiodef}.
 * Based on {@link https://goo.gl/FUWAta Chromium ColorUtils Java class}.
 * @param {Object} rgb The input color as an RGB color object.
 * @returns {number} The contrast value.
 */
export function getContrastForColor(rgb) {
    let bgR = rgb.red / 255;
    let bgG = rgb.green / 255;
    let bgB = rgb.blue / 255;
    bgR = bgR < 0.03928 ? bgR / 12.92 : Math.pow((bgR + 0.055) / 1.055, 2.4);
    bgG = bgG < 0.03928 ? bgG / 12.92 : Math.pow((bgG + 0.055) / 1.055, 2.4);
    bgB = bgB < 0.03928 ? bgB / 12.92 : Math.pow((bgB + 0.055) / 1.055, 2.4);
    const bgL = (0.2126 * bgR) + (0.7152 * bgG) + (0.0722 * bgB);
    return Math.abs(1.05 / (bgL + 0.05));
}

/**
 * Check whether lighter or darker foreground text should be used depending on the given background color.
 * Based on {@link https://goo.gl/4Lfuh2 Chromium ColorUtils Java class}.
 * @param {Object} backgroundColor The background color value which is being queried.
 * @returns {boolean} Whether light colored elements should be used.
 */
export function shouldUseLightForegroundOnBackground(backgroundColor) {
    return getContrastForColor(backgroundColor) >= CONTRAST_LIGHT_ITEM_THRESHOLD;
}
