import './Footer.scss';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
    return (
        <>
            <div className='footer'>
                <div className="footer-content">
                    <div className="content1">
                        <h3>About Us</h3>
                        <p>At Profit Craft, we empower you with practical trading and web development skills through expert courses and support to achieve your goals.</p>
                    </div>
                    <div className="content2">
                        <h3>Links</h3>
                        <ul>
                            <li><a href="/courses">Courses</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="contact">
                        <h3>Contact</h3>
                        <p>Email: info@profitcraft.com</p>
                        <p>Phone: +1 234 567 8901</p>
                    </div>
                    <div className="newsletter">
                        <h3>Subscribe</h3>
                        <p>Stay updated with our latest courses and offers.</p>
                        <input type="email" placeholder="Enter your email" className="newsletter-input" />
                        <button className="newsletter-btn">Subscribe</button>
                    </div>
                </div>
                <hr />
                <div className="footer-bottom">
                    <div className="social-links">
                        <a href="https://instagram.com/profitcraft" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://facebook.com/profitcraft" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                        <a href="https://twitter.com/profitcraft" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://linkedin.com/company/profitcraft" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                    </div>
                    <div className="copyright">
                        &copy; {new Date().getFullYear()} Profit Craft. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}