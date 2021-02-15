import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Loading from '../components/Loading';
import keys from './keys'
const { server_url } = keys;

export const PrivateRoute = ({component: Component, ...rest}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('auth useEffect()')
        console.log(Component.name, 'component.name')
        if (isAuth) {
            console.log('should be triggered')
            return ;
        }
        fetch(`${server_url}/auth/login/success`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
            }
        })
        .then(response => {
            if (response.status === 200)    return response.json();
            throw new Error("Failed to authenticate user");
        })
        .then(responseJson => {
            if (responseJson.success)   setIsAuth(true);
            console.log(responseJson);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => setIsLoading(false));
    }, []);
    console.log(isAuth, isLoading, 'status of auth')
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isLoading ?
            <Loading /> :
                isAuth ?
                    <Component {...props} />
                : <Redirect to="/" />
        )} />
    );
};
