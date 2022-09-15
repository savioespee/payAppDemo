import axios from 'axios';

export default function logError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(error.toJSON());
    console.error(`Response body: ${JSON.stringify(error.response?.data)}`);
  } else {
    console.error(error);
  }
}
