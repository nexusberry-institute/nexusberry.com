// const nexusBerryMobile = "923250362286";

// https://wa.me/whatsappphonenumber?text=urlencodedtext
export const getWhatsAppLink = (leadMobile, message = "") => {
    const msgLink = `https://wa.me/${leadMobile}?text=${encodeURIComponent(message)}`;
    return msgLink;
  };