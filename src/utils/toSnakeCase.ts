export function toSnakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, "_")
    .toLowerCase()
    .replace(/_+/g, "_")
    .replace(/^_/, "")
    .replace(/_$/, "");
}
