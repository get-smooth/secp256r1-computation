import childProcess from "child_process";

/**
 * Executes a shell command and returns its output as a string.
 *
 * @param {string} command A shell command to execute
 * @return {Promise<string>} A promise that resolve to the output of the shell command, or an error
 *
 * @example
 * const output = await execute("ls -alh");
 */
function execute(command) {
    return new Promise(function (resolve, reject) {
        /**
         * @param {Error} error An error triggered during the execution of the childProcess.exec command
         * @param {string|Buffer} standardOutput The result of the shell command execution
         * @param {string|Buffer} standardError The error resulting of the shell command execution
         * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
         */
        childProcess.exec(command, function (error, standardOutput, standardError) {
            if (error) {
                reject();
                return;
            }

            if (standardError) {
                reject(standardError);
                return;
            }

            resolve(standardOutput);
        });
    });
}

export default execute;
