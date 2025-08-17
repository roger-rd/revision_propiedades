// src/types/global.d.ts


declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-placeautocomplete': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
