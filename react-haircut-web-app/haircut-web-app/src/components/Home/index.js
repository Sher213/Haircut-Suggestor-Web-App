import './index.scss'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faGoogle, faPython, faReact, faYoutube, faChrome } from '@fortawesome/free-brands-svg-icons'

const Home = () => {
    return (
        <div className='cont home-page'>
            <div className='about'>
                <h1>Welcome to the New You.</h1>
                <p>Revolutionizing the hair makeover experience. Know what you want before you go in.
                   Use powerful AI and Machine Learning to find the right haircut for you based on face shape
                   and hair texture. Walk into and out the salon with confidence.
                </p>
                <h2>What we provide: </h2>
                <p>
                    A unique experience which will take you step by step to your new makeover: <br/>
                    <ul>
                        <li>First, we will take a picture of you to determine your face shape and hair texture. <br/></li>
                        <li>Then we will provide you with a series of recommended haircuts suiting your features. <br/></li>
                        <li>Finally, we will provide you with popular, local barbers and salonists to book your next appointment with
                            the confidence of knowing what suites you.</li>
                    </ul>
                </p>
                <div className='get-started'>
                    <NavLink className="nav classify" exact="true" activateclassname="active" to="/classify">
                        Get Started
                        <span className="icon">
                            <FontAwesomeIcon icon={faCamera} color='teal'></FontAwesomeIcon>
                        </span>
                    </NavLink>
                </div>
            </div>
            <div className='logo-cont'>
                <h3>In collaboration with:</h3>
                <div className='logo-display'>
                    <span className="icon">
                        <FontAwesomeIcon className='logo' icon={faInstagram} color='grey'></FontAwesomeIcon>
                        <FontAwesomeIcon className='logo' icon={faGoogle} color='grey'></FontAwesomeIcon>
                        <FontAwesomeIcon className='logo' icon={faChrome} color='grey'></FontAwesomeIcon>
                        <FontAwesomeIcon className='logo' icon={faYoutube} color='grey'></FontAwesomeIcon>
                        <FontAwesomeIcon className='logo' icon={faPython} color='grey'></FontAwesomeIcon>
                        <FontAwesomeIcon className='logo' icon={faReact} color='grey'></FontAwesomeIcon>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Home