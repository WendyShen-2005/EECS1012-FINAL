var url = "http://localhost:3000/post";
var editBg = false;

saveBGColor = () => {
    const bg = document.getElementById("profile");
    bg.style.backgroundImage = null;
    var color = document.getElementById("color-picker").value + "";
    bg.style.backgroundColor = color;
    $.post(url+'?data='+JSON.stringify({
        'name':'test',
        'action':'setBGColor',
        'color':'/'+color
    }),response);
}
setBgImg = () => {
    const bg = document.getElementById("profile");
    bg.style.backgroundColor = null;
    var fileName = document.getElementById('bgImg').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    console.log(fileName);
    bg.style.backgroundImage = `url("images/${fileName}")`;
    $.post(url+'?data='+JSON.stringify({
        'name':'test',
        'action':'setBgImg',
        'imgName':fileName
    }),response);
}
setPFP = () => {
    const pfp = document.getElementById("profile-picture");
    var fileName = document.getElementById('pfp').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    console.log(fileName);
    pfp.src = `images/${fileName}`;
    $.post(url+'?data='+JSON.stringify({
        'name':'test',
        'action':'setPFP',
        'imgName':fileName
    }),response);
}
clearPFP = () => {
    const pfp = document.getElementById("profile-picture");
    pfp.src = `images/default.jpg`;
    $.post(url+'?data='+JSON.stringify({
        'name':'test',
        'action':'setPFP',
        'imgName':'default.jpg'
    }),response);
}

function response(data, status){
    var response = JSON.parse(data);

    if(response['action'] == 'saved')
        console.log("saved");
}