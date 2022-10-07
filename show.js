let stu_name = document.querySelector(".stu_name");
let room_no = document.querySelector(".stu_room");
let sid = document.querySelector(".stu_id");
let img = document.querySelector(".stu_img");
let stu_container = document.querySelector(".container");
let search = document.querySelector(".search_txt");

let him = document.querySelector(".hstl_him");
let arv = document.querySelector(".hstl_arv");
let kuk = document.querySelector(".hstl_kuk");
let vin = document.querySelector(".hstl_vin");
let shiv = document.querySelector(".hstl_shiv");
let kp = document.querySelector(".hstl_kp");

let loader=document.querySelector('#loader');

const firebaseConfig = {
  apiKey: "AIzaSyCQFKRf0lKNVy7q1rtizXZ_VzwOCEEZciE",
  authDomain: "mess-server-d9e16.firebaseapp.com",
  databaseURL: "https://mess-server-d9e16-default-rtdb.firebaseio.com",
  projectId: "mess-server-d9e16",
  storageBucket: "mess-server-d9e16.appspot.com",
  messagingSenderId: "292020293092",
  appId: "1:292020293092:web:0e021b6708c1a36cd08bf1",
  measurementId: "G-CMEPK65HX9",
};
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();

let student_list = [];
function display(hstl) {
  stu_container.innerHTML = "";
  console.log("hello");
  firebase
    .database()
    .ref(hstl)
    .once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        childSnapshot.forEach((student) => {
          var stu=student.val();
          student_list.push(stu);
          var string = show_students(
            stu.URL,
            stu.Student_name,
            stu.Room_Number,
            stu.SID,
            stu.hostel,
            stu.block
          );
          stu_container.innerHTML += string;
        });
      });
    });
    loader.style.display='none';
}

search.addEventListener("keyup", (e) => {
  const s = e.target.value.toLowerCase();
  stu_container.innerHTML = "";
  searchtxt(s);
});

function searchtxt(txt) {
  stu_container.innerHTML = "";
  for (var i = 0; i < student_list.length; i++) {
    var stu = student_list[i];
    var full_name = stu.Student_name.toLowerCase();
    if (full_name.includes(txt)) {
      var string = show_students(
        stu.URL,
        stu.Student_name,
        stu.Room_Number,
        stu.SID,
        stu.hostel,
        stu.block
      );
      stu_container.innerHTML += string;
    }
  }
}

function show_students(url, name, roomNo, sid, hstl, blck) {
  var s =
    '<div class="student"' +
    "><img src=" +
    url +
    ' class="stu_img" >' +
    '<div class="stu_name">' +
    name +
    "</div>" +
    '<div class="stu_room">' +
    roomNo +
    "</div>" +
    '<div class="stu_id">' +
    sid +
    '</div><div><span id="hostel">' +
    hstl +
    '- </span><span id="block">' +
    blck +
    "</span></div>";
  // + '<i onclick="popup(this)" class="fa-solid fa-trash"></i></div>'
  return s;
}
