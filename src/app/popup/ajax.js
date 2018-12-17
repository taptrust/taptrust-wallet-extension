import axios from 'axios';

// const apiHome = 'http://localhost:7080'
const apiHome = 'http://www.taptrust.com'

export function APICall(url, params) {
	try {
		// TODO change to POST 
		const endpoint = apiHome + url;
		const response = axios.post(endpoint, params)
		// alert(JSON.stringify(response, null, 4));
		return response;
		// return axios.get(endpoint, {params: params}).then(response => {
		// 	return response.data
		// })
  	} 	catch (error) {
  			return error
	}
}