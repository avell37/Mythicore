import axios from 'axios';
import { SERVER_URL } from '../lib/constants/api.config';

export const baseAxios = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true,
});
