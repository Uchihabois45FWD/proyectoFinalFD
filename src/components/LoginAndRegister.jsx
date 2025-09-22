import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom";

import "../styles/auth-forms.css"
import "../styles/overlays.css"
import { authService } from "../services/AuthServices.jsx";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

function LoginAndRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
        setMessage({type: '', text: ''});
    };

    const handleLoginSubmit = async () => {
        if (!loginData.email || !loginData.password) {
            setMessage({type: 'error', text: 'Por favor, completa todos los campos'});
            return;
        }

        setLoading(true);
        setMessage({type: 'info', text: 'Verificando credenciales...'});

        try {
            const result = await authService.login(loginData.email, loginData.password);

            if (result.success) {
                setMessage({type: "success", text: `¡Bienvenido! Detectado como ${result.user.role === 'admin' ? 'Administrador' : 'Usuario'}`});

                setTimeout(() => {
                    if (result.user.role === 'admin') {
                        navigate("/Admin");
                    } else {
                        navigate("/Users");
                    }
                }, 2000);
            } else {
                setMessage({type: "error", text: result.message});
            }
        } catch (error) {
            setMessage({type: "error", text: "Error de conexión"});
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async () => {
        if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
            setMessage({type: 'error', text: 'Por favor, completa todos los campos'});
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setMessage({type: 'error', text: 'Las contraseñas no coinciden'});
            return;
        }

        if (registerData.password.length < 6) {
            setMessage({type: 'error', text: 'La contraseña debe tener al menos 6 caracteres'});
            return;
        }

        setLoading(true);
        setMessage({type: 'info', text: 'Registrando usuario...'});

        try {
            const {confirmPassword, ...userData} = registerData;
            const result = await authService.register(userData);

            if (result.success) {
                setMessage({type: 'success', text: result.message});
                setTimeout(() => {
                    navigate("/Users");
                }, 2000);
            } else {
                setMessage({type: 'error', text: result.message});
            }
        } catch (error) {
            setMessage({type: 'error', text: 'Error de conexión'});
        } finally {
            setLoading(false);
        }
    };

    const switchToRegister = () => {
        setIsLogin(false);
        setMessage({type: '', text: ''});
    };

    const switchToLogin = () => {
        setIsLogin(true);
        setMessage({type: '', text: ''});
    };

    return (
        <div className="auth-container">
            <div className={`auth-wrapper ${isLogin ? 'is-login' : 'is-register'}`}>
                {isLogin ? (
                    <LoginForm
                        loginData={loginData}
                        showPassword={showPassword}
                        loading={loading}
                        message={message}
                        onChange={handleLoginChange}
                        onSubmit={handleLoginSubmit}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onSwitchToRegister={switchToRegister}
                    />
                ) : (
                    <RegisterForm
                        registerData={registerData}
                        showPassword={showPassword}
                        showConfirmPassword={showConfirmPassword}
                        loading={loading}
                        message={message}
                        onChange={handleRegisterChange}
                        onSubmit={handleRegisterSubmit}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        onSwitchToLogin={switchToLogin}
                    />
                )}

                <div className={`overlay overlay--login ${!isLogin ? 'overlay--active' : ''}`}>
                    <div className="overlay-content">
                        <div className="overlay-icon"><User className="icon" /></div>
                        <h3 className="overlay-title">¡Bienvenido de vuelta!</h3>
                        <p className="overlay-text"></p>
                        <button onClick={switchToLogin} disabled={loading} className="overlay-btn">
                            <ArrowLeft className="btn-icon" />
                            Iniciar Sesión
                        </button>
                    </div>
                </div>

                <div className={`overlay overlay--register ${isLogin ? 'overlay--active' : ''}`}>
                    <div className="overlay-content">
                        <div className="overlay-icon"><User className="icon" /></div>
                        <h3 className="overlay-title">¡Únete a nuestra comunidad!</h3>
                        <p className="overlay-text"></p>
                        <button onClick={switchToRegister} disabled={loading} className="overlay-btn">
                            Registrarse
                            <ArrowRight className="btn-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginAndRegister