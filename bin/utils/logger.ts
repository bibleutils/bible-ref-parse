import { CONFIG } from '../config';

function info (...data: any): void {
	if (CONFIG.logLevel !== 'silent') console.log(...data);
}

function error (...data: any): void {
	console.error(...data);
}

export default { info, error };
