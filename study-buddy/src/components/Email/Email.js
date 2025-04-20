import emailjs from '@emailjs/browser';

// Function to send a noitfication about a new request
export const sendRequestAlert = async (recieverName, recieverEmail, message) => {
  const templateParams = {
    name: recieverName,
    email: recieverEmail,
    message: message
  };

  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully!', response.status, response.text);
  } catch (error) {
    console.error('Email send failed:', error);
  }
};
