export default NotifiyPush = async (tokenPush, body) => {
  //   console.log("Ingresó aquí");
  // console.log("Token del conductor: ", tokenPush);

  if(tokenPush !== '') {
      await envio();
  }

  async function envio() {

    const message = {
      to: tokenPush,
      sound: "default",
      title: "Avill",
      body: body,
      data: { someData: "goes here" },
    };
    //console.log("enviando msg: ", message);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

  }
};
