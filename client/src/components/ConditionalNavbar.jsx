import { useLocation } from "react-router-dom";
import Navbar from "./NavBar";

const ConditionalNavbar = () => {
	const location = useLocation();

	const noNavPaths = ["/", "/login", "/change-password"];
	const shouldHideNavbar = noNavPaths.includes(location.pathname);

	if (shouldHideNavbar) {
		return null;
	}

	return <Navbar />;
};

export default ConditionalNavbar;
