import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { TranslatedString } from '@atb/translations';
import { Input } from '../input';

export type ContactForm = {
  description: TranslatedString;
  href: string;
  page: React.ReactNode;
};

type ContactFormSelectorProps = {
  contactForms: ContactForm[];
};

const ContactFormSelector = ({ contactForms }: ContactFormSelectorProps) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav>
      {contactForms.map((contactForm, index) => {
        const isActive = pathname.includes(contactForm.href);
        return (
          <Input
            key={index}
            label={contactForm.description}
            type="radio"
            checked={isActive}
            onChange={() =>
              router.push(contactForm.href, undefined, {
                shallow: true,
              })
            }
          />
        );
      })}
    </nav>
  );
};

export default ContactFormSelector;
