
import chalk from "chalk";
import * as fs from "fs";
import { config } from "../../index";

type LogType = "errors" | "service" | "actions" | "connections";

const console_colors: object | any  = {
    'service': 'green',
    'errors': 'red',
    'actions': 'magenta',
    'connections': 'yellow',
}

/**
 * This will colorize and prettify console content
 * @param log_type type of log
 * @param contents type of contents
 * @returns string
 */
function edit_ConsoleLogContent(log_type: LogType, contents: string): string {

    const dateString: string = chalk.yellow(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`);
    const logString: string = chalk[console_colors[log_type]](`[${log_type.toUpperCase()}]`);

    return `${dateString} ${logString} ${contents}`;

}

/**
 * This will prettify the content of a string into something that can be formatted in a .log file
 * @param log_type string
 * @param contents string
 * @returns string
 */
function edit_LogContent(log_type: LogType, contents: string): string {

    const dateString: string = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`;
    const logString: string = `[${log_type.toUpperCase()}]`;

    return `${dateString} ${logString} ${contents}`;

}

/**
 * This will log into a log file, and will log into console if console_log is true
 * @param log_type string
 * @param contents string
 * @param console_log boolean
 */
export function write_to_logs(log_type: LogType, contents: string, console_log: boolean = false): void {

    const log_contents: string = edit_ConsoleLogContent(log_type, contents);
    contents = edit_LogContent(log_type, contents);

    console.log(log_contents);

}
