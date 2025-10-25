const nexusBerryMobile = "923250362286";

// https://wa.me/whatsappphonenumber?text=urlencodedtext
const waSendLink = (mobile, message) => {
  const msgLink = `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
  return msgLink;
};


export default {
  nexusBerryMobile,
  waSendLink,
};
