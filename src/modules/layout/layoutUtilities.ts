export default `@layer utilities {
    [data-layout] {
        --layout-all-aside-columns-count: calc(var(--layout-aside-left-columns-count) + var(--layout-aside-right-columns-count));
        --layout-main-columns-count-with-2-aside: calc(var(--layout-columns-count) - var(--layout-all-aside-columns-count));
        --layout-main-columns-half-count-with-2-aside: calc(var(--layout-main-columns-count-with-2-aside) / 2);
        --layout-main-columns-count: calc(var(--layout-columns-count) - var(--layout-single-aside-columns-count));
        --layout-main-columns-half-count: calc(var(--layout-main-columns-count) / 2);
        --layout-container-columns-half-count: calc(var(--layout-columns-count) / 2);
        --layout-gutters-count: calc(var(--layout-columns-count) - 1);
        --layout-total-gutters-width: calc(var(--layout-gap-x) * var(--layout-gutters-count));
        --layout-all-columns-width: calc(var(--layout-container-width) - var(--layout-total-gutters-width));
        --layout-column-width: calc(var(--layout-all-columns-width) / var(--layout-columns-count));
    }
}

@utility grid-layout-columns {
    --_cols:
        [c-full-width-start] minmax(var(--layout-extra-margin-width), 1fr)
        [c-container-start c-main-start] repeat(var(--layout-container-columns-half-count), minmax(0, var(--layout-column-width)))
        [c-center]
        repeat(var(--layout-container-columns-half-count), minmax(0, var(--layout-column-width))) [c-container-end c-main-end]
        minmax(var(--layout-extra-margin-width), 1fr) [c-full-width-end];
    column-gap: var(--layout-gap-x);
}`