import axios from 'axios';

const apiHome = 'http://localhost:7080'
// const apiHome = 'http://www.taptrust.com/'

export async function APICall(url, params) {
	try {
		// TODO change to POST 
		const endpoint = apiHome + url
		const response = axios.get(endpoint, {params: params})
  		return response
  	} 	catch (error) {
  			return error
		}
}