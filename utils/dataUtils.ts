import safeJSONParse from './safeJSONParse';

export function getMessageData(options: MessageData) {
  return JSON.stringify(options);
}

export function parseChannelData(data: string | null): ChannelData | null {
  return safeJSONParse(data || '');
}

export function parseMessageData(data: string | null): MessageData | null {
  return safeJSONParse(data || '');
}
