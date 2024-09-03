import './App.css';
import CustomInput from './components/CustomInput';
import Button from './components/Button';
import Container from './layout/Container';
import Text from './components/Text';
import image from './assets/advisor.png';
import Select from './components/Select';

function App() {
  return (
    <div className="App">
      <Container>
      <form class="col-span-5 flex flex-col h-full justify-center my-auto">
        <Text classNames="mb-8" type={"heading"}>Let's get started!</Text>
        <div class="flex justify-between mb-1">
          <CustomInput classNames="w-5/12" label={"First Name"} placeholder="Enter your first name"/>
          <CustomInput classNames="w-5/12" label={"Surname"} placeholder="Enter your surname"/>
        </div>
        <CustomInput classNames=" mb-2" label={"Email Address"} placeholder="Enter your Email Address"/>
        <div class="flex justify-between mb-1">
          <CustomInput classNames="w-5/12" label={"Password"} placeholder="Enter your password"/>
          <CustomInput classNames="w-5/12" label={"Confirm Password"} placeholder="Confirm your password"/>
        </div>
        
        <Select classNames=" mb-2" label={"Faculty"} options={[{value: 'science', label: 'Science'}, {value: 'commerce', label: 'Commerce'}]}/>
        <div class="flex justify-between  mb-1">
          <Select classNames="w-5/12" label={"First Major"} options={[{value: 'computerScience', label: 'Computer Science'}, {value: 'computerEngineering', label: 'Computer Engineering'}]}/>
          <Select classNames="w-5/12" label={"Second Major"} options={[{value: 'computerScience', label: 'Computer Science'}, {value: 'computerEngineering', label: 'Computer Engineering'}]}/>
        </div>
        
        <Button text={"Register"}/>
      </form>
      <img class="col-span-8 col-start-7  my-auto" src={image} alt='advisor'/>
      </Container>
    </div>
  );
}

export default App;
