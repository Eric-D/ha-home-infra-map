/** Sizes announced to the "sections" view.

`rows` is 'auto', never a number: a number makes hui-grid-section set a hard
height (`fit-rows`), the content overflows and the next card is drawn over it
(seen on a previous card). Our height depends on the data. */
export interface GridOptions {
  columns?: number | 'full';
  rows?: number | 'auto';
  min_columns?: number;
  min_rows?: number;
}

export function gridOptions(): GridOptions {
  return { columns: 'full', rows: 'auto', min_columns: 6, min_rows: 4 };
}

export function cardSize(): number {
  return 8;
}
