export default `@layer utilities {
    [data-layout] {
        > :where(#header, #main, [id*="aside-"], #footer) {
            grid-column: c-full-width;
            display: grid;
            grid-template-columns: subgrid;

            > * {
                grid-column: var(--_default-inner-area);
            }
        }

        > #header {
            --_default-inner-area: c-container;
            grid-row: r-header;
        }

        > #aside-left {
            --_default-inner-area: c-aside-left;
            grid-row: r-aside-left;

            @media (min-width: 64rem) {
                grid-column: c-full-width / c-aside-left;
            }
        }

        > #main {
            --_default-inner-area: c-main;
            grid-row: r-main;
        }

        > #aside-right {
            --_default-inner-area: c-aside-right;
            grid-row: r-aside-right;

            @media (min-width: 64rem) {
                grid-column: c-aside-right / c-full-width;
            }
        }

        > #footer {
            --_default-inner-area: c-container;
            grid-row: r-footer;
        }
    }
}`