var $ = Dom7;
var device = Framework7.getDevice();

var connectionOk=false;
//Detect user agents
var app_browser=false;
var app_last_scanned=null;
var app_stored_codes={
	"label": {
		"0": ""
	},
	"value": {
		"0": "NL2:7:HFIN*UZU00CM.I3TN0TCCW1GCTCSJ79*LOWVX 9JV2T-YPKHD.GKMN 8W/AQLZABYEQ AKVTVD.VJ-%6MN6JISIFLILGN97RR9F37Q+15IQUL:66-RP83Z% 9LKH3G33$/6BY F3PW.. ZB6G:T65L2BN$E*R3:7QPE/TOWUT5YK-$-B$BD6JJUQGJ-FZBTPC*8G$K0:C0OBW/A3A/.U0LDPMJ%6VFP39%TO.NOT15-O/5T9$O.7EEZGFB63COX%5G9H.IA0Z-JNK5 TJ7F8C.Y X04:D.9QB*L5%N-K.ME%E8.AF+1A/H1-DX9*CAKB$LXA:ZF*MHLWUP:ZDBX7IRQT*9ABRSYLGK*6J.Y M*VXZ:FN-Y:*XAF2W86-QQ+CN71G2*UN SPU27%I0MNXNCG9MBY2 .%SVNZ76HO3E5YJILCS-5EVEXMGFT0DXZ0DO2VBV4341V/H $ZJ7+.F+FUWV0/.SQ%46LJ204E/0ZG%UQ%/RD6S%+JTTK-9+YF9SG$36ZBP3 ND+B1N$V6CWQ:2-0LFN10EH298.R9ETE4QTY/Q81*T%*+HT:%816DI9KQLQFYC4:LMFB1+EVO8UCZXDK7I.I/4MMPKK%%$0CZSMLL2FWT2DD:$A2.P734/G09MVP J64++2/.N0/-*9F-1EZDA0E%-WSNVDC%J6GABLDE$$XY:WV2JWCBNLRIPI6AW -:0U -BOJ+AV%9%LSVN947.:0NI-BXG*Y1-.:VE:FZKSMHGKC7N*A4.O/Q$FW8E8M7M KQF-CAPQM/UNT8F-+ 7WH6A1KQ-7-3CH-%8V.ACL-$4IZDK4MGQJ+*Q0.0TUV6B90ZFW+NMRHN*N:F-0GB8-3L8:X+FQIT+0:MV2V+1MSU*$MAX-VAKZA12D24HZS8+EWZ"
	}
};

app_qr_code='';

var app_saved_codes;
const tddate = new Date();
let time = tddate.getTime();

try{
    readfromwww('application/json', 'data.json?t='+time,
    data => {
        app_saved_codes=data;
        showCodes();
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
            cordovaApp.init(f7);
            app_device=f7.device;
            console.log(app_device);
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

function delQr(aCode) {
    app.dialog.confirm('Wil je deze QR code verwijderen?', 'QR Verdwijderen', function(){
        app_stored_codes.label[aCode]='';
        app_stored_codes.value[aCode]='';

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

        
    }, 
    function(){});
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
                value: app_stored_codes[keys[1]][j],
                arrIdx: j,
            })
        }
    }
    if(app_saved_codes) {
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
    //console.log(optionsarray);
    var tHtml='<div class="block-title">Op je telefoon opgeslagen codes</div><div class="list links-list"><ul>';
    optionsarray.forEach(function(aOption,aIdx){
        //console.log(aOption);
        if(aOption.arrIdx) {
            tHtml+='<li class="row no-gap"><div class="col-20"><a href="javascript:delQr('+(aOption.arrIdx)+');" class="button button-fill color-red button-round" data-login-screen="#my-qr-screen">DEL</a></div><div class="col-80"><a class="link" href="javascript:showQr(\''+encodeURIComponent(aOption.value)+'\',\''+aOption.label+'\');"><span id="">'+(aIdx+1)+'. <b>'+aOption.label+'</b></span></a></div></li>';
        }
        else {
            //Demo codes cannot be deleted
            tHtml+='<li class="row no-gap"><div class="col-20"> </div><div class="col-80"><a class="link" href="javascript:showQr(\''+encodeURIComponent(aOption.value)+'\',\''+aOption.label+'\');"><span id="">'+(aIdx+1)+'. <b>'+aOption.label+'</b></span></a></div></li>';
        }
        
    });
    tHtml+='</ul></div>';
    $("#data_list").html(tHtml);
}




var org_width = 1;
var org_height = 1;
var d = 1;
    
function mirror() {
    attrValue = (d == 1) ? "scale(-1, 1) translate(-" + org_width.toString() + ", 0) " : "scale(1, 1) translate(0, 0)";
    d = (d == 1) ? -1 : 1;
    var lottie = document.getElementById("lottie");
    if (lottie) {
        lottie.children.forEach(function(svg) {
            if (svg) {
                var g = svg.childNodes[1];
                if (g)
                    g.setAttribute('transform', attrValue);
            }
        });
    }
}

var int_org_width = 1;
var int_org_height = 1;
var int_d = 1;


function mirrorInt() {
    attrValue = (int_d == 1) ? "scale(-1, 1) translate(-" + int_org_width.toString() + ", 0) " : "scale(1, 1) translate(0, 0)";
    int_d = (int_d == 1) ? -1 : 1;
    var lottie = document.getElementById("lottieInt");
    if (lottie) {
        lottie.children.forEach(function(svg) {
            if (svg) {
                var g = svg.childNodes[1];
                if (g)
                    g.setAttribute('transform', attrValue);
            }
        });
    }
}


function on_resize() {
    var lottie = document.getElementById("lottie");
    var svg = lottie.firstElementChild;
    if (svg != null) {
        //svg.setAttribute('width', lottie.clientWidth + "px");
        //svg.setAttribute('height', lottie.clientHeight + "px");
        svg.style.width = lottie.clientWidth;
        svg.style.height = lottie.clientWidth * org_height / org_width;
    }
    
    var lottie = document.getElementById("lottieInt");
    var svg = lottie.firstElementChild;
    if (svg != null) {
        //svg.setAttribute('width', lottie.clientWidth + "px");
        //svg.setAttribute('height', lottie.clientHeight + "px");
        svg.style.width = lottie.clientWidth;
        svg.style.height = lottie.clientWidth * int_org_height / int_org_width;
    }
    
}

function openFullscreen() {
    /* iOS re-orientation fix */
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        /* iOS hides Safari address bar */
        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 1000);
    }
    var elem = document.getElementById("page");

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
        elem.webkitEnterFullScreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

var animationLoaded=false;
var qrLoaded=false;
var qrCodeObject;
var qrSaved='';


function showQr(aCode,aLabel){
    $("#slide_title_1").css("margin-right","0px");
    $("#slide_title_2").css("margin-right","0px");


    swiper2.slideTo(1,1,false)
    swiper2.slideTo(0,1,false)
    qrSaved=aCode;
    aLabel = aLabel.replace('(NL)','');
    $("#qrLabel").html(aLabel);
    $("#qrLabelInt").html(aLabel);

    //Legacy mode below
    /*window.location='qr.html?n=klokkenluiders&qr='+encodeURIComponent(aCode);
    return;*/
    closeScreens();
}

function openViewQr(){
    
    if(qrSaved=='') {
        //We must select a QR
        app.loginScreen.open('#my-klokkenluiders-screen',false);
        return;
    }
    
    //Save the brightness
    if(!app_browser) {
        var brightness = cordova.plugins.brightness;
        brightness.getBrightness(function(aBrightness){
            storeBrightness=aBrightness;
        }, function(){console.log('read brightness error');});
        brightness.setBrightness(1, function(){}, function(){});
    }

    app.loginScreen.open('#my-show-qr-screen',false);
    var aCode = qrSaved;
    if(qrLoaded) {
        qrCodeObject.makeCode(aCode);
    }
    else {
        let element=document.getElementById("qrcode");
        qrCodeObject = new QRCode(element, {
        width: element.offsetWidth,
        height: element.offsetWidth,
        text: aCode,
        correctLevel: QRCode.CorrectLevel.M
        });
        
    }

    //Make sure it is not there
    if (document.getElementById('lottie').firstElementChild==null) {
        var animation = bodymovin.loadAnimation({
            container: document.getElementById('lottie'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData :animNl
        })

        animation.addEventListener('DOMLoaded',
            function (e) {
                var lottie = document.getElementById("lottie");
                var svg = lottie.firstElementChild;
                if (svg != null) {
                    org_width = svg.width.baseVal.value;
                    org_height = svg.height.baseVal.value;
                    on_resize();
                }
            }
        );            
    }
    else {
        //Reload if removed
        var svg=document.getElementById('lottie').firstElementChild;
        if (document.getElementById('lottie').firstElementChild.style.height=="0px") {
            document.getElementById('lottie').children.forEach(
                function(aChild,aIdx){
                    console.log(aIdx+' :');
                    console.log(aChild);
                    if(aIdx>0) {
                        aChild.remove();
                    }
                }
            );
            //document.getElementById('lottie').firstElementChild.remove();
            var animation = bodymovin.loadAnimation({
                container: document.getElementById('lottie'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData :animNl
            })
        }
    }

    animationLoaded=true;
    qrLoaded=true;
    //If we change animation, the other one is no longer loaded
    animationIntLoaded=false;
    
}

var animationIntLoaded=false;
var qrIntLoaded=false;

var storeBrightness;

function openViewQrInt(){
    if(qrSaved=='') {
        //We must select a QR
        app.loginScreen.open('#my-klokkenluiders-screen',false);
        return;
    }

    if(!app_browser) {
        //Save the brightness
        var brightness = cordova.plugins.brightness;
        brightness.getBrightness(function(aBrightness){
            storeBrightness=aBrightness;
        }, function(){console.log('read brightness error');});
        brightness.setBrightness(1, function(){}, function(){});
    }
    
    
    app.loginScreen.open('#my-show-qr-int-screen',false);
    var aCode = qrSaved;
    if(qrIntLoaded) {
        qrCodeObject.makeCode(aCode);
    }
    else {
        let element=document.getElementById("qrcodeInt");
        qrCodeObject = new QRCode(element, {
        width: element.offsetWidth,
        height: element.offsetWidth,
        text: aCode,
        correctLevel: QRCode.CorrectLevel.M
        });
        
    }


    //Make sure it is not there
    if (document.getElementById('lottieInt').firstElementChild==null) {
        var animation = bodymovin.loadAnimation({
            container: document.getElementById('lottieInt'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData :animInt
        })

        animation.addEventListener('DOMLoaded',
            function (e) {
                var lottie = document.getElementById("lottieInt");
                var svg = lottie.firstElementChild;
                if (svg != null) {
                    int_org_width = svg.width.baseVal.value;
                    int_org_height = svg.height.baseVal.value;
                    on_resize();
                }
            }
        );            
    }
    else {
        //Reload if removed
        var svg=document.getElementById('lottieInt').firstElementChild;
        if (document.getElementById('lottieInt').firstElementChild.style.height=="0px") {
            document.getElementById('lottieInt').children.forEach(
                function(aChild,aIdx){
                    console.log(aIdx+' :');
                    console.log(aChild);
                    if(aIdx>0) {
                        aChild.remove();
                    }
                }
            );
            //document.getElementById('lottieInt').firstElementChild.remove();
            var animation = bodymovin.loadAnimation({
                container: document.getElementById('lottieInt'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData :animInt
            })
        }
    }
    animationIntLoaded=true;
    qrIntLoaded=true;
    animationLoaded=false;
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
    //console.log(optionsarray)
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
              //console.log(tObj);
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
            //console.log(optionsarray) 
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

    //Load klokkenluiders-page
    app.loginScreen.open('#my-klokkenluiders-screen',false);

    if(document.getElementById("remove_add")) {
        if (document.getElementById("remove_add").nextElementSibling != null) {
            if (document.getElementById("remove_add").nextElementSibling.style.zIndex=='9999999') {
                //We have the webhost add
                document.getElementById("remove_add").nextElementSibling.style.display='none';
            }
        }
    }
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
    try {
        var result=readCode(aString);
        //alert(result);
        console.log('decodeQrNL ' + result);
        return result;
    }
    catch {
        //Wasm / Go crashed? Just reinitialize
        setup();
        return('{}');
    }
}

function decodeQrHC(aString){
    return controlla(aString);
}

function processQr(aQrTxt) {
    //alert(processQr);
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
    else {
        data.device='browser';
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

    var doDecode=false;
    if(data.scan.startsWith('HC1:') ) {
        var tDecoded=decodeQrHC(data.scan);
        //alert(JSON.stringify(tDecoded));
        decoded.firstName=tDecoded.firstname.charAt(0);
        decoded.lastName=tDecoded.lastname.charAt(0);
        var tDateParts=tDecoded.birthdate.split('-');
        decoded.birthDay=tDateParts[2];
        decoded.birthMonth=months[parseInt(tDateParts[1])];
        codeFound=true;
        doDecode=true;
    }

    if(data.scan.startsWith('NL2:') ) {
        var tDecoded=JSON.parse(decodeQrNL(data.scan));
        if(tDecoded){
            decoded.lastName=tDecoded.attributes.lastNameInitial;
            decoded.firstName=tDecoded.attributes.firstNameInitial;
            decoded.birthDay=tDecoded.attributes.birthDay;
            decoded.birthMonth=months[tDecoded.attributes.birthMonth];
            if(tDecoded.attributes.validForHours) {
                if(parseInt(tDecoded.attributes.validForHours)>48) {
                    decoded.validForHours=tDecoded.attributes.validForHours;
                    doDecode=true;
                }    
            }
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
    $("#qrM").html(decoded.birthMonth);
    data.info=decoded;
    if(doDecode){setTimeout(function(){var decoding=DecodeCrypto(data);},300);}
    app.loginScreen.open('#my-confirm-screen',false);
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
                    if(aDevice.label.toLowerCase().includes('back') || aDevice.label.toLowerCase().includes('achter' ) ) {
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

function closeScreens(restoreBrightness=false){
    app.loginScreen.close('#my-confirm-screen',false);
    app.loginScreen.close('#my-green-screen',false);
    app.loginScreen.close('#my-qr-screen',false);
    app.loginScreen.close('#my-show-qr-screen',false);
    app.loginScreen.close('#my-show-qr-int-screen',false);
    app.loginScreen.close('#my-klokkenluiders-screen',false);
    if(restoreBrightness && !app_browser ){
        var brightness = cordova.plugins.brightness;
        brightness.setBrightness(storeBrightness, function(){}, function(){});
    }
    
    if(qrSaved=='') {
        //We must select a QR
        app.loginScreen.open('#my-klokkenluiders-screen',false);
    }
}

function greenOk(){
    //Store this code and refresh
    var lastCode=Object.keys(app_stored_codes.label).length;
    
    app_stored_codes.value[lastCode]=app_last_scanned.qr;
    if(app_last_scanned.qr.startsWith('NL2:') ) {
        app_stored_codes.label[lastCode]=app_last_scanned.firstName+app_last_scanned.lastName+' ' + app_last_scanned.birthDay + ' ' + app_last_scanned.birthMonth + ' (NL)';
    }
    else {
        app_stored_codes.label[lastCode]=app_last_scanned.firstName+app_last_scanned.lastName+' ' + app_last_scanned.birthDay + ' ' + app_last_scanned.birthMonth;
    }

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
        app.loginScreen.open('#my-klokkenluiders-screen',false);
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
	  

	  
	  
var animInt;
var animNl;
document.addEventListener("deviceready", function() { 
	console.log('Device is ready!');
    StatusBar.backgroundColorByHexString('#FFFFFF');
    appRequestReady();
    //Keep screen awake
    window.plugins.insomnia.keepAwake();

    try{

        readfromwww('application/json', 'skatefiets2.json',
        data1 => {
            animNl=data1;
            var animation = bodymovin.loadAnimation({
                container: document.getElementById('animatie1'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData : animNl
            })

        });	
        
                
        readfromwww('application/json', 'moving_walkway.json',
        data2 => {
            animInt=data2;
            var animation = bodymovin.loadAnimation({
                container: document.getElementById('animatie2'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData : animInt
            })
        });	
    }
    catch (error) {
        scan1={};
        scan2={};
        scan3={};
        scan4={};
    }



}, false);



function readfromwww(_mimetype,_filename,callback)
{
	console.log('readfromwww ' + _filename );
	var request = new XMLHttpRequest();
	request.overrideMimeType(_mimetype ); 
	request.open("GET", _filename );
	request.onreadystatechange = () =>
	{
      if( request.readyState === XMLHttpRequest.DONE) {
          if(request.status > 300)
          {
            if(rs==404) console.log('file not found in www: ',request.status);
            else console.log('error on request: ',request.status);
          }
          else if(request.responseText!=undefined && request.responseText!='')
          {

            //from json string to js obj content
            if(_mimetype == "application/json") {
                //console.log('File was loaded OK JSON' + request.responseText );
                try {
                    var result = request.responseText;
                    var tJson=JSON.parse(result);
                    callback(tJson);
                }
                catch (error) {
                  console.error(error);
                  console.error(result);
                  //callback(result);
                }
            }
            //return string into your file
            else {
                console.log('File was loaded OK' + request.responseText );
                  callback(request.responseText);
                }
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

    request = new XMLHttpRequest();
    request.open('GET', 'lib.wasm');
    request.responseType = 'arraybuffer';
    request.send();

    request.onload = function() {
        var bytes = request.response;
        WebAssembly.instantiate(bytes, go.importObject).then(
            async result => {
            mod = result.module;
            inst = result.instance;
            await go.run(inst);
            inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance
        }).then(awaitWasm());
    };
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


function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}


async function decryptQr(aMessage) {
    var ciphertext = CryptoJS.enc.Base64.parse(aMessage);
    // split iv and ciphertext
    var iv = CryptoJS.enc.Utf8.parse("1234567890123456");
    var key = CryptoJS.enc.Utf8.parse("https://t.me/klokkenluiders 2021");
    // decryption
    var decrypted = CryptoJS.AES.decrypt({ciphertext: ciphertext}, key, {
      iv: iv,
      mode: CryptoJS.mode.CFB
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

async function saveQrFile(aTxt) {
    try {
        var decoded=await decryptQr(aTxt);
        var CodeToImport = JSON.parse(decoded);
        console.log(CodeToImport);
        if(!CodeToImport.label) {
            app.dialog.alert('Code niet toegevoegd','Dit is een ongeldig QR bestand.');
            return;
        }

        if(!CodeToImport.label[0]) {
            app.dialog.alert('Code niet toegevoegd','Dit is een ongeldig QR bestand.');
            return;
        }

        if(!CodeToImport.value) {
            app.dialog.alert('Code niet toegevoegd','Dit is een ongeldig QR bestand.');
            return;
        }

        if(!CodeToImport.value[0]) {
            app.dialog.alert('Code niet toegevoegd','Dit is een ongeldig QR bestand.');
            return;
        }
        
        //Valid .qr file Add it to local storage

        //Store this code and refresh
        var lastCode=Object.keys(app_stored_codes.label).length;
        
        app_stored_codes.value[lastCode]=CodeToImport.value[0];
        app_stored_codes.label[lastCode]=CodeToImport.label[0];
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
    catch {
        app.dialog.alert('Code niet toegevoegd','Dit is een ongeldig QR bestand.');
    }

}

async function importQr(){
    if (app_browser) {

        let fileInput = document.getElementById('qr-file')
        fileInput.click();

        fileInput.onchange = () => {
            var file = document.getElementById("qr-file").files[0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    console.log(evt.target.result);
                    try {
                        var CodeToImport=evt.target.result;
                        saveQrFile(CodeToImport);
                    }
                    catch {
                        app.dialog.alert('Code niet toegevoegd','Dit is een ongeldig QR bestand.');
                    }
                }
                reader.onerror = function (evt) {
                    app.dialog.alert('Code niet toegevoegd','Lezen van bestand mislukt');
                }
            }
            else {
                app.dialog.alert('Code niet toegevoegd','Importeren geannuleerd');
            }
        }
    }
    else {
        (async () => {
            const file = await chooser.getFile();
            if(file) {
                if (file.name !='canceled') {
                    if(file.name.toLowerCase().endsWith('.qr') ) {
                        var contents=Utf8ArrayToStr(file.data);
                        try {
                            var CodeToImport=contents;
                            saveQrFile(CodeToImport);
                        }
                        catch {
                            app.dialog.alert('Code niet toegevoegd','Dit is een ongeldig QR bestand.');
                        }
                    }
                    else {
                        app.dialog.alert('Code niet toegevoegd','Je kunt enkel een .qr bestand kiezen.');
                    }
                }
                else {
                    app.dialog.alert('Code niet toegevoegd','Importeren geannuleerd');
                }
            }
            else {
                app.dialog.alert('Code niet toegevoegd','Importeren geannuleerd');
            }
        })();
        
    }
}

function setCurrentSlide(ele,index){
    $(".swiper1 .swiper-slide").removeClass("selected");
    $("#slide_title_1").css("margin-right","0px");
    $("#slide_title_2").css("margin-right","0px");

    ele.addClass("selected");
    if(index==0) {
        $("#slide_title_1").css("height","50px");
        $("#slide_title_2").css("height","52px");
    }
    else {
        $("#slide_title_1").css("height","52px");
        $("#slide_title_2").css("height","50px");
    }
    
  }
  
var swiper1 = new Swiper('.swiper1', {
        slidesPerView: 2,
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true,
        loop: false,
        onTab:function(swiper){
          var n = swiper1.clickedIndex;
          alert(1);
        },
        onSlideChangeEnd: function(swiper){
            console.log('Swiper 1 ');
            var n=swiper.activeIndex;
            setCurrentSlide($(".swiper1 .swiper-slide").eq(n),n);
            swiper1.slideTo(n, 500, false);
        }
    });

swiper1.slides.each(function(index,val){
    var ele=$(this);
    ele.on("click",function(){
        setCurrentSlide(ele,val);
        swiper2.slideTo(val, 500, false);
    });
  });
  
  
var swiper2 = new Swiper ('.swiper2', {
    direction: 'horizontal',
    loop: false,
    autoHeight: true,
    onSlideChangeEnd: function(swiper){
        console.log('Swiper 2 ');
        var n=swiper.activeIndex;
        setCurrentSlide($(".swiper1 .swiper-slide").eq(n),n);
        swiper1.slideTo(n, 500, false);
    }
  });
  
swiper2.on('slideChange', function (swiper) {
    console.log('slide changed');
    var n=swiper.activeIndex;
    swiper1.slideTo(n, 500, false);
    setCurrentSlide($(".swiper1 .swiper-slide").eq(n),n);
});

$("#slide_title_1").css("margin-right","0px");
$("#slide_title_2").css("margin-right","0px");
$("#slide_title_2").css("height","52px");
$("#slide_1").css("height","5800");
$("#slide_2").css("height","5800");



window.addEventListener('resize', () => {
    // do something on window resize
    $("#slide_title_1").css("margin-right","0px");
    $("#slide_title_2").css("margin-right","0px");
})


async function awaitWasm(){
    await setTimeout(loadCertsExec,1000);
}
