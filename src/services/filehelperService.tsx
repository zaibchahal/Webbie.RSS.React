import axios from "axios";
import { API_BASE_URL, BASE_URL, FILE_URLS } from "../common/RssData/constants";
import { store } from "../store";
import api from "./baseService";

export const uploadFile = async (prop: IFileProp) => {
	const accessToken = store.getState().session.Session.accessToken;
	const formData = new FormData();
	formData.append('file', prop.file);
	console.log(prop);
	formData.append('prevFile', prop.prevFile);
	formData.append('subFolder', prop.subFolder);
	try {
		const response = await axios.post(BASE_URL + '/File/UploadFile', formData, {
			//const response = await axios.post(FILE_URLS.UploadFile, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${accessToken}`,
			}
		});
		return response.data.result;
	} catch {
		return 0;
	}
};
export const deleteFile = async (path: string) => {
	try {
		const response = await api.delete(FILE_URLS.Delete + '?path=' + path);
		return response.data.result;
	} catch {
		return 0;
	}
};

export interface IFileProp {
	file: any,
	prevFile: string,
	subFolder: string
}