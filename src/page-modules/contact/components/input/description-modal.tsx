import { Typo } from '@atb/components/typography';
import style from './input.module.css';
import { motion } from 'framer-motion';
import { FocusScope } from '@react-aria/focus';
import { MonoIcon } from '@atb/components/icon';
import { useEffect } from 'react';

type DescriptionModalProps = {
  label: string;
  description: string;
  onClose: () => void;
};

const DescriptionModal = ({
  label,
  description,
  onClose,
}: DescriptionModalProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ ease: 'backOut', delay: 0.1, duration: 0.15 }}
        >
          <div className={style.modal_content}>
            <div className={style.modal_header}>
              <Typo.h2 textType="body__primary">{label}</Typo.h2>
              <button className={style.iconButtonModal} onClick={onClose}>
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
