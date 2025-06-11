import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaExternalLinkAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
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
    { id: 'data-collection', title: 'Collecting and Using Your Personal Data' },
    { id: 'data-sharing', title: 'Disclosure of Your Personal Data' },
    { id: 'data-security', title: 'Security of Your Personal Data' },
    { id: 'children', title: "Children's Privacy" },
    { id: 'links', title: 'Links to Other Websites' },
    { id: 'changes', title: 'Changes to this Privacy Policy' },
    { id: 'contact', title: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Privacy Policy | Chinju Store</title>
        <meta name="description" content="Read our Privacy Policy to understand how we collect, use, and protect your personal data at Chinju Store." />
      </Helmet>

      {/* Header */}
      <header className={`bg-white shadow-sm sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Privacy Policy</h1>
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
                  This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                </p>
                <p className="text-gray-700 mb-4">
                  We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the <a href="https://www.freeprivacypolicy.com/free-privacy-policy-generator/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Free Privacy Policy Generator</a>.
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
                  <p className="text-gray-700 mb-4">For the purposes of this Privacy Policy:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Account</h4>
                      <p className="text-gray-700">means a unique account created for You to access our Service or parts of our Service.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Affiliate</h4>
                      <p className="text-gray-700">means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Company</h4>
                      <p className="text-gray-700">(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Chinju Store.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">Cookies</h4>
                      <p className="text-gray-700">are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p>
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
                      <h4 className="font-medium text-gray-800">Personal Data</h4>
                      <p className="text-gray-700">is any information that relates to an identified or identifiable individual.</p>
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

              {/* Collecting and Using Your Personal Data */}
              <section id="data-collection" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Collecting and Using Your Personal Data</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Types of Data Collected</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 text-gray-700">Personal Data</h4>
                    <p className="text-gray-700 mb-3">
                      While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Email address</li>
                      <li>First name and last name</li>
                      <li>Phone number</li>
                      <li>Usage Data</li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 text-gray-700">Usage Data</h4>
                    <p className="text-gray-700 mb-3">
                      Usage Data is collected automatically when using the Service.
                    </p>
                    <p className="text-gray-700 mb-3">
                      Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                    </p>
                    <p className="text-gray-700">
                      When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 text-gray-700">Tracking Technologies and Cookies</h4>
                    <p className="text-gray-700 mb-3">
                      We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>
                        <strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.
                      </li>
                      <li>
                        <strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).
                      </li>
                    </ul>
                    <p className="text-gray-700 mt-3">
                      Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser. Learn more about cookies on the <a href="https://www.freeprivacypolicy.com/blog/sample-privacy-policy-template/#Use_Of_Cookies_And_Tracking" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Free Privacy Policy website</a> article.
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Use of Your Personal Data</h3>
                  <p className="text-gray-700 mb-4">
                    The Company may use Personal Data for the following purposes:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                    <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
                    <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
                    <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                    <li><strong>To provide You</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</li>
                    <li><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
                    <li><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
                    <li><strong>For other purposes</strong>: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Retention of Your Personal Data</h3>
                  <p className="text-gray-700">
                    The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                  </p>
                  <p className="text-gray-700 mt-3">
                    The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Transfer of Your Personal Data</h3>
                  <p className="text-gray-700">
                    Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.
                  </p>
                  <p className="text-gray-700 mt-3">
                    Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.
                  </p>
                  <p className="text-gray-700 mt-3">
                    The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Delete Your Personal Data</h3>
                  <p className="text-gray-700">
                    You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
                  </p>
                  <p className="text-gray-700 mt-3">
                    Our Service may give You the ability to delete certain information about You from within the Service.
                  </p>
                  <p className="text-gray-700 mt-3">
                    You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.
                  </p>
                  <p className="text-gray-700 mt-3">
                    Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
                  </p>
                </div>
              </section>

              {/* Disclosure of Your Personal Data */}
              <section id="data-sharing" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Disclosure of Your Personal Data</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Business Transactions</h3>
                  <p className="text-gray-700">
                    If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Law enforcement</h3>
                  <p className="text-gray-700">
                    Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">Other legal requirements</h3>
                  <p className="text-gray-700 mb-3">
                    The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Comply with a legal obligation</li>
                    <li>Protect and defend the rights or property of the Company</li>
                    <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                    <li>Protect the personal safety of Users of the Service or the public</li>
                    <li>Protect against legal liability</li>
                  </ul>
                </div>
              </section>

              {/* Security of Your Personal Data */}
              <section id="data-security" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Security of Your Personal Data</h2>
                <p className="text-gray-700">
                  The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="children" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Children's Privacy</h2>
                <p className="text-gray-700 mb-3">
                  Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
                </p>
                <p className="text-gray-700">
                  If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information.
                </p>
              </section>

              {/* Links to Other Websites */}
              <section id="links" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Links to Other Websites</h2>
                <p className="text-gray-700 mb-3">
                  Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.
                </p>
                <p className="text-gray-700">
                  We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                </p>
              </section>

              {/* Changes to this Privacy Policy */}
              <section id="changes" className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Changes to this Privacy Policy</h2>
                <p className="text-gray-700 mb-3">
                  We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
                </p>
                <p className="text-gray-700 mb-3">
                  We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.
                </p>
                <p className="text-gray-700">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </section>

              {/* Contact Us */}
              <section id="contact">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Contact Us</h2>
                <p className="text-gray-700 mb-6">
                  If you have any questions about this Privacy Policy, You can contact us:
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

export default PrivacyPolicy;