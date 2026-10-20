import {
  Button,
  ErrorMessage,
  Fieldset,
  FileInput,
  Input,
  Radio,
  Textarea,
  commonInputValidator,
  findFirstErrorMessage,
  findOrderFormFields,
  scrollToFirstErrorMessage,
  useApiConfig,
  useContactFormConfig,
  usePageText,
  useTranslation,
  type FormSlug,
  type InputErrorMessages,
} from '@mrfylke/contact-form';
import { FormEventHandler, useState } from 'react';
import { CompanyText as tx } from './text.ts';
import style from './company.module.css';
import TravelCardNumbers from './travel-card-numbers';

type FormCategory = 'order' | 'other';

const FIELDS = {
  order: {
    companyName: { isRequired: true },
    organizationNumber: { isRequired: true },
    invoiceAddress: { isRequired: true },
    contactPerson: { isRequired: true },
    email: { isRequired: true },
    description: { isRequired: true },
  },
  other: {
    firstName: { isRequired: true },
    lastName: { isRequired: true },
    email: { isRequired: true },
    company: { isRequired: false },
    question: { isRequired: true },
  },
} satisfies Record<FormCategory, Record<string, { isRequired: boolean }>>;

type FieldName = {
  [C in FormCategory]: keyof (typeof FIELDS)[C];
}[FormCategory];

export default function CompanyContent() {
  const { t, tRich } = useTranslation();
  const PageText = usePageText();
  const { onSubmit: submit } = useApiConfig();
  const { layout } = useContactFormConfig();
  const successPath =
    layout?.successPath ?? `${layout?.basePath ?? '/contact'}/success`;

  const [formCategory, setFormCategory] = useState<FormCategory>();
  const [fields, setFields] = useState<Partial<Record<FieldName, string>>>({});
  const [travelCardNumbers, setTravelCardNumbers] = useState(['']);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<InputErrorMessages>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);

  const field = (name: FieldName) => ({
    id: name,
    name,
    value: fields[name] ?? '',
    isRequired:
      !!formCategory &&
      fieldsOf(formCategory).some(
        ([n, { isRequired }]) => n === name && isRequired,
      ),
    onChange: (e: { target: { value: string } }) => {
      setFields((f) => ({ ...f, [name]: e.target.value }));
      setErrors(({ [name]: _, ...rest }) => rest);
      setSubmissionError(false);
    },
  });

  const validate = (formCategory: FormCategory) => {
    const required = fieldsOf(formCategory)
      .filter(([, { isRequired }]) => isRequired)
      .map(([name]) => name);
    const errors: InputErrorMessages = commonInputValidator(
      Object.fromEntries(required.map((name) => [name, fields[name]])),
    );
    for (const name of required) {
      if (!errors[name] && !fields[name]?.trim()) {
        errors[name] = [tx.errors.required];
      }
    }
    if (formCategory === 'order') {
      travelCardNumbers.forEach((n, i) => {
        if (n && !/^\d{16}$/.test(n)) {
          errors[`travelCardNumber${i}`] = [tx.errors.travelCardNumber];
        }
      });
    }
    return errors;
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!formCategory) return;
    const errors = validate(formCategory);
    if (Object.keys(errors).length) {
      setErrors(errors);
      scrollToFirstErrorMessage(
        findFirstErrorMessage(findOrderFormFields(e), errors),
      );
      return;
    }

    setSubmitting(true);
    try {
      // TODO: 'company' is not actually a FormSlug in the package; remove cast when package has relaxed the param type
      const response = await submit('company' as FormSlug, {
        formType: formCategory,
        ...Object.fromEntries(
          fieldsOf(formCategory).map(([name]) => [name, fields[name]]),
        ),
        ...(formCategory === 'order' && {
          travelCardNumbers: travelCardNumbers.filter(Boolean),
        }),
        attachments: await Promise.all(attachments.map(toDataUrl)),
      });
      if (!response.ok) throw new Error('Failed to call API');
      window.location.href = successPath;
    } catch {
      setSubmitting(false);
      setSubmissionError(true);
    }
  };

  const fileInput = (
    <FileInput
      id="attachments"
      name="attachments"
      label={formCategory === 'order' ? t(tx.attachmentLabel) : undefined}
      iconLabel={t(tx.attachment)}
      onChange={setAttachments}
    />
  );

  return (
    <form onSubmit={onSubmit} className={style.form}>
      <Fieldset title={t(tx.category.title)}>
        <ul className={style.optionsList}>
          {(['order', 'other'] as const).map((c) => (
            <li key={c}>
              <Radio
                name="formCategory"
                label={t(tx.category[c])}
                checked={formCategory === c}
                onChange={() => {
                  setFormCategory(c);
                  setErrors({});
                  setSubmissionError(false);
                }}
              />
            </li>
          ))}
        </ul>
      </Fieldset>

      {formCategory === 'order' && (
        <Fieldset title={t(tx.category.order)}>
          <div>
            <p>{t(tx.order.examples)}</p>
            <ul className={style.examplesList}>
              <li>{t(tx.order.orderTickets)}</li>
              <li>
                <a
                  href={t(tx.order.orderTravelCardsHref)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(tx.order.orderTravelCards)}
                </a>
              </li>
            </ul>
          </div>
          {tRich(tx.order.info)}

          <Input
            {...field('companyName')}
            errorMessage={errors.companyName?.[0]}
            label={t(tx.order.companyName)}
            autoComplete="organization"
          />
          <Input
            {...field('organizationNumber')}
            errorMessage={errors.organizationNumber?.[0]}
            label={t(tx.order.organizationNumber)}
            inputMode="numeric"
          />
          <Input
            {...field('invoiceAddress')}
            errorMessage={errors.invoiceAddress?.[0]}
            label={t(tx.order.invoiceAddress)}
          />
          <Input
            {...field('contactPerson')}
            errorMessage={errors.contactPerson?.[0]}
            label={t(tx.order.contactPerson)}
            autoComplete="name"
          />
          <Input
            {...field('email')}
            errorMessage={errors.email?.[0]}
            label={t(PageText.Contact.input.email.label)}
            type="email"
            autoComplete="email"
          />
          <Textarea
            {...field('description')}
            label={t(tx.order.description)}
            error={
              errors.description?.[0] ? t(errors.description[0]) : undefined
            }
          />

          <TravelCardNumbers
            values={travelCardNumbers}
            errors={errors}
            onChange={(values) => {
              setTravelCardNumbers(values);
              // indices shift on removal, so drop all card number errors
              setErrors((errors) =>
                Object.fromEntries(
                  Object.entries(errors).filter(
                    ([name]) => !name.startsWith('travelCardNumber'),
                  ),
                ),
              );
            }}
          />

          {fileInput}
        </Fieldset>
      )}

      {formCategory === 'other' && (
        <>
          <Fieldset title={t(tx.category.other)}>
            <Textarea
              {...field('question')}
              label={t(tx.other.info)}
              error={errors.question?.[0] ? t(errors.question[0]) : undefined}
            />
            {fileInput}
          </Fieldset>

          <Fieldset title={t(PageText.Contact.aboutYouInfo.title)}>
            <Input
              {...field('firstName')}
              errorMessage={errors.firstName?.[0]}
              label={t(PageText.Contact.input.firstName.label)}
              autoComplete="given-name additional-name"
            />
            <Input
              {...field('lastName')}
              errorMessage={errors.lastName?.[0]}
              label={t(PageText.Contact.input.lastName.label)}
              autoComplete="family-name"
            />
            <Input
              {...field('email')}
              errorMessage={errors.email?.[0]}
              label={t(PageText.Contact.input.email.label)}
              type="email"
              autoComplete="email"
            />
            <Input
              {...field('company')}
              errorMessage={errors.company?.[0]}
              label={t(tx.other.company)}
              autoComplete="organization"
            />
          </Fieldset>
        </>
      )}

      {submissionError && (
        <ErrorMessage
          message={t(PageText.Contact.error.info)}
          id="submission-error"
        />
      )}

      {formCategory && (
        <Button
          title={t(PageText.Contact.submit)}
          mode="interactive_0--bordered"
          buttonProps={{ type: 'submit' }}
          state={submitting ? 'loading' : undefined}
          className={style.submitButton}
        />
      )}
    </form>
  );
}

const fieldsOf = (formCategory: FormCategory) =>
  Object.entries(FIELDS[formCategory]) as [
    FieldName,
    { isRequired: boolean },
  ][];

const toDataUrl = (file: File) =>
  new Promise<{ filename: string; body: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ filename: file.name, body: reader.result as string });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
