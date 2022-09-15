import { ReactElement } from 'react';
import Svg, { Path } from 'react-native-svg';

import BrandAvatar from '../BrandAvatar';
import Image from '../Image';

const WarningIcon = () => (
  <Svg width={14} height={14} fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.583 12.28 7.03 1.166l6.446 11.112H.583Zm5.834-3.442v-3.5h1.166v3.5H6.417Zm0 1.167c0-.323.26-.584.583-.584h.006a.583.583 0 1 1 0 1.167H7a.583.583 0 0 1-.583-.583Z"
      fill="#D9352C"
    />
  </Svg>
);

function BookmarkIcon() {
  return (
    <Svg width="14" height="14" fill="none" viewBox="0 0 14 14">
      <Path
        fill="#2658B6"
        fillRule="evenodd"
        d="M7.336 2.042a2.379 2.379 0 00-1.846.693l-3.83 3.83c-.923.924-.933 2.411-.022 3.322l2.475 2.475c.91.912 2.398.901 3.322-.022l3.83-3.83a2.379 2.379 0 00.693-1.846l-.162-2.312a2.31 2.31 0 00-2.148-2.148l-2.312-.162zm.489 4.133a1.167 1.167 0 101.65-1.65 1.167 1.167 0 00-1.65 1.65z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

function AnnouncementIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6752 1.5981C11.9086 1.66064 12.0471 1.90054 11.9845 2.13393L11.771 2.93077C11.7085 3.16416 11.4686 3.30267 11.2352 3.24013C11.0018 3.1776 10.8633 2.9377 10.9258 2.70431L11.1393 1.90746C11.2019 1.67407 11.4418 1.53556 11.6752 1.5981ZM9.25662 2.58754C8.86416 1.90776 7.92587 1.80171 7.39159 2.37673L3.62995 6.42512C3.76119 6.54418 3.87643 6.68529 3.96977 6.84699L5.4281 9.37288C5.52145 9.53458 5.58607 9.70497 5.62354 9.87816L11.0104 8.64464C11.7755 8.46947 12.1528 7.60386 11.7603 6.9241L9.25662 2.58754ZM4.57807 9.75747L3.11974 7.23158C2.87811 6.8131 2.34297 6.66971 1.92446 6.91133C1.50596 7.15294 1.36257 7.6881 1.60419 8.10658L3.06252 10.6325C3.30414 11.051 3.83929 11.1944 4.2578 10.9528C4.6763 10.7112 4.81969 10.176 4.57807 9.75747ZM7.99709 12.3356L6.88677 10.4125L8.67154 10.0038L9.51265 11.4606C9.75427 11.8791 9.61088 12.4143 9.19234 12.6559C8.77386 12.8975 8.23871 12.7541 7.99709 12.3356ZM12.6283 4.41572C12.3949 4.35318 12.155 4.49168 12.0925 4.72508C12.03 4.95847 12.1684 5.19836 12.4018 5.2609L13.1987 5.47442C13.4321 5.53695 13.672 5.39845 13.7345 5.16506C13.7971 4.93166 13.6586 4.69177 13.4252 4.62923L12.6283 4.41572Z"
        fill="#019C6E"
      />
    </Svg>
  );
}

type HeaderType = NonNullable<MessageData['header']>['type'];

const headerIconMap: Record<HeaderType, ReactElement> = {
  warning: <WarningIcon />,
  bookmark: <BookmarkIcon />,
  announcement: <AnnouncementIcon />,
  news: <Image source={require('../../assets/ic-category-news.png')} style={{ width: 14, height: 14 }} />,
  tip: <Image source={require('../../assets/ic-category-tip.png')} style={{ width: 14, height: 14 }} />,
  card: <Image source={require('../../assets/ic-category-card.png')} style={{ width: 14, height: 14 }} />,
  people: <Image source={require('../../assets/ic-category-people.png')} style={{ width: 14, height: 14 }} />,
  tag: <Image source={require('../../assets/ic-category-tag.png')} style={{ width: 14, height: 14 }} />,
  stock: <Image source={require('../../assets/ic-category-stock.png')} style={{ width: 14, height: 14 }} />,
  bank: <Image source={require('../../assets/ic-category-bank.png')} style={{ width: 14, height: 14 }} />,
  ww: (
    <Image
      source={require('../../assets/avatars/live-events.png')}
      style={{ width: 14, height: 14, borderRadius: 7 }}
    />
  ),
  reminder: <BrandAvatar type="notifications" size={14} />,
  promotions: <BrandAvatar type="promotions" size={14} />,
};

export default headerIconMap;
