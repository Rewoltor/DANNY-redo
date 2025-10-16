// Minimal shim to avoid editor/type errors when full React types aren't available.
// Recommended: install @types/react and @types/react-dom for full typing.

declare module 'react' {
  // Very small subset of React types used by this project files
  export type ReactNode = any;
  export const StrictMode: any;
  export default {} as {
    createElement: (...args: any[]) => any;
    Fragment: any;
  };
}

declare module 'react/jsx-runtime' {
  export function jsx(...args: any[]): any;
  export function jsxs(...args: any[]): any;
  export function jsxDEV(...args: any[]): any;
}

declare module 'react-dom/client' {
  export function createRoot(el: Element): { render: (node: any) => void };
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
