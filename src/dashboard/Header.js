import React from 'react';
import '../Ades.css';
import {Navbar, Alignment, NavbarHeading, NavbarDivider} from "@blueprintjs/core";

function Header() {
    return(
        <div className="dshHeader">
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <NavbarHeading>
                        DronfiesUTM
                    </NavbarHeading>
                    <NavbarDivider />
                </Navbar.Group>
            </Navbar>
        </div>
    )
}
export default Header;