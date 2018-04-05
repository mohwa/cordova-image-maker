#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const log = require('../lib/log');

const _ = require('lodash');
const ArgumentParser = require('argparse').ArgumentParser;

const packageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

// http://nodeca.github.io/argparse/#HelpFormatter.prototype.addArgument
const cliParser = new ArgumentParser({
    version: packageConfig.version,
    addHelp:true,
    description: 'cordova-image-maker cli example'
});

cliParser.addArgument(['-c', '--config'], {
    required: false,
    help: 'config.xml file path'
});

cliParser.addArgument(['-i', '--icon'], {
    required: false,
    help: 'Icon image source file path'
});

cliParser.addArgument(['-s', '--splash'], {
    required: false,
    help: 'Splash image source file path'
});

cliParser.addArgument(['-q', '--quiet'], {
    required: false,
    help: 'Not display message'
});

const args = cliParser.parseArgs();

const config = args.c || args.config;
const icon = args.i || args.icon;
const splash = args.s || args.splash;
const quiet = args.q || args.quiet;

// publish 시작
new (require('../index.js'))({config: config, icon: icon, splash: splash, quiet: quiet}).resize();