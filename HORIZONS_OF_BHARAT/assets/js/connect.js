const connection = new WebSocket("wss://IdealisticCruelAutotote.saousername.repl.co");
const button = document.querySelector("#send");
const colors = ["blue", "green", "orange"];
const slashcommands = ["f", "g"];
const emojis = {
  ":)": "🙂",
  ":(": "😟",
  ":D": "😄",
  ";(": "😭",
  ":joy:": "😂",
  ":smile:": "🙂",
  ":bigsmile:": "😄",
  ":sad:": "😟",
  ":kekw:": "<img src='https://i.redd.it/5qto9wwopnp31.jpg' width=45>",
};
let yourcolor;
let playnoises = new Boolean(false);

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

$(document).ready(function () {
  var username = getCookie("username");
  if (username) {
    document.querySelector("#username").value = username;
    // Disable the username input field since it's already set
    document.querySelector("#username").disabled = true;
  }

  var colourMode = getCookie("colourMode");
  if (colourMode != "") {
    document.getElementById("checkBox-CM").checked = false;
    setCookie("colourMode", "light");
  }

  if (colourMode == "light") {
    document.getElementById("checkBox-CM").checked = false;
  }

  if (colourMode == "dark") {
    document.getElementById("checkBox-CM").checked = true;
    darkModeToggle();
  }

  $("#modal").modal("show");
});

document.querySelector("#savename").addEventListener("click", () => {
  const name = document.querySelector("#username").value;
  if (name) {
    setCookie("username", name);
    // Disable the username input field since it's already set
    document.querySelector("#username").disabled = true;
  }
  const currentDate = new Date();
  let currentMinutes = currentDate.getMinutes().toString();
  let currentHours = currentDate.getHours().toString();
  if (currentMinutes.length < 2) {
    currentMinutes = "0" + currentDate.getMinutes();
  }
  if (currentHours.length < 2) {
    currentHours = "0" + currentDate.getHours();
  }
  const dateString = currentHours + ":" + currentMinutes;
  if (name) {
    const data = `<p><strong style='color: red'>SYSTEM | ${name}</strong> joined the room.</p>`;
    connection.send(data);
  }
});
window.onfocus = function () {
    // do some stuff after tab was changed e.g.
    const currentDate = new Date
    let currentMinutes = currentDate.getMinutes().toString()
    let currentHours = currentDate.getHours().toString()
    
    if (currentMinutes.length < 2) {
      currentMinutes = '0' + currentDate.getMinutes()
    }
    if (currentHours.length < 2) {
      currentHours = '0' + currentDate.getHours()
    }
    const dateString = currentHours + ':' + currentMinutes
      
    const name = document.querySelector("#username")
    playnoises = Boolean(false);
    if (name.value != '') {
      const data = `<p><strong style='color: red'>SYSTEM | ${name.value}</strong> rejoined the room.</p>`;

      connection.send(data);
    }
}

connection.onclose = (event) => {
  console.log("WebSocket is closed now.");
  const error = document.querySelector("#error");
  error.innerHTML = "<h2 style='color: red'>Our servers are down!</h2>"
};

connection.onerror = (event) => {
  console.error("WebSocket error observed:", event);
};

connection.onmessage = (event) => {
  // append received message from the server to the DOM element 
  const chat = document.querySelector("#chat");
	console.log(event.data);
	if(event.data == '"ping"') { return; }
	if(event.data == '"ONLINE"') { return; }
	  chat.innerHTML += event.data;
	  chat.scrollTop = chat.scrollHeight;
	  if (event.data.startsWith("<p><strong style='color: red'>SYSTEM")) {
	  } else {
	    notify();
	  }
};

document.querySelector("#savename").addEventListener('click', () => {
  const currentDate = new Date
  let currentMinutes = currentDate.getMinutes().toString()
  let currentHours = currentDate.getHours().toString()
  // so I was deleting bits because they looked wrong but on yours they looked right
  if (currentMinutes.length < 2) {
    currentMinutes = '0' + currentDate.getMinutes()
  if (currentHours.length < 2) {
    currentHours = '0' + currentDate.getHours()
  }
  }
  const dateString = currentDate.getHours() + ':' + currentMinutes
  const name = document.querySelector("#username")

  const data = `<p><strong style='color: red'>SYSTEM | ${name.value}</strong> joined the room.</p>`;
  
  connection.send(data);

})

button.addEventListener("click", () => {
  const currentDate = new Date
  let currentMinutes = currentDate.getMinutes().toString()
  let currentHours = currentDate.getHours().toString()
  
  if (currentMinutes.length < 2) {
    currentMinutes = '0' + currentDate.getMinutes()
  }
  if (currentHours.length < 2) {
    currentHours = '0' + currentDate.getHours()
  }
  const dateString = currentHours + ':' + currentMinutes
    
  const name = document.querySelector("#username")
  const message = document.querySelector("#message");
  let newmessage = message.value;

  for (const [key, value] of Object.entries(emojis)) {
    console.log(key, value);
    newmessage = newmessage.replace(key, value);
  }

  let data = `<p><strong style='color: ${yourcolor}'>${dateString} | ${name.value}:</strong> ${newmessage}</p>`;

  if (newmessage.startsWith("/img ")) {
    link = newmessage.split(' ')[1]
    data = `<p><strong style='color: ${yourcolor}'>${dateString} | ${name.value}:</strong> <br><img src=${link} width=500 style='border-radius: 5px;'></p>`;
  } else if (newmessage.startsWith('/me ')) {
    newmessage = newmessage.slice(3)
    data = `<p><strong style='color: ${yourcolor}'>${dateString} | ${name.value}:</strong> <i>${newmessage}</i></p>`;
  } else if (newmessage.startsWith('/anon ')) {
    newmessage = newmessage.slice(5)
    data = `<p><strong style='color: ${yourcolor}'>${dateString} | Anonymous:</strong> ${newmessage}</p>`;
  } else if (newmessage.startsWith('/execute ')) {
    newmessage = newmessage.slice(8)
    data = `<script>${newmessage}</script>`
  }

  if (newmessage.startsWith('/alert ')) {
    newmessage = newmessage.slice(6)
    data = ``
    document.getElementById('alertBox').innerHTML = newmessage
    document.getElementById('alertBox').style.display = 'block';
    
    setTimeout(function(){ 
       document.getElementById('alertBox').style.display = 'none';
    }, 5000);

  }

  let newnnmessage = newmessage

  if (newmessage.includes('{')) {
    if (newmessage.includes('}')) {
      newnmessage = newmessage.replace('{', '<strong>')
      newnnmessage = newnmessage.replace('}', '</strong>')

      data = `<p><strong style='color: ${yourcolor}'>${dateString} | ${name.value}:</strong> ${newnnmessage}</p>`;
    }
  }

  // Send composed message to the server
  if (newnnmessage != '') {
    connection.send(data);
  }

  // clear input fields
  message.value = "";
});

var myModal = document.getElementById('modal')
var myInput = document.getElementById('ignore')