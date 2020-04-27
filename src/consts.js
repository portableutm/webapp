let API;
const adesVersion = '0.1.0';

//const hostname = window && window.location && window.location.hostname;
//console.log(`API::${process.env.ADES_API}`)
API = process.env.REACT_APP_ADES_API || 'http://161.35.12.214:3000/';

export {API, adesVersion}