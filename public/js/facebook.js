(function (d, s, id) {
  let js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js     = d.createElement(s);
  js.id  = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId='
    + document.head.querySelector("[name=facebook-signin-client_id]").content
    + '&autoLogAppEvents=1';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    const tokenInput = document.getElementsByName('token')[0];
    tokenInput.value = response.authResponse.accessToken;
    getProfile();
  }
}

function getProfile() {
  FB.api('/me?fields=name,email', function (response) {
    const nameInput = document.getElementsByName('name')[0];
    nameInput.value = response.name;

    const emailInput = document.getElementsByName('email')[0];
    emailInput.value = response.email;
  });
}