import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className='navbar_div'>
			<div>
				<NavLink exact to="/">Home</NavLink>
			</div>
			{!sessionUser ? (
					<div className='navbar_logged_out_elements'>
						<NavLink to='/login'>Log in</NavLink>
						<NavLink to='/signup'>Sign up</NavLink>
					</div>
				): (
					<div className='navbar_logged_in_elements'>
						<NavLink to='/recipes/submit'>Submit</NavLink>
					</div>
				)
			}
		</div>
	);
}

export default Navigation;
