var path = require("path");
const vbspretty = require('vbspretty');
const wsf2json = require('wsf2json');

const newline = path.sep === '/' ? '\n' : '\r\n';

const extractVbsFromWsfJSON = (jobs) => {
    let vbsOut = `' ======== START ======== ${newline}`
    vbsOut += jobs.reduce((vbs, job)=>{
        let { id, script, runtime } = job;
        vbs += newline;
        if (id) {
            vbs += `' ================================== Job: ${id} ================================== ${newline}`
        }
        if (script) {
            vbs += script.reduce((s, scr)=>{
                let {type, src, language, value} = scr;
                if (type) {
                    s += `' ================= ${type}`
                    if (type === 'src') {
                        s += ` : ${src}`
                    } else {
                        s += ` script`
                    }
                    s += ` ================= ${newline}`
                }
                if (language.toLowerCase() === "vbscript" && value) {
                    s += value;
                }
                return s;
            }, '');
        }
        //Inject arguments usage
        if (runtime) {
            let usage = runtime.reduce((str, param)=>{
                let {name, helpstring} = param;
                str += `Wscript.Echo "/${name}:  ${helpstring}"\r\n`;
                return str;
            },'');
            vbs = vbs.replace('WScript.Arguments.ShowUsage', usage);
        }
        return vbs;
    },`' vbs file generated from wsf file using wsf2vbs npm package ${newline}`);
    return vbsOut + ` ${newline}' ======== END ========`
}

const prettify = (vbs) => {

    var sourcePretty = vbspretty({
        level: 0,
        indentChar: '\t',
        breakLineChar: '\r\n',
        breakOnSeperator: false,
        removeComments: false,
        source: vbs,
    });

    return sourcePretty;
}

const extract = (wsfPath='', debug) => {
    return wsf2json.parseWSF(wsfPath, debug).then((json) => {
        if (debug) console.log('json output', json);
        return prettify(extractVbsFromWsfJSON(json));
    })
}

const extractFromStr = (wsfStr='', baseDir, debug) => {
    return wsf2json.parseWSFStr(wsfStr, baseDir, debug).then((json)=> {
        if (debug) console.log('json output', json);
        return prettify(extractVbsFromWsfJSON(json));
    })
}

module.exports = { extract, extractFromStr }
