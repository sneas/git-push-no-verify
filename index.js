#!/usr/bin/env node

const { spawn, spawnSync } = require("child_process");

function pushUpstream() {
    const getBranchResult = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

    if (getBranchResult.status != 0) {
        console.error(`Error while getting the branch name`);
        process.stderr.write(getBranchResult.stderr);
        process.exitCode = getBranchResult.status;
        return;
    }

    const arguments = ['push', '--set-upstream', 'origin', getBranchResult.stdout.toString().trim(), '--no-verify'];

    console.log(`$ git ${arguments.join(' ')}\n`);

    const gitPush = spawn('git', arguments, {stdio: [process.stdin, process.stdout, process.stderr]});
    gitPush.on('close', code => process.exitCode = code);
}

function push() {
    const gitPush = spawn('git', ['push', '--no-verify'], { stdio: [process.stdin, process.stdout, process.stderr] });

    gitPush.on('close', (code) => {
        if (code === 128) {
            console.log('Adding upstream...\n');
            pushUpstream();
            return;
        }

        process.exitCode = code;
    });
}

push();
