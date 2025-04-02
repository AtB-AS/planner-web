export function colorToOverrideMode(hexColor: string): 'light' | 'dark' {
  if (typeof hexColor !== 'string') {
    return 'light';
  }
  const colorValues = hexColorToRgb(hexColor) ?? { r: 0, g: 0, b: 0 };
  const luminence = relativeLuminance(colorValues);

  if (luminence <= 0.5) {
    return 'light';
  }
  return 'dark';
}

/**
 * Based on the work of Magnus Ohlin, 2022-10-31, hex-contrast-color,
 * https://github.com/magnusohlin/hex-contrast-color
 */

type RGB = { r: number; g: number; b: number };

function hexColorToRgb(hexColor: string): RGB | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hexColor = hexColor.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 *
 * Based on the work of Ates Goral (https://stackoverflow.com/users/23501/ates-goral), 2022-10-31,
 * https://stackoverflow.com/a/52879332
 */

function relativeLuminance(rgb: RGB) {
  const rsrgb = rgb.r / 255;
  const gsrgb = rgb.g / 255;
  const bsrgb = rgb.b / 255;

  const rc = 0.2126;
  const gc = 0.7152;
  const bc = 0.0722;
  // low-gamma adjust coefficient
  const lowc = 1 / 12.92;

  const r = rsrgb <= 0.03928 ? rsrgb * lowc : adjustGamma(rsrgb);
  const g = gsrgb <= 0.03928 ? gsrgb * lowc : adjustGamma(gsrgb);
  const b = bsrgb <= 0.03928 ? bsrgb * lowc : adjustGamma(bsrgb);

  return r * rc + g * gc + b * bc;
}

function adjustGamma(num: number) {
  return Math.pow((num + 0.055) / 1.055, 2.4);
}
