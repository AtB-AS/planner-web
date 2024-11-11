import { Typo } from '@atb/components/typography';
import style from './form.module.css';
import { motion } from 'framer-motion';
import { FocusScope } from '@react-aria/focus';
import { MonoIcon } from '@atb/components/icon';
import { useEffect, useRef } from 'react';
import { Button } from '@atb/components/button';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';

type DescriptionModalProps = {
  title: string;
  modalDescription?: string;
  modalInstruction?: string;
  modalBulletPoints?: TranslatedString[];
  isModalOpen: boolean;
  closeModal: () => void;
};

const DescriptionModal = ({
  title,
  modalDescription,
  modalInstruction,
  modalBulletPoints,
  isModalOpen,
  closeModal,
}: DescriptionModalProps) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleEscapeOrClickOutside = (event: KeyboardEvent | MouseEvent) => {
    if (event instanceof KeyboardEvent && event.key === 'Escape') {
      closeModal();
    } else if (
      event instanceof MouseEvent &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeOrClickOutside);
    document.addEventListener('mousedown', handleEscapeOrClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscapeOrClickOutside);
      document.removeEventListener('mousedown', handleEscapeOrClickOutside);
    };
  }, []);

  if (!isModalOpen) return null;

  return (
    <motion.div
      className={style.modal_wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.15 }}
    >
      <FocusScope contain restoreFocus autoFocus>
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ ease: 'backOut', delay: 0.1, duration: 0.15 }}
        >
          <dialog
            aria-modal="true"
            aria-labelledby="title"
            tabIndex={0}
            className={style.modal_content}
          >
            <div className={style.modal_header}>
              <Typo.h2 id="title" textType="body__primary" autoFocus>
                {title}
              </Typo.h2>
              <Button
                className={style.iconButton}
                onClick={closeModal}
                icon={{ right: <MonoIcon icon={'actions/Close'} /> }}
                buttonProps={{
                  'aria-label': t(
                    PageText.Contact.components.modal.close(title),
                  ),
                }}
              />
            </div>

            {modalDescription && (
              <Typo.p textType="body__primary">{modalDescription}</Typo.p>
            )}

            {modalBulletPoints && (
              <ul className={style.modal__rules_list}>
                {modalBulletPoints.map((desc, index) => (
                  <li key={index}>
                    <Typo.p textType="body__primary" key={index}>
                      {t(desc)}
                    </Typo.p>
                  </li>
                ))}
              </ul>
            )}

            {modalInstruction && (
              <Typo.p textType="body__primary--bold">{modalInstruction}</Typo.p>
            )}
          </dialog>
        </motion.div>
      </FocusScope>
    </motion.div>
  );
};

export default DescriptionModal;
