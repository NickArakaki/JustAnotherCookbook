import "./Footer.css"
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer_wrapper">
            <div className="footer_upper_content">
                    JustAnotherCookbook is a recipe sharing website where food lovers can easily share their recipes.  JustAnotherCookbook is a modified clone of <Link to={{pathname:"https://trivet.recipes/"}} target="_blank" rel="noreferrer">Trivet Recipes</Link>, and was created with idea that finding and sharing a fantastic recipe should be as simple and easy as possible. So whether it's finding inspiration for tonight's dinner or sharing your wonderful creations with the rest of the world, we hope that you will enjoy using our site.
            </div>
            <div className="footer_lower_content">
                <section className="footer_section">
                    <div className="section_header">Project Repository</div>
                    <div className="section_content">
                        <Link to={{pathname:"https://trivet.recipes/"}} target="_blank" rel="noreferrer"> <i className="fa-brands fa-square-github" /></Link>
                    </div>
                </section>
                <section className="footer_section">
                    <div className="section_header">About Me</div>
                    <div className="section_content">
                        <Link to={{pathname:"https://trivet.recipes/"}} target="_blank" rel="noreferrer"> <i className="fa-brands fa-square-github" /></Link>
                        <i className="fa-brands fa-linkedin" />
                    </div>
                </section>
                <section className="footer_section">
                    <div className="section_header">My Other Projects</div>
                    <div className="section_content">
                        <Link to={{pathname:"https://trivet.recipes/"}} target="_blank" rel="noreferrer">CouchCrashers</Link>
                        <Link to={{pathname:"https://trivet.recipes/"}} target="_blank" rel="noreferrer"> <i className="fa-brands fa-square-github" /></Link>
                    </div>
                    <div className="section_content">
                        <Link to={{pathname:"https://trivet.recipes/"}} target="_blank" rel="noreferrer">DivvyUp</Link>
                        <Link to={{pathname:"https://trivet.recipes/"}} target="_blank" rel="noreferrer"> <i className="fa-brands fa-square-github" /></Link>
                    </div>
                </section>
            </div>
        </footer>
    )
}

export default Footer;
