import { Line } from '@atb/page-modules/contact';
import { Option } from './index';

export const getLineOptions = (lines: Line[]): Option<Line>[] => {
  return lines.map((line) => ({
    id: line.id,
    name: line.publicCode ? `${line.publicCode} - ${line.name}` : line.name,
    value: line,
  }));
};

export const getStopOptions = (
  stops: Line['quays'],
): Option<Line['quays'][0]>[] => {
  return stops.map((stop) => ({
    id: stop.id,
    name: stop.name,
    value: stop,
  }));
};
