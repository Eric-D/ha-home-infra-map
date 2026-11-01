/** Instrumented logs: without them "no log" is ambiguous between "HA never
used our element" and "everything went fine" (lesson from a previous card). */
export function log(level: 'info' | 'warn' | 'error', scope: string, message: string, ...args: unknown[]): void {
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  fn(`%cHOME-INFRA-MAP%c [${scope}] ${message}`, 'color:#0b6bcb;font-weight:bold', '', ...args);
}
