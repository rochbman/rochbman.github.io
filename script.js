/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/


function updateCoffeeView(coffeeQty) {
  // your code here


  let coffeeCounter = document.getElementById('coffee_counter');
  coffeeCounter.innerText = coffeeQty;

}
// updateCoffeeView()

function clickCoffee(data) {
  // your code here
  data.coffee+=1
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/**************
 *   SLICE 2
 **************/



function unlockProducers(producers, coffeeCount) {
  // your code here

 for(let i=0; i<producers.length;i++){
  if(coffeeCount>=producers[i].price/2){
      producers[i].unlocked=true

    }
 }


}



function getUnlockedProducers(data) {
  // your code here
  const unlocked= data.producers.filter((producer)=>{
    return producer.unlocked
  })
  return unlocked
}



function makeDisplayNameFromId(id) {
  // your code here

  let string=id.replaceAll('_',' ');
  let words=string.split(' ');


  let upArr=words.map((string)=>string.charAt(0).toUpperCase()+string.slice(1))
  let result=upArr.join(' ')



  return result
}



// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">☕️</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here

  while(parent.firstChild){
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  // your code here
  const proCon =document.getElementById('producer_container');
  deleteAllChildNodes(proCon)
  let pros =data.producers

  unlockProducers(pros, data.coffee)

  data.producers=pros

  let unlocked = getUnlockedProducers(data)

  unlocked.forEach((obj)=>{
    let proDiv=makeProducerDiv(obj)

    proDiv.id
    proCon.append(proDiv)
  })

}
// renderProducers(data)


/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  let newId = producerId.replace('buy_', '');

  const result = data.producers.find(({id})=>id===newId)
  return result
}

function canAffordProducer(data, producerId) {
  // your code here
  const thisPro = getProducerById(data, producerId);
  if (data.coffee>=thisPro.price){
    return true
  }else{
    return false
  }
}

function updateCPSView(cps) {
  // your code here
  const cpsEle = document.getElementById('cps');
  cpsEle.innerText=cps
}

function updatePrice(oldPrice) {
  // your code here
  let quart = oldPrice/4

  return Math.floor(oldPrice+quart)
}




function attemptToBuyProducer(data, producerId) {
  // your code here
  const thisPro=getProducerById(data, producerId);

  if(data.coffee<thisPro.price){
    return false
  }else if(data.coffee>=thisPro.price){
    thisPro.qty+=1;
    data.coffee=data.coffee-thisPro.price;
    thisPro.price=updatePrice(thisPro.price);
    data.totalCPS = data.totalCPS +thisPro.cps;

    return true
  }
}

function buyButtonClick(event, data) {
  // your code here
  if(event.target.tagName !== 'BUTTON'){
    return void(0)

  }
  let buttId = event.target.id;
  let bool=attemptToBuyProducer(data, buttId);
  if(bool===false){
    window.alert("Not enough coffee!");
  }else{
    // clickCoffee(data)
    renderProducers(data)
    updateCoffeeView(data.coffee)
    updateCPSView(data.totalCPS)
  }
}

function tick(data) {
  // your code here
  let count=data.coffee + Number(data.totalCPS)
  data.coffee=count
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
