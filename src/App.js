import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var _ = require('lodash');

var possibleCombinationSum = (arr, n) => {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
  //random number between 1 and 9
  // const numberOfStars = 1 + Math.floor(Math.random() * 9);

  // store star icons in an array
  // let stars = []
  // for (let i = 0; i < numberOfStars; i++){
  // 	stars.push(<i key={i} className='fa fa-star'> </i>)
  // }

  // declarative mapping method
  let stars = _.range(1, props.numberOfStars + 1)

  return(
  <div className="col-5">
    {
      stars.map((i) =>
        <i key={i} className='fa fa-star'> </i>
      )
    }
  </div>
  );
}

const Button = (props) => {
	let button;

  switch (props.correctAns){
  	case true: button = <button className="btn btn-success" onClick={props.acceptNum}> <i className="fa fa-check"></i></button>;
    break;
    case false: button = <button className="btn btn-danger"> <i className="fa fa-times"></i></button>;
    break;
    default: button = <button className="btn btn-primary" disabled={props.ans.length === 0} onClick={props.checkAnswer}> = </button>;
    break;
  }

  return(
  <div className="col-2 text-center">
    { button }
    <br /> <br />
    <button className="btn btn-warning" onClick={props.redraw} disabled={props.trials === 0}>
      <i className="fa fa-refresh"> {props.trials} </i>
    </button>
  </div>
  );
}

const Answer = (props) => {

  return(
  <div className="col-5">

    {
        props.ans.map( (num, i) =>
            (
                <span key={i} onClick = {() => props.unselectNum(num)} >
                    {num}
                </span>
            )
        )
    }
  </div>
  );
}

const Numbers = (props) => {

  //declarative method using range with map
  const selector = (num) => {
  	if (props.usedNum.indexOf(num) >= 0) {
      return 'used';
    }
    if (props.ans.indexOf(num) >= 0) {
      return 'selected';
    }
  }

  return (
  <div className="card text-center">
    <div>
        {
          Numbers.list.map((number, i) =>
            <span key={i}
                  className={selector(number)}
                  onClick = {() => props.selectNum(number)}> {number} </span>
          )
        }

    </div>
  </div>
  );
}

//creating range as a property of Numbers since value doesnt depent on logic inside the component
Numbers.list = _.range(1, 10)

const DoneFrame = (props) => {
	return (
  	<div className="text-center">
      <h3> {props.doneStatus} </h3>
      <button onClick={props.playAgain} className="btn btn-secondary"> Play Again </button>
    </div>
  )
}

class Game extends React.Component{
  initialState = () => ({
  	selectedNumbers: [],
    numberOfStars: 1 + Math.floor(Math.random() * 9),
		correctAnswer: null,
    usedNumber: [],
    trials: 5,
    doneStatus: null,
  });

  state = this.initialState()

  selectNum = (clickedNum) => {
    if (this.state.selectedNumbers.indexOf(clickedNum) >= 0) {
      return;
    }
    this.setState( prevState => ({
    	correctAnswer: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNum)
    }));
  }

  unselectNum = (clickedNum) => {
    this.setState( prevState => ({
    	correctAnswer: null,
      selectedNumbers: prevState.selectedNumbers.filter(num => num !== clickedNum )
    }));
  }

  checkAnswer = () => {
    this.setState( prevState => ({
      correctAnswer: prevState.selectedNumbers.reduce((a, b) => a + b, 0) === prevState.numberOfStars
    }));
  }

  acceptNum = () => {
  	this.setState((prevState) => ({
    	usedNumber: prevState.usedNumber.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      correctAnswer: null,
      numberOfStars: 1 + Math.floor(Math.random() * 9)
    }), this.updateDoneStatus)
  }

  redraw = () => {
  	if (this.state.trials === 0){return;}
  	this.setState((prevState) => ({
    		selectedNumbers: [],
    		numberOfStars: 1 + Math.floor(Math.random() * 9),
				correctAnswer: null,
        trials: prevState.trials - 1,
    }), this.updateDoneStatus)
  }

  //destructure state passed into function
  isSolvable = ({usedNumber, numberOfStars}) => {
  	const unUsedNumbers = _.range(1, 10).filter(num => usedNumber.indexOf(num) === -1);
    return possibleCombinationSum(unUsedNumbers, numberOfStars);
  }

  updateDoneStatus = () => {
      this.setState(prevState => {
					if (prevState.usedNumber.length === 9){
					return {doneStatus: "Great Job"}
					}

          if (prevState.trials === 0 && !this.isSolvable(prevState)){
          	return {doneStatus: "You Lose"}
          }
      }
    )
  }

  playAgain = () => {
  	this.setState(this.initialState())
  }

  render (){
  	//refactoring so we don't call state multiple times
    const {selectedNumbers, numberOfStars} = this.state;
    return (
        <div className="container">
           <h3> Play Nine </h3>
           <hr />

           <div className="row">
             <Stars numberOfStars = {this.state.numberOfStars} />
             <Button ans = {this.state.selectedNumbers}
                     checkAnswer = {this.checkAnswer}
                     correctAns = {this.state.correctAnswer}
                     acceptNum = {this.acceptNum}
                     redraw = {this.redraw}
                     trials = {this.state.trials} />
             <Answer ans = {this.state.selectedNumbers}
                     unselectNum = {this.unselectNum} />
           </div>

           <br />

           {
           		this.state.doneStatus ? <DoneFrame doneStatus={this.state.doneStatus} playAgain={this.playAgain} /> : <Numbers ans = {this.state.selectedNumbers}
                    selectNum = {this.selectNum}
                    usedNum = {this.state.usedNumber}/>

           }

        </div>
    );
  }
  }

class App extends React.Component{
  render (){
  return (
    <div>
      <Game />
    </div>
  );
  }
}

export default App;
