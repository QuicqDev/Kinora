import { staticDemo } from './demo-mode';
import { useEffect, useState, type AnchorHTMLAttributes } from 'react';
function currentPath() {
  if (!staticDemo) return location.pathname;
  return location.hash.startsWith('#/')
    ? location.hash.slice(1)
    : '/' + location.pathname.slice(import.meta.env.BASE_URL.length);
}
function address(path: string) {
  return staticDemo ? import.meta.env.BASE_URL + '#' + path : path;
}
export function navigate(path: string) {
  if (currentPath() === path) return;
  history.pushState(null, '', address(path));
  window.dispatchEvent(new PopStateEvent('popstate'));
}
export function usePath() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const update = () => setPath(currentPath());
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
    };
  }, []);
  return path.replace(/\/$/, '') || '/';
}
export function Link({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      href={address(href)}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target
        )
          return;
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
