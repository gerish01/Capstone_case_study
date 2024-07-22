import React, { useState } from 'react';
import Login from './login';
import Signup from './signup';
import './auth.css';

function Auth() {
    const [isLoginView, setIsLoginView] = useState(true);

    const switchToSignup = () => {
        setIsLoginView(false);
    };

    const switchToLogin = () => {
        setIsLoginView(true);
    };

    return (
        <div className="auth-container">
            {isLoginView ? (
                <Login onSwitchToSignup={switchToSignup} />
            ) : (
                <Signup onSwitchToLogin={switchToLogin} />
            )}
        </div>
    );
}

export default Auth;
