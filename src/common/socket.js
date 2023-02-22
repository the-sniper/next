import openSocket from "socket.io-client";
import openSocketForward from "socket.io-client-latest";

let socket = openSocket(`${process.env.NEXT_PUBLIC_FORWARD_DOMAIN}/`, {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
  transports: ["websocket", "polling"],
});
let socketForward = openSocketForward(
  `${process.env.NEXT_PUBLIC_FORWARD_DOMAIN}/`,
  {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
    transports: ["websocket", "polling"],
  }
);

socketForward.on("connect", function () {
  console.log("Socket Forward Connected");
});

socket.on("connect", function () {
  console.log("Socket Connected");
});

function bidAddtime(cb) {
  socket.on("bidAddtime", (data) => {
    cb(data);
  });
}

// function bidoffers(cb) {
//   socket.on("bidoffers", (data) => {
//     cb(data);
//   });
// }

function realClosedUpdates(cb) {
  socket.on("realclosedupdates", (data) => {
    cb(data);
  });
}

function refreshbuyer(cb) {
  socket.on("refreshbuyer", (data) => {
    cb(data);
  });
}
function refreshbuyerOff() {
  socket.off("refreshbuyer");
}
function bid_extended(cb) {
  socket.on("bid_extended", (data) => {
    cb(data);
  });
}
function bid_extendedOff() {
  socket.off("bid_extended");
}
socket.on("disconnect", function () {
  console.log("Socket Disconnected");
});

socketForward.on("disconnect", function () {
  console.log("Socket Forward Disconnected");
});

// function reInitializeSocket() {
//   socket.close();
//   socket = openSocket(`${process.env.NEXT_PUBLIC_DOMAIN}/`);
// }

export {
  bidAddtime,
  realClosedUpdates,
  refreshbuyer,
  socket,
  socketForward,
  refreshbuyerOff,
  bid_extended,
  bid_extendedOff,
  // bidoffers,
};
