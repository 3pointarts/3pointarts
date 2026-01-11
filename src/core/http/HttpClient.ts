export async function http<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_SUPABASE_KEY!,
      "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}
