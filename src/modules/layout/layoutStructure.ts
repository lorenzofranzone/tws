export default `@layer base {
    html,
    body {
        overflow-x: hidden;
    }

    [data-layout] {
        --_cols-gap: var(--layout-gap);
        --_rows: var(--_global-rows);
        --_cols: var(--_wide-layout-columns-strategy);
        
        min-height: 100dvh;
        display: grid;
        grid-template-columns: var(--_cols);
        grid-template-rows: var(--_rows);
        grid-auto-rows: auto;
        column-gap: var(--_cols-gap);
    }

    [data-layout="no-gap"] {
        --_cols-gap: 0;
    }
}`