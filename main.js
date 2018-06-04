var modal
var modalContent
var lastNumEggs=-1
var lastNumPacifist=-1
var lastSecondsUntilFull=100
lastHatchTime=0
var eggstohatch1=864
var lastUpdate=new Date().getTime();

var web3;

	 if(typeof window.web3 !== "undefined" && typeof window.web3.currentProvider !== "undefined") {
         web3 = new Web3(window.web3.currentProvider);
      } else {
      web3 = new Web3();
		
		web3.setProvider(new web3.providers.HttpProvider('https://mainnet.infura.io/uwEccFsRIgwJGznPQLDN'));
		
      }
	
	
	
function main(){
    console.log('test')
    modal = document.getElementById('myModal');
    modalContent=document.getElementById('modal-internal')
    controlLoop()
    controlLoopFaster()
}
function controlLoop(){
    refreshData()
    setTimeout(controlLoop,2500)
}
function controlLoopFaster(){
    liveUpdateEggs()
    console.log('clf')
    setTimeout(controlLoopFaster,30)
}
function refreshData(){
    var sellsforexampledoc=document.getElementById('sellsforexample')
    marketEggs(function(eggs){
        eggs=eggs/10
        calculateEggSell(eggs,function(wei){
            devFee(wei,function(fee){
                console.log('examplesellprice ',wei)
                sellsforexampledoc.textContent='('+formatEggs(eggs)+' peace would sell for '+formatEthValue(web3.fromWei(wei-fee,'ether'))+')'
            });
        });
    });
    lastHatch(web3.eth.accounts[0],function(lh){
        lastHatchTime=lh
    });
    EGGS_TO_HATCH_1PACIFIST(function(eggs){
        eggstohatch1=eggs
    });
    getMyEggs(function(eggs){
        if(lastNumEggs!=eggs){
            lastNumEggs=eggs
            lastUpdate=new Date().getTime()
            updateEggNumber(formatEggs(eggs))

        }
        var timeuntilfulldoc=document.getElementById('timeuntilfull')
        secondsuntilfull=eggstohatch1-eggs/lastNumPacifist
        console.log('secondsuntilfull ',secondsuntilfull,eggstohatch1,eggs,lastNumPacifist)
        lastSecondsUntilFull=secondsuntilfull
        timeuntilfulldoc.textContent=secondsToString(secondsuntilfull)
        if(lastNumPacifist==0){
            timeuntilfulldoc.textContent='?'
        }
    });
    getMyPacifist(function(pacifist){
        lastNumPacifist=pacifist
        var gfsdoc=document.getElementById('getfreepacifist')
        if(pacifist>0){
            gfsdoc.style.display="none"
        }
        else{
           // gfsdoc.style.display="inline-block"
        }
        var allnumpacifist=document.getElementsByClassName('numpacifist')
        for(var i=0;i<allnumpacifist.length;i++){
            if(allnumpacifist[i]){
                allnumpacifist[i].textContent=translateQuantity(pacifist,0)
            }
        }
        var productiondoc=document.getElementById('production')
        productiondoc.textContent=formatEggs(lastNumPacifist*60*60)
    });
	
	var myContract=getCon();
	
		myContract.numFree(function(err,result){
			var num=web3.toDecimal(result);		
		  var gfsdoc=document.getElementById('getfreepacifist')
        if(num>200){
            gfsdoc.style.display="none"
        }
	});
	
    updateBuyPrice()
    updateSellPrice()
	updatePacifistmasterPrice()
	updateCurrentPacifistmaster()
    var prldoc=document.getElementById('playerreflink')
    prldoc.textContent=window.location+"?ref="+web3.eth.accounts[0]
    var copyText = document.getElementById("copytextthing");
    copyText.value=prldoc.textContent
}
function updateEggNumber(eggs){
    var hatchpacifistquantitydoc=document.getElementById('hatchpacifistquantity')
    hatchpacifistquantitydoc.textContent=translateQuantity(eggs,0)
    var allnumeggs=document.getElementsByClassName('numeggs')
    for(var i=0;i<allnumeggs.length;i++){
        if(allnumeggs[i]){
            allnumeggs[i].textContent=translateQuantity(eggs)
        }
    }
}
function hatchEggs1(){
    ref=getQueryVariable('ref')
    if(!ref || ref==web3.eth.accounts[0]){
        ref=0
    }
    console.log('hatcheggs ref ',ref)
    hatchEggs(ref,displayTransactionMessage())
}
function liveUpdateEggs(){
    if(lastSecondsUntilFull>1 && lastNumEggs>=0 && lastNumPacifist>0 && eggstohatch1>0){
        currentTime=new Date().getTime()
        if(currentTime/1000-lastHatchTime>eggstohatch1){
            return;
        }
        difference=(currentTime-lastUpdate)/1000
        additionalEggs=Math.floor(difference*lastNumPacifist)
        updateEggNumber(formatEggs(lastNumEggs+additionalEggs))
    }
}
function updateSellPrice(){
    var eggstoselldoc=document.getElementById('sellprice')
    //eggstoselldoc.textContent='?'
   getMyEggs(function(eggs){
        calculateEggSell(eggs,function(wei){
            devFee(wei,function(fee){
                console.log('sellprice ',wei)
                eggstoselldoc.textContent=formatEthValue(web3.fromWei(wei-fee,'ether'))
            });
        });
   });
}

function updateBuyPrice(){
    var eggstobuydoc=document.getElementById('eggstobuy')
    //eggstobuydoc.textContent='?'
    var ethtospenddoc=document.getElementById('ethtospend')
    weitospend=web3.toWei(ethtospenddoc.value,'ether')
    calculateEggBuySimple(weitospend,function(eggs){
        devFee(eggs,function(fee){
            eggstobuydoc.textContent=formatEggs(eggs-fee)
        });
    });
}

function updatePacifistmasterPrice(){
    var pacifistmasterpricedoc=document.getElementById('pacifistmasterprice')
	getPacifistmasterReq(function(req) {
		pacifistmasterpricedoc.textContent = translateQuantity(req, 0);
	});
}


function updateCurrentPacifistmaster(){
    var currentpacifistmasterdoc=document.getElementById('currentpacifistmaster')
    //eggstobuydoc.textContent='?'
	currentpacifistmaster.textContent=ceoAddress()
}

function getFreePacifist2(){
    var ethtospenddoc=0.001//document.getElementById('freepacifistspend')
    weitospend=web3.toWei(ethtospenddoc,'ether')
    getFreePacifist(weitospend,function(){
        displayTransactionMessage();
    });
}
	
function buyEggs2(){
    var ethtospenddoc=document.getElementById('ethtospend')
    weitospend=web3.toWei(ethtospenddoc.value,'ether')
    buyEggs(weitospend,function(){
        displayTransactionMessage();
    });
}
function formatEggs(eggs){
    return translateQuantity(eggs/eggstohatch1)
}
function translateQuantity(quantity,precision){
    quantity=Number(quantity)
    finalquantity=quantity
    modifier=''
    if(precision == undefined){
        precision=0
        if(quantity<10000){
            precision=1
        }
        if(quantity<1000){
            precision=2
        }
        if(quantity<100){
            precision=3
        }
        if(quantity<10){
            precision=4
        }
    }
    //console.log('??quantity ',typeof quantity)
    if(quantity>1000000){
        modifier='M'
        finalquantity=quantity/1000000
    }
    if(quantity>1000000000){
        modifier='B'
        finalquantity=quantity/1000000000
    }
    if(quantity>1000000000000){
        modifier='T'
        finalquantity=quantity/1000000000000
    }
    if(precision==0){
        finalquantity=Math.floor(finalquantity)
    }
    return finalquantity.toFixed(precision)+modifier;
}

function removeModal(){
        modalContent.innerHTML=""
        modal.style.display = "none";
}
function displayTransactionMessage(){
    displayModalMessage("Transaction Submitted. This can take a moment depending on the state of the Ethereum Network.")
}
function displayModalMessage(message){
    modal.style.display = "block";
    modalContent.textContent=message;
    setTimeout(removeModal,3000)
}
function weiToDisplay(ethprice){
    return formatEthValue(web3.fromWei(ethprice,'ether'))
}
function formatEthValue(ethstr){
    return parseFloat(parseFloat(ethstr).toFixed(5));
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function copyRef() {
  var copyText = document.getElementById("copytextthing");
  copyText.style.display="block"
  copyText.select();
  document.execCommand("Copy");
  copyText.style.display="none"
  displayModalMessage("copied link to clipboard")
  //alert("Copied the text: " + copyText.value);
}

function secondsToString(seconds)
{
    seconds=Math.max(seconds,0)
    var numdays = Math.floor(seconds / 86400);

    var numhours = Math.floor((seconds % 86400) / 3600);

    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);

    var numseconds = ((seconds % 86400) % 3600) % 60;
    var endstr=""
    //if(numdays>0){
    //    endstr+=numdays + " days "
    //}
    
    return numhours + "h " + numminutes + "m "//+numseconds+"s";
}
function disableButtons(){
    var allnumpacifist=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumpacifist.length;i++){
        if(allnumpacifist[i]){
            allnumpacifist[i].style.display="none"
        }
    }
}
function enableButtons(){
    var allnumpacifist=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumpacifist.length;i++){
        if(allnumpacifist[i]){
            allnumpacifist[i].style.display="inline-block"
        }
    }
}
web3.version.getNetwork((err, netId) => {
    if(netId!="1"){
        displayModalMessage("Please switch to Ethereum Mainnet "+netId)
        disableButtons()
    }
    /*
  switch (netId) {
    case "1":
      console.log('This is mainnet')
      break
    case "2":
      console.log('This is the deprecated Morden test network.')
      break
    case "3":
      console.log('This is the ropsten test network.')
      break
    default:
      console.log('This is an unknown network.')
      
  }*/
})
