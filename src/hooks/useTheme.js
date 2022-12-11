import React from 'react'

function useTheme() {

  const [theme, setTheme] = React.useState('light')

  React.useEffect(e => {
    if (typeof window !== undefined) {
      if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(preferes-colors-scheme: dark)').matches)) {
        setTheme('dark')
        console.log('dark');
      } 
    }
  }, [])

  React.useEffect(e => {
    if (theme === 'dark') {
      document.documentElement.classList.add("dark")
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem('theme', 'light')
    }
  }, [theme])

  const handleTeme = () => {
    setTheme(q => q === 'dark' ? 'light': 'dark')
  }

  return {
    handleTeme,
    theme, 
  }
}

export default useTheme