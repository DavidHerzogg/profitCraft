import './Footer.scss'

export default function Footer() {
    return (
        <>
            <div className='footer'>
                <div className="footer-content">
                    <div className="content1">
                        <h3>About Us</h3>
                        <p>We provide quality courses to help you master web development and design.</p>
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
                </div>
                <hr />
                <div className="copyright">
                    &copy; {new Date().getFullYear()} Profit Craft. All rights reserved.
                </div>
            </div>
        </>
    )
}
