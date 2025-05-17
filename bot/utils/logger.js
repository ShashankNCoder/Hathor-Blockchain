const chalk = require('chalk');

exports.log = (msg) => console.log(chalk.blue(`[BOT] ${msg}`));
exports.success = (msg) => console.log(chalk.green(`[SUCCESS] ${msg}`));
exports.error = (msg) => console.log(chalk.red(`[ERROR] ${msg}`));
