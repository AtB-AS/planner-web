import { describe, expect, it } from 'vitest';
import { arrivalRoundingMethod } from '../date';

// Times are CET/CEST; the helper normalises before comparing.
const at = (clock: string) => `2024-06-01T${clock}+02:00`;

describe('arrivalRoundingMethod', () => {
  it('rounds up when there is no connecting departure', () => {
    expect(arrivalRoundingMethod(at('15:17:11'), undefined)).toBe('ceil');
  });

  it('rounds down when rounding up would overtake the departure', () => {
    // Ceiling 15:17:11 gives 15:18, past the departure's floored 15:17.
    expect(arrivalRoundingMethod(at('15:17:11'), at('15:17:34'))).toBe('floor');
  });

  it('rounds up when the departure is in a later minute', () => {
    expect(arrivalRoundingMethod(at('15:17:11'), at('15:19:00'))).toBe('ceil');
  });

  it('rounds up when both land on the same minute anyway', () => {
    // Ceiling 15:17:50 and flooring 15:18:10 both give 15:18.
    expect(arrivalRoundingMethod(at('15:17:50'), at('15:18:10'))).toBe('ceil');
  });

  it('rounds up on an exact minute, where ceiling changes nothing', () => {
    expect(arrivalRoundingMethod(at('15:17:00'), at('15:17:40'))).toBe('ceil');
  });

  it('rounds down for a long wait inside one minute', () => {
    expect(arrivalRoundingMethod(at('15:17:01'), at('15:17:59'))).toBe('floor');
  });

  it('keeps rounding up when the connection really does leave first', () => {
    // A genuinely broken transfer must keep looking broken; rounding is not
    // what makes it look wrong here.
    expect(arrivalRoundingMethod(at('15:18:40'), at('15:17:30'))).toBe('ceil');
  });

  it('keeps rounding up on a negative gap inside one minute', () => {
    expect(arrivalRoundingMethod(at('15:17:40'), at('15:17:10'))).toBe('ceil');
  });
});
