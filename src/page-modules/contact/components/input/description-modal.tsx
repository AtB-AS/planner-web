import { Typo } from '@atb/components/typography';
import style from './input.module.css';
import { motion } from 'framer-motion';
import { FocusScope } from '@react-aria/focus';
import { MonoIcon } from '@atb/components/icon';
import { useEffect, useRef } from 'react';

type DescriptionModalProps = {
  title: string;
  description: string;
  ariaLabel: string;
  isModalOpen: boolean;
  closeModal: () => void;
};

const DescriptionModal = ({
  title,
  description,
  ariaLabel,
  isModalOpen,
  closeModal,
}: DescriptionModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener('click', handleClickOutside);
      }
    };
  }, []);

  if (!isModalOpen) return null;

  return (
    <motion.div
      className={style.modal_wrapper}
      ref={wrapperRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: 'easeInOut', duration: 0.15 }}
    >
      <FocusScope contain restoreFocus autoFocus>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ ease: 'backOut', delay: 0.1, duration: 0.15 }}
        >
          <div ref={modalRef} className={style.modal_content}>
            <div className={style.modal_header}>
              <Typo.h2 textType="body__primary">{title}</Typo.h2>
              <button
                type="button"
                name="closeModalButton"
                aria-label={ariaLabel}
                className={style.iconButton}
                onClick={closeModal}
              >
                <MonoIcon icon={'actions/Close'} />
              </button>
            </div>
            <Typo.p textType="body__primary">{description}</Typo.p>
          </div>
        </motion.div>
      </FocusScope>
    </motion.div>
  );
};

export default DescriptionModal;
