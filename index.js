const url = "https://localhost:7255/";
const connection = new signalR.HubConnectionBuilder()
  .withUrl(url + "offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

let timeCount = 10;
let myInterval;

async function Start() {
  try {
    await connection.start();
    console.log("Conneceted");

    let title = document.querySelector(".title");
    title.innerHTML = "Connected User";
  } catch (err) {
    console.log(err + "<- errore");
    setTimeout(() => {
      console.log("bax bax");
      Start();
    }, 15000);
  }
}

connection.on("ReadDataMethod", (message) => {
  let data = document.querySelector(".data");
  data.innerHTML = message;
});

connection.on("ReadDataUserMethod", (userMessage) => {
  let dataUser = document.querySelector(".dataUser");

  dataUser.innerHTML = userMessage;
});

connection.on("StartCountDown", () => {
  let submitBtn = document.querySelector(".submitBtn");
  let seconds = document.querySelector(".seconds");

  timeCount = 10;
  seconds.innerHTML = "";
  submitBtn.disabled = false;
  clearInterval(myInterval);
});

connection.on("Finish", (finishMessage) => {
  let seconds = document.querySelector(".seconds");
  let submitBtn = document.querySelector(".submitBtn");
  let dataUser = document.querySelector(".dataUser");

  seconds.innerHTML = "";
  submitBtn.disabled = true;
  dataUser.innerHTML = finishMessage;
});

async function SubmitButton(e) {
  let submitBtn = document.querySelector(".submitBtn");
  let inputName = document.querySelector(".inputName");

  submitBtn.disabled = true;

  connection.invoke("CountDownStarted");
  connection.invoke("OnDataReadUserAsync", inputName.value);

  myInterval = setInterval(() => {
    let seconds = document.querySelector(".seconds");
    seconds.innerHTML = timeCount;
    --timeCount;

    if (timeCount == -1) {
      clearInterval(myInterval);
      connection.invoke("FinishOffer", inputName.value + " Win ");
    }
  }, 1000);
}

Start();
