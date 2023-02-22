import React from "react";
import { ListItem } from "@material-ui/core";
import PrimaryButton from "../../atoms/PrimaryButton";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer">
          <div className="row">
            <div className="col-sm-4 col-6 col-lg-4">
              <h4 className="d-none d-md-block">Product</h4>
              <ul>
                <li>
                  <a
                    href="https://seller.auction.io/?page_id=2594"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="https://seller.auction.io/?page_id=2611"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="https://seller.auction.io/?page_id=2575"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Platform
                  </a>
                </li>
                <li>
                  <a
                    href="https://auctionsoftware.net/api-docs/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    API
                  </a>
                </li>
                {/* <li>
                  <Link href="/buy">Buy</Link>
                </li>

                <li>
                  <Link href="/buy">Sell</Link>
                </li> */}
                <li>
                  <a
                    href="https://seller.auction.io/?page_id=2577"
                    target="_blank"
                    rel="noreferrer"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-sm-4 col-6 col-lg-4">
              <h4 className="d-none d-md-block">Company</h4>
              <ul className="text-right text-md-left">
                <li>
                  <a
                    href="https://seller.auction.io/?page_id=2653"
                    target="_blank"
                    rel="noreferrer"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <Link href="/team">Our Team</Link>
                </li>
                <li>
                  <a
                    href="https://seller.auction.io/#pricingTable"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pricing
                  </a>
                </li>

                <li>
                  <a
                    href="https://blog.auction.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Blog
                  </a>
                </li>

                <li>
                  <a
                    href="https://seller.auction.io/?page_id=2607"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.auction.io/how-it-works-vid"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Seller Manual
                  </a>
                </li>

                <li>
                  <a
                    href="https://app.auction.io/login"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Sign-in as seller
                  </a>
                </li>

                <li>
                  {/* <a href="https://auction.io/?page_id=2579" target="_blank" rel="noreferrer">
                    Contact Us
                  </a> */}
                </li>
              </ul>
            </div>
            {/* <div className="col-6 col-md-3 col-lg-2 d-none d-md-block">
              <h4>Connect</h4>
              <ul>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noreferrer">
                    Linkedin
                  </a>
                </li>
              </ul>
            </div> */}
            <div className="col-sm-4 col-6 col-lg-4">
              <h4 className="d-none d-md-block">Contact</h4>
              <ul>
                <li>YourStore LLC</li>
                <li>
                  <a href="mailto:support@auction.io">support@auction.io</a>
                </li>
                <li>
                  <a href="tel:+1-972-200-5516">+1-972-200-5516</a>
                </li>
                <li>
                  <a
                    href="https://goo.gl/maps/MXquGvomasbYVUUR8"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    1221 West Campbell Road, Suite 181, Richardson, Texas 75080
                  </a>
                </li>
                <li className="d-none social-icons-xs">
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
              </ul>
            </div>
            {/* <div className="col-12 col-lg-3 nl-wrapper news-letter-wrapper">
              <div>
                <h4 className="d-none d-md-block">Newsletter</h4>
                <p>Join our weekly mailing list</p>
              </div>
              <div className="subscribe-wrapper">
                <input className="form-control" placeholder="Your email" />
                <PrimaryButton label="Subscribe" btnSize="small" />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <ul className="list-inline">
                <li className="list-inline-item">
                  <Link href="/static/terms">Terms & Conditions</Link>
                </li>
                <li className="list-inline-item">
                  <Link href="/static/privacy">Privacy</Link>
                </li>
                {/* <li className="list-inline-item"><Link href="">Patents</Link></li> */}
              </ul>
            </div>
            <div className="col-md-5 text-md-right copy-right">
              © {new Date().getFullYear()} - Auction.io | All right reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
