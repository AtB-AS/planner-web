// additional.d.ts
declare module "detect-nearest-browser-locale" {
  function detectNearestBrowserLocale(
    locales: string[] | readonly string[]
  ): string;

  export default detectNearestBrowserLocale;
}
declare module "detect-nearest-locale" {
  function detectNearestLocale(
    supportedLocales: string[] | readonly string[],
    preferredLocales: string[] | readonly string[]
  ): string;

  export default detectNearestLocale;
}
