let API;
let DEBUG = false;
const adesVersion = '1.0.0-DEV';
const USERS_DATA_TOO_OLD = 2 * 60000; // Only fetch user list if saved user list is older than 2 minutes

//const hostname = window && window.location && window.location.hostname;
//console.log(`API::${process.env.ADES_API}`)
API = process.env.REACT_APP_ADESAPI || 'http://68.183.22.43:3000/';
DEBUG = process.env.REACT_APP_DEBUG || DEBUG;

export { API, DEBUG, adesVersion, USERS_DATA_TOO_OLD };