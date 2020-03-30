#!/usr/bin/env node

const { exec } = require("child_process");

const pushUpstream = (prevError, prevStderr) => {
    const gitPush = prevStderr.match(/git push --set-upstream.+/gim).pop();

    if (!gitPush) {
        console.error(prevStderr);
        process.exit(prevError.code);
        return;
    }

    exec(`${gitPush} --no-verify`, (error, stdout, stderr) => {
        if (!error) {
            console.log(stdout);
            return;
        }

        console.error(stderr);
        process.exit(error.code);
    });
};

exec('git push --no-verify', (error, stdout, stderr) => {
    if (!error) {
        console.log(stdout);
        return;
    }

    if (error.code === 128) {
        pushUpstream(error, stderr);
        return;
    }

    console.error(stderr);
    process.exit(stderr.code);
});
