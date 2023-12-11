import Image from 'next/image';
import { useState } from 'react';
import copyIcon from './copy.svg';

import {
  SyntaxHighlighterProps,
  PrismLight as SyntaxHighlighterTemp,
} from 'react-syntax-highlighter';
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup';
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';
SyntaxHighlighterTemp.registerLanguage('markup', markup);

import style from './widget.module.css';
import React from 'react';

const SyntaxHighlighter =
  SyntaxHighlighterTemp as typeof React.Component<SyntaxHighlighterProps>;

export type CopyMarkupProps = { content: string };
export function CopyMarkup({ content }: CopyMarkupProps) {
  return (
    <div className={style.copyContainer}>
      <CopyButton text={content} />

      <SyntaxHighlighter language="markup" style={dark}>
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

export function CopyMarkupLarge({ content }: CopyMarkupProps) {
  return (
    <details className={style.copyContainerDetails}>
      <summary>HTML Code</summary>
      <div className={style.copyContainer}>
        <CopyButton text={content} />

        <SyntaxHighlighter
          language="markup"
          wrapLines
          wrapLongLines
          showLineNumbers
          style={dark}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    </details>
  );
}

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copy(str: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(str);
    } else {
      return document.execCommand('copy', true, str);
    }
  }

  const handleClick = async () => {
    try {
      await copy(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button onClick={handleClick} className={style.copyButton}>
      {isCopied ? (
        '👍'
      ) : (
        <Image className={style.copyIcon} src={copyIcon} alt="Copy" />
      )}
    </button>
  );
}
