import React from 'react';
import keys from '../config/keys';
const { server_url } = keys;

const Login = () => {
	return (
		<div className="login">
			<form className="regular" action={`${server_url}/auth/login`} method="post">
				<div className="username">
					<label className="username__label">Username:</label>
					<input className="username__input" type="text" name="username" />
				</div>
				<div className="password">
					<label className="password__label">Password:</label>
					<input className="password__input" type="password" name="password"/>
				</div>
				<div className="submit">
					<input className="submit__input" type="submit" value="Log In"/>
				</div>
			</form>
			<a className="facebook" href={`${server_url}/auth/facebook`}>Login with Facebook</a>
	</div>
	);
};

export default Login;