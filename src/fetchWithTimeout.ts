export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 8000
) {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    ),
  ]);
}
