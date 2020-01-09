import React from 'react';
import { Container, Jumbotron, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

class Home extends React.Component {
	render() {
		return (
			<Container>
				<Jumbotron>
					<h1 className="display-3 text-center">Shorten URLs. With Style.</h1>
					<p className="lead text-center">
						View analytics for shortened URLs, create custom URLs. Up to 100
						entries for free.
					</p>

					<p className="lead text-center">
						<Link to="/register">
							<Button color="primary" className="btn-lg">
								Register
							</Button>
						</Link>
					</p>
				</Jumbotron>
			</Container>
		);
	}
}

export default Home;
