const wsf2vbs = require('../index');
var fs = require('fs');
var path = require('path');
var chai = require('chai');
var assert = chai.assert;
let wsfPath = path.join(__dirname, '/test.wsf');
let debug = false;
let vbsOut1 = '';
let vbsOut2 = '';
describe('wsf2vbs: WSF to VBS conversion tests', function() {

    it('Convert WSF file to VBS file', function() {
        wsf2vbs.extract(wsfPath, debug).then((vbs)=>{
            vbsOut1 = vbs;
            if (debug) console.log('extract->out:', vbs);
            fs.writeFileSync(path.join(__dirname, 'test_out_extract.vbs'), vbs);
        }).catch((error)=>{
            console.error(error)
        })
    })

    it('Convert WSF file content to VBS file', async function() {
        let xml = await fs.readFileSync(wsfPath).toString();
        assert.equal(xml.substr(0, 5), '<?xml')
        wsf2vbs.extractFromStr(xml, __dirname, debug).then((vbs)=>{
            vbsOut2 = vbs;
            if (debug) console.log('extractStr->out:', vbs);
            fs.writeFileSync(path.join(__dirname, 'test_out_extractStr.vbs'), vbs);
        }).catch((error)=>{
            console.error(error)
        })
    })

});