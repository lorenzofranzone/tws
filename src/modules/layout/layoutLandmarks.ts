export default `@layer base {
    [data-layout] {
        >:is(#header, #main, [id*="aside-"], #intro, #outro, #footer) {
            grid-column: c-full-width;
            display: grid;
            grid-template-columns: subgrid;
            align-items: start;
            align-content: start;

            >:not([class*="-area"]) {
                grid-column: var(--_area, c-main);
                align-self: start;
            }
        }

        > #header {
            --_area: c-container;

            grid-row: r-header;
            z-index: 5;
        }

        > #intro {
            --_area: c-container;
            
            grid-row: r-intro;
            z-index: 2;
        }

        > #aside-left {
            --_area: c-aside-left;

            grid-row: r-aside-left;
            z-index: 2;

            @media (min-width: 64rem) {
                grid-column: c-full-width / c-aside-left;
            }
        }

        > #main {
            grid-row: r-main;
            z-index: 1;
        }

        > #aside-right {
            --_area: c-aside-right;

            grid-row: r-aside-right;
            z-index: 3;

            @media (min-width: 64rem) {
                grid-column: c-aside-right / c-full-width;
            }
        }

        > #outro {
            --_area: c-container;
            
            grid-row: r-outro;
            z-index: 2;
        }
        
        > #footer {
            --_area: c-container;

            grid-row: r-footer;
            z-index: 4;
        }
    }
}`