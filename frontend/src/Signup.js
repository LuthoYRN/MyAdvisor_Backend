import './App.css';
import React from 'react';
import CustomInput from './components/CustomInput';
import Button from './components/Button';
import Container from './layout/Container';
import Text from './components/Text';
import image from './assets/advisor.png';
import Select from './components/Select';

function App() {
  const [firstName, setFirstName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [faculty, setFaculty] = React.useState("");
  const [firstMajor, setFirstMajor] = React.useState("");
  const [secondMajor, setSecondMajor] = React.useState("");
  const [thirdMajor, setThirdMajor] = React.useState("");


  const handleFirstNameChange = (value) => {
    setFirstName(value);
  };

  const handleSurnameChange = (value) => {
    setSurname(value);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
  };

  const handleFacultyChange = (value) => {
    setFaculty(value);
  };

  const handleFirstMajorChange = (value) => {
    setFirstMajor(value);
  };

  const handleSecondMajorChange = (value) => {
    setSecondMajor(value);
  };

  const handleThirdMajorChange = (value) => {
    setThirdMajor(value);
  };
  
  const handleRegister = () => {
    const data = {
      name: firstName,
      surname: surname,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      faculty: faculty,
      firstMajor: firstMajor,
      secondMajor: secondMajor,
      thirdMajor: thirdMajor
    };
    window.location.href = '/CourseSelection';
  
  }

  return (
    <div className="App">
      <Container>
      <form class="col-span-5 flex flex-col h-full justify-center my-auto">
        <Text classNames="mb-8" type={"heading"}>Let's get started!</Text>
        <div class="flex justify-between mb-1">
          <CustomInput classNames="w-5/12" label={"First Name"} placeholder="Enter your first name" onChange={handleFirstNameChange} />
          <CustomInput classNames="w-5/12" label={"Surname"} placeholder="Enter your surname" onChange={handleSurnameChange} />
        </div>
        <CustomInput classNames=" mb-2" label={"Email Address"} placeholder="Enter your Email Address" onChange={handleEmailChange} />
        <div class="flex justify-between mb-1">
          <CustomInput classNames="w-5/12" label={"Password"} placeholder="Enter your password" onChange={handlePasswordChange} />
          <CustomInput classNames="w-5/12" label={"Confirm Password"} placeholder="Confirm your password" onChange={handleConfirmPasswordChange} />
        </div>
        
        <Select classNames=" mb-2" label={"Faculty"} options={[{value: 'science', label: 'Science'}, {value: 'commerce', label: 'Commerce'}]} onChange={handleFacultyChange} />
        <div class="flex justify-between  mb-1">
          <Select classNames="w-5/12" label={"First Major"} options={[{value: 'computerScience', label: 'Computer Science'}, {value: 'computerEngineering', label: 'Computer Engineering'}]} onChange={handleFirstMajorChange} />
          <Select classNames="w-5/12" label={"Second Major"} options={[{value: 'computerScience', label: 'Computer Science'}, {value: 'computerEngineering', label: 'Computer Engineering'}]} onChange={handleSecondMajorChange} />
          <Select classNames="w-5/12" label={"Third Major"} options={[{value: 'computerScience', label: 'Computer Science'}, {value: 'computerEngineering', label: 'Computer Engineering'}]} onChange={handleThirdMajorChange} />
        </div>
        
        <Button text={"Register"} onClick={handleRegister} />
      </form>
      <img class="col-span-8 col-start-7  my-auto" src={image} alt='advisor' />
      </Container>
    </div>
  );
}

export default App;
