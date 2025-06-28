export default `@layer base {
    [data-layout] {
        --_gaps-count: calc(var(--layout-columns-count) - 1);
        --_gaps-sum: calc(var(--layout-gap) * var(--_gaps-count));
        --_columns-sum: calc(var(--layout-container) - var(--_gaps-sum));
        --_asides-columns-sum: calc(var(--layout-aside-left-columns-count) + var(--layout-aside-right-columns-count));
        --_column-width: calc(var(--_columns-sum) / var(--layout-columns-count));
        --_cols-1-2: calc(var(--layout-columns-count) / 2);

        /* Column Strategies */

        --_wide-layout-columns-strategy:
            [c-full-width-start] var(--layout-extra-margin)
            var(--_boxed-layout-columns-strategy)
            var(--layout-extra-margin) [c-full-width-end];

        @media (min-width: theme('screens.d')) {
            --_wide-layout-columns-strategy:
                [c-full-width-start] minmax(0, 1fr)
                var(--_boxed-layout-columns-strategy)
                minmax(0, 1fr) [c-full-width-end];
        }
        
        --_boxed-layout-columns-strategy:
            [c-container-start c-main-start] repeat(var(--_cols-1-2), minmax(0, var(--_column-width)))
            [center]
            repeat(var(--_cols-1-2), minmax(0, var(--_column-width))) [c-container-end c-main-end];

        /* -------------------------------------------------- */
        /* Global layout */
        /* -------------------------------------------------- */

        --_global-rows:
            [r-header] auto
            [r-intro] auto
            [r-aside-left] auto
            [r-main] 1fr
            [r-aside-right] auto
            [r-outro] auto
            [r-footer] auto;

        @media (min-width: theme('screens.d')) {
            --_global-rows:
                [r-header] auto
                [r-intro] auto
                [r-aside-left r-main r-aside-right] 1fr
                [r-outro] auto
                [r-footer] auto;
        }

        /* -------------------------------------------------- */
        /* Aside left */
        /* -------------------------------------------------- */

        &:has(#aside-left):not(#aside-right) {            
            --_boxed-layout-columns-strategy:
                [c-container-start c-aside-left-start c-main-start] repeat(var(--_cols-1-2), minmax(0, 1fr))
                [center]
                repeat(var(--_cols-1-2), minmax(0, 1fr)) [c-container-end c-aside-left-end c-main-end];

            @media (min-width: theme('screens.d')) {                
                --_boxed-layout-columns-strategy: 
                    [c-container-start c-aside-left-start] repeat(var(--layout-single-aside-columns-count), minmax(0, var(--_column-width)))
                    [c-aside-left-end c-main-start] repeat(calc((var(--layout-columns-count) - var(--layout-single-aside-columns-count)) / 2), minmax(0, var(--_column-width)))
                    [center]
                    repeat(calc((var(--layout-columns-count) - var(--layout-single-aside-columns-count)) / 2), minmax(0, var(--_column-width))) [c-main-end c-container-end];
                    
                #main {
                    grid-column-start: c-main;
                }
            }
        }

        /* -------------------------------------------------- */
        /* Aside right */
        /* -------------------------------------------------- */

        &:has(#aside-right):not(#aside-left) {            
            --_boxed-layout-columns-strategy:
                [c-container-start c-main-start c-aside-right-start] repeat(var(--_cols-1-2), minmax(0, 1fr))
                [center]
                repeat(var(--_cols-1-2), minmax(0, 1fr)) [c-container-end c-main-end c-aside-right-end];

            @media (min-width: theme('screens.d')) {                
                --_boxed-layout-columns-strategy: 
                    [c-container-start c-main-start] repeat(calc((var(--layout-columns-count) - var(--layout-single-aside-columns-count)) / 2), minmax(0, var(--_column-width))) 
                    [center]
                    repeat(calc((var(--layout-columns-count) - var(--layout-single-aside-columns-count)) / 2), minmax(0, var(--_column-width))) [c-main-end c-aside-right-start]
                    repeat(var(--layout-single-aside-columns-count), minmax(0, var(--_column-width))) [c-aside-right-end c-container-end];
                    
                #main {
                    grid-column-end: c-main;
                }
            }
        }

        /* -------------------------------------------------- */
        /* Aside left and right */
        /* -------------------------------------------------- */

        &:has(#aside-left):has(#aside-right) {            
            --_boxed-layout-columns-strategy:
                [c-container-start c-aside-left-start c-main-start c-aside-right-start] repeat(var(--_cols-1-2), minmax(0, 1fr))
                [center]
                repeat(var(--_cols-1-2), minmax(0, 1fr)) [c-container-end c-aside-left-end c-main-end c-aside-right-end];

            @media (min-width: theme('screens.d')) {                
                --_boxed-layout-columns-strategy: 
                    [c-container-start c-aside-left-start] repeat(var(--layout-aside-left-columns-count), minmax(0, var(--_column-width)))
                    [c-aside-left-end c-main-start] repeat(calc((var(--layout-columns-count) - var(--_asides-columns-sum)) / 2), minmax(0, var(--_column-width)))
                    [center]
                    repeat(calc((var(--layout-columns-count) - var(--_asides-columns-sum)) / 2), minmax(0, var(--_column-width))) [c-main-end c-aside-right-start]
                    repeat(var(--layout-aside-right-columns-count), minmax(0, var(--_column-width))) [c-container-end c-aside-right-end];
            }
        }
    }

    [data-layout="no-gap"] {
        --_column-width: calc(var(--layout-container) / var(--layout-columns-count));
    }
}

@utility grid-layout-columns-wide {
  display: grid;
  grid-template-columns: var(--_wide-layout-columns-strategy);
  column-gap: var(--layout-gap);
}

@utility grid-layout-columns {
    display: grid;
    grid-template-columns: var(--_boxed-layout-columns-strategy);
    column-gap: var(--layout-gap);
}

@utility subgrid-x {
    display: grid;
    grid-template-columns: subgrid;
}

@utility subgrid-y {
    display: grid;
    grid-template-rows: subgrid;
}

@utility subgrid {
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}`