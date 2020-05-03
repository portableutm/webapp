let API;
const adesVersion = '0.1.1';
const USERS_DATA_TOO_OLD = 2 * 60000; // Only fetch user list if saved user list is older than 2 minutes

//const hostname = window && window.location && window.location.hostname;
//console.log(`API::${process.env.ADES_API}`)
API = process.env.REACT_APP_ADES_API || 'http://161.35.12.214:3000/';


export {API, adesVersion, USERS_DATA_TOO_OLD};