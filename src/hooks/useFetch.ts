import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
  const [state, setState] = useState<{ data: T | null, loading: boolean, error: string | null }>(
    { data: null, loading: true, error: null }
  )

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<T>;
      })
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });

    return () => { cancelled = true; };

  }, [url])

  return state;
}