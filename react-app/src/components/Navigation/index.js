import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const dispatch = useDispatch();


	const handleLogout = (e) => {
		e.preventDefault();
		dispatch(logout());
	  };

	return (
		<div className='navbar_div'>
			<div className='navbar_user_container'>
				<NavLink exact to="/">Home</NavLink>
				{isLoaded && !sessionUser ? (
				<div className='navbar_logged_out_elements'>
						<NavLink to='/login'>Log in</NavLink>
						<NavLink to='/signup'>Sign up</NavLink>
					</div>
				): (
					<div className='navbar_logged_in_elements'>
						<NavLink to='/recipes/submit'>Submit</NavLink>
						<button onClick={handleLogout}>Log out</button>
					</div>
				)
				}
			</div>
			<NavLink exact to="/">JustAnotherCookbook</NavLink>
			<div className='navbar_search_div'>
				Search Feature Coming Soon
			</div>
		</div>
	);
}

export default Navigation;
