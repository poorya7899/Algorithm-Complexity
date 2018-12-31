// onclick function for change page
function changPage(pageId){
    document.getElementById("infoBox").style.opacity = 0;
    document.getElementById("calcBox").style.opacity = 0;
    document.getElementById("compBox").style.opacity = 0;
    document.getElementById("resBox").style.opacity = 0;
    setTimeout(() => {
    document.getElementById("final--result").style.display = "block";
    document.getElementById("infoBox").style.display = "none";
    document.getElementById("calcBox").style.display = "none";
    document.getElementById("compBox").style.display = "none";
    document.getElementById("resBox").style.display = "none";
    document.getElementById("show-result").style.display = "none";
    pageId.style.display = "block";
        pageId.style.opacity=1;
    }, 500);
}
// define language of codes and default language
var mylang ={
    lang: "python3",
    version: "2" }
const python={
    lang: "python3",
    version: "2" }
const C={
    lang: "c",
    version: "3" }
const CPP={
    lang: "cpp",
    version: "3" }
// global var for compare and calculate
var Tawans= [];
var mypoints = ["","",""];
var code = "";
// style for changing language of codes
function langu(index){
    document.getElementById("Python3").style.color = "cornsilk" ;
    document.getElementById("C").style.color = "cornsilk" ;
    document.getElementById("CPP").style.color = "cornsilk" ;
    switch (index) {
        case 0 :
            mylang = python;
            document.getElementById("Python3").style.color = "black" ;
        break;
        case 1 :
            mylang = C;
            code = "#include<stdio.h>\nint ";
            document.getElementById("C").style.color = "black" ;
        break;
        case 2 :
            mylang = CPP;
            code = "#include <iostream>\n using namespace std;\n int "
            document.getElementById("CPP").style.color = "black" ;
        break;
        default :
        mylang = python;
        code = "";
    }
}
// start calculate complexity of each code
function calculate(mytextarea , num){
    // num is a variable for show code number and what should do
    var num = parseInt(num);
    // starat calc ; go to result page to show loading
    changPage(resBox);
    //intialize points
    mypoints = ["","",""];
    //get code from textarea
    let code1 = mytextarea.value;
    var sendcode ;
        for(var i = 1 ; i< 16 ; i++){
            // creat code with n value and librarys
            sendcode = code +"n = "+i+";\n" +code1;
            // start find points
            findpoint(sendcode,i ,num);
        }
}
function achiveMethod(points , num){
    // data for send request ; start creat request
    var data = {
        tool : 'lagrange-interpolating-polynomial',
        points : points
    };
    var urlEncodedData = "";
    var urlEncodedDataPairs = [];
    for (var name in data){
        urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    var url2 = "https://www.dcode.fr/api/";
    var funcreq = new XMLHttpRequest();
    funcreq.open("POST",url2);
    funcreq.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    funcreq.send(urlEncodedData);
    funcreq.onload = () => {
        var str = JSON.parse(funcreq.response).results;
        console.log(str);
        str = str.slice(10 , -3);
        if (num == 0){
            // should calcualte one code complexity ; now show result
            show(str);
        }
        else{
            // we are compare two codes ; find power of method
            // x is index of x variable in method
            var x = str.indexOf("x");
            // t is index of ^  in method
            var t = str.indexOf("^");
            var tavan="0";
            if(x==-1){
                // method has'nt any x
                tavan="0";
            }
            else if(t==-1){
                // method has x with power 1
                tavan = "1";
            }
            else if(x!=-1 && t!=-1){
                // find power
                tavan = "";
                t+=1;
				if( str[t] == "{"){
					t++;
				}
                while(str[t]!="+" && str[t] != "-" && t != str.lenght &&str[t]!="}"){
                    tavan+=str[t];
                    t++;
                }
            }
            Tawans[num-1] = tavan;
            console.log(Tawans[0] , Tawans[1]);
            if(Tawans[0] != -1 && Tawans[1] !=-1){
                // we do 2 calculate for coparing ; lets go to finde result
                comp();
            }
            else{
                // we do just one calculate of 2 ; should do another calculate
                calculate(compTwo,2);
            }
        }
    }
}
function findpoint(sendcode , i , num){
    // count is number of * in output
    var count = 0;
    //create request
    var req = new XMLHttpRequest();
    // var mypoint = "";
    const url = "https://api.jdoodle.com/v1/execute";
    var payloads = {clientId: "5d63f9b9cf9c18291dceac15235c712f",
                    clientSecret: "a9c77e52cecb0917002ba9fe71d9ac639256f698aa49e7a085d382de6b46e7d8",
                    script: sendcode,
                    language: mylang.lang ,
                    versionIndex: mylang.version};
    req.open("POST", url);
    req.setRequestHeader('Content-type', 'application/json');
    var jsoned = JSON.stringify(payloads)
    req.send(jsoned);
    req.onload = () => {
            var a = JSON.parse(req.response);
            for (item in a.output){
                if(a.output[item] ==="*"){
                    count++;
                }
            }
            // add x and y (x,y)
                mypoints[num]+= "("+i+","+count+")";
            if(i==15){
                return achiveMethod(mypoints[num] , num );
            }
    };
}
function Compare(){
    Tawans = [-1 , -1];
    // start do first calculate
    calculate(compOne,1);
}
function comp(){
    // comparing two method of compare page
    if(Tawans[0] > Tawans[1]){
        show("first code is greater");
    }
    else if(Tawans[0] < Tawans[1]){
        show("second code is greater");
    }
    else{
        show("codes are equal");
    }
}
function show(result){
    var text = "This Is Result:\n" + result;
    // stop loading ; show result
    document.getElementById("final--result").style.display = "none";
    document.getElementById("show-result").style.display = "block";
    document.getElementById("show-result").innerHTML = text;
}