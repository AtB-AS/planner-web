export const isSituationWithinValidityPeriod = ({
  startTime,
  endTime,
}: {
  startTime: string | null;
  endTime: string | null;
}): boolean => {
  if (!startTime || !endTime) return false;

  const now = new Date();
  return now >= new Date(startTime) && now <= new Date(endTime);
};
