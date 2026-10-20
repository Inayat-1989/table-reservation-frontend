import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setStatus({
      loading: true,
      error: "",
      success: "",
    });

    // Backend/API connection will be added later.
    console.log("Contact Form Data:", formData);

    setTimeout(() => {
      setStatus({
        loading: false,
        error: "",
        success: "Your message has been sent. Thank you!",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 500);
  };

  return (
    <section id="contact" className="contact section">
      {/* Section Title */}
      <div className="container section-title">
        <h2>Contact</h2>

        <p>
          <span>Need Help?</span>{" "}
          <span className="description-title">Contact Us</span>
        </p>
      </div>

      <div className="container">
        {/* Google Maps */}
        <div className="contact-map-wrapper mb-5">
          <iframe
            title="Restaurant Location"
            src="https://maps.google.com/maps?q=Pinnacloid%2C%20Lahore%2C%20Pakistan&t=&z=15&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Information */}
        <div className="row gy-4">
          {/* Address */}
          <div className="col-md-6">
            <div className="info-item d-flex align-items-center">
              <i className="icon bi bi-geo-alt flex-shrink-0"></i>

              <div>
                <h3>Address</h3>
                <p>Pinnacloid, Lahore, Pakistan</p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="col-md-6">
            <div className="info-item d-flex align-items-center">
              <i className="icon bi bi-telephone flex-shrink-0"></i>

              <div>
                <h3>Call Us</h3>
                <p>+92 313 8393 061</p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="col-md-6">
            <div className="info-item d-flex align-items-center">
              <i className="icon bi bi-envelope flex-shrink-0"></i>

              <div>
                <h3>Email Us</h3>
                <p>info@pinnacloid.com</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="col-md-6">
            <div className="info-item d-flex align-items-center">
              <i className="icon bi bi-clock flex-shrink-0"></i>

              <div>
                <h3>
                  Opening Hours
                  <br />
                </h3>

                <p>
                  <strong>Mon-Sat:</strong> 11AM - 23PM <strong>Sunday:</strong>{" "}
                  Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="php-email-form">
          <div className="row gy-4">
            {/* Name */}
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject */}
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            {/* Message */}
            <div className="col-md-12">
              <textarea
                className="form-control"
                name="message"
                rows="6"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Submit */}
            <div className="col-md-12 text-center">
              {status.loading && <div className="loading">Loading</div>}

              {status.error && (
                <div className="error-message">{status.error}</div>
              )}

              {status.success && (
                <div className="sent-message">{status.success}</div>
              )}

              <button type="submit">Send Message</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
