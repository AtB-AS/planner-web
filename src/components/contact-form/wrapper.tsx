'use client';

import {
  ContactFormRoot,
  ContactFormContainer,
  useLanguageSettings as useContactFormLanguageSettings,
  Language as ContactFormLanguage,
} from '@mrfylke/contact-form';
import { contactFormConfig } from '@atb/config/contact-form-config';
import { useLanguageSettings } from '@atb/translations';
import { Language as PlannerLanguage } from '@atb/translations';
import { useEffect, useRef } from 'react';

type ContactFormWrapperProps = {
  children: React.ReactNode;
  acceptLanguageHeader?: string | null;
};

function LanguageSync() {
  const { language: plannerLanguage, setLanguage: setPlannerLanguage } =
    useLanguageSettings();
  const { language: contactLanguage, setLanguage: setContactLanguage } =
    useContactFormLanguageSettings();

  const lastSyncedPlannerLanguage = useRef<PlannerLanguage | null>(null);
  const lastSyncedContactLanguage = useRef<ContactFormLanguage | null>(null);

  useEffect(() => {
    if (
      plannerLanguage !== lastSyncedPlannerLanguage.current &&
      plannerLanguage !== (contactLanguage as unknown as PlannerLanguage)
    ) {
      lastSyncedPlannerLanguage.current = plannerLanguage;
      lastSyncedContactLanguage.current = plannerLanguage as unknown as ContactFormLanguage;
      setContactLanguage(plannerLanguage as unknown as ContactFormLanguage);
    }
  }, [plannerLanguage, contactLanguage, setContactLanguage]);

  useEffect(() => {
    if (
      contactLanguage !== lastSyncedContactLanguage.current &&
      contactLanguage !== (plannerLanguage as unknown as ContactFormLanguage)
    ) {
      lastSyncedContactLanguage.current = contactLanguage;
      lastSyncedPlannerLanguage.current = contactLanguage as unknown as PlannerLanguage;
      setPlannerLanguage(contactLanguage as unknown as PlannerLanguage);
    }
  }, [contactLanguage, plannerLanguage, setPlannerLanguage]);

  return null;
}

export function ContactFormWrapper({
  children,
  acceptLanguageHeader,
}: ContactFormWrapperProps) {
  const { language: plannerLanguage } = useLanguageSettings();

  return (
    <ContactFormRoot
      config={contactFormConfig}
      acceptLanguageHeader={acceptLanguageHeader ?? undefined}
      initialLanguage={plannerLanguage as ContactFormLanguage}
    >
      <ContactFormContainer header={<div />} footer={<div />}>
        <LanguageSync />
        {children}
      </ContactFormContainer>
    </ContactFormRoot>
  );
}
