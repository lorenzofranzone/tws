export default `@layer utilities {
    [data-layout] {
        /* Wide */

        .wide-area {
            grid-column: c-full-width;
        }

        /* Half */

        .half-left-area {
            grid-column: c-full-width / c-center;
        }
        .half-right-area {
            grid-column: c-center / c-full-width-end;
        }

        /* Container */

        .container-area {
            grid-column: c-container;
        }
        .container-wide-left-area {
            grid-column: c-full-width / c-container-end;
        }
        .container-wide-right-area {
            grid-column: c-container / c-full-width-end;
        }

        /* Main */

        .main-area {
            grid-column: c-main;
        }

        /* Aside */

        .aside-left-area {
            grid-column: c-aside-left;
        }
        .aside-right-area {
            grid-column: c-aside-right;
        }

        /* Margin */

        .margin-left-area {
            grid-column: c-full-width / c-container-start;
        }
        .margin-right-area {
            grid-column: c-container-end / c-full-width-end;
        }

        /* All *-area classes */

        [class*="-area"] {
            &:has(>[class*="-area"]) {
                display: grid;
                grid-template-columns: subgrid;
                align-items: start;
            }
        }
    }
}`