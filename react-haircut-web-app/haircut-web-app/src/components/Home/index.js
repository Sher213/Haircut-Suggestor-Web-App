import './index.scss'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faGoogle, faPython, faReact, faYoutube, faChrome } from '@fortawesome/free-brands-svg-icons'
import heart from '../../assets/images/heart-example-home.png';
import oblong from '../../assets/images/oblong-example-home.png';
import oval from '../../assets/images/oval-example-home.png';
import round from '../../assets/images/round-example-home.png';
import square from '../../assets/images/square-example-home.png';
import GraphsScroll from '../GraphsScroll';
import { useEffect, useState } from 'react'

const Home = () => {
    const [currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage +1) % 5);   
        }, 2000);

        return () => clearInterval(timer);
    }, [])

    return (
        <div className='cont page home-page'>
            <div className='main-page'>
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
                            <li>Then, we will provide you with a series of recommended haircuts suiting your features. <br/></li>
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
                <div className='infographics-container'>
                    {[
                    heart, oblong, oval, round, square
                    ].map((image, index) => (
                    <img
                        key={index}
                        className={`home-img ${index === currentImage ? 'visible' : 'hidden'}`}
                        src={image}
                        alt={`Example ${index + 1}`}
                    />
                    ))}
                    <div className='graph-container'>
                        <GraphsScroll/>
                    </div>
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

export default Home;