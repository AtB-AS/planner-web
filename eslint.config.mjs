import { FlatCompat } from '@eslint/eslintrc';
import contactForm from '@mrfylke/contact-form/lint-rules';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    files: [
      'src/translations/contact-form/**/*.ts',
      'src/page-modules/contact/company/text.ts',
      'src/page-modules/contact/lost-property/modes.ts',
    ],
    plugins: { 'contact-form': contactForm },
    rules: { 'contact-form/no-plain-markdown': 'error' },
  },
];
