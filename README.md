# Windows Script File (WSF) to Visual Basic Script (VBS) converter
A tiny package to efficiently convert WSF file into VBS file.

Assuming a simple wsf with below content:
```xml
<?xml version="1.0" ?>
<?job error="true" debug="true" ?>
<package>
    <job id="job1">
        <runtime>
            <named helpstring="Enter the Script to exeucte" name="script" />
            <named helpstring="Enter the Msg" name="msg" />
        </runtime>
        <script language="VBScript" name="script" >
            Dim script
            'Read and assess the parameter supplied
            if WScript.Arguments.named.exists("script") Then
                WScript.Echo "Argument received: " & WScript.Arguments.named("script")
                script = WScript.Arguments.named("script")
            Else
                WScript.Arguments.ShowUsage
                WScript.Quit
            End If
        </script>
        <script language="VBScript" src="scripts\FS.vbs" />
    </job>

    <job id="job2">
        <runtime>
            <named helpstring="Enter the Str" name="str" />
        </runtime>
        <script language="VBScript" >
            Wscript.Echo "We are in Job2"
        </script>
    </job>
</package>
```

The generated VBS would be:

the responding output jscript file is like ：
```vbs
' ======== START ======== 
' vbs file generated from wsf file using wsf2vbs npm package 

' ================================== Job: job1 ================================== 
' ================= inline script ================= 

Dim script
'Read and assess the parameter supplied
If WScript.Arguments.named.exists("script") Then
	WScript.Echo "Argument received: " & WScript.Arguments.named("script")
	script = WScript.Arguments.named("script")
Else
	Wscript.Echo "/script:  Enter the Script to exeucte"
	Wscript.Echo "/msg:  Enter the Msg"
	
	WScript.Quit
End If
' ================= src : scripts\FS.vbs ================= 
Class FS
	Private objFSO

	Private Sub Class_Initialize
		Set objFSO = CreateObject("Scripting.FileSystemObject")
	End Sub
	
	Public Function GetFSO
		Set GetFSO = objFSO
	End Function
	
	Public Function GetFileDir(ByVal file)
		Wscript.Echo "GetFileDir(" + file + ")"
		Set objFile = objFSO.GetFile(file)
		GetFileDir = objFSO.GetParentFolderName(objFile)
	End Function
End Class

' set oFs = new FS
' Wscript.Echo oFs.GetFileDir(WScript.ScriptFullName)
' ================================== Job: job2 ================================== 
' ================= inline script ================= 

Wscript.Echo "We are in Job2"

' ======== END ========
```

### Usage

## parse a wsf file by path: extract()

```js
const fs = require('fs');
const wsf2vbs = require('wsf2vbs');
wsf2vbs.extract(wsfPath, debug).then((vbs)=>{
    fs.writeFileSync(path.join(__dirname, 'test_out_extract.vbs'), vbs);
}).catch((error)=>{
    console.error(error)
})
```

## parse a wsf file by content: extractFromStr()
(Or) if the content is available in string, simply pass it to String parser 'extractFromStr'


```js
const fs = require('fs');
const wsf2vbs = require('wsf2vbs');
// For Demo: Genearate string of wsf file
let xml = await fs.readFileSync(wsfPath).toString();
wsf2vbs.extractFromStr(xml, debug).then((vbs)=>{
    fs.writeFileSync(path.join(__dirname, 'test_out_extract.vbs'), vbs);
}).catch((error)=>{
    console.error(error)
})
```

### Alternatives

## Convert wsf to intermediate JSON file
Instead of generating vbs file, if the use case is to convert wsf file to a json format for post processing use npm package [wsf2json](https://www.npmjs.com/package/wsf2json?activeTab=readme). Note current project uses wsf2json as a dependency.