import axios from 'axios';

const apiHome = 'http://localhost:7080'
// const apiHome = 'http://www.taptrust.com/'

export async function APICall(url, params) {
	try {
		const response = axios.get(apiHome + url, {params: params})
  		return response
  	} 	catch (error) {
  			return error
		}
}