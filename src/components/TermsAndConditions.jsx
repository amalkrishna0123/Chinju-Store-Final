import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    { id: 'interpretation', title: 'Interpretation and Definitions' },
    { id: 'accounts', title: 'User Accounts' },
    { id: 'content', title: 'User-Generated Content' },
    { id: 'purchases', title: 'Purchases and Payments' },
    { id: 'intellectual', title: 'Intellectual Property' },
    { id: 'prohibited', title: 'Prohibited Activities' },
    { id: 'termination', title: 'Termination' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Terms and Conditions | Chinju Store</title>
        <meta name="description" content="Review the Terms and Conditions governing your use of Chinju Store's website and services." />
      </Helmet>

      {/* Header */}
      <header className={`bg-white shadow-sm sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Terms and Conditions</h1>
          <p className="text-gray-500 text-sm">Last updated: June 11, 2025</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Navigation</h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-left w-full px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={scrollToTop}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  Back to top
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <section className="mb-8">
                <p className="text-gray-700 mb-4">
                  Welcome to Chinju Store! These Terms and Conditions outline the rules and regulations for the use of Chinju Store's Website, located at https://chinjustore.in/.
                </p>
                <p className="text-gray-700 mb-4">
                  By accessing this website we assume you accept these terms and conditions. Do not continue to use Chinju Store if you do not agree to take all of the terms and conditions stated on this page.
                </p>
                <p className="text-gray-700">
                  The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
                </p>
              </section>

              {/* Interpretation and Definitions */}
              <section id="interpretation" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Interpretation and Definitions</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Interpretation</h3>
                  <p className="text-gray-700">
                    The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Definitions</h3>
                  <p className="text-gray-700 mb-4">For the purposes of these Terms and Conditions:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Account</h4>
                      <p className="text-gray-700">means a unique account created for You to access our Service or parts of our Service.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Company</h4>
                      <p className="text-gray-700">(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Chinju Store, an individual business entity based in Kerala, India.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Content</h4>
                      <p className="text-gray-700">refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Country</h4>
                      <p className="text-gray-700">refers to: Kerala, India</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Device</h4>
                      <p className="text-gray-700">means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Service</h4>
                      <p className="text-gray-700">refers to the Website.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Website</h4>
                      <p className="text-gray-700">refers to Chinju Store, accessible from <a href="https://chinjustore.in/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://chinjustore.in/</a></p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">You</h4>
                      <p className="text-gray-700">means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* User Accounts */}
              <section id="accounts" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">User Accounts</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
                  </p>
                  <p className="text-gray-700 mb-3">
                    You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a third-party service.
                  </p>
                  <p className="text-gray-700">
                    You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account.
                  </p>
                </div>
              </section>

              {/* User-Generated Content */}
              <section id="content" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">User-Generated Content</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Our Service allows You to post Content such as product reviews. You are responsible for the Content that You post to the Service, including its legality, reliability, and appropriateness.
                  </p>
                  <p className="text-gray-700 mb-3">
                    By posting Content to the Service, You grant Us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of Your rights to any Content You submit, post or display on or through the Service and You are responsible for protecting those rights.
                  </p>
                  <p className="text-gray-700 mb-3">
                    You represent and warrant that: (i) the Content is Yours (You own it) or You have the right to use it and grant Us the rights and license as provided in these Terms, and (ii) the posting of Your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
                  </p>
                  <p className="text-gray-700">
                    We reserve the right to terminate the account of anyone found to be infringing on a copyright or posting inappropriate or offensive content.
                  </p>
                </div>
              </section>

              {/* Purchases and Payments */}
              <section id="purchases" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Purchases and Payments</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    If You wish to purchase any product or service made available through the Service ("Purchase"), You may be asked to supply certain information relevant to Your Purchase including, without limitation, Your credit card number, the expiration date of Your credit card, Your billing address, and Your shipping information.
                  </p>
                  <p className="text-gray-700 mb-3">
                    You represent and warrant that: (i) You have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information You supply to us is true, correct and complete.
                  </p>
                  <p className="text-gray-700 mb-3">
                    The Service may employ the use of third party services for the purpose of facilitating payment and the completion of Purchases. By submitting Your information, You grant Us the right to provide the information to these third parties subject to our Privacy Policy.
                  </p>
                  <p className="text-gray-700">
                    We reserve the right to refuse or cancel Your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in Your order or other reasons.
                  </p>
                </div>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Intellectual Property</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Chinju Store and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Chinju Store.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Our content including but not limited to logo, visual design, trademarks, etc. is our exclusive property and protected by copyright and trademark laws.
                  </p>
                  <p className="text-gray-700">
                    You may not duplicate, copy, or reuse any portion of the HTML/CSS, Javascript, or visual design elements without express written permission from Chinju Store.
                  </p>
                </div>
              </section>

              {/* Prohibited Activities */}
              <section id="prohibited" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Prohibited Activities</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    You may not access or use the Service for any purpose other than that for which We make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by Us.
                  </p>
                  <p className="text-gray-700 mb-3">
                    As a user of the Service, You agree not to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Systematically retrieve data or other content from the Service to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from Us.</li>
                    <li>Make any unauthorized use of the Service, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
                    <li>Use the Service to advertise or offer to sell goods and services.</li>
                    <li>Circumvent, disable, or otherwise interfere with security-related features of the Service, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Service and/or the Content contained therein.</li>
                    <li>Engage in unauthorized framing of or linking to the Service.</li>
                    <li>Trick, defraud, or mislead Us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                    <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                    <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                    <li>Interfere with, disrupt, or create an undue burden on the Service or the networks or services connected to the Service.</li>
                    <li>Attempt to impersonate another user or person or use the username of another user.</li>
                    <li>Sell or otherwise transfer Your profile.</li>
                    <li>Use any information obtained from the Service in order to harass, abuse, or harm another person.</li>
                    <li>Use the Service as part of any effort to compete with Us or otherwise use the Service and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
                    <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Service.</li>
                    <li>Attempt to bypass any measures of the Service designed to prevent or restrict access to the Service, or any portion of the Service.</li>
                    <li>Harass, annoy, intimidate, or threaten any of Our employees or agents engaged in providing any portion of the Service to You.</li>
                    <li>Delete the copyright or other proprietary rights notice from any Content.</li>
                    <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Service or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Service.</li>
                    <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Service, or using or launching any unauthorized script or other software.</li>
                    <li>Disparage, tarnish, or otherwise harm, in Our opinion, Us and/or the Service.</li>
                    <li>Use the Service in a manner inconsistent with any applicable laws or regulations.</li>
                  </ul>
                </div>
              </section>

              {/* Termination */}
              <section id="termination" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Termination</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.
                  </p>
                  <p className="text-gray-700 mb-3">
                    Upon termination, Your right to use the Service will cease immediately. If You wish to terminate Your Account, You may simply discontinue using the Service.
                  </p>
                  <p className="text-gray-700">
                    All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section id="liability" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Limitation of Liability</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Notwithstanding any damages that You might incur, the entire liability of Chinju Store and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
                  </p>
                  <p className="text-gray-700 mb-3">
                    To the maximum extent permitted by applicable law, in no event shall Chinju Store or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if Chinju Store or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
                  </p>
                  <p className="text-gray-700">
                    Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.
                  </p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section id="changes" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Changes to Terms</h2>
                <p className="text-gray-700 mb-3">
                  We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
                </p>
                <p className="text-gray-700 mb-3">
                  By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.
                </p>
                <p className="text-gray-700">
                  You are advised to review these Terms periodically for any changes. Changes to these Terms are effective when they are posted on this page.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about these Terms and Conditions, You can contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <FaEnvelope className="text-indigo-600 mr-3 text-xl" />
                      <h3 className="text-lg font-medium text-gray-800">By email</h3>
                    </div>
                    <a href="mailto:akshaypayakkal@gmail.com" className="text-indigo-600 hover:underline">akshaypayakkal@gmail.com</a>
                  </div>
                  
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <FaExternalLinkAlt className="text-indigo-600 mr-3 text-xl" />
                      <h3 className="text-lg font-medium text-gray-800">Through our website</h3>
                    </div>
                    <a href="https://chinjustore.in/contact" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://chinjustore.in/contact</a>
                  </div>
                  
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <div className="flex items-center mb-3">
                      <FaPhone className="text-indigo-600 mr-3 text-xl" />
                      <h3 className="text-lg font-medium text-gray-800">By phone</h3>
                    </div>
                    <a href="tel:9400361911" className="text-indigo-600 hover:underline">9400361911</a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Back to top button */}
      {scrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TermsAndConditions;