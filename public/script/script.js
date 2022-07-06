Kakao.init('578ddc5d4d613d0b0781f4c4655da37b');
Kakao.isInitialized();
document.getElementById('logout').style.display = 'none';

function kakaoLogin() {
  Kakao.Auth.login({
    success: function (response) {
      Kakao.API.request({
        url: '/v2/user/me',
        success: function (response) {
          console.log(response); //테스트용
          document.getElementById('loginlink').style.display = "none";
          document.getElementById('logout').style.display = 'block';
          alert(response.kakao_account.profile.nickname + '님 로그인 되었습니다.')
        }
      })
    }
  })
}

function kakaoLogout() {
  if (Kakao.Auth.getAccessToken()) {
    Kakao.API.request({
      url: '/v1/user/unlink',
      success: function (response) {
        console.log(response); //테스트용
        document.getElementById('loginlink').style.display = "block";
        document.getElementById('logout').style.display = 'none';
        alert('로그아웃 되었습니다.');
      }
    })
    Kakao.Auth.setAccessToken(undefined)
  }
}