const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const sendNotification = async (receivedToken, title, body) => {
  try {
    const receivedToken = req.body.fcmToken;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = year + "-" + month + "-" + day;

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the time as desired
    var formattedTime = hours + ":" + minutes + ":" + seconds;

    const message = {
      notification: {
        title: title,
        body: body,
        time: formattedTime,
        date: formattedDate,
      },
      token: receivedToken,
    };
    const sentMessage = await getMessaging().messagel.send(message);
    if (sentMessage) {
      console.log("Successfully sent message:");
      res.status(200).json({
        message: "Successfuly Sent a message",
        FCMToken: receivedToken,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
