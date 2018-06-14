const gulp = require('gulp');
const typedoc = require('gulp-typedoc');

gulp.task("default", ["typedoc"]);

gulp.task("typedoc", function () {
    gulp.src([
        "src/VirtualGoogleAssistant.ts"
    ]).pipe(typedoc({
            // TypeScript options (see typescript docs)
            excludePrivate: true,
            excludeNotExported: true,
            excludeExternals: true,
            module: "commonjs",
            gaID: "UA-99287066-2",
            gaSite: "docs.bespoken.io",
            mode: "file",
            name: "Bespoken Virtual Google Assistant",
            readme: "README.md",
            target: "ES6",
            out: "docs/api",
            version: true
        })
    );
});
