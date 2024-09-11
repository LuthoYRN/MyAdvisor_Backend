import React from 'react';
import account from '../assets/account_circle.svg';
import notification from '../assets/notification.svg';
import Text from './Text';
import { useNavigate } from 'react-router-dom';

const Header = ({user, info, subinfo, imgSrc}) => {
  let navigate = useNavigate();
    return (
        <div class="flex items-center h-full bg-white rounded-2xl shadow-xl mb-10">
            <img src={account} alt="account" class="ml-4" />
            <div class="flex flex-col justify-center  p-4 ml-4 my-4 w-full h-5/6">
              <Text type="sm-heading">{user}</Text>
              <Text type="sm-subheading" classNames="mt-2">
                {info}
              </Text>
              <Text type="sm-subheading">{subinfo}</Text>
            </div>
            <img src={notification} alt="notification" class="mr-12 cursor-pointer" onClick={()=> {navigate("/notifications")}}/>
          </div>
    );
};

export default Header;