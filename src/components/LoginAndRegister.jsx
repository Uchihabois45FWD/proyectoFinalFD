import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom";
import React from 'react'

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

    const authService = {
        async login(email, password) {
            await new Promise(resolve => setTimeout(resolve,1500));
            const mockUsers = [
                {id: 1, name: "Usuario Demo", email: "user@demo.com", password: "123456", role: "user"},
                {id: 2, name: "Administrador", email: "admin@sistema.com", password: "admin123", role: "admin"}
            ];
            const user = mockUsers.find(u => u.email === email && u.password === password);

            if(user) {
                return {success: true, user, message: "Login exitoso"};
            } else {
                return {success: false, message: "Credenciales incorrectas"};
            }
        },

        async register(userData) {
            await new Promise(resolve => setTimeout(resolve,1500));
            if (userData.email === "admin@sistema.com" || userData.email === "user@demo.com") {
                return {success: false, message: "El email ya está registrado"};
            }

            const newUser = {
                id: Date.now(),
                ...userData
            };

            return {success: true, user: newUser, message: "Registro exitoso"};
        }
    };

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
                        console.log("redirigiendo a admin");
                        navigate("/Admin");
                    } else {
                        console.log("redirigiendo a user");
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

    const MessageDisplay = () => {
      if (!message.text) return null;

      const getIcon = () => {
        switch (message.type) {
          case 'error': return <AlertCircle className="circuloError" />;
          case 'success': return <CheckCircle className="circuloSuccess" />;
          default: return <AlertCircle className="circuloError" />;
        }
      }

      return (
          <div className="message-container">
              {getIcon()}
              <p className="message-text">{message.text}</p>
          </div>
      );
    };

    return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-side auth-side--login">
          <div className="auth-form">
            <div className="auth-header">
              <div className="auth-icon">
                <User className="icon" />
              </div>
              <h2 className="auth-title">Bienvenido</h2>
              <p className="auth-subtitle">Inicia sesión en tu cuenta</p>
              <p className="auth-demo">
                Admin: admin@sistema.com / admin123<br/>
                Usuario: user@demo.com / 123456
              </p>
            </div>

            <MessageDisplay />

            <div className="form-fields">
              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon input-icon--left" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  disabled={loading}
                  className="form-input form-input--password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="input-icon input-icon--right"
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>

              <button
                onClick={handleLoginSubmit}
                disabled={loading}
                className="submit-btn submit-btn--login"
              >
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>

              <div className="switch-section">
                <p className="switch-text">¿No tienes una cuenta?</p>
                <button
                  onClick={switchToRegister}
                  disabled={loading}
                  className="switch-btn"
                >
                  Crear cuenta nueva
                  <ArrowRight className="switch-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

    
        <div className="auth-side auth-side--register">
          <div className="auth-form">
            <div className="auth-header">
              <div className="auth-icon">
                <User className="icon" />
              </div>
              <h2 className="auth-title">Únete a nosotros</h2>
              <p className="auth-subtitle">Crea tu cuenta nueva</p>
              <p className="auth-demo">Los nuevos usuarios se registran como usuarios normales</p>
            </div>

            <MessageDisplay />

            <div className="form-fields">
              <div className="input-group">
                <User className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="form-input"
                  required
                />
              </div>

              <div className="input-group">
                <Lock className="input-icon input-icon--left" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="form-input form-input--password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="input-icon input-icon--right"
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>

              <div className="input-group">
                <Lock className="input-icon input-icon--left" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="form-input form-input--password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="input-icon input-icon--right"
                >
                  {showConfirmPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </button>
              </div>

              <button
                onClick={handleRegisterSubmit}
                disabled={loading}
                className="submit-btn submit-btn--register"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>

              <div className="switch-section">
                <p className="switch-text">¿Ya tienes una cuenta?</p>
                <button
                  onClick={switchToLogin}
                  disabled={loading}
                  className="switch-btn"
                >
                  <ArrowLeft className="switch-icon" />
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </div>


        <div className={`overlay overlay--login ${!isLogin ? 'overlay--active' : ''}`}>
          <div className="overlay-content">
            <div className="overlay-icon">
              <User className="icon" />
            </div>
            <h3 className="overlay-title">¡Bienvenido de vuelta!</h3>
            <p className="overlay-text">
              El sistema detectará automáticamente si eres administrador o usuario normal según tus credenciales.
            </p>
            <button
              onClick={switchToLogin}
              disabled={loading}
              className="overlay-btn"
            >
              <ArrowLeft className="btn-icon" />
              Ir a Login
            </button>
          </div>
        </div>

        <div className={`overlay overlay--register ${isLogin ? 'overlay--active' : ''}`}>
          <div className="overlay-content">
            <div className="overlay-icon">
              <User className="icon" />
            </div>
            <h3 className="overlay-title">¡Únete a nuestra comunidad!</h3>
            <p className="overlay-text">
              Crea tu cuenta y accede a todas nuestras funcionalidades. Los nuevos usuarios se registran como usuarios normales.
            </p>
            <button
              onClick={switchToRegister}
              disabled={loading}
              className="overlay-btn"
            >
              Crear Cuenta
              <ArrowRight className="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginAndRegister