import './App.css';
import CustomInput from './components/CustomInput';
import Button from './components/Button';
import Container from './layout/Container';
import Text from './components/Text';
import image from './assets/advisor.png';
import Select from './components/Select';
import Progress from './components/Progress';
import Checkbox from './components/Checkbox';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [courses, setCourses] = useState([]);
  const studentID = '80c0f9a9-5479-4cfb-aec2-5300c4bba7d8'; // Replace with dynamic student ID if needed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/auth/signup/${studentID}/courses`);
        const data = await response.json();
        if (data.status === 'success') {
          setCourses(data.courses);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [studentID]);


  return (
    <div className="App">
      <Container>
      <form class="col-span-4 flex flex-col h-full justify-center my-auto">
        <Text  type={"heading"}>Course Information</Text>
        <Text classNames="mb-8" type={"subheading"}>Select the courses you completed</Text>
        <Progress classNames="mb-8"/>
        <div class="flex items-center">
           <Checkbox/>
           <Select  options={[{value: 'science', label: 'Science'}, {value: 'commerce', label: 'Commerce'}]}/>
        </div>
        <div class="flex items-center">
           <Checkbox />
           <Select  options={[{value: 'science', label: 'Science'}, {value: 'commerce', label: 'Commerce'}]}/>
        </div>
        <div class="flex items-center">
           <Checkbox />
           <Select  options={[{value: 'science', label: 'Science'}, {value: 'commerce', label: 'Commerce'}]}/>
        </div>
        <div class="flex items-center">
           <Checkbox />
           <Select  options={[{value: 'science', label: 'Science'}, {value: 'commerce', label: 'Commerce'}]}/>
        </div>
        
        
        <Button text={"Register"}/>
      </form>
      <img class="col-span-8 col-start-7  my-auto" src={image} alt='advisor'/>
      </Container>
    </div>
  );
}

export default App;
