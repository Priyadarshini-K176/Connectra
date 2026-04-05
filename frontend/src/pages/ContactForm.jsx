import emailjs from "@emailjs/browser";
import { useState } from "react";
import { toast } from "sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validateInputs = () => {
    const newErrors = { name: "", email: "", message: "" };

    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
      console.error(err);
    }
  };

 return (
  <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-50 px-4">
    
    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-100 p-8">

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          We'd love to hear from you. Send us a message ✉️
        </p>
      </div>

      {/* Form */}
      <form className="mt-6 space-y-4" onSubmit={handleSendMessage}>

        {/* Name */}
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Email */}
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Message */}
        {errors.message && (
          <p className="text-xs text-red-500">{errors.message}</p>
        )}
        <textarea
          rows={4}
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md"
        >
          Send Message
        </button>

      </form>
    </div>
  </div>
);
}

export default ContactForm;