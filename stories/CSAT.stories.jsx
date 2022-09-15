import { useState } from 'react';
import { View } from 'react-native';

import Button from '../components/Button';
import Component from '../components/CSAT';

export default {
  title: 'CSAT',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const CSAT = Template.bind({});
CSAT.args = {
  question: 'How was your chat experience with ShareSend?',
  score: 0,
};

export const Interactive = ({ question }) => {
  const [score, setScore] = useState(0);
  return (
    <View>
      <CSAT question={question} onSelect={setScore} score={score} />
      <Button
        title="Reset"
        onPress={() => setScore(0)}
        style={{ width: 120, marginTop: 8 }}
      />
    </View>
  );
};
Interactive.args = {
  question: 'How was your chat experience with ShareSend?',
};

export const Great = Template.bind({});
Great.args = {
  ...CSAT.args,
  score: 1,
};

export const Bad = Template.bind({});
Bad.args = {
  ...CSAT.args,
  score: -1,
};
