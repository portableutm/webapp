import { API } from "./consts";


export const buildUrl = (relativePath) => {
	let url = `${API}`
	if(relativePath && relativePath.startsWith("/")){
		url = url.concat(relativePath.substring(1))
	}else {
		url = url.concat(relativePath)
	}
	// console.log(`Url:${url}, ${relativePath}`)
	return url
}
