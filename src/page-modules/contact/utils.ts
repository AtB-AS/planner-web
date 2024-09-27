import { TransportModeType } from '@atb-as/config-specs';
import { Line } from '.';

export const shouldShowContactPage = (): boolean => {
  return process.env.NEXT_PUBLIC_CONTACT_API_URL ? true : false;
};

export const convertFilesToBase64 = (
  attachments: File[],
): Promise<{ filename: string; body: string }[]> => {
  const filePromises = attachments.map((file) => {
    return new Promise<{ filename: string; body: string }>(
      (resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            resolve({
              filename: file.name,
              body: result,
            });
          } else {
            reject(new Error('File conversion failed'));
          }
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
      },
    );
  });

  return Promise.all(filePromises);
};

export const getCurrentDateString = (): string =>
  new Date().toISOString().split('T')[0];

export const getCurrentTimeString = (): string =>
  `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

export const setTransportModeAndResetLineAndStops = (
  context: any,
  transporMode: TransportModeType,
) => {
  return {
    ...context,
    transportMode: transporMode,
    line: undefined,
    fromStop: undefined,
    toStop: undefined,
  };
};

export const setLineAndResetStops = (context: any, line: Line) => {
  return {
    ...context,
    line: line,
    fromStop: undefined,
    toStop: undefined,
  };
};
