import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import "../styles/AuthForms.css";
function LoginForm({
  loginData = { email: "", password: "" },
  showPassword = false,
  loading = false,
  message = null,
  onChange = () => {},
  onSubmit = () => {},
  onTogglePassword = () => {},
  onSwitchToRegister = () => {},
}) {
  const [touched, setTouched] = useState({ email: false, password: false });
  const errors = {
    email: loginData?.email ? "" : "Ingresa tu correo",
    password: loginData?.password ? "" : "Ingresa tu contraseña",
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };
  return (
    <div className="auth-side auth-side--login">
      <div className="auth-form">
        <div className="auth-header">
          <div className="auth-icon">
            <User className="icon" />
          </div>
          <h2 className="auth-title">Bienvenido</h2>
          <p className="auth-subtitle">Inicia sesión en tu cuenta</p>
          <p className="auth-demo">
            Admin: admin@sistema.com / admin123
            <br />
            Usuario: user@demo.com / 123456
          </p>
        </div>
        {message?.text && (
          <div className="message-container" role="status" aria-live="polite">
            <p className="message-text">{message.text}</p>
          </div>
        )}
        <div className="form-fields">
          <div className={`input-group ${touched.email && errors.email ? "error" : ""}`}>
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={loginData?.email || ""}
              onChange={onChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`form-input ${touched.email && errors.email ? "error" : ""}`}
              required
            />
          </div>
          {touched.email && errors.email && (
            <div className="error-text" role="alert">{errors.email}</div>
          )}
          <div className={`input-group ${touched.password && errors.password ? "error" : ""}`}>
            <Lock className="input-icon input-icon--left" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={loginData?.password || ""}
              onChange={onChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`form-input form-input--password ${touched.password && errors.password ? "error" : ""}`}
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              disabled={loading}
              className="input-icon input-icon--right"
            >
              {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
            </button>
          </div>
          {touched.password && errors.password && (
            <div className="error-text" role="alert">{errors.password}</div>
          )}
          <button
            onClick={onSubmit}
            disabled={loading}
            className="submit-btn submit-btn--login"
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
          <div className="switch-section">
            <p className="switch-text">¿No tienes una cuenta?</p>
            <button
              onClick={onSwitchToRegister}
              disabled={loading}
              className="switch-btn"
            >
              Crear cuenta nueva <ArrowRight className="switch-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

