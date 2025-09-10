import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [particles, setParticles] = useState([]);

  // Particle animation effect
  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
        });
      }
      setParticles(newParticles);
    };

    createParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Scroll animations
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
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
  };

  const renderHomePage = () => (
    <div className="page-content">
      {/* Hero Section */}
      <section className="hero">
        <div className="particles-container">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
              }}
            />
          ))}
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">CampusConnect</span>
          </h1>
          <p className="hero-subtitle">
            The Ultimate Campus Management Platform - Connecting Students, Recruiters, and Educational Institutions
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Partner Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Job Placements</div>
            </div>
          </div>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Try Demo
            </Link>
            <button className="btn btn-secondary" onClick={() => handlePageChange('features')}>
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="section-title">Everything you need for campus management</h2>
            <p className="section-subtitle">Streamline your educational institution's operations with our comprehensive platform</p>
          </div>
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🎓</div>
              <h3>Student Management</h3>
              <p>Comprehensive student profiles, academic tracking, and career development tools</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">💼</div>
              <h3>Job Placements</h3>
              <p>Connect students with top companies through our advanced job matching system</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Real-time insights and reporting for better decision making</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">📝</div>
              <h3>Resume Builder</h3>
              <p>Professional resume creation and optimization tools</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🎪</div>
              <h3>Event Management</h3>
              <p>Organize and manage campus events, workshops, and career fairs</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">🔔</div>
              <h3>Smart Notifications</h3>
              <p>Stay updated with personalized alerts and important announcements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Partners Say</h2>
          <div className="testimonial-card animate-on-scroll">
            <p className="testimonial-text">
              "Globoniks has revolutionized our educational technology infrastructure. 
              Their innovative solutions have significantly improved our operational efficiency."
            </p>
            <div className="testimonial-author">
              <div className="author-info">
                <h4>Educational Institution</h4>
                <p>Technology Department</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to transform your campus?</h2>
            <p>Join hundreds of institutions already using CampusConnect to improve student outcomes and streamline operations.</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">
                Get Started
              </Link>
              <button className="btn btn-secondary" onClick={() => handlePageChange('features')}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderFeaturesPage = () => (
    <div className="page-content">
      <section className="features-hero">
        <div className="container">
          <h1 className="page-title">CampusConnect Features</h1>
          <p className="page-subtitle">
            Comprehensive tools for modern campus management and student success
          </p>
        </div>
      </section>

      <section className="detailed-features">
        <div className="container">
          <div className="feature-section">
            <div className="feature-content">
              <div className="feature-text">
                <h2>Student Portal</h2>
                <p>
                  A comprehensive dashboard where students can manage their academic journey, 
                  track progress, and access career development resources. Features include 
                  profile management, academic records, and personalized recommendations.
                </p>
                <ul className="feature-list">
                  <li>Personal profile management</li>
                  <li>Academic progress tracking</li>
                  <li>Career development tools</li>
                  <li>Resume builder and optimization</li>
                </ul>
              </div>
              <div className="feature-image">
                <div className="image-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">👨‍🎓</div>
                    <p>Student Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-content reverse">
              <div className="feature-text">
                <h2>Recruiter Dashboard</h2>
                <p>
                  Powerful tools for recruiters to discover talent, manage job postings, 
                  and streamline the hiring process. Access detailed student profiles, 
                  conduct assessments, and track application progress.
                </p>
                <ul className="feature-list">
                  <li>Job posting management</li>
                  <li>Student profile browsing</li>
                  <li>Application tracking</li>
                  <li>Assessment tools</li>
                </ul>
              </div>
              <div className="feature-image">
                <div className="image-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">👔</div>
                    <p>Recruiter Tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-section">
            <div className="feature-content">
              <div className="feature-text">
                <h2>TPO Management</h2>
                <p>
                  Complete training and placement office management system with 
                  analytics, reporting, and administrative tools to streamline 
                  campus operations and improve placement outcomes.
                </p>
                <ul className="feature-list">
                  <li>Placement analytics</li>
                  <li>Student performance tracking</li>
                  <li>Company relationship management</li>
                  <li>Event organization tools</li>
                </ul>
              </div>
              <div className="feature-image">
                <div className="image-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">📈</div>
                    <p>Analytics Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Campus?</h2>
            <p>Join hundreds of institutions already using CampusConnect to improve student outcomes</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">
                Start Free Trial
              </Link>
              <button className="btn btn-secondary" onClick={() => handlePageChange('contact')}>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAboutPage = () => (
    <div className="page-content">
      <section className="about-hero">
        <div className="container">
          <h1 className="page-title">About Globoniks</h1>
          <p className="page-subtitle">
            Pioneering the future of educational technology
          </p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text animate-on-scroll">
              <h2>Our Mission</h2>
              <p>
                At Globoniks, we are dedicated to transforming the educational landscape 
                through innovative technology solutions. We believe that every institution 
                deserves access to cutting-edge tools that enhance learning experiences 
                and streamline operations.
              </p>
              <p>
                Our team of experts works tirelessly to develop solutions that not only 
                meet today's challenges but anticipate tomorrow's needs. We are committed 
                to excellence, innovation, and the success of our educational partners.
              </p>
            </div>
            <div className="about-image animate-on-scroll">
              <div className="image-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">🎓</div>
                  <p>Educational Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card animate-on-scroll">
              <h3>Innovation</h3>
              <p>Continuously pushing the boundaries of what's possible in educational technology</p>
            </div>
            <div className="value-card animate-on-scroll">
              <h3>Excellence</h3>
              <p>Delivering superior quality in every solution we provide</p>
            </div>
            <div className="value-card animate-on-scroll">
              <h3>Integrity</h3>
              <p>Building trust through transparent and ethical business practices</p>
            </div>
            <div className="value-card animate-on-scroll">
              <h3>Collaboration</h3>
              <p>Working closely with our partners to achieve shared success</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderServicesPage = () => (
    <div className="page-content">
      <section className="services-hero">
        <div className="container">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">
            Comprehensive solutions for modern educational institutions
          </p>
        </div>
      </section>

      <section className="services-content">
        <div className="container">
          <div className="services-grid">
            <div className="service-card animate-on-scroll">
              <div className="service-icon">💻</div>
              <h3>Technology Integration</h3>
              <p>Seamlessly integrate cutting-edge technology into your existing infrastructure</p>
              <ul>
                <li>System Integration</li>
                <li>Cloud Migration</li>
                <li>Data Analytics</li>
              </ul>
            </div>
            <div className="service-card animate-on-scroll">
              <div className="service-icon">🔧</div>
              <h3>Custom Development</h3>
              <p>Tailored solutions designed specifically for your institution's needs</p>
              <ul>
                <li>Web Applications</li>
                <li>Mobile Solutions</li>
                <li>API Development</li>
              </ul>
            </div>
            <div className="service-card animate-on-scroll">
              <div className="service-icon">📊</div>
              <h3>Analytics & Reporting</h3>
              <p>Transform data into actionable insights for better decision making</p>
              <ul>
                <li>Performance Analytics</li>
                <li>Custom Dashboards</li>
                <li>Predictive Modeling</li>
              </ul>
            </div>
            <div className="service-card animate-on-scroll">
              <div className="service-icon">🛡️</div>
              <h3>Security & Compliance</h3>
              <p>Ensure your data and systems are protected with industry-leading security</p>
              <ul>
                <li>Security Audits</li>
                <li>Compliance Management</li>
                <li>Data Protection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderContactPage = () => (
    <div className="page-content">
      <section className="contact-hero">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            Get in touch with our team to discuss your needs
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info animate-on-scroll">
              <h2>Get In Touch</h2>
              <p>
                Ready to transform your educational technology? Contact us today 
                to discuss how Globoniks can help your institution achieve its goals.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>info@globoniks.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🌐</div>
                  <div>
                    <h4>Website</h4>
                    <p>www.globoniks.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form-container animate-on-scroll">
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/full-logo.svg" alt="CampusConnect" className="logo" />
            <div className="brand-info">
              <span className="product-name">CampusConnect</span>
              <span className="company-name">by Globoniks</span>
            </div>
          </div>
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <button 
              className="nav-link" 
              onClick={() => handlePageChange('home')}
            >
              Home
            </button>
            <button 
              className="nav-link" 
              onClick={() => handlePageChange('features')}
            >
              Features
            </button>
            <button 
              className="nav-link" 
              onClick={() => handlePageChange('about')}
            >
              About
            </button>
            <button 
              className="nav-link" 
              onClick={() => handlePageChange('contact')}
            >
              Contact
            </button>
            <Link to="/login" className="btn btn-primary nav-cta">
              Try Demo
            </Link>
          </div>
          <div 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'features' && renderFeaturesPage()}
        {currentPage === 'about' && renderAboutPage()}
        {currentPage === 'services' && renderServicesPage()}
        {currentPage === 'contact' && renderContactPage()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/full-logo.svg" alt="Globoniks" className="logo" />
                <span className="company-name">GLOBONIKS</span>
              </div>
              <p>Empowering educational excellence through innovative technology solutions.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><button onClick={() => handlePageChange('home')}>Home</button></li>
                <li><button onClick={() => handlePageChange('features')}>Features</button></li>
                <li><button onClick={() => handlePageChange('about')}>About</button></li>
                <li><button onClick={() => handlePageChange('contact')}>Contact</button></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Info</h3>
              <p>info@globoniks.com</p>
              <p>www.globoniks.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Globoniks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
