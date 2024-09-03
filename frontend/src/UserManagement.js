import React from 'react';
import Main from './layout/Main';
import Text from './components/Text';
import CustomInput from './components/CustomInput';
import search from './assets/search.svg';
import Select from './components/Select';
import Button from './components/Button';
import Table from './components/Table';


const UserManagement = () => {
  const mockData = [
    {
      "id": 1,
      "first_name": "Isador",
      "last_name": "Kruger",
      "email": "ikruger0@huffingtonpost.com",
      "user_permission": "student"
    },
    {
      "id": 2,
      "first_name": "Brady",
      "last_name": "Gommery",
      "email": "bgommery1@amazon.de",
      "user_permission": "advisor"
    },
    {
      "id": 3,
      "first_name": "Boycie",
      "last_name": "Drei",
      "email": "bdrei2@uol.com.br",
      "user_permission": "student"
    },
    {
      "id": 4,
      "first_name": "Connie",
      "last_name": "Wooffinden",
      "email": "cwooffinden3@desdev.cn",
      "user_permission": "advisor"
    }]


const defaultColumns = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'First Name',
    accessorKey: 'first_name',
  },
    {
        header: 'Last Name',
        accessorKey: 'last_name',
    },
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: "User Permission",
        accessorKey: "user_permission",
    },
  
   
]

    return (
        <Main>
            <Text type="heading" classNames="mb-16">User Management</Text>
            
            <Table classNames="" Tabledata={mockData} column={defaultColumns}/>
        </Main>
    );
};

export default UserManagement;