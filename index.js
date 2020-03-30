#!/usr/bin/env node

const { exec } = require("child_process");

const pushUpstream = (prevError, prevStderr) => {
    const gitPush = prevStderr.match(/git push --set-upstream.+/gim).pop();

    if (!gitPush) {
        process.stderr.write(prevStderr);
        process.exit(prevError.code);
        return;
    }

    exec(`${gitPush} --no-verify`, (error, stdout, stderr) => {
        process.stdout.write(stdout);
        process.stderr.write(stderr);
        process.exit(error ? error.code : 0);
    });
};

exec('git push --no-verify', (error, stdout, stderr) => {
    if (error && error.code === 128) {
        pushUpstream(error, stderr);
        return;
    }

    process.stdout.write(stdout);
    process.stderr.write(stderr);
    process.exit(error ? error.code : 0);
});
