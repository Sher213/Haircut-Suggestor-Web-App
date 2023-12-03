import "./index.scss"
import {Link, NavLink} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome, faCamera, faInfo} from '@fortawesome/free-solid-svg-icons'

const NavBar = () => {

    return (
        <div className="navbar">
            <Link className="logo" to='/'>
            </Link>
            <nav>
                <NavLink className="nav home" exact="true" activateclassname="active" to="/">
                    <FontAwesomeIcon icon={faHome} color='grey'></FontAwesomeIcon>
                </NavLink>
                <NavLink className="nav classify" exact="true" activateclassname="active" to="/classify">
                    <FontAwesomeIcon icon={faCamera} color='grey'></FontAwesomeIcon>
                </NavLink>
                <NavLink className="nav about" exact="true" activateclassname="active" to="/about">
                    <FontAwesomeIcon icon={faInfo} color='grey'></FontAwesomeIcon>
                </NavLink>
            </nav>
        </div>
    )
}

export default NavBar