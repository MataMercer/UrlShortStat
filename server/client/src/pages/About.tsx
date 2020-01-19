import React from 'react';
import { Container, Jumbotron, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
class About extends React.Component {
	render() {
		return (
			<Container>
				<h1>About</h1>
                <hr/>
				<h2>About UrlShortStat</h2>
				<p>
					UrlShortStat is an app to shorten URLs and track viewership. It is
					open source through the GNU license and the code is available
					<a href="https://github.com/MataMercer/UrlShortStat"> here</a>.
				</p>

				<h2>Contact Creator</h2>
				<p>
					UrlShortStat was created as a personal project by{' '}
					<a href="https://github.com/MataMercer"> MataMercer</a>. If you have
					any questions, feel free to contact him through email or his Github.
				</p>
			</Container>
		);
	}
}

export default About;
