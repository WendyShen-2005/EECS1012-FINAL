var url = "http://localhost:3000/post";
var editBg = false;

saveBGColor = () => {
    const bg = document.getElementById("profile");
    const color = document.getElementById("color-picker").value;
    bg.style.backgroundColor = color + "";
}
setBgImg = () => {
    const bg = document.getElementById("profile");
    var fileName = document.getElementById('bgImg').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    console.log(fileName);
    bg.style.backgroundImage = `url("images/${fileName}")`;
}