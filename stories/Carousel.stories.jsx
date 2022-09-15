import Component from '../components/Carousel';

export default {
  title: 'Carousel',
  component: Component,
};

const Template = (args) => <Component {...args} />;

export const Carousel = Template.bind({});
Carousel.args = {
  onItemSelect: () => new Promise((resolve) => setTimeout(resolve, 2000)),
  data: [
    {
      localImageName: 'chocolate-box-silver.jpg',
      name: 'Chocolate Lover Birthday Box - Silver',
      price: '$100',
    },
    {
      localImageName: 'chocolate-box-gold.jpg',
      name: 'Chocolate Lover Birthday Box - Gold',
      price: '$150',
    },
  ],
};

export const Selected = Template.bind({});
Selected.args = {
  data: [
    {
      localImageName: 'chocolate-box-silver.jpg',
      name: 'Chocolate Lover Birthday Box - Silver',
      price: '$100',
      isSelected: true,
    },
    {
      localImageName: 'chocolate-box-gold.jpg',
      name: 'Chocolate Lover Birthday Box - Gold',
      price: '$150',
    },
  ],
};
