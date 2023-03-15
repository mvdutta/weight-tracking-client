import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Login } from "../auth/Login";
import HamburgerIcon from "../utilities/HamburgerIcon";
import useMediaQuery from "../utilities/MediaQuery";
import styles from './NavBar.module.css'


export const NavBar = () => {
    const navigate = useNavigate()
    const isDesktop = useMediaQuery('(min-width: 768px)');
    //the variable isDesktop will be true if screen width exceeds 768px
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showMenu, setShowMenu] = useState(`${styles.show}`)

      useEffect(() => {
          const user = localStorage.getItem("wt_token");
          if (user) {
            setName(JSON.parse(user).name);
          }
          if (isDesktop) {
            setShowMenu(`${styles.show}`);
          } else{
            setShowMenu(`${styles.hide}`);
          }
        }, [loggedIn, isDesktop]);

      const clickHandler = () =>{// if the hamburger is clicked, toggle the showMenu variable to hide/show the nav links
        if (showMenu === `${styles.hide}`) {
          setShowMenu(`${styles.show}`);
        } else {
          setShowMenu(`${styles.hide}`);
        }
      }

    return (
      <>
        <div className={styles.top_bar}>
          {/* Do not  show the hamburger icon if in Desktop mode*/}
          {isDesktop ? "" : <HamburgerIcon clickHandler={clickHandler} />}
          <img src="/np_logo2.png" className={styles.navbar__logo} alt="logo" />
          <div className={showMenu}>
            <ul>
              <li className={`${styles.navbar__item} active`}>
                <Link className={styles.navbar__link} to="/home">
                  <h5>Home</h5>
                </Link>
              </li>
              <li className={`${styles.navbar__item} active`}>
                <Link className={`${styles.navbar__item} active`} to="/blogs">
                  <h5>Blogs</h5>
                </Link>
              </li>
              {localStorage.getItem("wt_token") ? (
                <>
                  <li
                    className={`${styles.navbar__item} ${styles.navbar__logout}`}
                  >
                    <Link
                      className={styles.navbar__link}
                      to=""
                      onClick={() => {
                        if (
                          window.confirm(
                            `${name}, do you really want to log out?`
                          )
                        ) {
                          setLoggedIn(false);
                          setName("");
                          localStorage.removeItem("wt_token");
                          navigate("/", { replace: true });
                        }
                      }}
                    >
                      <h5>Logout</h5>
                    </Link>
                  </li>
                </>
              ) : (
                <li className={`${styles.navbar__item} active`}>
                  <Link className={styles.navbar__link} onClick={handleShow}>
                    <h5>Login</h5>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          {isDesktop ? (
            <div className={styles.welcome}>{name ? `Welcome ${name}!` : ""}</div>
          ) : (
            ""
          )}
        </div>
      </>
    );
}

