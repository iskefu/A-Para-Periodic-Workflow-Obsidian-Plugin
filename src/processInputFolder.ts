export async function processFolder(str: string) {
	// 定义非法字符和保留名称，注意我们已经从非法字符中去掉了 '/'
	const ILLEGAL_CHARACTERS = /[<>:"|?*]/g;
	const RESERVED_NAMES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

	// 去掉首尾空格，将所有非法字符替换为下划线
	let processedStr = str.trim().replace(ILLEGAL_CHARACTERS, "_");

	// 将多个连续的 '\\' 或 '/' 替换为单个 '/'
	processedStr = processedStr.replace(/\\+/g, "/").replace(/\/+/g, "/");
	// 如果处理后的字符串是保留名称，添加下划线
	if (RESERVED_NAMES.test(processedStr)) {
		processedStr = "_" + processedStr;
	}
	return processedStr;
}
