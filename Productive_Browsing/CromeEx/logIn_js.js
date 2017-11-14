window.onload = load;

function logInPage()
{
	var a = document.getElementById("logIn_Form");
	var b = document.getElementById("rgister_Form");
    a.style.display = 'block';
    b.style.display = 'none';
}

function RegisterPage()
{
	var a = document.getElementById("logIn_Form");
	var b = document.getElementById("rgister_Form");
    b.style.display = 'block';
    a.style.display = 'none';
}

function loggedIn()
{
    var tmp = {
        email : document.getElementById("login_email").value,
        password : document.getElementById("login_password").value,
        type : "sign_in"
    };
    chrome.runtime.sendMessage(tmp, function(response) {
        //if ok load home page
        isLoggedIn = response;
        if(isLoggedIn==="true")
        {
            window.location.href = "extension.html";
        }
    });
    document.getElementById("logIn_Form").reset();
    return false;
}

function registered()
{
    var tmp = {
        name : document.getElementById("reg_name").value,
        email : document.getElementById("reg_password").value,
        password : document.getElementById("reg_email").value,
        type : "regiser"
    };
    chrome.runtime.sendMessage(tmp, function(response) {
        //if ok load home page
        isLoggedIn = response;
        if(isLoggedIn==="true")
        {
            window.location.href = "extension.html";
        }
    });
    document.getElementById("rgister_Form").reset();
    return false;
}

function load() {
    var tmp= {
        type : "isSignedIn"
    }
    //chrome.runtime.sendMessage(tmp);
    chrome.runtime.sendMessage(tmp, function(response) {
        isLoggedIn = response;
        if(isLoggedIn==="true")
        {
            window.location.href = "extension.html";
        }
        else
        {
        }
    });

	document.getElementById("rgister_Form").style.display = 'none';
	document.getElementById("go_to_login").onclick=logInPage;
	document.getElementById("go_to_register").onclick=RegisterPage;
	document.getElementById("logIn_Form").onsubmit=loggedIn;
	document.getElementById("rgister_Form").onsubmit=registered;
}
