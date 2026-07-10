import React, { useState, useEffect, useMemo } from 'react';

// Typewriter seguro baseado em índice (evita bugs de duplicação em Strict Mode)
export function TypewriterText({ text, delay = 8, onComplete, skip = false }) {
  const [currentIndex, setCurrentIndex] = useState(skip ? text.length : 0);
  const displayedText = useMemo(() => text.slice(0, currentIndex), [text, currentIndex]);

  useEffect(() => {
    if (skip) {
      setCurrentIndex(text.length);
      return;
    }
    if (currentIndex >= text.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => setCurrentIndex((prev) => prev + 1), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, text, delay, skip]);

  return <span>{displayedText}</span>;
}

export function OutputLine({ content, className = '', mono = false, typewriter = true, onComplete }) {
  if (content === '') {
    return <div className="h-4" aria-hidden="true" />;
  }

  return (
    <div className={`whitespace-pre-wrap break-words leading-relaxed ${mono ? 'font-mono-code' : ''} ${className}`}>
      {typewriter ? <TypewriterText text={content} onComplete={onComplete} /> : content}
    </div>
  );
}

export function InputEcho({ prompt, command }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 text-rp-kali-green-bright">{prompt}</span>
      <span className="whitespace-pre-wrap break-words text-rp-text">{command}</span>
    </div>
  );
}
