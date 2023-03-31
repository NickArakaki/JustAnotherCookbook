import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';
import ProfileButton from './ProfileButton';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
	const [searchInput, setSearchInput] = useState("")

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
			<div className='navbar_section navbar_search_div'>
				<form onSubmit={(e) => {
					e.preventDefault();
					alert("Serch Feature Coming Soon!")
					setSearchInput("")
					}}
					className='search_form'>
					<input
						className='search_form_input'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						type='text'
						placeholder='Recipe Search'
					/>
					<i className="fa-solid fa-magnifying-glass" />
				</form>
			</div>
		</div>
	);
}

export default Navigation;
