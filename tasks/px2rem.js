'use strict';

module.exports = function(grunt)
{

    grunt.registerMultiTask('px2rem', 'init css min before and after', function()
    {

        // load css min task options (from px2rem options)
        var config = {};
        config[this.data.dest] = [this.data.src];
        grunt.config('cssmin.px2rem_before.files', config);
        grunt.task.run('cssmin:px2rem_before');

        // for further usage: use dest as src
        this.data.src = this.data.dest;

        // the concrete conversion
        grunt.config('px2rem_convert.options', this.options());
        grunt.config('px2rem_convert.data', this.data);
        grunt.task.run('px2rem_convert');

        // do a css min afterwards again
        var config = {};
        config[this.data.dest] = [this.data.src];
        grunt.config('cssmin.px2rem_after.files', config);
        grunt.task.run('cssmin:px2rem_after');

    });

    grunt.registerMultiTask('px2rem_convert', 'the conversion algorithm', function()
    {

        var options = this.options();

        // read file
        var src = grunt.file.read(this.data.src);

        // add an additional line break after each ; { }
        src = src.replace(/;/g, ";\n");
        src = src.replace(/\{/g, "{\n");
        src = src.replace(/\}/g, "\n}\n");

        // split up line by line
        src = src.match(/[^\r\n]+/g);

        // plan: go line by line and convert every line
        // only ignore statements, that dont have px in it (except in media queries)
        // css min puts everything together and takes care of the rest

        // this will be the final output
        var output = "";

        var inside_media_query = false;
        var inside_media_query_stack = 0;

        for (var l = 0; l < src.length; l++)
        {

            var line = src[l];

            // determine if inside media query
            if (line.indexOf('{') > -1)
            {
                inside_media_query_stack++;
            }
            if (line.indexOf('}') > -1)
            {
                inside_media_query_stack--;
            }
            if (line.indexOf('@media') > -1)
            {
                inside_media_query = true;
            }
            if (line.indexOf('}') > -1 && inside_media_query === true && inside_media_query_stack === 0)
            {
                inside_media_query = false;
            }
            //console.log(line + inside_media_query);

            // if this is not a statement
            if ((line.indexOf('{') > -1 || line.indexOf('}') > -1) && line.indexOf("/* ignore */") === -1)
            {
                output += "\n" + line + "\n";
            }

            // if this is a statement with px (or a statement inside a media query) in it
            else if (
                (line.indexOf("px") > -1 || inside_media_query === true) &&
                line.indexOf("rem") === -1 &&
                line.indexOf("/* ignore */") === -1 &&
                line.indexOf(":") > -1
            )
            {

                // find all occurences of px in string
                var positions = [];
                var regex = /px/gi;
                var result;
                while ((result = regex.exec(line)))
                {
                    positions.push(result.index);
                }

                // collect numerical data before px
                var helper = [];
                for (var p of positions)
                {
                    helper.push([]);
                    for (var i = p - 1; i >= 0; i--)
                    {
                        // if this is not numeric, skip
                        if ( line[i] != "." && (isNaN(parseFloat(line[i])) || !isFinite(line[i])) )
                        {
                            break;
                        }
                        helper[helper.length - 1].push(line[i]);
                    }
                }
                for (var h of helper)
                {
                    h.reverse();
                }
                //console.log(helper);



                // prepare replacement
                var replace = [];
                for (var h of helper)
                {
                    var px = h.join("");
                    var rem = (Math.round((px / options.base) * 100) / 100);
                    var rule = [];
                    rule["source"] = px + "px";
                    // special case: don't go below 1px
                    if (px == 1)
                    {
                        rule["target"] = px + "px";
                    }
                    else
                    {
                        rule["target"] = rem + "rem";
                    }
                    replace.push(rule);
                }

                //console.log(replace);

                for (var r of replace)
                {
                    // replace only first occurence
                    line = line.replace(r["source"], r["target"]);
                }

                output += "\n" + line + "\n";

            }
        }

        // finally add resizer tags
        var resizer = [];
        for (var i = options.iterations; i > 0; i--)
        {
            resizer.push('@media screen and (max-width: ' + (options.init + (i * 10)) + 'px) { html { font-size: ' + (options.base + (i * options.smoothness)) + 'px; } } ');
        }
        for (var i = 0; i < options.iterations; i++)
        {
            resizer.push('@media screen and (max-width: ' + (options.init - (i * 10)) + 'px) { html { font-size: ' + (options.base - (i * options.smoothness)) + 'px; } } ');
        }
        output += "\n" + resizer.join(" ");

        grunt.file.write(this.data.dest, output);
        grunt.log.writeln('File "' + this.data.dest + '" created.');

    });

};