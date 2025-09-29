import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import "../styles/AuthForms.css";
function RegisterForm({
  registerData = { name: "", lastName: "", secondLastName: "", phone: "", idNumber: "", email: "", password: "", confirmPassword: "" },
  showPassword = false,
  showConfirmPassword = false,
  loading = false,
  message = null,
  onChange = () => {},
  onSubmit = () => {},
  onTogglePassword = () => {},
  onToggleConfirmPassword = () => {},
  onSwitchToLogin = () => {},
}) {
  const [touched, setTouched] = useState({ name: false, lastName: false, secondLastName: false, phone: false, idNumber: false, email: false, password: false, confirmPassword: false });
  const errors = {
    name: registerData?.name ? "" : "Ingresa tu nombre",
    lastName: registerData?.lastName ? "" : "Ingresa tu apellido",
    secondLastName: registerData?.secondLastName ? "" : "Ingresa tu segundo apellido",
    phone: registerData?.phone ? "" : "Ingresa tu teléfono",
    idNumber: registerData?.idNumber ? "" : "Ingresa tu cédula",
    email: registerData?.email ? "" : "Ingresa tu correo",
    password: !registerData?.password
      ? "Ingresa una contraseña"
      : registerData?.password.length < 6
      ? "Debe tener al menos 6 caracteres"
      : "",
    confirmPassword:
      registerData?.confirmPassword
        ? registerData?.password !== registerData?.confirmPassword
          ? "Las contraseñas no coinciden"
          : ""
        : "Confirma tu contraseña",
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };
  return (
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
        {message?.text && (
          <div className="message-container" role="status" aria-live="polite">
            <p className="message-text">{message.text}</p>
          </div>
        )}
        <div className="form-fields">
          <div className={`input-group ${touched.name && errors.name ? "error" : ""}`}>
            <User className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={registerData?.name || ""}
              onChange={onChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`form-input ${touched.name && errors.name ? "error" : ""}`}
              required
            />
          </div>
          {touched.name && errors.name && (
            <div className="error-text" role="alert">{errors.name}</div>
          )}
          <div className="grid-two">
            <div className={`form-field input-group ${touched.lastName ? "" : ""}`}>
              <label className="field-label" htmlFor="lastName">Apellido</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Apellido"
                value={registerData?.lastName || ""}
                onChange={onChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`form-input`}
              />
            </div>
            <div className={`form-field input-group ${touched.secondLastName ? "" : ""}`}>
              <label className="field-label" htmlFor="secondLastName">Segundo apellido</label>
              <input
                id="secondLastName"
                type="text"
                name="secondLastName"
                placeholder="Segundo apellido"
                value={registerData?.secondLastName || ""}
                onChange={onChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`form-input`}
              />
            </div>
          </div>
          <div className="grid-two">
            <div className={`form-field input-group ${touched.phone ? "" : ""}`}>
              <label className="field-label" htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={registerData?.phone || ""}
                onChange={onChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`form-input`}
              />
            </div>
            <div className={`form-field input-group ${touched.idNumber ? "" : ""}`}>
              <label className="field-label" htmlFor="idNumber">Cédula</label>
              <input
                id="idNumber"
                type="text"
                name="idNumber"
                placeholder="Cédula"
                value={registerData?.idNumber || ""}
                onChange={onChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`form-input`}
              />
            </div>
          </div>

          <div className={`input-group ${touched.email && errors.email ? "error" : ""}`}>
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={registerData?.email || ""}
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
              value={registerData?.password || ""}
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
          <div className={`input-group ${touched.confirmPassword && errors.confirmPassword ? "error" : ""}`}>
            <Lock className="input-icon input-icon--left" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={registerData?.confirmPassword || ""}
              onChange={onChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`form-input form-input--password ${touched.confirmPassword && errors.confirmPassword ? "error" : ""}`}
              required
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              disabled={loading}
              className="input-icon input-icon--right"
            >
              {showConfirmPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <div className="error-text" role="alert">{errors.confirmPassword}</div>
          )}
          <button
            onClick={onSubmit}
            disabled={loading}
            className="submit-btn submit-btn--register"
          >
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
          <div className="switch-section">
            <p className="switch-text">¿Ya tienes una cuenta?</p>
            <button
              onClick={onSwitchToLogin}
              disabled={loading}
              className="switch-btn"
            >
              <ArrowLeft className="switch-icon" /> Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
