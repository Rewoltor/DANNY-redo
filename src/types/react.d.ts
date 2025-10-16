declare module 'react' {
  export function useState<T = any>(initial: T): [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(fn: () => void | (() => void), deps?: any[]): void;
  export type ChangeEvent<T = any> = any;
  export type FormEvent<T = any> = any;
  export const Fragment: any;
  export const StrictMode: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
