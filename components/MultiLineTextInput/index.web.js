import { TextInput } from 'react-native';

export default function MultiLineTextInput({ onChange, ...props }) {
  const handleChange = (event) => {
    event.target.style.height = 0;
    event.target.style.height = `${event.target.scrollHeight}px`;
    onChange?.(event);
  };

  return <TextInput multiline onChange={handleChange} {...props} />;
}
