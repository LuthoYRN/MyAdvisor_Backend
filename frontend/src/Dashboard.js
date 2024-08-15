import React from 'react';
import Container from './layout/Container';
import account from './assets/account_circle.svg';
import robot from './assets/robot.svg';
import Text from './components/Text';
import uct from './assets/uct.png';


const Dashboard = () => {
    return (
        <div class="grid grid-rows-10 grid-cols-12 m-14 gap-14 h-svh my-auto">
        <div class="col-span-2 row-span-10 ">
            <div class="flex flex-col h-full my-auto bg-primary p-4 rounded-2xl ">
                <img class="mt-4" src={uct} alt="uct" />
            </div>
            </div>
        <div class="col-span-10 row-span-2 ">
            <div class="flex items-center h-full">
                <img src={account} alt="account" class="h-5/6"/>
                <div class="flex flex-col justify-center bg-white rounded-2xl shadow-xl p-4 ml-4 my-4 w-full h-5/6">
                    <Text type="paragraph">Jared Petersen</Text>
                    <Text type="paragraph">B.Com Computer Science and Information Systems</Text>
                    <Text type="paragraph">2nd Year</Text>
                </div>

            </div>
        </div>
        <div class="grid grid-cols-2 gap-14 col-span-10 justify-between col-start-3  row-span-8">
            <div class="flex items-center  rounded-2xl bg-white shadow-xl">
                <div class="flex -p-4">
                    <img src={robot} alt="SMART Advisor" class="h-1/2"/>
                    <Text classNames="my-auto" type="heading">SMART Advisor</Text>
                </div>

                <div  class="border-b border-gray-500 p-[-16px]"></div>
            </div>
            <div class="flex items-center  p-4 rounded-2xl bg-white shadow-xl">
            </div>
        </div>
        </div>

    );
};

export default Dashboard;   