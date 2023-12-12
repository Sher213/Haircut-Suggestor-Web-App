import './index.scss';
import {Link, NavLink} from 'react-router-dom'
import { faGithub, faLinkedin, faKaggle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMousePointer } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {

    return (
        <div className='cont footer'>
            <div className="footer-column legals">
                <h3>Legal</h3>
                <NavLink className="nav terms" exact="true" activateclassname="active" to="/terms">
                    Terms of Service
                </NavLink>
                <br/>
                <NavLink className="nav terms" exact="true" activateclassname="active" to="/privacy">
                    Privacy Policy
                </NavLink>
            </div>
            <div className="footer-column socials">
                <h3>Socials</h3>
                <Link className="nav terms" exact="true" activateclassname="active" to="https://github.com/Sher213" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} color='grey' style={{ marginRight: '5px' }}></FontAwesomeIcon>
                    Github
                </Link>
                <br/>
                <Link className="nav terms" exact="true" activateclassname="active" to="https://www.linkedin.com/in/ali-sher/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} color='grey' style={{ marginRight: '5px' }}></FontAwesomeIcon>
                    Linkedin
                </Link>
                <br/>
                <Link className="nav terms" exact="true" activateclassname="active" to="https://www.kaggle.com/asher213" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faKaggle} color='grey' style={{ marginRight: '5px' }}></FontAwesomeIcon>
                    Kaggle
                </Link>
                <br/>
                <Link className="nav terms" exact="true" activateclassname="active" to="https://www.bit.ly/asher-portfolio" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faMousePointer} color='grey' style={{ marginRight: '5px' }}></FontAwesomeIcon>
                    Portfolio
                </Link>
            </div>
            <div className="footer-column contact">
                <h3>Contact</h3>
                <a className='email-footer' href="mailto:alisher213@outlook.com">Email</a>
            </div>
        </div>
    );
}

export default Footer;