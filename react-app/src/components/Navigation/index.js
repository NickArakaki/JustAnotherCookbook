import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/session';
import './Navigation.css';
import ProfileButton from './ProfileButton';

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
				{isLoaded && !sessionUser ? (
					<div className='navbar_logged_out_elements'>
						<NavLink to='/login'>Log in</NavLink>
						<NavLink to='/signup'>Sign up</NavLink>
					</div>
				): (
					<div className='navbar_logged_in_elements'>
						<ProfileButton user={sessionUser} />
						<NavLink to='/recipes/submit'>Submit</NavLink>
					</div>
				)
				}
			</div>
			<NavLink exact to="/"><span className='navbar_logo'>JustAnotherCookbook</span></NavLink>
			<div className='navbar_search_div'>
				<form className='search_form'>
					<input
						type='text'
						placeholder='Recipe Search'
					/>
				</form>
			</div>
		</div>
	);
}

export default Navigation;
