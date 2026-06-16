(function () {
  var target = document.querySelector("[data-login-qr-target]");

  if (!target || typeof window.QRCode === "undefined") return;

  function generateRandomToken(length) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var token = "";
    var randomValues = new Uint32Array(length);

    if (window.crypto && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
      for (var i = 0; i < length; i++) {
        token += chars[randomValues[i] % chars.length];
      }
      return token;
    }

    for (var j = 0; j < length; j++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }

    return token;
  }

  function buildQrPayload() {
    var sessionId = generateRandomToken(64);
    var nonce = generateRandomToken(32);
    var issuedAt = Date.now();

    try {
      sessionStorage.setItem("cons-ui-qr-session", sessionId);
    } catch (e) {}

    return (
      "masri-belkharej://login?session=" +
      sessionId +
      "&nonce=" +
      nonce +
      "&iat=" +
      issuedAt
    );
  }

  new QRCode(target, {
    text: buildQrPayload(),
    width: 220,
    height: 220,
    colorDark: "#111111",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
})();
