import { IProcessedLayout } from './processLayout';

export default (options: IProcessedLayout) => `@theme {
    --breakpoint-ty: 30rem;
    --breakpoint-tx: 48rem;
    --breakpoint-d: 64rem;
}

@layer base {
    [data-layout] {
        --layout-container: ${options.container};
        --layout-columns-count: 2;
        --layout-gap: ${options.gap};
        --layout-breakout: ${options.breakout};
        --layout-single-aside-columns-count: ${options.columnsCount['aside-single'][0] ?? 0};
        --layout-aside-left-columns-count: ${options.columnsCount['aside-left'][0] ?? 0};
        --layout-aside-right-columns-count: ${options.columnsCount['aside-right'][0] ?? 0};
        --layout-extra-margin: ${options.extraMargin ?? '0.25rem'};

        /* -------------------------------------------------- */
        /* TABLET PORTRAIT */
        /* -------------------------------------------------- */

        @media (min-width: theme('screens.ty')) {
            --layout-columns-count: 4;
            --layout-single-aside-columns-count: ${options.columnsCount['aside-single'][1] ?? 0};
            --layout-aside-left-columns-count: ${options.columnsCount['aside-left'][1] ?? 0};
            --layout-aside-right-columns-count: ${options.columnsCount['aside-right'][1] ?? 0};
        }
        
        /* -------------------------------------------------- */
        /* TABLET LANDSCAPE */
        /* -------------------------------------------------- */

        @media (min-width: theme('screens.tx')) {
            --layout-columns-count: 6;
            --layout-single-aside-columns-count: ${options.columnsCount['aside-single'][2] ?? 0};
            --layout-aside-left-columns-count: ${options.columnsCount['aside-left'][2] ?? 0};
            --layout-aside-right-columns-count: ${options.columnsCount['aside-right'][2] ?? 0};
        }

        /* -------------------------------------------------- */
        /* DESKTOP*/
        /* -------------------------------------------------- */

        @media (min-width: theme('screens.d')) {
            --layout-columns-count: 12;
            --layout-single-aside-columns-count: ${options.columnsCount['aside-single'][3] ?? 4};
            --layout-aside-left-columns-count: ${options.columnsCount['aside-left'][3] ?? 3};
            --layout-aside-right-columns-count: ${options.columnsCount['aside-right'][3] ?? 3};
        }
    }
}`