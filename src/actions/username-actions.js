export const UPDATE_USERNAME = 'users:updateUserName';

export function updateUserName(userName) {
	return {
		type: UPDATE_USERNAME,
		payload: {
			userName: userName
		}
	}
}