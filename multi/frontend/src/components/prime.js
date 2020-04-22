import React, {Component } from 'react'
import axios from 'axios';


class Prime extends Component {
	constructor(props){
		super(props)

		this.state = {
			num: '',
			result: 0
		}
	};

	handleNumChange = (event) => {
		this.setState({
			num: event.target.value
		})
	};

	handleSubmit = async (event) => {
		event.preventDefault();
		const helloResponse = axios.get(`/api/${this.state.num}`);
		this.state.result = helloResponse.data;
		this.setState({
			result: this.state.result
		})
		console.log(helloResponse);
	};


	render() {
		const {result} = this.state
		return(
			<form onSubmit={this.handleSubmit}>
				<div>
					<label>Number </label>
					<input
					type="text"
					value={this.state.num}
					onChange={this.handleNumChange}
					/>
					<button style= {{marginLeft :15}} type="submit"> Liczba pierwsza? </button>
					<br/>
					{result}
				</div>
			</form>
		)
	}
}

export default Prime
