import './App.css';
import CustomInput from './components/CustomInput';
import Button from './components/Button';
import Container from './layout/Container';
import Text from './components/Text';
import image from './assets/advisor.png';
import Select from './components/Select';
import Progress from './components/Progress';
import Checkbox from './components/Checkbox';

function App() {
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
