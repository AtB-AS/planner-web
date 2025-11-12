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
  const { activeGlobalMessages, dismissGlobalMessage } =
    useActiveGlobalMessages();

  if (!activeGlobalMessages.length) return null;

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
        .map((message) => {
          const link = getTextForLanguage(message.link, language);
          const linkText = getTextForLanguage(message.linkText, language);
          return (
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
                subtle={message.subtle}
                onDismiss={
                  message.isDismissable
                    ? () => dismissGlobalMessage(message)
                    : undefined
                }
                onClickConfig={
                  link ? { url: link, text: linkText ?? link } : undefined
                }
              />
            </motion.div>
          );
        })}
    </motion.div>
  );
}
