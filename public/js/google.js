function onGoogleSignIn(googleUser) {
  const tokenInput = document.getElementsByName('token')[0];
  tokenInput.value = googleUser.getAuthResponse().id_token;

  const profile    = googleUser.getBasicProfile();
  const nameInput = document.getElementsByName('name')[0];
  nameInput.value = profile.getName();

  const emailInput = document.getElementsByName('email')[0];
  emailInput.value = profile.getEmail();

  gapi.auth2.getAuthInstance().disconnect()
}
