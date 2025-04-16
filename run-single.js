const Jasmine = require('jasmine'),
    jasmine = new Jasmine(),
    fs = require('fs'),
    path = require('path'),
    process = require('process'),
    mesen = require('./util/mesen');

// DO NOT REMOVE
require('./util/jasmine-boot');

const logInfo = function() { console.info.apply(this, ['[nes-test]', ...arguments]) }

if (process.argv.length !== 3 || process.argv.indexOf('--help') !== -1 || process.argv.indexOf('-h') !== -1) {
    logInfo('Usage: ./nes-test (path-to-test-files)');
    logInfo('Version: ' + require('./package.json').version);
    process.exit(1);
}

if (!fs.existsSync(path.join(process.cwd(), process.argv[2]))) {
    logInfo('The requested directory does not exist!');
    process.exit(1);
}

jasmine.loadConfig({
    spec_dir: "",
    spec_files: [process.argv[2]],
    stopSpecOnExpectationFailure: false,
    // Meh.
    random: false,
    jsLoader: 'require',
    // Have to guess the path from where the jasmine module inits. Ugly, but it works.
    // This overrides require (forced above) to load NesTest w/o it being installed locally.
    requires: ['../../../util/jasmine-boot.js', '../../../util/jasmine-matchers.js']
});


mesen.ensureMesenAvailable().then(() => {
    logInfo('Running all tests in', process.argv[2]);
    jasmine.execute();
});