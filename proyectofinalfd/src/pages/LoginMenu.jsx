import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import "../styles/pages/loginForm.css"
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
          navigate('/User')
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
    <div className="login-wrapper">
      <div className={`container ${mode === 'register' ? 'active' : ''}`}>
        <div className="hero-panel">
          <h2>{mode === 'login' ? '¡Bienvenido de nuevo!' : 'Crear una cuenta'}</h2>
          <p>{mode === 'login' ? 'Inicia sesión para continuar con tu experiencia.' : 'Regístrate para comenzar a utilizar la plataforma.'}</p>
          {mode === 'login' ? (
            <button className="btn secondary" onClick={() => setMode('register')}>Crear cuenta</button>
          ) : (
            <button className="btn secondary" onClick={() => setMode('login')}>Iniciar sesión</button>
          )}
        </div>

        <div className="form-panel sign-in">
          <LoginForm
            loginData={loginData}
            showPassword={showLoginPassword}
            loading={loading}
            message={message}
            onChange={handleLoginChange}
            onSubmit={handleLoginSubmit}
            onTogglePassword={() => setShowLoginPassword((v) => !v)}
          />
        </div>

        <div className="form-panelregister">
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
          />
        </div>
      </div>
    </div>
  )
}

export default LoginMenu