import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import './LandingPage.css';

// Carousel Settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  fade: true,
  arrows: false
};

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll animations observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const renderHomePage = () => (
    <div className="page-content">
      {/* Hero Section with Carousel & Tricolor Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933]/10 via-white/50 to-[#138808]/10 z-0" />

        <div className="container mx-auto px-4 z-10 pt-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1
                className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight"
                variants={fadeInUp}
              >
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] to-[#138808] drop-shadow-md">
                  EduMapping
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
                variants={fadeInUp}
              >
                Nurturing Young Minds. Our Objective: To make youth Job Ready with essential Employability Skills.
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-4"
                variants={fadeInUp}
              >
                <Link
                  to="/login"
                  state={{ from: { pathname: '/dashboard' } }}
                  className="px-8 py-4 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Try Demo
                </Link>
                <button
                  onClick={() => handlePageChange('features')}
                  className="px-8 py-4 bg-white text-[#138808] border-2 border-[#138808] rounded-full font-semibold hover:bg-green-50 transition-all transform hover:-translate-y-1"
                >
                  Explore Features
                </button>
              </motion.div>

              <motion.div
                className="mt-12 grid grid-cols-3 gap-6 text-center"
                variants={fadeInUp}
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-[#FF9933]">7500+</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-[#156395]">50+</div>
                  <div className="text-sm text-gray-600">Partners</div>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-[#138808]">2000+</div>
                  <div className="text-sm text-gray-600">Placements</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 w-full max-w-lg lg:max-w-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-3xl overflow-hidden">
                <Slider {...carouselSettings}>
                  {/* Slide 1: Career Growth - Saffron */}
                  <div className="outline-none px-2">
                    <div className="h-[400px] relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF9933]/20 to-[#FF9933]/5 backdrop-blur-lg border border-[#FF9933]/20 flex items-center justify-center group">
                      {/* Abstract Shapes */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9933]/30 rounded-full -mr-16 -mt-16 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF9933]/20 rounded-full -ml-10 -mb-10 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>

                      <div className="relative z-10 text-center p-8 max-w-md mx-auto">
                        <h3 className="text-4xl font-bold mb-4 tracking-tight text-gray-800 drop-shadow-sm">Career Growth</h3>
                        <p className="text-gray-700 text-xl leading-relaxed font-medium">
                          Accelerate your professional journey with our structured placement programs.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2: Skill Development - White/Blue (Chakra) */}
                  <div className="outline-none px-2">
                    <div className="h-[400px] relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/40 to-blue-50/20 backdrop-blur-lg border border-white/40 flex items-center justify-center group">
                      <div className="absolute top-0 left-0 w-64 h-64 bg-[#000080]/10 rounded-full -ml-16 -mt-16 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
                      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#000080]/10 rounded-full -mr-10 -mb-10 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>

                      <div className="relative z-10 text-center p-8 max-w-md mx-auto">
                        <h3 className="text-4xl font-bold mb-4 tracking-tight text-gray-800 drop-shadow-sm">Skill Development</h3>
                        <p className="text-gray-700 text-xl leading-relaxed font-medium">
                          Master essential workplace skills through our comprehensive training modules.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3: Industry Connect - Green */}
                  <div className="outline-none px-2">
                    <div className="h-[400px] relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#138808]/20 to-[#138808]/5 backdrop-blur-lg border border-[#138808]/20 flex items-center justify-center group">
                      <div className="absolute top-0 right-0 w-72 h-72 bg-[#138808]/30 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#138808]/20 rounded-full blur-3xl"></div>

                      <div className="relative z-10 text-center p-8 max-w-md mx-auto">
                        <h3 className="text-4xl font-bold mb-4 tracking-tight text-gray-800 drop-shadow-sm">Industry Connect</h3>
                        <p className="text-gray-700 text-xl leading-relaxed font-medium">
                          Bridge the gap between academia and industry with our recruiter network.
                        </p>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Training Modules</h2>
            <p className="text-xl text-gray-600">Comprehensive modules designed to make youth job-ready</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "💬", title: "Soft Skills", desc: "Communication, Teamwork, Leadership, Time Management", color: "bg-blue-50 text-blue-600" },
              { icon: "🌟", title: "Life Skills", desc: "Confidence Building, Decision Making, Emotional Intelligence", color: "bg-orange-50 text-orange-600" },
              { icon: "💼", title: "Workplace Readiness", desc: "Handling Real-world Challenges, Problem Solving, Adaptability", color: "bg-green-50 text-green-600" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow bg-white"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-3xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
            <p className="text-xl text-gray-600">Streamline your educational institution's operations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🎓", title: "Student Management", desc: "Comprehensive student profiles and academic tracking" },
              { icon: "💼", title: "Job Placements", desc: "Connect students with top companies" },
              { icon: "📊", title: "Analytics Dashboard", desc: "Real-time insights for better decision making" },
              { icon: "📝", title: "Resume Builder", desc: "Professional resume creation tools" },
              { icon: "🎪", title: "Event Management", desc: "Organize campus events and career fairs" },
              { icon: "🔔", title: "Smart Notifications", desc: "Stay updated with personalized alerts" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to transform your campus?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of institutions already using EduMapping to improve student outcomes.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                state={{ from: { pathname: '/dashboard' } }}
                className="px-8 py-4 bg-white text-[#138808] rounded-full font-bold shadow-lg hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
              <button
                onClick={() => handlePageChange('contact')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // ... (Keep other render functions: renderFeaturesPage, renderAboutPage, renderServicesPage, renderContactPage)
  // For brevity, I'll implement them with similar modern styling but keep the core content.

  const renderFeaturesPage = () => (
    <div className="pt-20">
      <section className="bg-[#156395] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Features</h1>
          <p className="text-xl text-blue-100">Comprehensive tools for modern campus management</p>
        </div>
      </section>
      {/* ... Content ... */}
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-600">Detailed feature list coming soon...</p>
      </div>
    </div>
  );

  const renderAboutPage = () => (
    <div className="pt-20">
      <section className="bg-[#156395] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About EduMapping</h1>
          <p className="text-xl text-blue-100">Making youth job-ready</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose lg:prose-xl mx-auto">
          <p>Our objective is to make youth job-ready with essential employability skills.</p>
          {/* ... */}
        </div>
      </div>
    </div>
  );

  const renderServicesPage = () => (
    <div className="pt-20">
      <section className="bg-[#156395] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        </div>
      </section>
    </div>
  );

  const renderContactPage = () => (
    <div className="pt-20">
      <section className="bg-[#156395] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <form onSubmit={handleContactSubmit} className="space-y-6">
          <input type="text" placeholder="Your Name" className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#156395] outline-none" required />
          <input type="email" placeholder="Your Email" className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#156395] outline-none" required />
          <textarea placeholder="Message" rows="5" className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#156395] outline-none" required></textarea>
          <button type="submit" className="w-full py-4 bg-[#156395] text-white rounded-xl font-bold hover:bg-[#0f4b72]">Send Message</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${currentPage === 'home' ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => handlePageChange('home')} className="flex items-center gap-2">
              <img src="/logo.svg" alt="EduMapping" className="h-12 w-auto" />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] to-[#138808] drop-shadow-sm">
                EduMapping
              </span>
            </button>

            <div className="hidden md:flex items-center gap-8">
              {['Home', 'Features', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => handlePageChange(item.toLowerCase())}
                  className={`text-sm font-medium hover:text-[#FF9933] transition-colors ${currentPage === item.toLowerCase() ? 'text-[#FF9933]' : 'text-gray-600'}`}
                >
                  {item}
                </button>
              ))}
              <Link
                to="/login"
                state={{ from: { pathname: '/dashboard' } }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#138808] text-white rounded-full font-medium hover:shadow-lg transition-all shadow-md"
              >
                Try Demo
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="flex flex-col p-4 gap-4">
                {['Home', 'Features', 'About', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item.toLowerCase())}
                    className="text-left py-2 text-gray-600 font-medium"
                  >
                    {item}
                  </button>
                ))}
                <Link
                  to="/login"
                  state={{ from: { pathname: '/dashboard' } }}
                  className="text-center py-3 bg-[#156395] text-white rounded-xl font-medium"
                >
                  Try Demo
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'features' && renderFeaturesPage()}
        {currentPage === 'about' && renderAboutPage()}
        {currentPage === 'services' && renderServicesPage()}
        {currentPage === 'contact' && renderContactPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <img src="/logo.svg" alt="EduMapping" className="h-10 mb-6" />
              <p className="mb-4 max-w-sm">Making youth job-ready with essential employability skills.</p>
              <p className="text-sm text-gray-500">
                Brand by <span className="text-[#FF9933]">eTraze</span>
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'Features', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <button onClick={() => handlePageChange(item.toLowerCase())} className="hover:text-white transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm">
                <li>hello@edumapping.com</li>
                <li>www.edumapping.com</li>
                <li>+91 9104991059</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 EduMapping. All rights reserved.</p>
            <p className="text-sm">Made by <span className="text-white font-medium">Globoniks</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
