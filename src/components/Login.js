import React from 'react';
import keys from '../config/keys';
const { server_url } = keys;

const Login = () => {
	return (
		<div className="login">
			<form action={`${server_url}/auth/login`} method="post">
				<div>
					<label>Username:</label>
					<input type="text" name="username"/>
				</div>
				<div>
					<label>Password:</label>
					<input type="password" name="password"/>
				</div>
				<div>
					<input type="submit" value="Log In"/>
				</div>
			</form>
			<a class="fb-login-button"
			className=""
			href={`${server_url}/auth/facebook`}
			>Login</a>
	</div>
	);
};

export default Login;