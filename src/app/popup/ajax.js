import axios from 'axios';

// const apiHome = 'http://localhost:7080'
const apiHome = 'http://www.taptrust.com/'

export function APICall(url, params) {
	try {
		// TODO change to POST 
		const endpoint = apiHome + url;
		return axios.get(endpoint, {params: params})
  	} 	catch (error) {
  			return error
		}
}