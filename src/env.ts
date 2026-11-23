// Ortam değişkenlerine Node tür paketine ihtiyaç duymadan erişim.
export function env(name: string): string | undefined {
  const g = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  return g.process?.env?.[name];
}
