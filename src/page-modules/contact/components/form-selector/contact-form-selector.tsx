import Link from 'next/link';
import { TranslatedString } from '@atb/translations';
import { Input } from '../input';
import style from './contact-form-selector.module.css';
import { usePathname } from 'next/navigation';

export type ContactForm = {
  description: TranslatedString;
  href: string;
  page: React.ReactNode;
};

type ContactFormSelectorProps = {
  contactForms: ContactForm[];
};

const ContactFormSelector = ({ contactForms }: ContactFormSelectorProps) => {
  const pathname = usePathname();
  return (
    <nav>
      {contactForms.map((contactForm, index) => {
        const isActive = pathname.includes(contactForm.href);

        return (
          <Link
            key={index}
            shallow={true}
            href={contactForm.href}
            className={style.link}
          >
            <Input
              label={contactForm.description}
              type="radio"
              checked={isActive}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default ContactFormSelector;
