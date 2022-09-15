import Component from '../components/OrderConfirmation';

export default {
  title: 'OrderConfirmation',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const OrderConfirmation = Template.bind({});
OrderConfirmation.args = {
  price: '$60',
  product: 'Sushi Son Dinner set-A with coke',
  paymentMethod: 'Visa 5454',
  address: '1995 Nassau Dr., Vancouver, BC V5P 3Z2',
  title: 'Purchase confirmation',
  localImageName: 'sushi.jpg',
};
