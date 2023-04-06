import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';
import ProfileButton from './ProfileButton';
import SearchBar from './Search';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);


	return (
		<div className='navbar_div'>
			<div className='navbar_section navbar_user_container'>
				{isLoaded && !sessionUser ? (
					<>
						<NavLink to='/login'>Log in</NavLink>
						<NavLink to='/signup'>Sign up</NavLink>
					</>
				): (
					<>
						<ProfileButton user={sessionUser} />
						<NavLink to='/recipes/submit'>Submit Recipe</NavLink>
					</>
				)
				}
			</div>
			<NavLink exact to="/"><span className='navbar_section navbar_logo'>JustAnotherCookbook</span></NavLink>
			<SearchBar />
		</div>
	);
}

export default Navigation;
