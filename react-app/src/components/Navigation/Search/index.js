import { useState } from "react";

function SearchBar() {
    const [searchInput, setSearchInput] = useState("")

    const handleSubmit = e => {
        e.preventDefault()

        alert("Search Feature Coming Soon!")
        setSearchInput("")
    }

    return (
        <div className='navbar_section navbar_search_div'>
            <form onSubmit={(e) => handleSubmit(e)}
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
    )
}

export default SearchBar;
