import React from "react";

const TermsOfService = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">Last updated: [Insert Date]</p>

      <p className="mb-4">
        Welcome to our Vaccine Booking System. By using our platform, you agree
        to these Terms of Service. Please read them carefully before proceeding.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By accessing or using our service, you agree to comply with these Terms
        of Service. If you do not agree, please do not use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of the Service</h2>
      <p className="mb-4">
        You may use our platform to book vaccination appointments for yourself
        or others (if authorized). You agree to provide accurate and up-to-date
        information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. User Responsibilities
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You must be at least 18 years old or have parental consent.</li>
        <li>
          You agree not to misuse the system or provide false information.
        </li>
        <li>You are responsible for keeping your login credentials secure.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Appointment Policy</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Appointments must be scheduled in advance and confirmed.</li>
        <li>
          Failure to attend an appointment may result in restrictions on future
          bookings.
        </li>
        <li>
          We reserve the right to cancel or reschedule appointments if
          necessary.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Privacy and Security
      </h2>
      <p className="mb-4">
        Your personal data is handled in accordance with our
        <a href="/privacy-policy" className="text-blue-600 hover:underline">
          {" "}
          Privacy Policy
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Limitation of Liability
      </h2>
      <p className="mb-4">
        We are not responsible for any indirect, incidental, or consequential
        damages arising from the use of our service, including but not limited
        to missed appointments, incorrect information, or technical issues.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Modifications to Terms
      </h2>
      <p className="mb-4">
        We reserve the right to update these Terms at any time. Continued use of
        the service after changes are posted constitutes acceptance of the new
        Terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Contact Information
      </h2>
      <p className="mb-4">
        If you have any questions about these Terms, please contact us at
        [Insert Contact Information].
      </p>
    </div>
  );
};

export default TermsOfService;
