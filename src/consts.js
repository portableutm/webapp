let API;
let DEBUG = false;
const adesVersion = '1.2.0';
const USERS_DATA_TOO_OLD = 2 * 60000; // Only fetch user list if saved user list is older than 2 minutes

//const hostname = window && window.location && window.location.hostname;
//console.log(`API::${process.env.ADES_API}`)
API = process.env.REACT_APP_ADESAPI || 'error';
const ISDINACIA = true;
DEBUG = process.env.REACT_APP_DEBUG || DEBUG;
const INACTIVE_TIMEOUT = 20000;

export { API, DEBUG, adesVersion, USERS_DATA_TOO_OLD, ISDINACIA, INACTIVE_TIMEOUT };