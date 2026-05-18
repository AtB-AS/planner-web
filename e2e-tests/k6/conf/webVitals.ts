/**
 * Core web vitals (read more on https://web.dev/articles/<web_vital>)
 * LCP (Largest Content Paint): measuring perceived load speed
 * FCP (First Content Paint): measuring perceived load speed
 * TTFB (Time To First Byte): measuring server responsiveness
 * CLS (Cumulative Layout Shift): measuring visual stability
 * INP (Interaction to Next Paint): measuring interaction responsiveness
 *
 * All values for p(75) in seconds, except CLS that doesn't have a unit
 */
export const webVitalLimits = {
  LCP: {
    good: 2.5,
    poor: 4,
  },
  FCP: {
    good: 1.8,
    poor: 3,
  },
  TTBF: {
    good: 0.8,
    poor: 1.8,
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  INP: {
    good: 0.2,
    poor: 0.5,
  },
};
