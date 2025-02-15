import React from "react";

const Policy = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last updated: [Insert Date]</p>

      <p className="mb-4">
        Welcome to our Vaccine Booking System. Your privacy is important to us.
        This Privacy Policy explains how we collect, use, and protect your
        personal information when you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        When you use our system, we may collect the following types of
        information:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Personal information (e.g., name, date of birth, phone number, email
          address)
        </li>
        <li>Medical history related to vaccination</li>
        <li>Appointment details (e.g., date, time, location of vaccination)</li>
        <li>
          Device and usage data (e.g., IP address, browser type, device type)
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">We use the collected information to:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Schedule and manage vaccine appointments</li>
        <li>Send reminders and notifications</li>
        <li>Ensure compliance with health regulations</li>
        <li>Improve system security and user experience</li>
        <li>Conduct analytics and research</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Data Sharing and Security
      </h2>
      <p className="mb-4">
        We do not sell or rent your personal data. Your information may be
        shared with:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Healthcare providers for appointment scheduling</li>
        <li>Government agencies if required by law</li>
        <li>Third-party service providers for system maintenance</li>
      </ul>
      <p className="mb-4">
        We implement strong security measures to protect your data, including
        encryption, access controls, and regular security audits.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Your Rights and Choices
      </h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Access and update your personal information</li>
        <li>Request deletion of your data</li>
        <li>Opt out of marketing communications</li>
      </ul>
      <p className="mb-4">
        To exercise these rights, please contact us at [Insert Contact Email].
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with a revised "Last updated" date.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us
        at [Insert Contact Information].
      </p>
    </div>
  );
};

export default Policy;
