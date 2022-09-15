export default function safeJSONParse(text: string | null | undefined) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}
