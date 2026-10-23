'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import styles from '@/app/docs/docs.module.css';

const baseCommand = 'curl -fsSL https://panasaurus.com/install.sh | bash';
const commands = [
  { id: 'guided', label: 'Guided setup', command: baseCommand },
  { id: 'panel', label: 'Panel only', command: `${baseCommand} -s -- --panel` },
  { id: 'wings', label: 'Wings only', command: `${baseCommand} -s -- --wings` },
];

export default function CopyCommand() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const code = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = commands[selected];

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function select(index: number) {
    if (timer.current) clearTimeout(timer.current);
    setCopied(false);
    setFailed(false);
    setSelected(index);
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % commands.length; break;
      case 'ArrowLeft': next = (index + commands.length - 1) % commands.length; break;
      case 'Home': next = 0; break;
      case 'End': next = commands.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.command);
      setCopied(true);
      setFailed(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      const selection = window.getSelection();
      if (code.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(code.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setFailed(true);
    }
  }

  return (
    <div className={styles.terminal}>
      <div className={styles.commandTabs} role="tablist" aria-label="Installation method">
        {commands.map(({ id, label }, index) => (
          <button key={id} ref={(element) => { tabs.current[index] = element; }} type="button" role="tab" id={`install-tab-${id}`} aria-controls="install-command" aria-selected={index === selected} tabIndex={index === selected ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => onTabKey(event, index)}>{label}</button>
        ))}
      </div>
      <div id="install-command" role="tabpanel" aria-labelledby={`install-tab-${active.id}`}>
        <div className={styles.terminalToolbar}>
          <span><Terminal aria-hidden="true" />bash</span>
          <button type="button" onClick={copy} aria-label={copied ? 'Command copied' : 'Copy installation command'}>
            {copied ? <><Check aria-hidden="true" /><span>Copied</span></> : <Copy aria-hidden="true" />}
          </button>
        </div>
        <div className={styles.command}><span aria-hidden="true" className={styles.commandPrompt}>$</span><code ref={code}>{active.command}</code></div>
      </div>
      <p className={styles.installRequirements}>Ubuntu 22.04+ or Debian 12. Run as root.</p>
      <span className="sr-only" role="status">{copied ? 'Installation command copied.' : failed ? 'Select and copy the highlighted command.' : ''}</span>
    </div>
  );
}
