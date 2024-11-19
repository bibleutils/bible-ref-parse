import { CONFIG } from '../config';

function info (...data: any): void {
	if (CONFIG.logLevel !== 'silent') console.log(...data);
}

function warn (...data: any): void {
	if (CONFIG.logLevel !== 'silent') console.warn(...data);
}

function error (...data: any): void {
	console.error(...data);
}

export default { info, warn, error };
