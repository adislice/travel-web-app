import { createContext, useContext, useState } from 'react'


export const NavigationContext = createContext()

export function NavigationContextProvider({children}) {
  const [navigation, setNavigation] = useState([])

  return (
    <NavigationContext.Provider value={[navigation, setNavigation]}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNav = () => useContext(NavigationContext)