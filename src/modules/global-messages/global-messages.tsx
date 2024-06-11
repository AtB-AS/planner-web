import { MessageBox } from '@atb/components/message-box';
import { getTextForLanguage, useTranslation } from '@atb/translations';
import { and } from '@atb/utils/css';
import { useActiveGlobalMessages } from './context';
import { GlobalMessageContextEnum } from './types';
import style from './global-messages.module.css';
import { motion } from 'framer-motion';

export type GlobalMessagesProps = {
  context: GlobalMessageContextEnum;
  className?: string;
};

export function GlobalMessages({ context, className }: GlobalMessagesProps) {
  const { language } = useTranslation();
  const { activeGlobalMessages } = useActiveGlobalMessages();

  if (!activeGlobalMessages || activeGlobalMessages.length === 0) return null;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      initial="hidden"
      animate="show"
      className={and(style.container, className)}
    >
      {activeGlobalMessages
        .filter((message) => message.context.includes(context))
        .map((message) => (
          <motion.div
            key={message.id}
            variants={{
              hidden: { opacity: 0, height: 0 },
              show: { opacity: 1, height: 'auto' },
            }}
          >
            <MessageBox
              type={message.type}
              title={getTextForLanguage(message.title, language)}
              message={getTextForLanguage(message.body, language) ?? ''}
            />
          </motion.div>
        ))}
    </motion.div>
  );
}
