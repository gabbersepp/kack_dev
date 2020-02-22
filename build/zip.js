var fs = require('fs');
var archiver = require('archiver');

var fileName =   'test.zip'
var fileOutput = fs.createWriteStream(fileName);
const archive = archiver('zip');

fileOutput.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.pipe(fileOutput);
//archive.glob("./dist/**/*"); //some glob pattern here
archive.directory('dist/', false, d => {
    if (d.name.indexOf("images") > -1) {
        return false;
    }
    return d;
});
//archive.glob("../dist/.htaccess"); //another glob pattern
// add as many as you like
archive.on('error', function(err){
    throw err;
});
archive.finalize();