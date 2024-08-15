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
      <form class="col-span-3 flex flex-col h-full justify-center my-auto">
        <Text classNames="mb-8" type={"heading"}>Login</Text>
        <CustomInput label={"Username"} placeholder="Enter your username"/>
        <CustomInput label={"Password"} placeholder="Enter your password"/>
        <Select label={"Role"} options={[{value: 'student', label: 'Student'}, {value: 'advisor', label: 'Advisor'}]}/>
        <Button text={"Login"}/>
        <Text classNames="mt-2" type={"paragraph"}>Don't have an account? Sign up</Text>
      </form>
      <img class="col-span-8 col-start-7  my-auto" src={image} alt='advisor'/>
      </Container>
    </div>
  );
}

export default App;
