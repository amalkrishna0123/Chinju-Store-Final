import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';

const RefundPolicy = () => {
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
    { id: 'eligibility', title: 'Eligibility for Refund' },
    { id: 'process', title: 'Refund Process' },
    { id: 'timeframe', title: 'Refund Timeframe' },
    { id: 'shipping', title: 'Shipping Costs' },
    { id: 'exchanges', title: 'Exchanges' },
    { id: 'non-refundable', title: 'Non-Refundable Items' },
    { id: 'contact', title: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Refund Policy | Chinju Store</title>
        <meta name="description" content="Read our Refund Policy to understand our guidelines for returns and refunds at Chinju Store." />
      </Helmet>

      {/* Header */}
      <header className={`bg-white shadow-sm sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Refund Policy</h1>
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
                  At Chinju Store, we strive to ensure your complete satisfaction with every purchase. This Refund Policy outlines the terms and conditions under which we offer refunds for products purchased through our website.
                </p>
                <p className="text-gray-700 mb-4">
                  Please read this policy carefully before making a purchase. By using our Service, you agree to the terms of this Refund Policy.
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
                  <p className="text-gray-700 mb-4">For the purposes of this Refund Policy:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Company</h4>
                      <p className="text-gray-700">(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Chinju Store, an individual business entity based in Kerala, India.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Goods</h4>
                      <p className="text-gray-700">refer to the items offered for sale on the Website.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Order</h4>
                      <p className="text-gray-700">means a request by You to purchase Goods from Us.</p>
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

              {/* Eligibility for Refund */}
              <section id="eligibility" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Eligibility for Refund</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    To be eligible for a refund, you must meet the following conditions:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>The item must be unused, in its original packaging, and in the same condition as when you received it.</li>
                    <li>The item must be returned within 7 days of delivery.</li>
                    <li>The item must not be on our list of non-refundable items (see section below).</li>
                    <li>You must provide proof of purchase (order number or receipt).</li>
                    <li>The item must not be damaged due to misuse or negligence after delivery.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Ineligible Cases</h3>
                  <p className="text-gray-700 mb-3">
                    The following situations are not eligible for refund:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Items that have been used, worn, or damaged after delivery.</li>
                    <li>Items returned without original packaging or tags.</li>
                    <li>Items that are returned more than 7 days after delivery.</li>
                    <li>Digital products or services that have been accessed or downloaded.</li>
                    <li>Items marked as "final sale" or "non-refundable" at the time of purchase.</li>
                  </ul>
                </div>
              </section>

              {/* Refund Process */}
              <section id="process" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Refund Process</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    To initiate a refund, please follow these steps:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>Contact our customer service team at <a href="mailto:akshaypayakkal@gmail.com" className="text-indigo-600 hover:underline">akshaypayakkal@gmail.com</a> or call us at <a href="tel:9400361911" className="text-indigo-600 hover:underline">9400361911</a> within 7 days of receiving your order to request a return authorization.</li>
                    <li>Pack the item securely in its original packaging, including all accessories and documentation.</li>
                    <li>Include a copy of your order confirmation or receipt inside the package.</li>
                    <li>Ship the package to the address we provide in your return authorization.</li>
                    <li>Once we receive and inspect your return, we will notify you of the approval or rejection of your refund.</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Refund Approval</h3>
                  <p className="text-gray-700">
                    If your refund is approved, it will be processed to the original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies (see Refund Timeframe section below).
                  </p>
                </div>
              </section>

              {/* Refund Timeframe */}
              <section id="timeframe" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Refund Timeframe</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                  </p>
                  <p className="text-gray-700 mb-3">
                    If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                    <li><strong>Bank Transfers:</strong> 7-14 business days</li>
                    <li><strong>Other Payment Methods:</strong> Varies by provider</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Late or Missing Refunds</h3>
                  <p className="text-gray-700 mb-3">
                    If you haven't received a refund yet, first check your bank account again. Then contact your credit card company or bank as it may take some time before your refund is officially posted.
                  </p>
                  <p className="text-gray-700">
                    If you've done all of this and you still have not received your refund yet, please contact us at <a href="mailto:akshaypayakkal@gmail.com" className="text-indigo-600 hover:underline">akshaypayakkal@gmail.com</a>.
                  </p>
                </div>
              </section>

              {/* Shipping Costs */}
              <section id="shipping" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Shipping Costs</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Shipping costs for returning an item are generally the responsibility of the customer, unless the return is due to our error (such as shipping the wrong item or a defective product).
                  </p>
                  <p className="text-gray-700">
                    We recommend using a trackable shipping service and purchasing shipping insurance for returns. We cannot guarantee that we will receive your returned item.
                  </p>
                </div>
              </section>

              {/* Exchanges */}
              <section id="exchanges" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Exchanges</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us at <a href="mailto:akshaypayakkal@gmail.com" className="text-indigo-600 hover:underline">akshaypayakkal@gmail.com</a> or call us at <a href="tel:9400361911" className="text-indigo-600 hover:underline">9400361911</a>.
                  </p>
                  <p className="text-gray-700">
                    For exchanges due to size or color preferences, we recommend returning the original item (following our standard return process) and placing a new order for the desired item.
                  </p>
                </div>
              </section>

              {/* Non-Refundable Items */}
              <section id="non-refundable" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Non-Refundable Items</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Certain items are exempt from being returned and are non-refundable:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Gift cards</li>
                    <li>Downloadable software products</li>
                    <li>Personalized or custom-made products</li>
                    <li>Perishable goods (food, flowers, etc.)</li>
                    <li>Intimate or sanitary goods</li>
                    <li>Items marked as "final sale" at time of purchase</li>
                  </ul>
                </div>
              </section>

              {/* Contact Us */}
              <section id="contact">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our Refund Policy, You can contact us:
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

export default RefundPolicy;