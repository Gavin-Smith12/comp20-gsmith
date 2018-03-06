var request = new XMLHttpRequest();

request.open("POST", "http://jordan-marsh.herokuapp.com/rides", true);
postInfo();
request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
                data = request.responseText;
                loc = JSON.parse(data);
                elem = document.getElementById("")
        }
}

function postInfo() {
        request.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
        request.send("username=" + bomkcQM8oI "&lat")
}