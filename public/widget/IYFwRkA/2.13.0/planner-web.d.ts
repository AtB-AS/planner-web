import type { GeocoderFeature } from '@atb/page-modules/departures';

export declare function createWidget({ urlBase, language, }: WidgetOptions): PlannerWebOutput;

declare type Languages = 'nb' | 'nn' | 'en';

export declare type PlannerWebOutput = {
    output: string;
    init: () => void;
    urls: SettingConstants;
};

export declare function reverse(urlBase: string, coords: GeolocationCoordinates): Promise<GeocoderFeature | undefined>;

declare type SettingConstants = {
    URL_BASE: string;
    URL_JS_UMD: string;
    URL_JS_ESM: string;
    URL_CSS: string;
};

export declare type WidgetOptions = {
    urlBase: string;
    language?: Languages;
};

export { }
