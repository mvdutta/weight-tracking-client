import React from 'react'
import { footer, logo } from "../../assets";

export const Footer = () => {
  return (
    <footer className="mt-[118px]">
      <img className="w-[210px] ml-auto mr-auto opacity-90 -mb-16" src={logo} alt="weightTrackingLogo" />
      <p className='text-stone-600 text-sm text-center'>&copy;2023</p>
    </footer>
  );
}
export default Footer;