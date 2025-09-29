import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import "../styles/overlays.css"
import { authService } from '../services/AuthServices.jsx'

function LoginMenu() {
  const [mode, setMode] = useState('login') 
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null) 

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e) => {
    e?.preventDefault?.()
    setLoading(true)
    setMessage(null)
    try {
      const { email, password } = loginData
      if (!email || !password) {
        setMessage({ text: 'Completa tu correo y contraseña.' })
        return
      }
    
      const result = await authService.login(email, password)
      if (result.success) {
        setMessage({ text: result.message || 'Inicio de sesión exitoso.' })
        if (authService.isCollaborator()) {
          navigate('/Colab')
        } else if (result.user?.role === 'admin') {
          navigate('/Admin')
        } else {
          navigate('/Users')
        }
      } else {
        setMessage({ text: result.message || 'Credenciales inválidas.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const [registerData, setRegisterData] = useState({
    name: '',
    lastName: '',
    secondLastName: '',
    phone: '',
    idNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault?.()
    setLoading(true)
    setMessage(null)
    try {
      const { name, lastName, secondLastName, phone, idNumber, email, password, confirmPassword } = registerData
      if (!name || !email || !password || !confirmPassword) {
        setMessage({ text: 'Completa todos los campos.' })
        return
      }
      if (password.length < 6) {
        setMessage({ text: 'La contraseña debe tener al menos 6 caracteres.' })
        return
      }
      if (password !== confirmPassword) {
        setMessage({ text: 'Las contraseñas no coinciden.' })
        return
      }

      const result = await authService.register({ name, lastName, secondLastName, phone, idNumber, email, password })
      if (result.success) {
        setMessage({ text: result.message || 'Cuenta creada con éxito. Ahora inicia sesión.' })
        setMode('login')
        setLoginData({ email, password })
      } else {
        setMessage({ text: result.message || 'No se pudo crear la cuenta.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`auth-wrapper ${mode === 'login' ? 'is-login' : 'is-register'}`}>
      {mode === 'login' ? (
        <LoginForm
          loginData={loginData}
          showPassword={showLoginPassword}
          loading={loading}
          message={message}
          onChange={handleLoginChange}
          onSubmit={handleLoginSubmit}
          onTogglePassword={() => setShowLoginPassword((v) => !v)}
          onSwitchToRegister={() => setMode('register')}
        />
      ) : (
        <RegisterForm
          registerData={registerData}
          showPassword={showRegPassword}
          showConfirmPassword={showRegConfirmPassword}
          loading={loading}
          message={message}
          onChange={handleRegisterChange}
          onSubmit={handleRegisterSubmit}
          onTogglePassword={() => setShowRegPassword((v) => !v)}
          onToggleConfirmPassword={() => setShowRegConfirmPassword((v) => !v)}
          onSwitchToLogin={() => setMode('login')}
        />
      )}

      <div className={`overlay overlay--login ${mode === 'register' ? 'overlay--active' : ''}`}>
        <div className="overlay-content">
          <div className="overlay-icon">←</div>
          <h3 className="overlay-title">¿Ya tienes cuenta?</h3>
          <p className="overlay-text">Inicia sesión para continuar.</p>
          <button className="overlay-btn" onClick={() => setMode('login')}>Ir a iniciar sesión</button>
        </div>
      </div>

      <div className={`overlay overlay--register ${mode === 'login' ? 'overlay--active' : ''}`}>
        <div className="overlay-content">
          <div className="overlay-icon">→</div>
          <h3 className="overlay-title">¿Nuevo por aquí?</h3>
          <p className="overlay-text">Crea tu cuenta y únete.</p>
          <button className="overlay-btn" onClick={() => setMode('register')}>Ir a registrarse</button>
        </div>
      </div>
    </div>
  )
}

export default LoginMenu