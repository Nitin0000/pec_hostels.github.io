let stu_container = document.querySelector(".container");
let student_name = document.querySelector(".in_student_name");
let room_number = document.querySelector(".in_student_room");
let SID = document.querySelector(".in_student_sid");
let student_image = document.querySelector(".in_stu_img");
let image = document.querySelector(".img_url");
let hostel = document.querySelector(".hostel");
let block = document.querySelector(".block");
let progress = document.querySelector(".progress");
let progress_bar = document.querySelector(".progress-bar");
let btn = document.querySelector(".add_btn");
let roomsz = document.querySelector(".in_room_size");
let stu_cont = document.querySelector(".student_add");

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

var student_list = [];
function getdata() {
  firebase
    .database()
    .ref()
    .once("value", (snapshot) => {
      snapshot.forEach((hostelsnap) => {
        hostelsnap.forEach((blocksnap) => {
          blocksnap.forEach((student) => {
            student_list.push(student.val());
          });
        });
      });
    });
}

hostel.addEventListener("change", function () {
  var blocklist = [
    '<option value="">Block</option>',
    '<option value="A">A</option>',
    '<option value="B">B</option>',
    '<option value="C">C</option>',
  ];
  if (hostel.value == "Aravali") {
    block.innerHTML = blocklist[0] + blocklist[1] + blocklist[2];
  } else if (hostel.value == "Kurukshetra") {
    block.innerHTML = blocklist[0] + blocklist[1] + blocklist[2] + blocklist[3];
  } else if (hostel.value == "Himalaya") {
    block.innerHTML = blocklist[0] + blocklist[1] + blocklist[2];
  } else if (hostel.value == "Shivalik") {
    block.innerHTML = blocklist[0] + blocklist[1] + blocklist[2];
  } else if (hostel.value == "Vindhya") {
    block.innerHTML = blocklist[0] + blocklist[1] + blocklist[2];
  } else if (hostel.value == "Kalpna") {
    block.innerHTML = blocklist[0] + blocklist[1] + blocklist[2];
  } else {
    block.innerHTML = blocklist[0];
  }
});

function isValidName(input) {
  return isNaN(input);
}

function isValidSID(input) {
  if (isNaN(input) || input.length != 8) return false;
  for (var i = 0; i < student_list.length; i++) {
    if (student_list[i].SID == input) {
      return false;
    }
  }
  return true;
}

function isValidRoom(input, hstl, vac) {
  if (isNaN(input) || input.length != 3) return false;
  var count = 0;
  for (var i = 0; i < student_list.length; i++) {
    if (
      student_list[i].Room_Number == input &&
      student_list[i].hostel == hstl
    ) {
      count = count + 1;
      if (student_list[i].vaccancy <= count) {
        alert("Room become full");
        return false;
      }
      if (student_list[i].vaccancy != vac) {
        alert("Room size changed !! Please Contact Site Owner");
        return false;
      }
      console.log(count);
    }
  }
  return true;
}

var img_file = "";
var image_link = "";
image.addEventListener("change", function () {
  if (!this.files[0]) return;
  const reader = new FileReader();
  reader.readAsDataURL(this.files[0]);
  console.log(this.files[0]);
  reader.addEventListener("load", () => {
    image_link = reader.result;
    student_image.src = image_link;
    student_image.onload = (e) => {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      canvas.width = 250;
      canvas.height = 250;
      context.drawImage(student_image, 0, 0, 250, 250);
      let new_url = context.canvas.toDataURL("images/jpeg", 100);
      image_link = new_url;
      img_file = urlToFile(new_url);
    };
  });
});

let urlToFile = (url) => {
  let arr = url.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let data = arr[1];

  let dataStr = atob(data);
  let n = dataStr.length;
  let dataArr = new Uint8Array(n);

  while (n--) {
    dataArr[n] = dataStr.charCodeAt(n);
  }

  let file = new File([dataArr], "File.jpg", { type: mime });

  return file;
};

// function popup(cur_ele) {
//   var cont = cur_ele.parentElement;
//   var stuid = cont.querySelector(".stu_id").textContent;
//   firebase
//     .database()
//     .ref("users/" + stuid)
//     .remove();
//   firebase
//     .storage()
//     .ref("Images/" + stuid + ".jpg")
//     .delete();
//   cont.remove();
// }

function add_student() {
  let stu_Name = student_name.value;
  let stu_SID = SID.value;
  let stu_Room_no = room_number.value;
  let stu_hostel = hostel.value;
  let stu_block = block.value;
  let stu_roomsz = roomsz.value;
  if (
    img_file != "" &&
    isValidName(stu_Name) &&
    isValidSID(stu_SID) &&
    stu_hostel != "" &&
    stu_block != "" &&
    stu_roomsz != "" &&
    isValidRoom(stu_Room_no, stu_hostel, stu_roomsz)
  ) {
    console.log(img_file);
    var uploadTask = firebase
      .storage()
      .ref("Images/" + stu_SID + ".jpg")
      .put(img_file);
    btn.style.opacity = ".1";
    uploadTask.on("state_changed", (snapshot) => {
      var pro = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress.style.width = pro + "%";
    });
    uploadTask.then((snapshot) => {
      btn.style.opacity = "1";
      progress.style.width = 0;
      var student;
      firebase
        .storage()
        .ref("Images/" + stu_SID + ".jpg")
        .getDownloadURL()
        .then((url) => {
          student = {
            SID: stu_SID,
            Student_name: stu_Name,
            Room_Number: stu_Room_no,
            URL: url,
            vaccancy: stu_roomsz,
            hostel: stu_hostel,
            block: stu_block,
          };
          firebase
            .database()
            .ref(stu_hostel + "/" + stu_block + "/" + stu_SID)
            .set(student);
          student_list.push(student);
          console.log(student_list);
        });
      student_name.value = "";
      SID.value = "";
      room_number.value = "";
      image_link = "";
      img_file = "";
      hostel.value = "";
      block.value = "";
      block.innerHTML = '<option value="">Block</option>';
      roomsz.innerHTML =
        '<option value="">Size</option>' +
        "<option value=1>Single</option>" +
        "<option value=2>Double</option>" +
        "<option value=3>Triple</option>";
      student_image.src = "noprofil.jpg";
    });
  } else {
    alert("Invalid data");
  }
}
