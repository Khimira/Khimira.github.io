import React, { useRef, useEffect } from 'react';

function placeCaretAtEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range);
}

export function InputLine({ prompt, disabled = false, onSubmit, onHistoryUp, onHistoryDown }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!disabled) {
      ref.current?.focus();
    }
  }, [disabled]);

  function refocus() {
    if (!disabled) ref.current?.focus();
  }

  useEffect(() => {
    document.addEventListener('click', refocus);
    return () => document.removeEventListener('click', refocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const text = ref.current?.textContent ?? '';
      onSubmit(text);
      if (ref.current) ref.current.textContent = '';
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = onHistoryUp?.();
      if (ref.current && prev !== undefined) {
        ref.current.textContent = prev;
        placeCaretAtEnd(ref.current);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = onHistoryDown?.();
      if (ref.current && next !== undefined) {
        ref.current.textContent = next;
        placeCaretAtEnd(ref.current);
      }
    }
  }

  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 text-rp-kali-green-bright">{prompt}</span>
      <div
        ref={ref}
        contentEditable={!disabled}
        suppressContentEditableWarning
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        role="textbox"
        aria-label="Linha de comando do terminal"
        onKeyDown={handleKeyDown}
        className="min-w-[1ch] flex-1 whitespace-pre-wrap break-words outline-none"
        style={{ caretColor: 'var(--color-rp-kali-green-bright)' }}
      />
    </div>
  );
}
