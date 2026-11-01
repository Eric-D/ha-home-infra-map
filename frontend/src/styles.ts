import { css } from 'lit';

/** Theme variables of Home Assistant only; derived tints via color-mix. */
export const cardStyles = css`
  :host {
    display: block;
    --him-ok: var(--success-color, #2e9d57);
    --him-warn: var(--warning-color, #d98a00);
    --him-bad: var(--error-color, #d23c3c);
    --him-accent: var(--primary-color, #0b6bcb);
    --him-muted: var(--secondary-text-color, #68737d);
    --him-line: var(--divider-color, #d7dce1);
    --him-card: var(--card-background-color, #fff);
    --him-ink: var(--primary-text-color, #1c2126);
    --him-rail: color-mix(in srgb, var(--him-ink) 8%, var(--him-card));
    --him-mod: color-mix(in srgb, var(--him-ink) 3%, var(--him-card));
    --him-diff: color-mix(in srgb, var(--him-accent) 18%, var(--him-card));
    --him-diff-ink: color-mix(in srgb, var(--him-accent) 75%, var(--him-ink));
    --him-dev: color-mix(in srgb, #f2b233 24%, var(--him-card));
    --him-dev-ink: color-mix(in srgb, #8a5c00 70%, var(--him-ink));
    --him-indent: 22px;
    --him-mono: ui-monospace, 'Roboto Mono', SFMono-Regular, Menlo, monospace;
  }
  ha-card {
    overflow: hidden;
    color: var(--him-ink);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 14px 16px 8px;
    flex-wrap: wrap;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .head-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .body {
    padding: 4px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .seg {
    display: inline-flex;
    border: 1px solid var(--him-line);
    border-radius: 8px;
    overflow: hidden;
    font-size: 13px;
  }
  .seg button {
    all: unset;
    cursor: pointer;
    padding: 4px 10px;
    color: var(--him-muted);
  }
  .seg button[aria-pressed='true'],
  .seg button[aria-selected='true'] {
    background: var(--him-accent);
    color: var(--text-primary-color, #fff);
  }
  button:focus-visible,
  .seg button:focus-visible,
  [tabindex]:focus-visible,
  select:focus-visible,
  input:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--him-accent);
    outline-offset: 2px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--him-line);
    border-radius: 99px;
    padding: 3px 10px;
    font-size: 13px;
    background: var(--him-card);
    color: var(--him-ink);
  }
  button.chip {
    cursor: pointer;
    font: inherit;
    font-size: 13px;
  }
  .chip.warn {
    border-color: var(--him-warn);
    color: color-mix(in srgb, var(--him-warn) 70%, var(--him-ink));
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--him-ok);
    flex: none;
    display: inline-block;
  }
  .dot.warn {
    background: var(--him-warn);
  }
  .dot.bad {
    background: var(--him-bad);
  }
  .dot.off {
    background: var(--him-muted);
  }
  .num {
    font-variant-numeric: tabular-nums;
    font-family: var(--him-mono);
    font-size: 12.5px;
  }
  .muted {
    color: var(--him-muted);
  }
  .small {
    font-size: 12px;
  }
  h3 {
    font-size: 13px;
    margin: 6px 0 0;
    color: var(--him-muted);
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .empty {
    padding: 12px;
    color: var(--him-muted);
    border: 1px dashed var(--him-line);
    border-radius: 10px;
  }
  .banner {
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 13px;
    background: color-mix(in srgb, var(--him-bad) 12%, var(--him-card));
    border: 1px solid color-mix(in srgb, var(--him-bad) 45%, var(--him-card));
  }
  .banner.info {
    background: color-mix(in srgb, var(--him-accent) 10%, var(--him-card));
    border-color: color-mix(in srgb, var(--him-accent) 40%, var(--him-card));
  }
  .btn {
    border: 1px solid var(--him-line);
    border-radius: 7px;
    padding: 5px 10px;
    font: inherit;
    font-size: 13px;
    background: var(--him-card);
    color: var(--him-ink);
    cursor: pointer;
    min-height: 30px;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .btn.pri {
    background: var(--him-accent);
    border-color: var(--him-accent);
    color: var(--text-primary-color, #fff);
  }
  .btn.danger {
    color: var(--him-bad);
    border-color: color-mix(in srgb, var(--him-bad) 50%, var(--him-line));
  }
  .icon-btn {
    all: unset;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--him-muted);
  }
  .icon-btn:hover {
    background: color-mix(in srgb, var(--him-ink) 8%, transparent);
  }
  .btns {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  select.sel,
  input.inp,
  textarea.inp {
    border: 1px solid var(--him-line);
    border-radius: 6px;
    padding: 6px 8px;
    background: var(--him-card);
    color: var(--him-ink);
    font: inherit;
    font-size: 13px;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
  }
  input.inp[type='color'] {
    padding: 1px;
    height: 30px;
  }
  input.inp[type='checkbox'] {
    width: auto;
  }
  textarea.inp {
    font-family: var(--him-mono);
    font-size: 12px;
  }
  .f {
    display: flex;
    flex-direction: column;
    gap: 3px;
    font-size: 13px;
  }
  .f > label,
  .f > .lbl {
    font-size: 11.5px;
    color: var(--him-muted);
  }
  .hint {
    font-size: 11.5px;
  }
  .hint.ok {
    color: var(--him-ok);
  }
  .hint.bad {
    color: var(--him-bad);
  }
  .ent {
    font-family: var(--him-mono);
    font-size: 11.5px;
    color: var(--him-muted);
    word-break: break-all;
  }
  button.ent {
    all: unset;
    font-family: var(--him-mono);
    font-size: 11.5px;
    color: var(--him-accent);
    cursor: pointer;
    word-break: break-all;
  }
  .detail {
    border: 1px solid var(--him-line);
    border-radius: 10px;
    padding: 10px 12px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 14px;
    font-size: 13.5px;
    margin: 0;
  }
  .detail dt {
    color: var(--him-muted);
  }
  .detail dd {
    margin: 0;
    min-width: 0;
  }
  .scroll {
    overflow-x: auto;
  }
  table.tbl {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .tbl td,
  .tbl th {
    border-bottom: 1px solid var(--him-line);
    padding: 5px 6px;
    text-align: left;
    vertical-align: top;
  }
  .tbl th {
    color: var(--him-muted);
    font-weight: 500;
    font-size: 11.5px;
  }
  .tbl tr.hl {
    background: color-mix(in srgb, var(--him-ok) 10%, transparent);
  }
  .act {
    display: inline-flex;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
  }
  .act.pass {
    background: var(--him-ok);
  }
  .act.block {
    background: var(--him-bad);
  }
  .badge {
    display: inline-block;
    font-size: 10.5px;
    border-radius: 99px;
    padding: 0 6px;
    border: 1px solid var(--him-line);
    color: var(--him-muted);
    white-space: nowrap;
  }
  .badge.warn {
    border-color: var(--him-warn);
    color: color-mix(in srgb, var(--him-warn) 70%, var(--him-ink));
  }
  .warnlist {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
  }
  .warnlist li.warning::marker {
    color: var(--him-warn);
  }

  /* electrical board */
  .board {
    background: var(--him-rail);
    border-radius: 10px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .rail {
    /* one grid column per DIN slot; modules span their width */
    --him-slot: 60px;
    /* below this a slot cannot show "C10": the rail scrolls instead */
    --him-slot-min: 48px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto;
    justify-content: start;
    gap: 3px;
    align-items: stretch;
    background: var(--him-card);
    border-radius: 7px;
    padding: 5px;
    overflow-x: auto;
    min-height: 86px;
  }
  .rl {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-size: 10px;
    color: var(--him-muted);
    padding: 0 2px;
    flex: none;
    text-align: center;
  }
  .m {
    all: unset;
    box-sizing: border-box;
    min-width: 0;
    min-height: 84px;
    border: 1px solid var(--him-line);
    border-radius: 5px;
    background: var(--him-mod);
    padding: 4px 5px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    color: var(--him-ink);
  }
  .m b {
    font-size: 13px;
    line-height: 1.15;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /* break between words; split a word only when it cannot fit at all */
    overflow-wrap: break-word;
    padding-right: 8px;
  }
  /* ratings ("C10", "40A") never break */
  .m:not(.s) b {
    white-space: nowrap;
    overflow-wrap: normal;
  }
  /* device titles are words ("Shelly", "Prise"), not short ratings */
  .m.s b {
    font-size: 12px;
    letter-spacing: -0.01em;
    overflow-wrap: normal;
  }
  .m.s:not(:has(.led)) b {
    padding-right: 0;
  }
  .m small {
    font-size: 10.5px;
    line-height: 1.15;
    color: var(--him-muted);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    hyphens: auto;
    overflow-wrap: anywhere;
  }
  .m .w {
    white-space: nowrap;
    margin-top: auto;
    font-family: var(--him-mono);
    font-size: 11px;
    font-weight: 500;
  }
  .m .led {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--him-muted);
  }
  .m .led.on {
    background: var(--him-ok);
  }
  .m .wmark {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--him-warn);
  }
  .m.d {
    background: var(--him-diff);
    color: var(--him-diff-ink);
    border-color: transparent;
  }
  .m.d small {
    color: var(--him-diff-ink);
  }
  .m.s {
    background: var(--him-dev);
    color: var(--him-dev-ink);
    border-color: transparent;
  }
  .m.s small {
    color: var(--him-dev-ink);
  }
  .m.u {
    border-style: dashed;
    border-color: color-mix(in srgb, var(--him-ink) 35%, var(--him-card));
  }
  .m.sp {
    background: transparent;
    border-style: dotted;
  }
  /* free DIN slot of a rail whose width is known */
  .m.free {
    background: transparent;
    border: 1px dashed color-mix(in srgb, var(--him-line) 60%, transparent);
    cursor: default;
  }
  .rail.over {
    box-shadow: inset 0 0 0 2px var(--him-warn);
  }
  .rail .cell {
    display: flex;
    min-width: 0;
  }
  .rail .cell > .m {
    width: 100%;
  }
  .rail-meta {
    font-size: 11px;
    color: var(--him-muted);
    margin: -2px 0 2px 4px;
  }
  .rail-meta.over {
    color: var(--him-warn);
    font-weight: 500;
  }
  .add.add-sp {
    font-size: 16px;
  }
  /* switched off / tripped: lever down */
  .m.off {
    border-color: var(--him-bad);
    filter: saturate(0.35);
  }
  /* spare: installed for future works, not wired */
  .m.spare {
    background: repeating-linear-gradient(
      135deg,
      var(--him-mod) 0 6px,
      color-mix(in srgb, var(--him-line) 70%, var(--him-mod)) 6px 8px
    );
    border-style: dashed;
    color: var(--him-muted);
  }
  .tag {
    align-self: flex-start;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    padding: 0 4px;
    border-radius: 3px;
    line-height: 14px;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  .m .tag {
    margin-top: auto;
  }
  .m .tag + .w {
    margin-top: 0;
  }
  .tag.off {
    background: var(--him-bad);
    color: #fff;
  }
  .tag.spare {
    background: var(--him-line);
    color: var(--him-ink);
  }
  .tag.inline {
    display: inline-block;
    font-size: 11px;
  }
  /* explicit feed (not the RCD on the left) */
  .m .fxmark {
    position: absolute;
    top: 2px;
    right: 14px;
    font-size: 11px;
    line-height: 1;
    color: var(--him-accent);
    font-weight: 700;
  }
  .m.fx {
    border-left: 3px solid var(--him-accent);
  }
  /* feed links of the selected module */
  .board.linking .m:not(.up):not(.down):not(.sel):not(.free),
  .board.linking .sup:not(.up):not(.down):not(.sel) {
    opacity: 0.4;
  }
  .m.up,
  .sup.up {
    box-shadow: inset 0 0 0 2px var(--him-accent);
  }
  .m.down,
  .sup.down {
    box-shadow: inset 0 -3px 0 var(--him-accent);
  }
  /* service entrance */
  .supply {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    background: var(--him-card);
    border-radius: 7px;
    padding: 5px;
  }
  .sup {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 56px;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--him-line);
    background: var(--him-mod);
    color: var(--him-ink);
    cursor: pointer;
  }
  .sup.meter {
    background: color-mix(in srgb, #8bc34a 22%, var(--him-mod));
  }
  .sup.main_breaker {
    background: var(--him-diff);
    color: var(--him-diff-ink);
    border-color: transparent;
  }
  .sup .txt {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }
  .sup small {
    font-size: 10.5px;
    opacity: 0.8;
  }
  .sup b {
    font-size: 14px;
  }
  .sup .w {
    font-family: var(--him-mono);
    font-size: 12px;
    font-weight: 500;
  }
  .sup .load {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
  }
  .sup .bar {
    width: 48px;
    height: 6px;
    border-radius: 3px;
    background: color-mix(in srgb, currentColor 20%, transparent);
    overflow: hidden;
  }
  .sup .bar > span {
    display: block;
    height: 100%;
    background: var(--him-ok);
  }
  .sup .bar > span.hot {
    background: var(--him-warn);
  }
  .sup.sel {
    outline: 2px solid var(--him-accent);
    outline-offset: 1px;
  }
  .supply .arrow {
    color: var(--him-muted);
  }
  .supply .rl {
    align-self: stretch;
  }
  .m.sel {
    outline: 2px solid var(--him-accent);
    outline-offset: 1px;
  }
  .m.drag-over {
    box-shadow: -3px 0 0 var(--him-accent);
  }
  .add {
    all: unset;
    box-sizing: border-box;
    border: 1px dashed var(--him-accent);
    color: var(--him-accent);
    min-width: 0;
    min-height: 84px;
    border-radius: 5px;
    font-size: 20px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .spark {
    width: 100%;
    height: 42px;
    display: block;
  }
  .photo-link {
    font-size: 13px;
  }

  /* network */
  .topo {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13.5px;
  }
  .tn {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--him-line);
    border-radius: 8px;
    background: var(--him-card);
    min-width: 0;
  }
  button.tn {
    cursor: pointer;
  }
  button.tn:hover {
    border-color: var(--him-accent);
  }
  .tn .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tn .ip {
    margin-left: auto;
    color: var(--him-muted);
    white-space: nowrap;
  }
  .tn.port-head {
    background: transparent;
    border-style: dashed;
  }
  @media (max-width: 600px) {
    :host {
      --him-indent: 10px;
    }
    .tn {
      flex-wrap: wrap;
      row-gap: 2px;
    }
    .tn .name {
      white-space: normal;
      flex: 1 1 calc(100% - 20px);
    }
    .tn .ip {
      margin-left: 17px;
    }
  }
  .portgrp {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .vgrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 8px;
  }
  .vc {
    border: 1px solid var(--him-line);
    border-left: 5px solid var(--vc, var(--him-muted));
    border-radius: 8px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
  }
  .vc b {
    font-size: 14px;
  }
  .vc .row {
    all: unset;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border-radius: 4px;
  }
  .vc .row:hover {
    background: color-mix(in srgb, var(--him-ink) 6%, transparent);
  }
  .sw {
    background: #2b3137;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    gap: 10px;
    overflow-x: auto;
  }
  .sw-copper {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(2, 30px);
    gap: 4px;
    flex: 1;
    min-width: max-content;
  }
  .sw-sfp {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(2, 30px);
    gap: 4px;
    padding-left: 10px;
    border-left: 1px solid #4a535c;
  }
  .p {
    all: unset;
    box-sizing: border-box;
    background: #3a424a;
    border-radius: 3px;
    height: 30px;
    min-width: 30px;
    position: relative;
    color: #cfd6dc;
    font-size: 9.5px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 2px;
    font-family: var(--him-mono);
    cursor: pointer;
  }
  .p.sfp {
    background: #30363c;
    border: 1px solid #59626b;
    min-width: 36px;
  }
  .p::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #59626b;
  }
  .p.up::before {
    background: #47d17c;
  }
  .p.poe::after {
    content: '';
    position: absolute;
    top: 4px;
    right: 5px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f2b233;
  }
  .p.sel {
    outline: 2px solid #4fa3f7;
  }
  .p:focus-visible {
    outline: 2px solid #4fa3f7;
  }

  /* overlays */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 10;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 4vh 8px;
    overflow-y: auto;
  }
  .sheet {
    background: var(--him-card);
    color: var(--him-ink);
    border-radius: 12px;
    width: min(760px, 100%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  .sheet .head {
    position: sticky;
    top: 0;
    background: var(--him-card);
    z-index: 1;
  }

  /* editor layout */
  .ed {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 12px;
    align-items: start;
  }
  .ed.wide {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  @media (max-width: 680px) {
    .ed,
    .ed.wide {
      grid-template-columns: 1fr;
    }
  }
  .form {
    border: 1px solid var(--him-line);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
    min-width: 0;
  }
  .grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .tog {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .toolbar {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .yaml {
    max-height: 50vh;
    overflow: auto;
    background: var(--him-mod);
    border: 1px solid var(--him-line);
    border-radius: 8px;
    padding: 8px;
    font-family: var(--him-mono);
    font-size: 12px;
    white-space: pre;
    margin: 0;
  }
  .timeline {
    display: flex;
    height: 14px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--him-line);
  }
  .timeline span.on {
    background: var(--him-ok);
  }
  .timeline span.off {
    background: var(--him-bad);
  }
  .timeline span.na {
    background: var(--him-line);
  }
  .photo-full {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 0 0 12px 12px;
  }
  @media (prefers-reduced-motion: no-preference) {
    .m,
    .p,
    .btn {
      transition: outline-color 0.15s;
    }
  }
`;
