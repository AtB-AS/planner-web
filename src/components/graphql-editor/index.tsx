import { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { graphql } from 'cm6-graphql';
import type { GraphQLSchema } from 'graphql';

type GraphQLEditorProps = {
  value: string;
  onChange: (value: string) => void;
  schema?: GraphQLSchema;
  className?: string;
};

export default function GraphQLEditor({
  value,
  onChange,
  schema,
  className,
}: GraphQLEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions = [
      basicSetup,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        '&': {
          fontSize: '0.8rem',
          border:
            '1px solid var(--color-background-neutral-2-background, #ccc)',
          borderRadius: '4px',
          maxHeight: '450px',
          backgroundColor: '#fff',
        },
        '.cm-scroller': {
          overflow: 'auto',
        },
        '.cm-content': {
          fontFamily: 'monospace',
          backgroundColor: '#fff',
        },
        '.cm-gutters': {
          backgroundColor: '#fff',
        },
      }),
      ...(schema ? [graphql(schema)] : [graphql()]),
    ];

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Recreate editor when schema changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema]);

  // Sync external value changes (e.g. restore defaults)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} className={className} />;
}
