
import Layout from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">About BloodLink Connect</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              BloodLink Connect is dedicated to bridging the gap between blood donors and patients in need. 
              Our mission is to ensure that no life is lost due to blood shortage by creating an efficient 
              platform that connects willing donors with patients in critical need of blood transfusions.
            </p>
            <p className="text-gray-700">
              We believe that everyone can be a hero by donating blood. A single donation can save up to three 
              lives, making it one of the most impactful ways to help others.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Work</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                  <span className="text-bloodred font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Registration</h3>
                  <p className="text-gray-700">
                    Users can register as donors or patients. Donors provide their blood group and location 
                    information, while patients can request blood when needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                  <span className="text-bloodred font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Blood Requests</h3>
                  <p className="text-gray-700">
                    Patients can request blood by specifying their blood group, units needed, and reason. 
                    The system prioritizes finding donors in the same city.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                  <span className="text-bloodred font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Admin Approval</h3>
                  <p className="text-gray-700">
                    Our dedicated administrators review all blood requests and donation offers to ensure 
                    the system's integrity and facilitate the matching process.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                  <span className="text-bloodred font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Connection</h3>
                  <p className="text-gray-700">
                    Once approved, donors and patients are connected, and the blood donation process is facilitated 
                    to ensure timely and safe transfusions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Why Donate Blood?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Save Lives</h3>
                <p className="text-gray-700">
                  Your donation can save up to three lives and help patients undergoing surgeries, 
                  cancer treatments, or suffering from traumatic injuries.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Health Benefits</h3>
                <p className="text-gray-700">
                  Regular blood donation helps reduce the risk of heart and liver ailments and 
                  stimulates the production of new blood cells.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Free Health Check</h3>
                <p className="text-gray-700">
                  Donors receive a mini health check-up including blood pressure, hemoglobin levels, 
                  and screening for various infections.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Community Service</h3>
                <p className="text-gray-700">
                  Blood donation is a simple way to give back to your community and make a 
                  meaningful difference in people's lives.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="text-gray-700 mb-6">
              BloodLink Connect is run by a dedicated team of healthcare professionals, technology experts, 
              and volunteers who are passionate about making blood donation more accessible and efficient.
            </p>
            
            <div className="bg-bloodred text-white rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-3">Join Our Mission</h3>
              <p className="mb-4">
                Whether you're a donor, a patient, or someone who wants to contribute to this life-saving cause, 
                we welcome you to join our community.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="/register" className="bg-white text-bloodred px-4 py-2 rounded-md font-medium hover:bg-gray-100">
                  Register Now
                </a>
                <a href="/contact" className="border border-white px-4 py-2 rounded-md font-medium hover:bg-bloodred-dark">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
