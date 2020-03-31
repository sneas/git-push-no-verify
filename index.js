#!/usr/bin/env node

const { spawn } = require("child_process");

function pushUpstream(gitPushSetUpstreamCommand) {
    const arguments = gitPushSetUpstreamCommand.split(' ');
    arguments.shift();

    const gitPush = spawn('git', arguments, {stdio: [process.stdin, process.stdout, process.stderr]});
    gitPush.on('close', code => process.exitCode = code);
}

function push() {
    let gitPushSetUpstreamCommand = '';

    const gitPush = spawn('git', ['push', '--no-verify'], {stdio: [process.stdin, process.stdout]});

    gitPush.stderr.on('data', (data) => {
        const upstream = data.toString().match(/git push --set-upstream.+/gim);

        if (upstream) {
            gitPushSetUpstreamCommand = `${upstream.pop()} --no-verify`;
        }

        process.stderr.write(data);
    });

    gitPush.on('close', (code) => {
        if (code === 128 && gitPushSetUpstreamCommand) {
            console.log('Automatically setting upstream...');
            console.log(`Running ${gitPushSetUpstreamCommand}\n`);
            pushUpstream(gitPushSetUpstreamCommand);
            return;
        }

        process.exitCode = code;
    });
}

push();
