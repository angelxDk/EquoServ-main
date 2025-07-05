var modal = document.getElementById("modal");
let btn = document.getElementById('btn');
let cancelbtn = document.querySelector('.cancelbtn');
let logoutbtn = document.querySelector('.logoutbtn');
let title = document.querySelector('.title');

btn.onclick = function () {
  modal.style.display = 'block';
  btn.style.display = 'none';
  title.style.display = 'none';
}

cancelbtn.onclick = function () {
  modal.style.display = 'none';
  btn.style.display = 'block';
  title.style.display = 'block';
}
logoutbtn.onclick = function () {
  modal.style.display = 'none';
  btn.style.display = 'block';
  title.style.display = 'block';
}


