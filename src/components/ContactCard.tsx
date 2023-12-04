import React from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { validateForm } from "@/utils/formValidate";

type ContactCardProps = {
  isShowingContactCard: boolean;
  handleIsOpen: () => void;
};

const ContactCard = ({
  isShowingContactCard,
  handleIsOpen,
}: ContactCardProps) => {
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [message, setMessage] = React.useState<string>("");
  const [budget, setBudget] = React.useState<string>("");
  const [buttonText, setButtonText] = React.useState<string>("Send message");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm({ name, email, message, budget, startDate })) {
      return;
    }
    try {
      emailjs.send(
        `${process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID}`,
        `${process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID}`,
        {
          from_name: name,
          reply_to: email,
          startDate,
          message,
          budget,
        },
        `${process.env.NEXT_PUBLIC_EMAIL_JS_AUTH_TOKEN}`
      );
      setButtonText("Message sent!");
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending email", error);
      toast.error("Something went wrong. Please try again later.");
    }
    setName("");
    setEmail("");
    setStartDate("");
    setMessage("");
    setBudget("");

    setTimeout(() => {
      setButtonText("Send Message");
    }, 3000);
  };

  return (
    <React.Fragment>
      {isShowingContactCard && (
        <motion.div
          className="contact-container"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="contact-card">
            <div className="contact-header">
              <h1>Let{"'"}s work together!</h1>
              <button
                className="btn-transparent-dark"
                onClick={() => handleIsOpen()}
              >
                X
              </button>
            </div>
            <div className="contact-content">
              <div className="col-left">
                <h2>Send a message</h2>
              </div>
              <div className="col-right">
                <form className="form-layout" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Hi, my name is"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="My email is"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <textarea
                    name="message"
                    id="message"
                    placeholder="I am interested in"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <label htmlFor="budget">
                    My budget is around {"("}CAD{")"}
                  </label>
                  <div className="budget-btns-container">
                    <button
                      type="button"
                      className={
                        budget === "20-50k"
                          ? "btn-black"
                          : "btn-transparent-dark"
                      }
                      onClick={() => setBudget("20-50k")}
                    >
                      20 - 50k
                    </button>
                    <button
                      type="button"
                      className={
                        budget === "50-100k"
                          ? "btn-black"
                          : "btn-transparent-dark"
                      }
                      onClick={() => setBudget("50-100k")}
                    >
                      50 - 100k
                    </button>
                    <button
                      type="button"
                      className={
                        budget === "100k+"
                          ? "btn-black"
                          : "btn-transparent-dark"
                      }
                      onClick={() => setBudget("100k+")}
                    >
                      100k +
                    </button>
                  </div>
                  <label htmlFor="startDate">I{"'"}d like to start on</label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    placeholder="yyyy-mm-dd"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <div className="form-submit">
                    <button type="submit" className="btn-black">
                      {buttonText}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </React.Fragment>
  );
};

export default ContactCard;
