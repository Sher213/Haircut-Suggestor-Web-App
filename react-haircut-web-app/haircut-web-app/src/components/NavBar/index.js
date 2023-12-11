import "./index.scss"
import {Link, NavLink} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome, faCamera, faInfo, faMap} from '@fortawesome/free-solid-svg-icons'

const NavBar = () => {

    return (
        <div className="navbar">
            <Link className="logo" to='/'>
                NextLook
            </Link>
            <nav>
                <NavLink className="nav home" exact="true" activateclassname="active" to="/">
                    <FontAwesomeIcon icon={faHome} color='grey'></FontAwesomeIcon>
                </NavLink>
                <NavLink className="nav about" exact="true" activateclassname="active" to="/about">
                    <FontAwesomeIcon icon={faInfo} color='grey'></FontAwesomeIcon>
                </NavLink>
                <NavLink className="nav map" exact="true" activateclassname="active" to="/local-haircuts">
                    <FontAwesomeIcon icon={faMap} color='grey'></FontAwesomeIcon>
                </NavLink>
                <NavLink className="nav classify" exact="true" activateclassname="active" to="/classify">
                    Get Started
                    <span className="icon">
                        <FontAwesomeIcon icon={faCamera} color='teal'></FontAwesomeIcon>
                    </span>
                </NavLink>
            </nav>
        </div>
    )
}

export default NavBar