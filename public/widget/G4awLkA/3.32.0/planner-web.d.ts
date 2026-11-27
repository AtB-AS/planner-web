import { GeocoderFeature } from '../modules/geocoder';

export declare function createWidget({ urlBase, language, outputOverrideOptions, }: WidgetOptions): PlannerWebOutput;

declare type Languages = 'nb' | 'nn' | 'en';

declare type LayoutMode = 'doubleColumn' | 'singleColumn' | 'compact';

declare type OutputOverrideOptions = {
    inheritFont?: boolean;
    singleColumnLayout?: boolean;
    /**
     * Layout mode for the widget.
     * - `doubleColumn`: Default layout with two columns.
     * - `singleColumn`: Single column layout. Replaces `singleColumnLayout` in previous versions.
     * - `compact`: Compact layout with less options.
     */
    layoutMode?: LayoutMode;
};

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
    outputOverrideOptions?: Partial<OutputOverrideOptions>;
};

export { }
