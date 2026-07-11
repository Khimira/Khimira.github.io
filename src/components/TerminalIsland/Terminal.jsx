import React, { useState, useRef, useCallback, useEffect } from 'react';
import { InputLine } from './InputLine.jsx';
import { OutputLine, InputEcho } from './OutputLine.jsx';
import { MatrixRain } from './MatrixRain.jsx';

const PROMPT = 'khimira@portfolio:~$';

const COMMAND_MODULES = {
  about: () => import('./commands/sysinfo.js'),
  whoami: () => import('./commands/sysinfo.js'),
  nmap: () => import('./commands/nmap.js'),
  scan: () => import('./commands/nmap.js'),
  projects: () => import('./commands/projects.js'),
  blog: () => import('./commands/blog.js'),
  writeups: () => import('./commands/writeups.js'),
  ctf: () => import('./commands/writeups.js'),
  matrix: () => import('./commands/matrix.js'),
  themes: () => import('./commands/themes.js'),
  theme: () => import('./commands/themes.js'),
  contact: () => import('./commands/contact.js'),
  help: () => import('./commands/help.js'),
};

const BOOT_SEQUENCE = [
  'KHIMIRA-BIOS (C) 2026 — Retro Phosphor Systems',
  'CPU: Human-Grade Curiosity Unit @ ∞ GHz',
  'Memory Test: 640K ought to be enough... OK',
  'Detecting drives... /dev/sda [PORTFOLIO] ... OK',
  'Loading kernel: khimira-linux-terminal.img',
  '',
  `Bem-vindo ao terminal de ${'Lucas "Khimira" Carvalho'}.`,
  'Digite "help" para ver os comandos disponíveis.',
  '',
];

let idCounter = 0;
const nextId = () => idCounter++;

/**
 * @param {{
 *   projects?: Array<Record<string, any>>,
 *   posts?: Array<Record<string, any>>,
 *   writeups?: Array<Record<string, any>>,
 *   baseUrl?: string,
 * }} props
 */
export default function Terminal({ projects = [], posts = [], writeups = [], baseUrl = '/' }) {
  const [lines, setLines] = useState([]);
  const [booted, setBooted] = useState(false);
  const [busy, setBusy] = useState(true);
  const [matrixActive, setMatrixActive] = useState(false);
  const [kernelPanic, setKernelPanic] = useState(false);
  const scrollRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const print = useCallback(
    (text, opts = {}) => {
      const line = {
        id: nextId(),
        text,
        className: opts.className || '',
        mono: !!opts.mono,
        typewriter: opts.typewriter !== false && text !== '',
      };
      setLines((prev) => [...prev, line]);
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const wait = useCallback(
    (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    [],
  );

  const setTheme = useCallback((_name, theme) => {
    const root = document.documentElement;
    root.style.setProperty('--color-rp-base', theme.base);
    root.style.setProperty('--color-rp-surface', theme.surface);
    root.style.setProperty('--color-rp-text', theme.text);
    root.style.setProperty('--color-rp-pine', theme.accent);
    root.style.setProperty('--color-rp-kali-green-bright', theme.bright);
    root.style.setProperty('--color-rp-subtle', theme.subtle);
  }, []);

  const exitTerminal = useCallback(() => {
    print('Encerrando sessão... voltando ao Modo Website.', { className: 'text-rp-subtle' });
    setTimeout(() => {
      window.location.href = baseUrl;
    }, 500);
  }, [print, baseUrl]);

  const triggerKernelPanic = useCallback(() => {
    setKernelPanic(true);
    setTimeout(() => window.location.reload(), 2200);
  }, []);

  const startMatrix = useCallback(() => setMatrixActive(true), []);
  const stopMatrix = useCallback(() => setMatrixActive(false), []);

  const buildCtx = useCallback(
    () => ({
      print,
      wait,
      projects,
      posts,
      writeups,
      setTheme,
      exitTerminal,
      triggerKernelPanic,
      startMatrix,
    }),
    [print, wait, projects, posts, writeups, setTheme, exitTerminal, triggerKernelPanic, startMatrix],
  );

  // Boot sequence
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      for (const line of BOOT_SEQUENCE) {
        if (cancelled) return;
        print(line, { className: 'text-rp-kali-green-bright' });
        await wait(line === '' ? 80 : 140);
      }
      if (!cancelled) {
        setBooted(true);
        setBusy(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHistoryUp = useCallback(() => {
    const h = historyRef.current;
    if (h.length === 0) return undefined;
    const nextIndex = historyIndexRef.current <= 0 ? 0 : historyIndexRef.current - 1;
    historyIndexRef.current = nextIndex;
    return h[nextIndex];
  }, []);

  const handleHistoryDown = useCallback(() => {
    const h = historyRef.current;
    if (h.length === 0) return '';
    const nextIndex = historyIndexRef.current + 1;
    if (nextIndex >= h.length) {
      historyIndexRef.current = h.length;
      return '';
    }
    historyIndexRef.current = nextIndex;
    return h[nextIndex];
  }, []);

  const handleSubmit = useCallback(
    async (raw) => {
      const input = raw.trim();

      if (matrixActive) {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'matrix') {
          stopMatrix();
          print('Efeito Matrix desativado.', { className: 'text-rp-subtle', typewriter: false });
        }
        return;
      }

      setLines((prev) => [
        ...prev,
        { id: nextId(), isEcho: true, text: input, prompt: PROMPT },
      ]);
      scrollToBottom();

      if (input === '') return;

      historyRef.current.push(input);
      historyIndexRef.current = historyRef.current.length;

      const [cmd, ...args] = input.split(/\s+/);
      const cmdLower = cmd.toLowerCase();

      if (cmdLower === 'clear') {
        setLines([]);
        return;
      }
      if (cmdLower === 'exit') {
        exitTerminal();
        return;
      }
      if (cmdLower === 'sudo' && args.join(' ') === 'rm -rf /') {
        setBusy(true);
        const mod = await import('./commands/rm_rf.js');
        await mod.run(args, buildCtx());
        return;
      }

      const loader = COMMAND_MODULES[cmdLower];
      if (!loader) {
        print(`comando não encontrado: ${cmd}. Digite "help" para ver a lista.`, {
          className: 'text-rp-love',
        });
        return;
      }

      setBusy(true);
      try {
        const mod = await loader();
        await mod.run(args, buildCtx());
      } catch (err) {
        print(`erro ao executar "${cmd}": ${String(err?.message || err)}`, {
          className: 'text-rp-love',
        });
      } finally {
        setBusy(false);
      }
    },
    [matrixActive, stopMatrix, print, scrollToBottom, exitTerminal, buildCtx],
  );

  if (kernelPanic) {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black p-6 text-center font-mono-term">
        <div className="animate-glitch text-2xl text-rp-love md:text-4xl">
          KERNEL PANIC — not syncing: Attempted to kill portfolio!
        </div>
        <p className="mt-4 text-rp-subtle">Reiniciando sistema...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-screen max-w-5xl flex-col p-4 md:p-8">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-t-lg border border-rp-overlay bg-rp-surface/60 p-4 shadow-inner"
      >
        {lines.map((line) =>
          line.isEcho ? (
            <InputEcho key={line.id} prompt={line.prompt} command={line.text} />
          ) : line.text === undefined ? null : (
            <OutputLine
              key={line.id}
              content={line.text}
              className={line.className}
              mono={line.mono}
              typewriter={line.typewriter}
            />
          ),
        )}
        {booted && !busy && (
          <InputLine
            prompt={PROMPT}
            onSubmit={handleSubmit}
            onHistoryUp={handleHistoryUp}
            onHistoryDown={handleHistoryDown}
          />
        )}
      </div>

      <div className="flex items-center justify-between rounded-b-lg border-x border-b border-rp-overlay bg-rp-surface px-4 py-2 text-xs text-rp-subtle">
        <span>khimira-terminal v1.0</span>
        <span>{busy ? 'processando...' : 'pronto'}</span>
      </div>

      {matrixActive && <MatrixRain onExit={stopMatrix} />}
    </div>
  );
}
