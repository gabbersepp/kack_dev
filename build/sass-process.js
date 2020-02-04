const sass = require('sass');
const fs = require('fs-extra');
const path = require('path');
// create dist folder
function transform(scssPath, cssPath) {
    console.log(`Watching ${path.dirname(scssPath)}...`);
    //Encapsulate rendered css from scssPath into watchResult variable
    const watchResult = sass.renderSync({file: scssPath});
    //Then write result css string to cssPath file
    fs.writeFile(cssPath, watchResult.css.toString())
    .catch(error => console.error(error))
}

module.exports = (scssPath, cssPath) => {
    console.log(`Transforming '${scssPath}' to '${cssPath}'`)
    transform(scssPath, cssPath);

    if (process.env.SASSWATCH == 1) {
        console.log("starting watch task for sass");
        //Watch for changes to scssPath directory...
        fs.watch(path.dirname(scssPath), () => {
            transform(scssPath, cssPath);
        });
    }
}