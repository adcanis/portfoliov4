import { toast } from "react-toastify";

type FormState = {
  name: string;
  email: string;
  message: string;
  budget: string;
  startDate: string;
};

export const validateForm = (form: FormState) => {
  const { name, email, message, budget, startDate } = form;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message || !budget || !startDate) {
    toast.error("Please fill out all fields.");
    return false;
  }
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address.");
    return false;
  }
  if (name.trim().length <= 2) {
    toast.error("Name must be longer than 2 characters.");
    return false;
  }
  if (message.trim().length <= 5) {
    toast.error("Message must be longer than 5 characters.");
    return false;
  }

  // If all validations pass
  return true;
};
