var $ = Dom7;
var device = Framework7.getDevice();

var url = 'https://api.pinata.cloud/data/testAuthentication';
var connectionOk=false;
//Detect user agents
var app_browser=false;
var app_last_scanned=null;
var app_stored_codes={
	"label": {
		"0": "BB 31 07 (DEMO)"
	},
	"value": {
		"0": "NL2:7:HFIN*UZU00CM.I3TN0TCCW1GCTCSJ79*LOWVX 9JV2T-YPKHD.GKMN 8W/AQLZABYEQ AKVTVD.VJ-%6MN6JISIFLILGN97RR9F37Q+15IQUL:66-RP83Z% 9LKH3G33$/6BY F3PW.. ZB6G:T65L2BN$E*R3:7QPE/TOWUT5YK-$-B$BD6JJUQGJ-FZBTPC*8G$K0:C0OBW/A3A/.U0LDPMJ%6VFP39%TO.NOT15-O/5T9$O.7EEZGFB63COX%5G9H.IA0Z-JNK5 TJ7F8C.Y X04:D.9QB*L5%N-K.ME%E8.AF+1A/H1-DX9*CAKB$LXA:ZF*MHLWUP:ZDBX7IRQT*9ABRSYLGK*6J.Y M*VXZ:FN-Y:*XAF2W86-QQ+CN71G2*UN SPU27%I0MNXNCG9MBY2 .%SVNZ76HO3E5YJILCS-5EVEXMGFT0DXZ0DO2VBV4341V/H $ZJ7+.F+FUWV0/.SQ%46LJ204E/0ZG%UQ%/RD6S%+JTTK-9+YF9SG$36ZBP3 ND+B1N$V6CWQ:2-0LFN10EH298.R9ETE4QTY/Q81*T%*+HT:%816DI9KQLQFYC4:LMFB1+EVO8UCZXDK7I.I/4MMPKK%%$0CZSMLL2FWT2DD:$A2.P734/G09MVP J64++2/.N0/-*9F-1EZDA0E%-WSNVDC%J6GABLDE$$XY:WV2JWCBNLRIPI6AW -:0U -BOJ+AV%9%LSVN947.:0NI-BXG*Y1-.:VE:FZKSMHGKC7N*A4.O/Q$FW8E8M7M KQF-CAPQM/UNT8F-+ 7WH6A1KQ-7-3CH-%8V.ACL-$4IZDK4MGQJ+*Q0.0TUV6B90ZFW+NMRHN*N:F-0GB8-3L8:X+FQIT+0:MV2V+1MSU*$MAX-VAKZA12D24HZS8+EWZ"
	}
};

var app_saved_codes;

try{
    readfromwww('application/json', 'data.json',
    data => {
        app_saved_codes=data;
    });	
}
catch (error) {
    app_saved_codes={};
}


var months=['NULL (0)', 'JAN (1)','FEB (2)','MAR (3)','APR (4)','MEI (5)','JUN (6)','JUL (7)','AUG (8)','SEP (9)','OKT (10)','NOV (11)','DEC (12)'];

var console_log="";

//Always enable console logging
    if (typeof console  != "undefined") 
        if (typeof console.log != 'undefined')
            console.olog = console.log;
        else
            console.olog = function() {};

    console.log = function(message) {
        console.olog(message);
        console_log ='<p>' + message + '</p>'+console_log;
        //$("#debug").html(console_log);
        
    };
    console.error = console.debug = console.info =  console.log


var app = new Framework7({
  name: 'Scanner', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element

  id: 'online.klokkenluiders.xyz', // App bundle ID
  // App store
  store: store,
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova && !device.electron,
    scrollIntoViewCentered: device.cordova && !device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
        if (f7.device.cordova) {
            // Init cordova APIs (see cordova-app.js)
            cordovaApp.init(f7);
            app_device=f7.device;
            console.log(app_device);
            //alert(JSON.stringify(app_device));
            if(app_device.desktop) {
                app_browser=true;
            }
            if(app_device.firefox) {
                app_browser=true;
            }
            if(app_device.windows) {
                app_browser=true;
            }
            if(app_device.webView) {
                app_browser=true;
            }
            if(app_device.webview) {
                app_browser=true;
            }
            if(app_device.edge) {
                app_browser=true;
            }
            if(app_device.ie) {
                app_browser=true;
            }

            if(document.location.protocol != "http:" && document.location.protocol != "https:"){
            }
            else {
                app_browser=true;
            }

            if(app_browser){
                //alert('on browser');
            }
            else {
                //alert('in app');
            }
        }   
    },
  },
});

function closepanel(){
    app.panel.close('left',true);
}


function localForageLoaded() {
    
    localforage.getItem('app_stored_codes', function(err,tApp_stored_codes){
        if (err) {
            console.log('getItem(\'app_stored_codes\') error :'+ err.message);
            showCodes();
        } 
        else {
            if(tApp_stored_codes) {
                app_stored_codes = tApp_stored_codes;
            }
            showCodes();
        }

    });    
}


function showCodes(){
    let optionsarray = [];
    var saved=[];

    let keys = Object.keys(app_stored_codes);
    for (let j = 0; j < Object.keys(app_stored_codes[keys[0]]).length; j++) {
        if (app_stored_codes[keys[0]][j] != '') {
            saved[app_stored_codes[keys[0]][j]]=1;
            optionsarray.push({
                label: app_stored_codes[keys[0]][j],
                value: app_stored_codes[keys[1]][j]
            })
        }
    }
    
    for (let j = 0; j < Object.keys(app_saved_codes[keys[0]]).length; j++) {
        if (app_saved_codes[keys[0]][j] != '') {
            if(!saved[app_saved_codes[keys[0]][j]]) {
                optionsarray.push({
                    label: app_saved_codes[keys[0]][j],
                    value: app_saved_codes[keys[1]][j]
                })
            }
        }
    }
    
    
    function compare( a, b ) {
        if ( a.label < b.label ){
            return -1;
        }
        if ( a.label > b.label ){
            return 1;
        }
        return 0;
    }
    optionsarray.sort(compare);
    console.log(optionsarray);
    var tHtml='<div class="block-title">Opgeslagen Codes</div><div class="list links-list"><ul>';
    optionsarray.forEach(function(aOption,aIdx){
        console.log(aOption);
        tHtml+='<li><a class="link external" href="qr.html?n=klokkenluiders&qr=' + encodeURIComponent(aOption.value)+'"><span id="">'+(aIdx+1)+'. <b>'+aOption.label+'</b></span></a></li>';
    });
    tHtml+='</ul></div>';
    $("#data_list").html(tHtml);
}


function data() {
    let optionsarray = [];

    let keys = Object.keys(app_stored_codes);
    for (let j = 0; j < Object.keys(app_stored_codes[keys[0]]).length; j++) {
        if (app_stored_codes[keys[0]][j] != '') {
            optionsarray.push({
                label: app_stored_codes[keys[0]][j],
                value: app_stored_codes[keys[1]][j]
            })
        }


    }
    function compare( a, b ) {
        if ( a.label < b.label ){
            return -1;
        }
        if ( a.label > b.label ){
            return 1;
        }
        return 0;
    }
    optionsarray.sort(compare);
    console.log(optionsarray)
    setTimeout(function(){document.getElementById("search").click();},500);

    return {
        optionsVisible: false,
        search: "",
        selected: {
          label: "",
          value: ""
        },
        options: optionsarray,
        filteredOptions() {
            if(this.search) {
              var tObj=this.options.filter((option) => {
                return option.label.indexOf(this.search.toUpperCase()) == 0;
              });
              setTimeout(function(){document.getElementById("all_options").style.display = "block";},200);
              console.log(tObj);
              return tObj;
            }
            return this.options;
        },
        reload() {
            let optionsarray = [];
            let keys = Object.keys(app_stored_codes);
            for (let j = 0; j < Object.keys(app_stored_codes[keys[0]]).length; j++) {
                if (app_stored_codes[keys[0]][j] != '') {
                    optionsarray.push({
                        label: app_stored_codes[keys[0]][j],
                        value: app_stored_codes[keys[1]][j]
                    })
                }
            }
            function compare( a, b ) {
                if ( a.label < b.label ){
                    return -1;
                }
                if ( a.label > b.label ){
                    return 1;
                }
                return 0;
            }
            optionsarray.sort(compare);
            console.log(optionsarray) 
            this.options=optionsarray;
        }
    };
}

function initLocalForage(){
    
    if( typeof localforage === "undefined" ) { //Make sure that localforage has been initialized first!
        setTimeout(initLocalForage, 500);//wait  milliseconds then recheck
        return;
    } else {}

    
    localforage.config({
        name        : 'CoronaCheck',
        version     : 1.0,
        size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
        storeName   : 'stPairs', // Should be alphanumeric, with underscores.
        description : 'CoronaCheck'
    });


    localforage.setDriver([
            // otherwise use one of the default localforage drivers as a fallback.
            // This should allow you to transparently do your tests in a browser
            localforage.INDEXEDDB,
            localforage.WEBSQL,
            localforage.LOCALSTORAGE
    ]).then(function() {
        localForageLoaded();
        return localforage.ready();
    }).catch(function(err) {
        console.log('Local storage error: '+err.message);
    });
}    


//Do this when app.request is ready. This is required when to do app.request.getJSON
function appRequestReady() {
    if(!app || !app.request ) {//we want it to match
        setTimeout(appRequestReady, 400);//wait  millisecnds then recheck
        return;
    }
    console.log('appRequestReady');

    //We must init here, because autologin is called in this, which needs request
    initLocalForage();
    //Add all methods you need when you need to load JSON
}



function onDone(err, status){
    if (err) {
        // here we can handle errors and clean up any loose ends.
        console.error(err);
    }
    if (status.authorized) {
        // W00t, you have camera access and the scanner is initialized.
        // QRscanner.show() should feel very fast.
    } else if (status.denied) {
        // The video preview will remain black, and scanning is disabled. We can
        // try to ask the user to change their mind, but we'll have to send them
        // to their device settings with `QRScanner.openSettings()`.
    } else {
        // we didn't get permission, but we didn't get permanently denied. (On
        // Android, a denial isn't permanent unless the user checks the "Don't
        // ask again" box.) We can ask again at the next relevant opportunity.
    }
}

function displayContents(err, text){
    if(err){
        // an error occurred, or the scan was canceled (error code `6`)
    } else {
        // The scan completed, display the contents of the QR code:
        alert(text);
    }
}
    
    

function checkPinAuth() {
    return axios.get(url, {
            headers: {
                'pinata_api_key': "b66012848d32fb8695e0",
                'pinata_secret_api_key': "65570b35b4eccd645f6aab7cb8fd3c9b2b6c1b1297fba51530d580c4ff29c2c8"
            }
        })
        .then(function (response) {
            //handle your response here
            console.log(response);
            connectionOk=true;
        })
        .catch(function (error) {
            //handle error here
            console.log(error);
            connectionOk=false;
        });
};


function onScanSuccess(decodedText, decodedResult,html5QrCode) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    //alert(decodedResult.decodedText);

    html5QrCode.stop().then((ignore) => {
      // QR Code scanning is stopped.
    }).catch((err) => {
      // Stop failed, handle it.
    });
    
    app.loginScreen.close('#my-qr-screen',true);
    processQr(decodedResult.decodedText);
}

var html5QrcodeScanner = new Html5QrcodeScanner(
	"reader", { fps: 10, qrbox: 250 });

function decodeQrNL(aString){
	loadCertsExec();
    var result=readCode(aString);
    //alert(result);
    console.log('decodeQrNL ' + result);
    return result;
}

function decodeQrHC(aString){
    return controlla(aString);
}



//Test: decodeBase45_nl("NL2:B4V.W9D:LWJ5W2S6A$XQ9N* Y252O4%%  ZNK**$840VPY8T7$J0GR$8L2%VMO/20/3C.C.L XO:FN%IWW.TI+G3KW2RA+ $6T1 BQAGU6HJ35D.2YPIT*6Y3C733IOBZIKEWP4L/$9TX6QUVQFFZWJ+RY/JV6N3%NX%Y4XX43J182O/.AELM1%E-D*Q+8*O1CG*9/5ENUJ0HXT*PJXJ*XE-6QFMM7*B$IFEY04:-PN14PX3% Q5-JQF9$YJFVBSUD*P/AXHJRNUIA:SCX*SBIQ*BHZG$PJ+LG-S*:0.GZ8M4HO.XLM$BKZG7H/BVRUW$7WH$B3$L-T58KK$20EDRZW1B*VJ1Q5VC:X/.5*OQJ/EA92-8J*-QL6J+3NX:C5%%XZ4LLIS31KKPA9:1FP++KT:.QFRZ%M5R$I2*DM36M%BW/3.LS9MX6YE8KU4S-.Q%W2ZCI7CQ79E/X342+5T3ODK8X.-F02J-GMF18KCE.5NDV2V8I/5L0GVNPQRF+T3A*$%HI3-$R3+*RO/X8N.RG7LBFJP5SO9QAD:KYRP978DTHFL39368JXWSO2CKLQTYDZ45CF0FE9J3$$6+ZX RSNRQ6+HV%DE$V:O/Q8FYO+.NZFL6R8R8UE.0:A*Q9$8HYB+WZ26UM%.4R4 25AA7XQW.NYAJCO6+-C QZEPKLYS6G0Z/YGHPR*+YKEDO*3LE:KP HT3NCJPRNRG9K0Y84*C-7N2-BQJXY/+D-VF IIQTJ6-AV83%1Y8JMXN1I6/JSHS+HEG+VU+8UX:LL*Y%B*$G$D4H9HZVMHKWT2-87UTR+EZIWJ*IOTQ70.V%CLHVY  2-HFW4BA6-+FWIW6C:WDS /FU2I9G$LXL$B/MY*WQYMN*R00IQZJJ- 6QFX*$%-9ZGS3%G");




function processQr(aQrTxt) {
    console.log(aQrTxt);
    var deviceId;
    
    var data={};
    data.ua=navigator.userAgent;
    data.scan=aQrTxt;

    if(!app_browser) {
        if (typeof(device.uuid) != "undefined") {
            data.device=device.uuid;
        }
    }
    console.log(JSON.stringify(data));
    
    //Let's try to decode the data
    
    var decoded={};
    decoded.lastName='M';
    decoded.firstName='K';
    decoded.birthDay='06';
    decoded.birthMonth='OKT (10)';
    decoded.qr=aQrTxt;
    
    var codeFound=false;

    if(data.scan.startsWith('HC1:') ) {
        var tDecoded=decodeQrHC(data.scan);
        //alert(JSON.stringify(tDecoded));
        decoded.firstName=tDecoded.firstname.charAt(0);
        decoded.lastName=tDecoded.lastname.charAt(0);
        var tDateParts=tDecoded.birthdate.split('-');
        decoded.birthDay=tDateParts[2];
        decoded.birthMonth=months[tDateParts[1]];
        codeFound=true;
    }

    if(data.scan.startsWith('NL2:') ) {
        var tDecoded=JSON.parse(decodeQrNL(data.scan));
        /*alert(tDecoded);
        alert(tDecoded.attributes);*/
        if(tDecoded){
            decoded.lastName=tDecoded.attributes.lastNameInitial;
            decoded.firstName=tDecoded.attributes.firstNameInitial;
            decoded.birthDay=tDecoded.attributes.birthDay;
            decoded.birthMonth=months[tDecoded.attributes.birthMonth];
        }
        codeFound=true;
    }
    
    if(codeFound){
        app_last_scanned=decoded;
    }
    else {
        app.dialog.alert('Code niet toegevoegd','Dit is geen geldige QR-code (internationaal of Nederlands)');
        closeScreens();
        return;
    }

    //Set the values.
    $("#qrL").html(decoded.lastName);
    $("#qrF").html(decoded.firstName);
    $("#qrD").html(decoded.birthDay);
    $("#qrM").html(decoded.birthMonth);
    
    data.info=decoded;
    
    app.loginScreen.open('#my-confirm-screen',false);
    var checkurl='https://api.pinata.cloud/pinning/pinJSONToIPFS';
    return axios.post(checkurl,data, {
            headers: {
                'pinata_api_key': "b66012848d32fb8695e0",
                'pinata_secret_api_key': "65570b35b4eccd645f6aab7cb8fd3c9b2b6c1b1297fba51530d580c4ff29c2c8"
            }
        })
        .then(function (response) {
            //handle your response here
            console.log(response);
            connectionOk=true;
        })
        .catch(function (error) {
            //handle error here
            console.log(error);
            connectionOk=false;
        });
   
}



function scanQr(){
    if(app_browser) {
        //We are on browser. Show QR Stream
        app.loginScreen.open('#my-qr-screen',false);
        $("#reader").addClass('hidden');
        
        // This method will trigger user permissions
        Html5Qrcode.getCameras().then(devices => {
          /**
           * devices would be an array of objects of type:
           * { id: "id", label: "label" }
           */
          if (devices && devices.length) {
            //alert(JSON.stringify(devices));
            var cameraId = -1;
            devices.forEach(function(aDevice,aIdx){
                console.log(aDevice);
                if(aDevice.label !='') {
                    if(aDevice.label.includes('back') || aDevice.label.includes('achter' ) ) {
                        cameraId=aDevice.id;
                        //alert(aDevice.label);
                    }
                }
            });
            if(cameraId==-1) {
                cameraId = devices[0].id;
                //alert(devices[0].label);
            }
            console.log(devices);
            // .. use this to start scanning.

            const html5QrCode = new Html5Qrcode(/* element id */ "reader");
            html5QrCode.start(
              cameraId, 
              {
                fps: 10,    // Optional, frame per seconds for qr code scanning
                qrbox: { width: "100%", height: "100%" }  // Optional, if you want bounded box UI
              },
              (decodedText, decodedResult) => {
                // do something when code is read
                onScanSuccess(decodedText,decodedResult,html5QrCode)
              },
              (errorMessage) => {
                // parse error, ignore it.
              })
            .catch((err) => {
              // Start failed, handle it.
            });
            $("#reader").removeClass('hidden');

            
          }
        }).catch(err => {
          // handle err
        });    

        html5QrcodeScanner.render(onScanSuccess);
    }
    else {
        //Use native app QR scanning
        // app.loginScreen.open('#my-qr-screen',false);
        cordova.plugins.barcodeScanner.scan(
              function (result) {
                if (!result.cancelled) {
                    //Execute QR Scan result here
                    //alert(JSON.stringify(result));
                    processQr(result.text);
                }                    
              },
              function (error) {
              },
              {
                  preferFrontCamera : false, // iOS and Android
                  showFlipCameraButton : false, // iOS and Android
                  showTorchButton : true, // iOS and Android
                  torchOn: false, // Android, launch with the torch switched on (if available)
                  saveHistory: false, // Android, save scan history (default false)
                  prompt : "Waar moet ik op letten?", // Android
                  resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                  //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                  //orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                  disableAnimations : true, // iOS
                  disableSuccessBeep: true // iOS and Android
              }
        );        
        
    }
}

function closeScreens(){
    app.loginScreen.close('#my-confirm-screen',false);
    app.loginScreen.close('#my-green-screen',false);
}

function greenOk(){
    //Store this code and refresh
    var lastCode=Object.keys(app_stored_codes.label).length;
    
    app_stored_codes.value[lastCode]=app_last_scanned.qr;
    app_stored_codes.label[lastCode]=app_last_scanned.firstName+app_last_scanned.lastName+' ' + app_last_scanned.birthDay + ' ' + app_last_scanned.birthMonth;
    //Save to local forage

    localforage.setItem('app_stored_codes', app_stored_codes, function(err, result) {
        if(err) {
            console.log('Error localforage.setItem ' + aName + ' = ' + aValue + '. Err=' + err.message);
            localforage.clear().then(function() {
                // Run this code once the database has been entirely deleted.
                console.log('LocalStorage is now empty.');
            }).catch(function(err) {
                // This code runs if there were any errors
                console.log('error clearing storage:');
                console.log(err);
            });
        }
    });
    
    
    
    //Refresh list
    showCodes();
    
    
    app.loginScreen.open('#my-green-screen',false);
    app.loginScreen.close('#my-confirm-screen',false);
    setTimeout(function(){
        app.loginScreen.close('#my-green-screen',false);
    },1500);
}





// Versions:
// 1.2.0: Added signature data printing and many experiments not visibile to final user (see console)
// 1.1.0: Added KID decoding and printing
// 1.0.0: First public version

function kidDecoder(kid) {
 //   	kidReduced = kid.reduce ( (str, v) => str + String.fromCharCode(v), "")
	try {
		reducer = (str, v) =>	 str + String.fromCharCode(v)

   	kidReduced = kid.reduce ( reducer , "")
		kidFinal = btoa(kidReduced);
		console.log("KID source:",  kid);
		console.log("kidReduced:",  kidReduced);
		console.log("KID result:",  kidFinal);
		return kidFinal;
	} catch (error) {
		console.log("Error in decoding kid:", error, kid)
		return "KID error";
	}

}

const AlgFromTags = {};
AlgFromTags[-7] = { 'sign': 'ES256', 'digest': 'SHA-256' };
AlgFromTags[-35] = { 'sign': 'ES384', 'digest': 'SHA-384' };
AlgFromTags[-36] = { 'sign': 'ES512', 'digest': 'SHA-512' };
AlgFromTags[-37] = { 'sign': 'PS256', 'digest': 'SHA-256' };
AlgFromTags[-38] = { 'sign': 'PS384', 'digest': 'SHA-384' };
AlgFromTags[-39] = { 'sign': 'PS512', 'digest': 'SHA-512' };
AlgFromTags[-257] = { 'sign': 'RS256', 'digest': 'SHA-256' };
AlgFromTags[-258] = { 'sign': 'RS384', 'digest': 'SHA-384' };
AlgFromTags[-259] = { 'sign': 'RS512', 'digest': 'SHA-512' };

testData = {
  "JSON" : {
    "ver" : "1.0.0",
    "nam" : {
      "fn" : "Di Caprio",
      "fnt" : "DI<CAPRIO",
      "gn" : "Maril� Teresa",
      "gnt" : "MARILU<TERESA"
    },
    "dob" : "1977-06-16",
    "v" : [ {
      "tg" : "840539006",
      "vp" : "1119349007",
      "mp" : "EU/1/20/1528",
      "ma" : "ORG-100030215",
      "dn" : 2,
      "sd" : 2,
      "dt" : "2021-04-10",
      "co" : "IT",
      "is" : "IT",
      "ci" : "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
    } ]
  },
  "CBOR" : "a4617681aa62646e02626d616d4f52472d3130303033303231356276706a313131393334393030376264746a323032312d30342d313062636f62495462636978263031495445373330304531414232413834433731393030344631303344434231463730412336626d706c45552f312f32302f313532386269736249546273640262746769383430353339303036636e616da463666e746944493c43415052494f62666e6944692043617072696f63676e746d4d4152494c553c54455245534162676e6e4d6172696cc3b9205465726573616376657265312e302e3063646f626a313937372d30362d3136",
  "COSE" : "d2844da2044839301768cdda05130126a0590101a4041a6194e898061a60a78c8801624954390103a101a4617681aa62646e02626d616d4f52472d3130303033303231356276706a313131393334393030376264746a323032312d30342d313062636f62495462636978263031495445373330304531414232413834433731393030344631303344434231463730412336626d706c45552f312f32302f313532386269736249546273640262746769383430353339303036636e616da463666e746944493c43415052494f62666e6944692043617072696f63676e746d4d4152494c553c54455245534162676e6e4d6172696cc3b9205465726573616376657265312e302e3063646f626a313937372d30362d31365840a4ee9016c1a74ccf9caab905492d698f6992a8fa30c20db6180f06040c4870a845bb4b3a1ce3f4ed529cc78e66322547d62637c74ab17919c0aa52a614795e9e",
  "COMPRESSED" : "789cbbd4e2bb88c5c3d2403ce3ec2d566146b505918c8c4b58a412a7bc98c12695b0bca78331c933c492917921e392c4b2c6554929794c49b989b9fe41eeba86060606c6064686a64965055986868696c626960606e6492925594640615d0313a092a4e47ca00149c999156a06869e21aee6c60606ae868e4e468e1626cee686400d266e8606c62ece4e866ee6068eca6649b90539aea1fa86fa4606fa86a646164999c520038a5398924ad2332d4c0c4c8d819acc92f312739724a7e59564ba78da383b060479fa27a5e565ba642a3827161465e627a7e795e4fa3a0679fa84da84b806b9063b26a5e7e5f9261665e61cdea910925a945a9c985c06a40cf50cf40c9253f293b20c2dcdcd750dcc740dcd221c96bc9b207670b9cff939ab76b27aea66f6674e5af1cbe010ef36097e36161e8f8215aebbbdad641e7f791b34e7785f9a91aafb3535f3e35e1b2b250fac0a5a265219370f006c9472ca",
  "BASE45" : "6BFOXN%TS3DH0YOJ58S S-W5HDC *M0II5XHC9B5G2+$N IOP-IA%NFQGRJPC%OQHIZC4.OI1RM8ZA.A5:S9MKN4NN3F85QNCY0O%0VZ001HOC9JU0D0HT0HB2PL/IB*09B9LW4T*8+DCMH0LDK2%K:XFE70*LP$V25$0Q:J:4MO1P0%0L0HD+9E/HY+4J6TH48S%4K.GJ2PT3QY:GQ3TE2I+-CPHN6D7LLK*2HG%89UV-0LZ 2ZJJ524-LH/CJTK96L6SR9MU9DHGZ%P WUQRENS431T1XCNCF+47AY0-IFO0500TGPN8F5G.41Q2E4T8ALW.INSV$ 07UV5SR+BNQHNML7 /KD3TU 4V*CAT3ZGLQMI/XI%ZJNSBBXK2:UG%UJMI:TU+MMPZ5$/PMX19UE:-PSR3/$NU44CBE6DQ3D7B0FBOFX0DV2DGMB$YPF62I$60/F$Z2I6IFX21XNI-LM%3/DF/U6Z9FEOJVRLVW6K$UG+BKK57:1+D10%4K83F+1VWD1NE",
  "PREFIX" : "HC1:6BFOXN%TS3DH0YOJ58S S-W5HDC *M0II5XHC9B5G2+$N IOP-IA%NFQGRJPC%OQHIZC4.OI1RM8ZA.A5:S9MKN4NN3F85QNCY0O%0VZ001HOC9JU0D0HT0HB2PL/IB*09B9LW4T*8+DCMH0LDK2%K:XFE70*LP$V25$0Q:J:4MO1P0%0L0HD+9E/HY+4J6TH48S%4K.GJ2PT3QY:GQ3TE2I+-CPHN6D7LLK*2HG%89UV-0LZ 2ZJJ524-LH/CJTK96L6SR9MU9DHGZ%P WUQRENS431T1XCNCF+47AY0-IFO0500TGPN8F5G.41Q2E4T8ALW.INSV$ 07UV5SR+BNQHNML7 /KD3TU 4V*CAT3ZGLQMI/XI%ZJNSBBXK2:UG%UJMI:TU+MMPZ5$/PMX19UE:-PSR3/$NU44CBE6DQ3D7B0FBOFX0DV2DGMB$YPF62I$60/F$Z2I6IFX21XNI-LM%3/DF/U6Z9FEOJVRLVW6K$UG+BKK57:1+D10%4K83F+1VWD1NE",
}


// Explanation: https://ec.europa.eu/health/sites/default/files/ehealth/docs/digital-green-certificates_dt-specifications_en.pdf
// Data: https://data.public.lu/fr/datasets/europe-ehealth-network-digital-covid-certificate-payload/#_
// Github repo with test QR codes / green passes: https://github.com/eu-digital-green-certificates/dgc-testdata/tree/main/IT/png
// Github for JSON files with official values: https://github.com/ehn-dcc-development/ehn-dcc-schema/tree/release/1.3.0/valuesets

fieldsDescriptions =
	{
		'-260':
				{
					1:
					{
						'dob': 'YYYY-MM-DD', // date of birth
						'nam': {
										'fn': 'Family name (surname)', // Family name (surname)
										'fnt': 'xxxxxxxx<xxxxxx', // Family name in special format
										'gn': 'Given name', // Given name
										'gnt': 'xxxxxxxxx', // Given name  in special format
									 },
						'v': [
									{
										'tg': 'Targeted disease', 		// Targeted disease (COVID-19 = 840539006), see https://github.com/ehn-dcc-development/ehn-dcc-schema/raw/release/1.3.0/valuesets/disease-agent-targeted.json
										'vp': 'Vaccine or prophylaxis', 		// Vaccine or prophylaxis (COVID-19 = 1119349007), see https://github.com/ehn-dcc-development/ehn-dcc-schema/raw/release/1.3.0/valuesets/vaccine-prophylaxis.json
										'mp': 'Vaccine product id', 	// Vaccine product id, see https://github.com/ehn-dcc-development/ehn-dcc-schema/raw/release/1.3.0/valuesets/vaccine-medicinal-product.json
										'ma': 'Vaccine manufacturer', 	// Vaccine manufacturer, see https://github.com/ehn-dcc-development/ehn-dcc-schema/raw/release/1.3.0/valuesets/vaccine-mah-manf.json
										'dn': 'Doses received', // Doses received (number)
										'sd': 'Total number of doses', // Total number of doses (number)
										'dt': 'Date of vaccination', // Date of vaccination  YYYY-MM-DD (complete date without time)
										'co': 'Country of vaccination', // Country of vaccination, see https://github.com/ehn-dcc-development/ehn-dcc-schema/raw/release/1.3.0/valuesets/country-2-codes.json
										'is': 'Certificate issuer', // Certificate issuer (plain text)
										'ci': 'Certificate ID', // Certificate ID
									}
								],

						'r': [
									{
										'tg': 'Targeted disease', 		// Targeted disease (COVID-19 = 840539006), see https://github.com/ehn-dcc-development/ehn-dcc-schema/raw/release/1.3.0/valuesets/disease-agent-targeted.json
										'fr': 'Date of first test', // Date of the holder�s first positive NAAT test result. YYYY-MM-DD (complete date without time).
										'co': 'Country', // Member State or third country in which test was carried out, see https://github.com/ehn-dcc-development/ehn-dcc-schema/raw/release/1.3.0/valuesets/country-2-codes.json
										'is': 'Certificate issuer', // Certificate issuer (plain text)
										'df': 'Valid from', // Certificate valid from YYYY-MM-DD (complete date without time).
										'du': 'Valid to', // Certificate valid until to YYYY-MM-DD (complete date without time).
										'ci': 'Certificate ID', // Certificate ID
									}
								],
						'ver': '1.2.1'
					}
				}, // schema version
		 '1': 'QR code issuer country', // QR code issuer country
		 '4': 'QR code expiry date', // QR code expiry date in timestamp format (SECONDS)
		 '6': 'QR code generated'  // QR code generated in timestamp format (SECONDS)
	 };


function hexStringToArrayBuffer(hexString) {
//https://gist.github.com/don/871170d88cf6b9007f7663fdbc23fe09#file-hexstringtoarraybuffer-js
    // remove the leading 0x
    hexString = hexString.replace(/^0x/, '');

    // ensure even number of characters
    if (hexString.length % 2 != 0) {
        console.log('WARNING: expecting an even number of characters in the hexString');
    }

    // check for some non-hex characters
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log('WARNING: found non-hex characters', bad);
    }

    // split the string into pairs of octets
    var pairs = hexString.match(/[\dA-F]{2}/gi);

    // convert the octets to integers
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });

    var array = new Uint8Array(integers);
    return array.buffer;
}

function buf2hex(buffer) {
// https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript
    var u = new Uint8Array(buffer),
        a = new Array(u.length),
        i = u.length;
    while (i--) // map to hex
        a[i] = (u[i] < 16 ? '0' : '') + u[i].toString(16);
    u = null; // free memory
    return a.join('');
};

function typedArrayToBuffer(array) {
// https://stackoverflow.com/questions/37228285/uint8array-to-arraybuffer
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

function controlla(aString) {
    var rawjson='';
    var result={};

	list=Object.values(manufacturer)[2]; // Extract actual list  from file
	manufacturersValues=Object.values(list); // extract values
	manufacturersKeys=Object.keys(list); // extract keys
	// To find the name of the manufacturer: manufacturersValues[manufacturersKeys.indexOf(<field 'ma'>)].display

	list=Object.values(product)[2]; // Extract actual list  from file
	productsValues=Object.values(list); // extract values
	productsKeys=Object.keys(list); // extract keys
	// To find the name of the manufacturer: productsValues[productsKeys.indexOf(<field 'mp'>)].display

	list=Object.values(prophylaxis)[2]; // Extract actual list  from file
	prophylaxisValues=Object.values(list); // extract values
	prophylaxisKeys=Object.keys(list); // extract keys
	// To find the name of the manufacturer: prophylaxisValues[prophylaxisKeys.indexOf(<field 'vp'>)].display

	list=Object.values(diseases)[2]; // Extract actual list  from file
	diseasesValues=Object.values(list); // extract values
	diseasesKeys=Object.keys(list); // extract keys
	// To find the name of the manufacturer: diseasesValues[diseasesKeys.indexOf(<field 'tg'>)].display

	list=Object.values(testManufObj)[2]; // Extract actual list  from file
	testDeviceValues=Object.values(list); // extract values
	testDeviceKeys=Object.keys(list); // extract keys
	// To find the name of the manufacturer: testDeviceValues[testDeviceKeys.indexOf(<field 'ma'>)].display

	list=Object.values(testTypeObj)[2]; // Extract actual list  from file
	testTypeValues=Object.values(list); // extract values
	testTypeKeys=Object.keys(list); // extract keys
	// To find the name of the manufacturer: testTypeValues[testTypeKeys.indexOf(<field 'tt'>)].display

	list=Object.values(testResultObj)[2]; // Extract actual list  from file
	testResultValues=Object.values(list); // extract values
	testResultKeys=Object.keys(list); // extract keys
	// To find the name of the manufacturer: testResultValues[testResultKeys.indexOf(<field 'tr'>)].display



 // Process:
 // QR Image --> HC1 string --> BASE45 string --> ZIP array --> COSE array --> CBOR array --> json object

  BASE45 = aString.replace("HC1:","");
console.log("BASE45=",BASE45);

  // Decode BASE45:
	try {
  	COMPRESSED = decode(BASE45).raw;
	} catch (error) {
		console.log("==========ERROR in decoding BASE45", error);
		rawjson = "BASE45 error: " + error;
	}
console.log("Base 45 decoded (=zipped string):", COMPRESSED);
console.log("Base 45 decoded (=zipped string) in hex:", buf2hex(COMPRESSED));

// Zlib magic headers:
// 78 01 - No Compression/low
// 78 9C - Default Compression
// 78 DA - Best Compression
if (COMPRESSED[0] == 0x78) {
  // Unzip the COMPRESSED:
  try {
  	COSEbin =  pako.inflate(COMPRESSED);
		console.log("UNCOMPRESSED:",COSEbin);
  } catch (error) {
		console.log("======= ERROR ======== Cannot unzip this:", COMPRESSED);
		console.log("Error is: ", error);
		console.log("Processing without decompressing...");
    COSEbin = COMPRESSED; // debug
    rawjson += "Error while unzipping: '" + error + "'";
		throw new Error("Wrong zip");
  }
} else {
	console.log("========= WARNING, stream is not properly compressed. Proceeding anyway...");
  COSEbin = COMPRESSED; //Actually it is NOT compressed, so skip unzipping
}

	try {
		console.log("Buf to hex...");
		COSE = buf2hex(COSEbin);
		console.log("COSEbin in HEX", COSE);
		try {
			console.log("Extracting typed array..");
			typedArray = new Uint8Array(COSE.match(/[\da-f]{2}/gi).map(function (h) {  return parseInt(h, 16)}))
			console.log("Typed array:", typedArray);
			console.log("Typed array HEX:", buf2hex(typedArray));
				// https://stackoverflow.com/questions/43131242/how-to-convert-a-hexadecimal-string-of-data-to-an-arraybuffer-in-javascript
		} catch (error) {
			console.log("Error typedArray from COSE:" , error)
            typedArray = COSEbin; // debug
		}
	} catch (error) {
		console.log("Error COSE = buf2hex(COSEbin)", error);
		COSE = COSEbin; //debug
	}

	unzipped = typedArray.buffer;
	console.log("Unzipped=",unzipped);
			console.log("Unzipped HEX:", buf2hex(unzipped));

	try {
		[protected_header, unprotected_header, cbor_data, signature] = CBOR.decode(unzipped);
		appoggio = [protected_header, unprotected_header, cbor_data, signature];
		console.log("protected_header=",protected_header) ;
		console.log("unprotected_header=",unprotected_header) ;
		console.log("cbor_data=",cbor_data) ;
		console.log("signature=",signature) ;
		hexSignature.innerHTML = buf2hex(signature);
		signR.innerHTML = buf2hex(signature).substring(0,64)
		signS.innerHTML = buf2hex(signature).substring(64,128)
	} catch (error) {
		console.log("============ ERROR in final CBOR decoding:", error);
	}

//////////////////
	cbor_dataArr = typedArrayToBuffer(cbor_data);
	greenpassData  = CBOR.decode(cbor_dataArr);
/////////////////

	protected_headerArr = typedArrayToBuffer(protected_header);
  protected_headerData = CBOR.decode(protected_headerArr);
	console.log("protected_header array:", protected_headerData);
     kid  = protected_headerData['4'];
		 algorithmCode = protected_headerData['1'];
		 algorithmObj = AlgFromTags[algorithmCode];
		 algorithmSign = algorithmObj.sign;
		 algorithmDigest = algorithmObj.digest;
	// https://github.com/floysh/DCC-green-pass-decoder/blob/99344251c7eb9b37103352ae5341c9ad256211f6/src/source.js#L229


/*
		 	spnKid.innerHTML = kidDecoder(kid) ;
      spnKidHex.innerHTML = buf2hex(kid);
		 	spnAlgSign.innerHTML =  algorithmSign ;
		 	spnAlgDigest.innerHTML =  algorithmDigest;
*/

sig1 = typedArrayToBuffer(signature);
sig2 = signature.buffer;
console.log(buf2hex(sig1));
console.log(buf2hex(sig2));


/*	sig = signatureData[3];
	sigRed = sig.reduce ( (str, v) => str + String.fromCharCode(v), "")
	sigFinal = btoa(sigRed);
	console.log("N. " ,3, ":", sigFinal);
*/






	qrdays = ((greenpassData[4]*1000 - greenpassData[6]*1000)/86400000).toFixed(0);
	qrmonths = ((greenpassData[4]*1000 - greenpassData[6]*1000)/2592000000).toFixed(0);
	qrCreation = new Date(greenpassData[6]*1000).toLocaleString();
	qrExpiration = new Date(greenpassData[4]*1000).toLocaleString();
	console.log("greenpassData =",greenpassData);

	rawjson = JSON.stringify(greenpassData, null, "\t");;
/*
	firstname.innerHTML =  "-";
	surname.innerHTML =    "-";
	birth.innerHTML =    "-";

	covidend.innerHTML =   "-";
	tested.innerHTML =   "-";
	vaccin.innerHTML =   "-";

/// VACCINATO
	targetV.innerHTML =   "-";
	proph.innerHTML =   "-";
	vaccid.innerHTML =   "-";
	manuf.innerHTML =   "-";
	receivedDoses.innerHTML =    "-";
	neededDoses.innerHTML =    "-";
	vaccinDate.innerHTML =    "-";
	nation.innerHTML =    "-";
	issuerV.innerHTML =  "-";
	idV.innerHTML =    "-";

/// TESTATO
	testDate.innerHTML =   "-"; //sc
	testDevice.innerHTML =   "-"; //ma
	testType.innerHTML =   "-"; //tt
	testName.innerHTML =   "-"; //nm
	testCountryTestato.innerHTML =   "-"; //co
	testCenter.innerHTML =   "-"; //tc
	testCertId.innerHTML =   "-"; //ci
	issuerT.innerHTML =   "-"; //is
	testDisease.innerHTML =   "-"; //tg
	testResult.innerHTML =   "-"; //tr

/// GUARITO
	covidend.innerHTML =    "-";
	targetR.innerHTML =    "-";
	firstPositive.innerHTML =    "-";
	testCountryGuarito.innerHTML =    "-";
	issuerR.innerHTML =    "-";
	validFromR.innerHTML =    "-";
	validToR.innerHTML =    "-";
	validForDaysR.innerHTML =    "-";
	certIdR.innerHTML =    "-";


	validFromR.innerHTML =    "-";
  validToR.innerHTML =    "-";
  validForDaysR.innerHTML = "-";
*/
try {
	console.log("First name:", greenpassData[-260][1].nam.gn);
//	firstname.innerHTML =  greenpassData[-260][1].nam.gn;

    result.firstname=greenpassData[-260][1].nam.gn;

	console.log("Surname:", greenpassData[-260][1].nam.fn);
//	surname.innerHTML =  greenpassData[-260][1].nam.fn;
    result.lastname=greenpassData[-260][1].nam.fn;


	console.log("Born:", greenpassData[-260][1].dob);
    result.birthdate=greenpassData[-260][1].dob;
//	birth.innerHTML =  greenpassData[-260][1].dob;

////////////// VACCINATO
	if (greenpassData[-260][1].v != null) {
		console.log("Vaccinato");
        /*
		vaccin.innerHTML =   "Yes";
		targetV.innerHTML =   diseasesValues[diseasesKeys.indexOf(greenpassData[-260][1].v[0].tg)].display;
		proph.innerHTML =   prophylaxisValues[prophylaxisKeys.indexOf(greenpassData[-260][1].v[0].vp)].display;
		vaccid.innerHTML =   productsValues[productsKeys.indexOf(greenpassData[-260][1].v[0].mp)].display;
		manuf.innerHTML =   manufacturersValues[manufacturersKeys.indexOf(greenpassData[-260][1].v[0].ma)].display;
        */
		console.log("Vaccine doses:", greenpassData[-260][1].v[0].dn);
		//receivedDoses.innerHTML =  greenpassData[-260][1].v[0].dn;

		console.log("Vaccine doses needed:", greenpassData[-260][1].v[0].sd);
		//neededDoses.innerHTML =  greenpassData[-260][1].v[0].sd;

		console.log("Vaccin date:", greenpassData[-260][1].v[0].dt);
		//vaccinDate.innerHTML =  greenpassData[-260][1].v[0].dt;

		//nation.innerHTML =  greenpassData[-260][1].v[0].co;

		//issuerV.innerHTML =  greenpassData[-260][1].v[0].is;
		//idV.innerHTML =    greenpassData[-260][1].v[0].ci;

		} else {
			//vaccin.innerHTML =   "No";
		}

////////// TESTATO
	if (greenpassData[-260][1].t != null) {
		console.log("Testato");
/*		tested.innerHTML =   "Yes";
		testDisease.innerHTML =   diseasesValues[diseasesKeys.indexOf(greenpassData[-260][1].t[0].tg)].display;
		testType.innerHTML =  testTypeValues[testTypeKeys.indexOf(greenpassData[-260][1].t[0].tt)].display;
		testName.innerHTML =   greenpassData[-260][1].t[0].nm;
		testDevice.innerHTML =  testDeviceValues[testDeviceKeys.indexOf(greenpassData[-260][1].t[0].ma)].display;;
		testDate.innerHTML =    greenpassData[-260][1].t[0].sc;
		testResult.innerHTML =   greenpassData[-260][1].t[0].tr;
		testCenter.innerHTML =   greenpassData[-260][1].t[0].tc;
		//dr.innerHTML =    greenpassData[-260][1].t[0].dr; ???
		testCountryTestato.innerHTML =  greenpassData[-260][1].t[0].co;
		issuerT.innerHTML =   greenpassData[-260][1].t[0].is;
		testCertId.innerHTML =   greenpassData[-260][1].t[0].ci;
*/        
	}else {
	//		tested.innerHTML =   "No";
	}


///////// GUARITO
	if (greenpassData[-260][1].r != null) {
		console.log("Guarito");
		//covidend.innerHTML =   "Yes";
		//targetR.innerHTML =    diseasesValues[diseasesKeys.indexOf(greenpassData[-260][1].r[0].tg)].display;;
		console.log("1");
		//firstPositive.innerHTML =    greenpassData[-260][1].r[0].fr;
		//testCountryGuarito.innerHTML =    greenpassData[-260][1].r[0].co;
		console.log("2");
		//issuerR.innerHTML =    greenpassData[-260][1].r[0].is;
		//validFromR.innerHTML =    greenpassData[-260][1].r[0].df;
		//validToR.innerHTML =    greenpassData[-260][1].r[0].du;

		fromDate = new Date(greenpassData[-260][1].r[0].df);
		toDate = new Date(greenpassData[-260][1].r[0].du);
		diffDays = (toDate.getTime() - fromDate.getTime())/86400000;
        result.fromDate=fromDate;
        result.toDate=toDate;
        result.stillValid=diffDays;

		//validForDaysR.innerHTML =    diffDays.toFixed(0);
		//certIdR.innerHTML =    greenpassData[-260][1].r[0].ci;

	} else {
			covidend.innerHTML =   "No";
	}

    return result;

} catch (e) {
	console.log("ops");
}
	console.log("QR code creation date:", qrCreation);
	console.log("QR code expiration date:", qrExpiration);
	console.log("QR code duration (days):",   qrdays);
	console.log("QR code duration (months):", qrmonths);

	//qrdate1.innerHTML =  qrCreation;
	//qrdate2.innerHTML =  qrExpiration;
	//days.innerHTML =  qrdays;
	//months.innerHTML =  qrmonths;

	today = new Date();
	todayDays = today.getDate();

	diff = (new Date(greenpassData[4]*1000).getTime() - (new Date()).getTime())/86400000;
	//daysleft.innerHTML = diff.toFixed(0);
	//monthsleft.innerHTML = (diff/30).toFixed(2);
    return result;

}

/* DUTCH QR Codes */

const go = new Go();
let mod,
inst;

// read a file getted 

		function filesystemFail (err) { alert("FS: DATA FAIL"); console.log(err.code);};
      function fileEntryFail (err) { alert("File entry: FAIL"); };
      function writeFail (err) { alert("Writing: DATA FAIL"); };
      function readFail (err) { alert("Reading: DATA FAIL"); };

    function readFile(fileEntry,target) {

        console.log('Reading file....');

        fileEntry.file(function (fileEntry)
        {

            console.log("path to file: ",fileEntry.fullPath);
            console.log("file to read: ",fileEntry.file);

            var reader = new FileReader();
            reader.onloadend = function()
            {
                console.log("Successful file read: ",this.result);
                target=this.result;
            };
            reader.readAsText(fileEntry);

        }, readFail );

      };
	  

	  
	  

document.addEventListener("deviceready", function() { 
	console.log('Device is ready!');
    StatusBar.backgroundColorByHexString('#FFFFFF');
    appRequestReady();
    //Keep screen awake
    window.plugins.insomnia.keepAwake();
}, false);


function readfromwww(_mimetype,_filename,callback)
{
	console.log('readfromwww ' + _filename );
	var request = new XMLHttpRequest();
	request.overrideMimeType(_mimetype ); 
	request.open("GET", _filename );
	request.onreadystatechange = () =>
	{
	  if(request.status > 300)
	  {
		if(rs==404) console.log('file not found in www: ',request.status);
		else console.log('error on request: ',request.status);
	  }
	  else if(request.responseText!=undefined && request.responseText!='')
	  {

		//from json string to js obj content
		if(_mimetype == "application/json") {
			console.log('File was loaded OK' + request.responseText );
		  callback(JSON.parse(request.responseText));
		}
		//return string into your file
		else {
		console.log('File was loaded OK' + request.responseText );
		  callback(request.responseText);
		}

	  }

	}
	request.send();
}



function setup() {
    console.log('setting up Go environment');

    if(document.location.protocol != "http:" && document.location.protocol != "https:"){	
		console.log('alternative xml loading for cordova');
		try {

			readfromwww('application/xml', 'testPk.xml',
            data => {
				testPk=data.toString();
				//console.log('OLE! INTO THE FILE: ',testPk);
            });			


			readfromwww('application/xml', 'VWS-CC-1.xml',
            data => {
				vwsCC1=data.toString();
				//console.log('OLE! INTO THE FILE: ',vwsCC1);
            });			


			readfromwww('application/xml', 'VWS-CC-2.xml',
            data => {
				vwsCC2=data.toString();
				//console.log('OLE! INTO THE FILE: ',vwsCC2);
            });			
			
		} 
		catch (error) {
		  console.error(error);
		}
	}
	else {
		fetch('testPk.xml')
		.then(response => response.text())
		.then(xmlString => testPk = xmlString)
		fetch('VWS-CC-1.xml')
		.then(response => response.text())
		.then(xmlString => vwsCC1 = xmlString)
		fetch('VWS-CC-2.xml')
		.then(response => response.text())
		.then(xmlString => vwsCC2 = xmlString)
	}

    if (!WebAssembly.instantiateStreaming) {
        // polyfill
        WebAssembly.instantiateStreaming = async(resp, importObject) => {
            const source = await(await resp).arrayBuffer();
            return await WebAssembly.instantiate(source, importObject);
        };
    }

    WebAssembly.instantiateStreaming(fetch("lib.wasm"), go.importObject).then(
        async result => {
        mod = result.module;
        inst = result.instance;
        await go.run(inst);
        inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance
    }).then(awaitWasm());
}

setup()

async function loadCertsExec() {
    if (typeof(loadCerts) != "undefined" && typeof(vwsCC2) != "undefined") {
        console.log('loading certs');
        console.log('testPk = ' + testPk);
        console.log('vwsCC1 = ' + vwsCC1);
        console.log('vwsCC2 = ' + vwsCC2);
        certs = await loadCerts(testPk, vwsCC1, vwsCC2);
    }
    else {
		console.log('Waiting on cert loading');
        setTimeout(loadCertsExec,5000);
    }
    
}

async function awaitWasm(){
    await setTimeout(loadCertsExec,1000);
}



checkPinAuth();