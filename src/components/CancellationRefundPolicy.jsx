import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';

const CancellationRefundPolicy = () => {
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
    { id: 'cancellation', title: 'Order Cancellation Policy' },
    { id: 'refund', title: 'Refund Policy' },
    { id: 'eligibility', title: 'Eligibility for Refund' },
    { id: 'process', title: 'Processes' },
    { id: 'exceptions', title: 'Non-Cancellable/Refundable Items' },
    { id: 'timeframe', title: 'Timeframes' },
    { id: 'shipping', title: 'Shipping Costs' },
    { id: 'exchanges', title: 'Exchanges' },
    { id: 'changes', title: 'Changes to this Policy' },
    { id: 'contact', title: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Cancellation & Refund Policy | Chinju Store</title>
        <meta name="description" content="Review our comprehensive Cancellation & Refund Policy for purchases made at Chinju Store." />
      </Helmet>

      {/* Header */}
      <header className={`bg-white shadow-sm sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Cancellation & Refund Policy</h1>
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
                  This Cancellation & Refund Policy outlines the terms and conditions under which you may cancel orders and request refunds for purchases made through Chinju Store.
                </p>
                <p className="text-gray-700">
                  By placing an order on our platform, you agree to comply with this policy. Please read it carefully before making any purchase.
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
                  <p className="text-gray-700 mb-4">For the purposes of this Policy:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Business Days</h4>
                      <p className="text-gray-700">means Monday through Saturday, excluding public holidays in India.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Cancellation Window</h4>
                      <p className="text-gray-700">refers to the period during which an order can be cancelled, typically before shipment.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Chinju Store</h4>
                      <p className="text-gray-700">(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Chinju Store, an individual business entity based in Kerala, India operating at <a href="https://chinjustore.in/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://chinjustore.in/</a>.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Goods</h4>
                      <p className="text-gray-700">refer to the items offered for sale on the Website.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Order</h4>
                      <p className="text-gray-700">means your purchase request for goods through our Service.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Service</h4>
                      <p className="text-gray-700">refers to the Website.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Shipment</h4>
                      <p className="text-gray-700">means the point at which your order has been dispatched from our facility.</p>
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

              {/* Order Cancellation Policy */}
              <section id="cancellation" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Order Cancellation Policy</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Cancellation Timeframe</h3>
                    <p className="text-gray-700">
                      You may cancel your order under the following conditions:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
                      <li><strong>Before shipment:</strong> Orders can be cancelled any time before we process your order for shipment</li>
                      <li><strong>After shipment:</strong> Once your order has been shipped, cancellation is no longer possible</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">How to Cancel</h3>
                    <p className="text-gray-700">
                      To cancel an order, please follow these steps:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 mt-2 text-gray-700">
                      <li>Log in to your Chinju Store account</li>
                      <li>Navigate to "My Orders" section</li>
                      <li>Select the order you wish to cancel</li>
                      <li>Click "Cancel Order" and confirm your cancellation</li>
                    </ol>
                    <p className="text-gray-700 mt-3">
                      Alternatively, you may contact us directly using the contact information provided at the bottom of this policy.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Processing Time</h3>
                    <p className="text-gray-700">
                      Cancellation requests are processed within 1-2 business days. You will receive email confirmation once your cancellation is processed.
                    </p>
                  </div>
                </div>
              </section>

              {/* Refund Policy */}
              <section id="refund" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Refund Policy</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Refund Eligibility</h3>
                    <p className="text-gray-700">
                      Refunds are issued under the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
                      <li>Successful cancellation of an order before shipment</li>
                      <li>Defective, damaged, or incorrect items received</li>
                      <li>Non-delivery of goods despite payment confirmation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Refund Processing</h3>
                    <p className="text-gray-700">
                      Approved refunds will be processed within 7-10 business days. The refund will be issued through the original payment method used during purchase.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Refund Methods</h3>
                    <p className="text-gray-700">
                      Refunds will be issued using the same payment method used for the original transaction:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
                      <li>Credit/Debit Card: Refunded to the original card</li>
                      <li>UPI: Refunded to the original UPI account</li>
                      <li>Net Banking: Refunded to the originating bank account</li>
                      <li>Wallet payments: Refunded to the original wallet</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Partial Refunds</h3>
                    <p className="text-gray-700">
                      In certain cases, partial refunds may be granted for:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
                      <li>Partial order cancellations</li>
                      <li>Returns of specific items from a multi-item order</li>
                      <li>Defective parts of a product bundle</li>
                    </ul>
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
                    <li>The item must not be on our list of non-refundable items.</li>
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

              {/* Processes */}
              <section id="process" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Processes</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Cancellation Process</h3>
                    <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                      <li>
                        <strong>Log in to your account</strong>
                        <p className="text-sm text-gray-600 mt-1">Access your Chinju Store account using your registered credentials</p>
                      </li>
                      <li>
                        <strong>Navigate to Order History</strong>
                        <p className="text-sm text-gray-600 mt-1">Go to "My Orders" section in your account dashboard</p>
                      </li>
                      <li>
                        <strong>Select the order</strong>
                        <p className="text-sm text-gray-600 mt-1">Choose the order you wish to cancel from your order list</p>
                      </li>
                      <li>
                        <strong>Initiate cancellation</strong>
                        <p className="text-sm text-gray-600 mt-1">Click the "Cancel Order" button next to the selected order</p>
                      </li>
                      <li>
                        <strong>Select cancellation reason</strong>
                        <p className="text-sm text-gray-600 mt-1">Choose the appropriate reason from the dropdown menu</p>
                      </li>
                      <li>
                        <strong>Confirm cancellation</strong>
                        <p className="text-sm text-gray-600 mt-1">Review your request and confirm the cancellation</p>
                      </li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Refund Process</h3>
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
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">After Processing</h3>
                    <p className="text-gray-700">
                      Once your cancellation/refund is confirmed:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
                      <li>You will receive an email confirmation</li>
                      <li>Your refund process will begin automatically</li>
                      <li>The refund amount will reflect in your account within the specified timeframe</li>
                      <li>Order status will be updated in your account</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Non-Cancellable/Refundable Items */}
              <section id="exceptions" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Non-Cancellable/Refundable Items</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Non-Cancellable Products</h3>
                    <p className="text-gray-700">
                      Certain items cannot be cancelled once ordered due to their nature:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
                      <li>Customized or personalized products</li>
                      <li>Digital products that have been delivered or activated</li>
                      <li>Perishable goods (food, flowers, etc.)</li>
                      <li>Intimate or sanitary products</li>
                      <li>Products marked as "Final Sale" or "Non-returnable"</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Non-Refundable Items</h3>
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
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Special Circumstances</h3>
                    <p className="text-gray-700">
                      We reserve the right to refuse cancellation/refund requests if:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-700">
                      <li>The order has already been shipped</li>
                      <li>Fraudulent activity is suspected</li>
                      <li>Multiple cancellation/refund requests are made for the same product</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Timeframes */}
              <section id="timeframe" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Timeframes</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Cancellation Processing</h3>
                    <p className="text-gray-700">
                      Cancellation requests are processed within 1-2 business days. You will receive email confirmation once your cancellation is processed.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Refund Processing</h3>
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

              {/* Changes to this Policy */}
              <section id="changes" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Changes to this Policy</h2>
                <p className="text-gray-700 mb-3">
                  We may update our Cancellation & Refund Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
                </p>
                <p className="text-gray-700 mb-3">
                  For significant changes, we will notify you through email or a prominent notice on our Service prior to the change becoming effective.
                </p>
                <p className="text-gray-700">
                  We recommend reviewing this policy periodically for any updates. Continued use of our Service after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our Cancellation & Refund Policy, please contact us:
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
                
                <div className="mt-8 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Response Time</h3>
                  <p className="text-gray-700">
                    We strive to respond to all cancellation requests and inquiries within 24-48 business hours. Please note that response times may be longer during peak seasons or holidays.
                  </p>
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

export default CancellationRefundPolicy;