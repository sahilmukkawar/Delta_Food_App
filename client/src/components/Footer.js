import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1c1c1c',
      color: '#fff',
      padding: '40px 0 20px 0',
      marginTop: '40px'
    }}>
      <div className="container">
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginBottom: '15px',
              color: '#ff3d00'
            }}>
              Delta Food Court
            </h3>
            <p style={{ 
              color: '#999',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              Discover the best food & drinks in your area. 
              Order online for quick delivery to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ 
              fontSize: '18px',
              marginBottom: '15px',
              color: '#fff'
            }}>
              Quick Links
            </h4>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {['Home', 'Menu', 'About Us', 'Contact'].map((item) => (
                <li key={item} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{
                    color: '#999',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s'
                  }} onMouseOver={e => e.target.style.color = '#ff3d00'}
                     onMouseOut={e => e.target.style.color = '#999'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ 
              fontSize: '18px',
              marginBottom: '15px',
              color: '#fff'
            }}>
              Contact Us
            </h4>
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#999',
              fontSize: '14px'
            }}>
              <li style={{ marginBottom: '10px' }}>
                <i className="fas fa-phone" style={{ marginRight: '10px', color: '#ff3d00' }}></i>
                +91 7666118192
              </li>
              <li style={{ marginBottom: '10px' }}>
                <i className="fas fa-envelope" style={{ marginRight: '10px', color: '#ff3d00' }}></i>
                support@deltafoodcourt.com
              </li>
              <li style={{ marginBottom: '10px' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#ff3d00' }}></i>
                123 Food Street, Nanded
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 style={{ 
              fontSize: '18px',
              marginBottom: '15px',
              color: '#fff'
            }}>
              Connect With Us
            </h4>
            <div style={{ 
              display: 'flex',
              gap: '15px'
            }}>
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                <a key={platform} href="#" style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#333',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.3s'
                }} onMouseOver={e => {
                  e.target.style.backgroundColor = '#ff3d00';
                  e.target.style.transform = 'translateY(-3px)';
                }} onMouseOut={e => {
                  e.target.style.backgroundColor = '#333';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <i className={`fab fa-${platform}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div style={{
          borderTop: '1px solid #333',
          paddingTop: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Delta Food Court | Designed with ❤️ by Sahil Mukkawar
          </p>
        </div>
      </div>
    </footer>
  );
}