import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaTruck, FaBoxOpen, FaClock, FaUndo, FaMapMarkerAlt, FaPhone, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';

const ShippingDelivery = () => {
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
    { id: 'shipping-info', title: 'Shipping Information' },
    { id: 'delivery-times', title: 'Delivery Times' },
    { id: 'shipping-rates', title: 'Shipping Rates' },
    { id: 'order-tracking', title: 'Order Tracking' },
    { id: 'returns', title: 'Returns & Refunds' },
    { id: 'international', title: 'International Shipping' },
    { id: 'contact', title: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Shipping & Delivery Policy | Chinju Store</title>
        <meta name="description" content="Learn about our shipping and delivery policies, including delivery times, shipping rates, and return procedures at Chinju Store." />
      </Helmet>

      {/* Header */}
      <header className={`bg-white shadow-sm sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Shipping & Delivery Policy</h1>
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
                  Thank you for shopping at Chinju Store. This Shipping & Delivery Policy outlines how we handle the shipping and delivery of products purchased through our website.
                </p>
                <p className="text-gray-700">
                  Please read this policy carefully to understand our shipping methods, delivery times, and related information. By placing an order with us, you agree to the terms outlined in this policy.
                </p>
              </section>

              {/* Shipping Information */}
              <section id="shipping-info" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Shipping Information</h2>
                
                <div className="mb-6">
                  <div className="flex items-start mb-4">
                    <FaTruck className="text-indigo-600 mt-1 mr-3 text-xl flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-700">Shipping Methods</h3>
                      <p className="text-gray-700">
                        We offer the following shipping methods for domestic orders within India:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                        <li><strong>Standard Shipping:</strong> Delivery through our trusted courier partners</li>
                        <li><strong>Express Shipping:</strong> Faster delivery option (additional charges may apply)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaBoxOpen className="text-indigo-600 mt-1 mr-3 text-xl flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-700">Processing Time</h3>
                      <p className="text-gray-700">
                        All orders are processed within <strong>1-2 business days</strong> (excluding weekends and public holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-indigo-600 mt-1 mr-3 text-xl flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-700">Shipping Locations</h3>
                      <p className="text-gray-700 mb-2">
                        We currently ship to all states within India. For international shipping options, please see our <a href="#international" className="text-indigo-600 hover:underline">International Shipping</a> section below.
                      </p>
                      <p className="text-gray-700">
                        Please ensure your shipping address is complete and accurate to avoid any delays in delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Times */}
              <section id="delivery-times" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Delivery Times</h2>
                
                <div className="flex items-start mb-4">
                  <FaClock className="text-indigo-600 mt-1 mr-3 text-xl flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Estimated Delivery Times</h3>
                    <p className="text-gray-700 mb-3">
                      Delivery times may vary depending on your location and the shipping method selected. Below are our estimated delivery times:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Within Kerala:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Standard Shipping: 2-3 business days</li>
                        <li>Express Shipping: 1-2 business days</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mt-3">
                      <h4 className="font-medium text-gray-800 mb-2">Other Indian States:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Standard Shipping: 3-7 business days</li>
                        <li>Express Shipping: 2-4 business days</li>
                      </ul>
                    </div>
                    <p className="text-gray-700 mt-3">
                      <strong>Note:</strong> These are estimates only and actual delivery times may vary due to factors beyond our control such as weather conditions, customs delays (for international orders), or carrier delays.
                    </p>
                  </div>
                </div>
              </section>

              {/* Shipping Rates */}
              <section id="shipping-rates" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Shipping Rates</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Shipping costs are calculated at checkout based on the weight of your order and your delivery location. You can view the shipping cost for your order during checkout before submitting your order.
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700">Domestic Shipping Rates (India)</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard Shipping</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Express Shipping</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">Below ₹500</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹50</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹100</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹500 - ₹1500</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹40</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹80</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">Above ₹1500</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">FREE</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₹50</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-gray-700 mt-3 text-sm">
                      *Free standard shipping applies to orders above ₹1500. Express shipping charges still apply.
                    </p>
                  </div>
                </div>
              </section>

              {/* Order Tracking */}
              <section id="order-tracking" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Order Tracking</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    Once your order has been shipped, you will receive a confirmation email with your tracking number and a link to track your package.
                  </p>
                  <p className="text-gray-700 mb-4">
                    You can also track your order by logging into your account on our website and viewing your order history.
                  </p>
                  <p className="text-gray-700">
                    If you're having trouble tracking your order or haven't received your tracking information within 2 business days, please contact our customer service team.
                  </p>
                </div>
              </section>

              {/* Returns & Refunds */}
              <section id="returns" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Returns & Refunds</h2>
                
                <div className="flex items-start mb-4">
                  <FaUndo className="text-indigo-600 mt-1 mr-3 text-xl flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Return Policy</h3>
                    <p className="text-gray-700 mb-3">
                      We accept returns within <strong>7 days</strong> of delivery for most items. To be eligible for a return:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
                      <li>The item must be unused and in the same condition that you received it</li>
                      <li>The item must be in the original packaging</li>
                      <li>You must provide the receipt or proof of purchase</li>
                    </ul>
                    <p className="text-gray-700 mb-3">
                      To initiate a return, please contact our customer service team with your order number and details about the product you would like to return.
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Refunds</h3>
                  <p className="text-gray-700 mb-3">
                    Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                  </p>
                  <p className="text-gray-700 mb-3">
                    If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within <strong>7-10 business days</strong>.
                  </p>
                  <p className="text-gray-700">
                    <strong>Note:</strong> Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                  </p>
                </div>
              </section>

              {/* International Shipping */}
              <section id="international" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">International Shipping</h2>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-4">
                    We currently offer limited international shipping to select countries. Please contact us before placing an international order to confirm availability and shipping costs.
                  </p>
                  <p className="text-gray-700 mb-4">
                    For international orders:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
                    <li>Shipping times vary by destination (typically 7-21 business days)</li>
                    <li>Customers are responsible for any customs and import taxes that may apply</li>
                    <li>We are not responsible for delays due to customs</li>
                    <li>International returns are handled on a case-by-case basis</li>
                  </ul>
                  <p className="text-gray-700">
                    For more information about international shipping, please contact our customer service team.
                  </p>
                </div>
              </section>

              {/* Contact Us */}
              <section id="contact">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about our Shipping & Delivery Policy, You can contact us:
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

export default ShippingDelivery;